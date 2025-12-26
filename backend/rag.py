import os
import chromadb
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq

class DocumentEngine:
    def __init__(self, storage="./vector_db"):
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.db = chromadb.PersistentClient(path=storage)
        self.collection = self.db.get_or_create_collection("docs_collection")
        self.llm = ChatGroq(model_name="llama3-8b-8192")

    def ingest(self, folder_path):
        print(f"--- Début de l'ingestion depuis : {folder_path} ---")
        all_docs = [] # J'ai supprimé le 'q' qui était ici

        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            
            try:
                if filename.lower().endswith(".pdf"):
                    print(f"Chargement du PDF : {filename}")
                    loader = PyPDFLoader(file_path)
                    all_docs.extend(loader.load())
                elif filename.lower().endswith(".txt"):
                    print(f"Chargement du texte : {filename}")
                    loader = TextLoader(file_path, encoding='utf-8')
                    all_docs.extend(loader.load())
                else:
                    print(f"Fichier ignoré : {filename}")
            except Exception as e:
                print(f"Erreur lors de la lecture de {filename} : {e}")

        if not all_docs:
            print("Aucun document n'a été chargé.")
            return 0

        # CORRECTION ICI : C'était RecursiveCharacterCharacter... (en trop)
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
        chunks = splitter.split_documents(all_docs)
        
        print(f"Indexation de {len(chunks)} fragments...")

        for i, chunk in enumerate(chunks):
            embedding = self.embed_model.encode(chunk.page_content).tolist()
            # Sécurité pour la source
            source = os.path.basename(chunk.metadata.get("source", "unknown"))
            
            self.collection.add(
                ids=[f"id_{i}_{source}"],
                embeddings=[embedding],
                documents=[chunk.page_content],
                metadatas=[{"source": source}]
            )
        
        print("done")
        return len(chunks)

    def ask(self, question):
        q_emb = self.embed_model.encode(question).tolist()
        results = self.collection.query(query_embeddings=[q_emb], n_results=3)
        
        if not results['documents'][0]:
            return {"answer": "Je ne trouve pas d'informations dans les documents.", "sources": []}

        context = "\n\n".join(results['documents'][0])
        sources = list(set([m['source'] for m in results['metadatas'][0]]))
        
        prompt = f"""Tu es un assistant expert. Utilise UNIQUEMENT le contexte suivant pour répondre.
        CONTEXTE :
        {context}
        QUESTION :
        {question}
        """
        
        response = self.llm.invoke(prompt)
        return {"answer": response.content, "sources": sources}