Create a Farm Management app with FadstAPI as backend and React as Frontend. The app will create farmer profile, list farmers, show details of farmer, edit farmer, delete farmer. The app will create task for farmer, edit task for farmer, delete task for farmer, showlist of tasks. Farmer can buy item, edit item, delete item. Farmer can sell item, show list of sell, list of buyers, farmar can create farm assets, edit asset, show asset, delete asset, show list of assets. Report for buy, sell, items, farmers, tasks. Create land, edit, land, show land, delete land. Assign a land to a farmer. Assign tasks for farmer. Add Tax for each Land. create crops for each land for a 4 months, list crops for each land for a 4 months, details crops for each land for a 4 months. check pages and backend.

## How to Run

### Backend
To run the backend, execute the `run_backend.bat` script or run the following command from the root directory:
```bash
backend\venv\Scripts\python -m uvicorn backend.main:app --reload
```
The API will be available at http://localhost:8000.

### Frontend
To run the frontend, execute the `run_frontend.bat` script or run the following commands from the root directory:
```bash
cd frontend
npm run dev
```
The application will be available at http://localhost:5173.
