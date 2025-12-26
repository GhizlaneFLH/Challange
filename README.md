# Challenge RAG - Assistant Intelligent

Ce projet est un système de **RAG (Retrieval-Augmented Generation)** qui permet de discuter avec des documents PDF et texte. Il utilise **FastAPI** pour le backend, **ChromaDB** comme base de données vectorielle, et **Groq (Llama 3)** pour la génération de réponses.

##  Fonctionnalités
- Ingestion automatique de documents (PDF et TXT).
- Découpage intelligent du texte (Text Splitting).
- Recherche sémantique par embeddings.
- Interface de chat (Frontend React/Vite).

##  Installation et Lancement

### Prérequis
- Docker et Docker Compose
- Une clé API Groq

### Étapes
1. **Cloner le projet**
   ```bash
   git clone <votre-lien-repo-github>
   cd Challenge