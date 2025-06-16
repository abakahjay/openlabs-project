from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

generator = pipeline("text-generation", model="./fine_tuned_model")

class ChatInput(BaseModel):
    prompt: str

@app.post("/generate")
def generate_text(chat_input: ChatInput):
    output = generator(chat_input.prompt, max_length=50, num_return_sequences=1)
    return {"response": output[0]['generated_text']}
