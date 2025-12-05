@echo off
cd /d "%~dp0"
backend\venv\Scripts\python -m uvicorn backend.main:app --reload
pause
