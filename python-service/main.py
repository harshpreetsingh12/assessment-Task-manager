from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import torch
import os

app = FastAPI()

@app.on_event("startup")
def load_model():
    global model
    with torch.no_grad():
        model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
        model.eval() 

class TextData(BaseModel):
    text: str

@app.get("/")
def health_check():
    return {"status": "AI Service is running"}

@app.post("/embed")
def get_embedding(data: TextData):
    with torch.no_grad():
        vector = model.encode(
            data.text,
            convert_to_numpy=True,
            normalize_embeddings=True
        ).tolist()
    return {"embedding": vector}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)