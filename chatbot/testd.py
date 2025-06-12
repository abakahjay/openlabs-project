from transformers import GPT2LMHeadModel, GPT2Tokenizer

# 🔽 Global cache (default location, e.g., ~/.cache/huggingface/transformers)
print("Downloading GPT-2 to global cache...")
global_model = GPT2LMHeadModel.from_pretrained("gpt2")  # global
global_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

# 🔽 Local cache (your project folder, e.g., ./gpt2_model)
print("Downloading GPT-2 to local folder './gpt2_model'...")
local_model = GPT2LMHeadModel.from_pretrained("gpt2", cache_dir="./gpt2_model")  # local
local_tokenizer = GPT2Tokenizer.from_pretrained("gpt2", cache_dir="./gpt2_model")
