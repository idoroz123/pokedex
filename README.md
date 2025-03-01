# Pokedex App

A Pokedex built for a home assignment.

---

## Getting Started

### 1. Unzip the Folder
Extract the project folder.

### 2. Navigate to the Project Directory
```bash
cd pokedex
```

---

## Running the App

### Run with Docker Compose
Start the application using Docker Compose:
```bash
docker compose up
```
Once running, open your browser and go to: <http://localhost:5173>

---

### Run Manually
#### Prerequisites
Ensure you have **Python 3.11 or higher** installed on your system.

#### 1. Set Up the Backend
Navigate to the project directory and create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```

Install required dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
python3 app.py
```

#### 2. Set Up the Frontend
Open another terminal window and navigate to the frontend directory:
```bash
cd pokedex-frontend
```

Install frontend dependencies:
```bash
npm install
```

Run the frontend server:
```bash
npm run dev
```

Once running, open your browser and go to: <http://localhost:5173>

