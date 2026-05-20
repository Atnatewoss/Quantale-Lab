# Quantale Lab: Algebraic Modeling of Chess Skill Progression

<div align="center">
  <img src="client/public/ui.png" alt="Quantale Chess Arena" width="100%">
  <br>
  <em>The Quantale Chess Arena — Live Computation Interface</em>
</div>

## Overview

Quantale Lab is an implementation of algebraic structures applied to skill progression, specifically within the domain of Chess. By modeling skill levels (e.g., Beginner, Intermediate, Grandmaster) as elements of a **Quantale**, the engine computes compositions, residuals, and logical joins to simulate and evaluate skill interactions.

This project demonstrates how rigorous mathematical properties (Distributivity, Adjunction, Monoidal Composition) can be reliably encoded and served via a modern web architecture.

## Tech Stack

This project is built with a decoupled architecture, ensuring scalability, type safety, and high performance.

### **Frontend (Client)**
<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

### **Backend (Server)**
<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white" alt="Pydantic" />
  <img src="https://img.shields.io/badge/uv-2C2C2C?style=for-the-badge&logo=uv&logoColor=white" alt="UV" />
</p>

## Core Mathematical Properties Verified

The Python engine (`quantale_core.py`) programmatically validates the following abstract algebraic axioms:
1. **Idempotent Monoid:** Operations like `compose(x, y)` define non-commutative progression logic.
2. **Complete Lattice:** Supremum (`big_join`) and Infimum capabilities across the set of skill stages.
3. **Distributivity:** Proving that composition distributes over joins.
4. **Adjunction (Residuals):** The engine supports right and left residuals (implications) to determine the exact requirements bridging two skill gaps.

## Local Development Setup

### 1. Run the Backend (Python/FastAPI)
```bash
cd server
# If using uv (recommended):
uv run python app/main.py
```
*The backend will be available at `http://localhost:8000`.*

### 2. Run the Frontend (Next.js)
```bash
cd client
npm install
npm run dev
```
*The frontend will be available at `http://localhost:3000`.*

## Architecture Overview

```text
your-repo/
├── client/                     # Next.js Frontend Application
│   ├── app/                    # App Router Pages
│   ├── components/             # Reusable React UI Components
│   └── lib/                    # API clients and utilities
├── server/                     # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                # Route definitions
│   │   ├── core/               
│   │   │   └── quantale_core.py# Core Mathematical Engine
│   │   └── main.py             # Server Entry Point
│   └── requirements.txt        
└── README.md                   # Project Documentation
```
