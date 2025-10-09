

Quick references
	•	How to deploy and connect to a Runpod pod (web terminal / SSH).  ￼
	•	Runpod GPU selection & cloud offerings.  ￼
	•	PEFT + LoRA resources (huggingface PEFT repo and TRL examples).  ￼
	•	QLoRA / LoRA guides and practical tips (memory-efficient fine-tuning).  ￼

⸻

Overview (what we’ll do)
	1.	Launch a Runpod pod with a GPU that has ~48 GB VRAM (choose an A5000 / 3090 / L4/L40 variant if available — check the pod GPU list in the Runpod UI).  ￼
	2.	Connect via Web Terminal or SSH.  ￼
	3.	Prepare environment (conda/venv) and install training libs: transformers, accelerate, bitsandbytes (if using 8/4-bit), peft, trl, datasets.  ￼
	4.	Prepare sample dataset (JSONL).
	5.	Run LoRA (PEFT) training script with accelerate launch or TRL example. Optionally use QLoRA (NF4 + bitsandbytes) if you want to fine-tune larger models in 4-bit.  ￼
	6.	Save/upload LoRA adapters (small), test inference, optionally merge with base model.

⸻

Step-by-step

A. Launch the pod on Runpod
	1.	Login to Runpod dashboard → Create Pod. Choose a GPU that gives you ~48 GB VRAM (if exact 48 GB isn’t listed, pick the closest: e.g., A5000/3090/L40/A6000 variants — check GPU types). Set storage 100 GB. Name the pod and deploy. (See “Deploy your first Pod” and GPU types docs.)  ￼
	2.	After deploy, open Connect → use Open Web Terminal (or SSH tab — add your public SSH key into your Runpod account and use the provided ssh command).  ￼

Tip: If you prefer developing locally in VS Code, you can connect via Remote-SSH (Runpod docs).  ￼

⸻

B. Base setup on the Pod (commands to run in the web terminal)

Run as a regular user; prefix sudo where you must (some images have preinstalled CUDA + drivers).

# update and tools
sudo apt update && sudo apt install -y git wget build-essential

# create a conda env (if conda present on template) or use venv
# If conda not installed, you can use python -m venv instead.
conda create -n lora python=3.10 -y
conda activate lora

# Install core libs
pip install --upgrade pip
pip install transformers accelerate datasets evaluate peft trl bitsandbytes safetensors

# Optional: install wandb for logging
pip install wandb

Notes:
	•	If you plan to use 4-bit QLoRA, bitsandbytes is required; ensure CUDA version and GPU driver compatibility. If bitsandbytes install fails, check Runpod image (they have PyTorch/CUDA images that work).  ￼

⸻

C. Pick a base model

Good small / open weights options (choose one that’s available on HF or other repo and matches license you accept):
	•	Mistral-7B (good performance for 7B class). Example fine-tune tutorials exist.  ￼
	•	RedPajama / Mosaic / Falcon-7B are alternatives, but check hosting/license.

For a 48 GB GPU:
	•	You can fine-tune a 7B model with LoRA comfortably.
	•	You can also QLoRA (4-bit) a 13B model on 48 GB but be careful with batch sizes and activation memory.

⸻

D. Sample training dataset (tiny JSONL)

Create train.jsonl with cases in the HF prompt -> response style for causal LM:

train.jsonl

{"prompt":"Translate English to French:\n\nEnglish: Hello, how are you?\nFrench:","completion":" Bonjour, comment ça va ?"}
{"prompt":"Summarize the following text:\n\nText: The API returned an error when the user exceeded rate limits.\nSummary:","completion":" The API failed due to the user exceeding the rate limit; retry later or increase quota."}
{"prompt":"Q: What is the capital of France?\nA:","completion":" Paris."}

(For more realistic chat-style training use { "instruction": "...", "input": "", "output": "..." } or a prompt/completion pair depending on the training script you follow.)

⸻

E. Minimal LoRA training script (example using Hugging Face Transformers + PEFT)

Save as train_lora.py:

# train_lora.py
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import load_dataset
from peft import get_peft_config, get_peft_model, LoraConfig, TaskType

MODEL="mistralai/mistral-7b-instruct"  # replace with chosen model
tokenizer = AutoTokenizer.from_pretrained(MODEL, use_fast=False)
model = AutoModelForCausalLM.from_pretrained(MODEL, device_map="auto", torch_dtype="auto", load_in_8bit=False)

