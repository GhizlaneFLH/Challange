"use client";

import { useState } from "react";
import { Send, Bot, User, FileText } from "lucide-react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string; sources?: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // 1. Ajouter la question de l'utilisateur à l'interface
    const newHistory = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);
    setLoading(true);
    const currentQuestion = question;
    setQuestion("");

    try {
      // 2. Appel à ton API FastAPI (backend)
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });

      const data = await res.json();

      // 3. Ajouter la réponse de l'IA à l'interface
      setChatHistory([...newHistory, { 
        role: "bot", 
        content: data.answer, 
        sources: data.sources 
      }]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Bot size={24} /> RAG Assistant Chatbot
        </h1>
      </header>

      {/* Zone de Chat */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center gap-2 mb-1 font-semibold text-xs opacity-75">
                {msg.role === "user" ? <User size={14}/> : <Bot size={14}/>}
                {msg.role === "user" ? "Vous" : "IA Assistant"}
              </div>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              
              {/* Affichage des sources si présentes */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100 italic text-xs flex flex-wrap gap-2">
                  <span className="font-bold flex items-center gap-1"><FileText size={12}/> Sources:</span>
                  {msg.sources.map((s, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded text-gray-600">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs animate-pulse">L'IA réfléchit...</div>}
      </main>

      {/* Input de texte */}
      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleAsk} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Posez votre question sur les documents..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}