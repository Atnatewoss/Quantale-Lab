import sys
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Use absolute imports relative to the app/ root
from api.routes import router
from core.quantale_core import demo

app = FastAPI(title="Quantale Arena API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "messages": "Hello from the backend sideee..."
    }

def main():
    # Force UTF-8 encoding for standard output on Windows
    sys.stdout.reconfigure(encoding='utf-8')
    
    # 1. Run the mathematical demonstration tables first (showing all checks pass)
    demo()
    
    # 2. Start the FastAPI server
    print("\n" + "=" * 60)
    print("  Starting Quantale Arena FastAPI Server on http://127.0.0.1:8000")
    print("=" * 60)
    
    try:
        # 'main' refers to this main.py file
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
    except KeyboardInterrupt:
        print("\n[system] Server shut down gracefully.")

if __name__ == "__main__":
    main()
