from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import DocumentEngine
import sys

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
engine = DocumentEngine()

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask(q: Query):
    return engine.ask(q.question)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "ingest":
        engine.ingest("./data")
    else:
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)