from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments, TextDataset, DataCollatorForLanguageModeling
from flask import Flask, request, jsonify
import os

model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

def load_dataset(file_path, tokenizer, block_size=128):
    return TextDataset(
        tokenizer=tokenizer,
        file_path=file_path,
        block_size=block_size
    )

def train_model():
    if not os.path.exists("data/your_dataset.txt"):
        print("❗ Dataset not found. Please provide your_dataset.txt in data/ folder.")
        return
    
    train_dataset = load_dataset("data/your_dataset.txt", tokenizer)

    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,
    )

    training_args = TrainingArguments(
        output_dir="./fine_tuned_model",
        overwrite_output_dir=True,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        save_steps=500,
        save_total_limit=2,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=train_dataset,
    )

    trainer.train()
    trainer.save_model("./fine_tuned_model")
    tokenizer.save_pretrained("./fine_tuned_model")
    print("✅ Model trained and saved to ./fine_tuned_model")

def load_fine_tuned_model():
    if os.path.exists("./fine_tuned_model"):
        print("✅ Loading fine-tuned model...")
        return GPT2LMHeadModel.from_pretrained("./fine_tuned_model"), GPT2Tokenizer.from_pretrained("./fine_tuned_model")
    else:
        print("⚠️ Fine-tuned model not found, using base GPT-2")
        return model, tokenizer

# Train the model (if dataset exists)
train_model()

# Serve the model
model, tokenizer = load_fine_tuned_model()
from transformers import pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer, max_length=256)

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    output = generator(prompt)
    return jsonify({"response": output[0]["generated_text"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