# Peft/LoRA config
peft_config = LoraConfig(
    r=8, lora_alpha=32, target_modules=["q_proj","v_proj"], lora_dropout=0.05, bias="none", task_type=TaskType.CAUSAL_LM
)
model = get_peft_model(model, peft_config)

# dataset (local jsonl)
ds = load_dataset("json", data_files={"train":"train.jsonl"}, split="train")

def tokenize_fn(example):
    text = example["prompt"] + example.get("completion","")
    return tokenizer(text, truncation=True, max_length=512)

ds = ds.map(tokenize_fn, remove_columns=ds.column_names)
ds.set_format(type="torch")

training_args = TrainingArguments(
    output_dir="./lora-out",
    per_device_train_batch_size=1,
    num_train_epochs=3,
    logging_steps=10,
    save_strategy="epoch",
    fp16=True,
    learning_rate=2e-4,
    weight_decay=0.0,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=ds,
)

trainer.train()
model.save_pretrained("lora-adapter")

Run with accelerate if you want multi-GPU or advanced config:

accelerate launch train_lora.py

Notes:
	•	The script above uses device_map="auto" — it will place layers on GPU automatically, but you may want to control load_in_8bit=True + bitsandbytes for larger models. See the PEFT / TRL examples for best practice.  ￼

⸻

F. QLoRA option (if you want 4-bit + bigger models)

QLoRA combines NF4 4-bit quantization (bitsandbytes) + LoRA and is commonly used to fine-tune models like Falcon/Mistral/LLama-derivatives. Typical flow:
	1.	pip install bitsandbytes (ensure compatibility with CUDA).
	2.	Load base model with load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16, bnb_4bit_use_double_quant=True in from_pretrained.
	3.	Apply PEFT LoRA adapters and train with accelerate.
There are robust tutorials that walk through exact flags and memory tricks. Use QLoRA when you want to fine-tune a 13B+ model on a single 48GB GPU (with small batch sizes).  ￼

⸻

G. Training tips to avoid OOMs (practical)
	•	Use small per_device_train_batch_size (1 or 2) and short max_length (256–512).
	•	Use fp16=True or bf16=True if GPU supports it.
	•	Use gradient_checkpointing=True and model.enable_input_require_grads() where appropriate (TRL examples).
	•	Use LoRA to keep trainable parameter count tiny (MBs) and only store adapter weights.  ￼

⸻

H. Test inference locally on the pod

After model.save_pretrained("lora-adapter") you can load the adapter with the base model for inference:

from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE="mistralai/mistral-7b-instruct"
tokenizer = AutoTokenizer.from_pretrained(BASE, use_fast=False)
base = AutoModelForCausalLM.from_pretrained(BASE, device_map="auto", torch_dtype="auto")
model = PeftModel.from_pretrained(base, "lora-adapter")
inp = "Translate to French: Hello world"
tokens = tokenizer(inp, return_tensors="pt").to(model.device)
out = model.generate(**tokens, max_new_tokens=64)
print(tokenizer.decode(out[0], skip_special_tokens=True))


⸻

I. Save / upload adapters
	•	LoRA adapters are small (model.save_pretrained("lora-adapter")). Copy out to your laptop via scp to the Runpod SSH endpoint, or push to Hugging Face Hub (requires huggingface_hub token). PEFT adapters are much smaller than full model snapshots.

⸻

J. Checklist / run order (short)
	1.	Deploy Runpod pod (48GB GPU + 100GB storage).  ￼
	2.	Connect (web terminal / SSH).  ￼
	3.	Create conda env, install packages.
	4.	Copy train.jsonl to pod.
	5.	Run accelerate config (if using accelerate) then accelerate launch train_lora.py.
	6.	Save adapter, test inference.
	7.	Download adapter or push to HF.

⸻

Recommended resources / reading (for deeper details)
	•	Runpod docs: deploy/connect to pod.  ￼
	•	Hugging Face TRL LoRA examples & PEFT repo (how to wire adapters).  ￼
	•	QLoRA guides (practical tutorial for 4-bit LoRA).  ￼
	•	Runpod guide on OOM prevention and best practices.  ￼

⸻

