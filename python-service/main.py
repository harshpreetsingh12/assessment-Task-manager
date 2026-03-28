from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os

app = FastAPI()

model = None  

class TextData(BaseModel):
    text: str

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model


@app.get("/")
def health_check():
    return {"status": "AI Service is running"}


@app.post("/embed")
def get_embedding(data: TextData):
    model = get_model()
    vector = model.encode(data.text).tolist()
    return {"embedding": vector}


# Render will use this
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)