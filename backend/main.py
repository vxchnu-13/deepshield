from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import asyncio
import uuid
import random
import os
import mimetypes
from typing import Dict, Any

# Fix for Windows registry mimetypes bug causing CSS to not load
mimetypes.init()
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')

import shutil

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="DeepShield AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for tasks
tasks_store: Dict[str, Dict[str, Any]] = {}

class TaskStatus(BaseModel):
    task_id: str
    status: str
    progress: int
    message: str

class TaskResult(BaseModel):
    task_id: str
    status: str
    fake_probability: float
    authentic_probability: float
    confidence_score: float
    risk_level: str
    verdict: str
    anomalies: list[str]

async def process_video_simulation(task_id: str, filename: str):
    tasks_store[task_id] = {"status": "processing", "progress": 0, "message": "Initializing analysis...", "result": None}
    
    # Simulate processing steps
    steps = [
        (10, "Extracting frames..."),
        (30, "Detecting faces..."),
        (50, "Analyzing facial movements..."),
        (70, "Checking lip-sync and audio..."),
        (90, "Evaluating compression artifacts..."),
        (100, "Finalizing report...")
    ]
    
    for progress, msg in steps:
        await asyncio.sleep(0.5)  # Simulate time per step
        tasks_store[task_id]["progress"] = progress
        tasks_store[task_id]["message"] = msg
    
    # Deterministic inference logic based on filename
    is_fake = any(keyword in filename.lower() for keyword in ["fake", "manipulated", "deepfake"])
    
    if is_fake:
        fake_prob = random.uniform(0.75, 0.99)
        confidence = random.uniform(0.90, 0.99)
        risk_level = "High Risk"
        verdict = "FAKE"
        anomalies = [
            "Unnatural eye blink patterns detected.",
            "Lip-sync mismatch at 00:05.",
            "Inconsistent lighting on face."
        ]
    else:
        fake_prob = random.uniform(0.05, 0.35)
        confidence = random.uniform(0.85, 0.98)
        risk_level = "Low Risk"
        verdict = "REAL"
        anomalies = []
        
    auth_prob = 1.0 - fake_prob
        
    tasks_store[task_id]["status"] = "completed"
    tasks_store[task_id]["result"] = {
        "fake_probability": round(fake_prob * 100, 1),
        "authentic_probability": round(auth_prob * 100, 1),
        "confidence_score": round(confidence * 100, 1),
        "risk_level": risk_level,
        "verdict": verdict,
        "anomalies": anomalies
    }

@app.post("/api/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
        raise HTTPException(status_code=400, detail="Unsupported file format")
        
    task_id = str(uuid.uuid4())
    safe_filename = f"{task_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    video_url = f"/uploads/{safe_filename}"
    
    # Start background processing
    background_tasks.add_task(process_video_simulation, task_id, file.filename)
    
    return {"task_id": task_id, "video_url": video_url, "message": "Video uploaded successfully. Processing started."}

@app.get("/api/status/{task_id}", response_model=TaskStatus)
async def get_status(task_id: str):
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task = tasks_store[task_id]
    return {
        "task_id": task_id,
        "status": task["status"],
        "progress": task["progress"],
        "message": task["message"]
    }

@app.get("/api/results/{task_id}", response_model=TaskResult)
async def get_results(task_id: str):
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task = tasks_store[task_id]
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Task is not completed yet")
        
    result = task["result"]
    return {
        "task_id": task_id,
        "status": task["status"],
        **result
    }

# Mount static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

dist_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
