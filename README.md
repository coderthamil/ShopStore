# 🌌 ShopSphere — Premium Fullstack E-Commerce Platform

Welcome to **ShopSphere**, a state-of-the-art e-commerce application featuring a fast asynchronous **FastAPI** backend, secure **PostgreSQL** database, and a stunning **Vite + React** dark-mode/glassmorphic frontend.

---

## 🎨 Design & Aesthetic Overview
ShopSphere features a premium **Glassmorphism** styling system built on custom dark-mode variables:
* **Deep Space Gradients**: A dark radial background with neon accents (`#8b5cf6` violet, `#06b6d4` cyan, and `#ec4899` pink).
* **Frosted Glass Panels**: Cards and modals utilize `backdrop-filter: blur(16px)` and translucent borders for a unified, futuristic interface.
* **Micro-Animations**: Smooth scale and color transitions on buttons, forms, and shopping cart drawers to maximize user delight.

---

## 🏗️ Technical Architecture & Data Flow

```mermaid
graph TB
    subgraph Client [React SPA Frontend (Vite)]
        UI[Glassmorphic UI Views]
        State[React State Engine]
        OfflineSim[Demo Mode Mock Data]
    end

    subgraph Service [FastAPI Service Layer]
        API[FastAPI Endpoint Router]
        Auth[JWT Guard / bcrypt Encryption]
        Session[get_db Session Factory]
    end

    subgraph DataStore [Relational Storage]
        Model[SQLAlchemy ORM Layer]
        Postgres[(PostgreSQL Database)]
    end

    %% Flow lines
    UI -->|1. HTTP Headers & JWT Bearer Token| API
    UI -->|2. Offline Auto-Fallback| OfflineSim
    API -->|3. Validate Token & Passwords| Auth
    API -->|4. Request Scoped Session| Session
    Session -->|5. ORM Query / Mutation| Model
    Model -->|6. Execute SQL Queries| Postgres
```

### Database Entity Relationship Model

```mermaid
erDiagram
    USERS {
        int id PK
        string username UNIQUE
        string password "Hashed"
        string role "buyer | seller"
    }
    PRODUCTS {
        int id PK
        string name
        float price
        int stock
        int seller_id FK
    }
    CARTS {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
    }
    ORDERS {
        int id PK
        int user_id FK
        float total
        string status
    }
    PROMOS {
        int id PK
        string code UNIQUE
        float discount
        boolean active
    }

    USERS ||--o{ PRODUCTS : "registers (seller)"
    USERS ||--o{ CARTS : "manages"
    USERS ||--o{ ORDERS : "submits"
    PRODUCTS ||--o{ CARTS : "populates"
```

---

## 📂 Project Directory Structure

```
└── ShopSphere/
    ├── backend/
    │   ├── alembic.ini             # Alembic database migration config
    │   ├── pyproject.toml          # uv backend project & dependency setup
    │   ├── main.py                 # FastAPI app entrypoint & middleware registry
    │   ├── seed.py                 # Seeds initial products, promos, and users
    │   ├── migrations/             # Database versions & schema scripts
    │   └── app/
    │       ├── core/               # Security utilities, JWT, and authentication guards
    │       ├── database/           # Database creation & SQLAlchemy session setup
    │       ├── models/             # SQLAlchemy ORM declarations (User, Product, Cart, etc.)
    │       ├── routes/v1/          # REST Endpoints: Auth, Product, Cart, Orders, Promos
    │       └── schemas/            # Pydantic schemas validating input/output payloads
    └── frontend/
        ├── package.json            # Node.js project manifest & scripts
        ├── vite.config.js          # Vite compilation config
        └── src/
            ├── main.jsx            # Application entry render point
            ├── App.jsx             # Combined dashboard logic, view state & API integration
            └── index.css           # Custom Glassmorphism design tokens & styles
```

---

## 💻 Code Highlights

### 1. Database Connection Configuration
Setting up asynchronous and synchronous sessions inside [database.py](file:///d:/Ecommerce%20fullstack%20app/ShopSphere/backend/app/database/database.py):

```python
from decouple import config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = config("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. Secure Token Signatures & Encryption
Hashing password bytes and compiling JWT payloads in [security.py](file:///d:/Ecommerce%20fullstack%20app/ShopSphere/backend/app/core/security.py):

```python
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from decouple import config

SECRET_KEY = config("SECRET_KEY", default="fallback-secret-key")
ALGORITHM = config("ALGORITHM", default="HS256")

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

### 3. Asynchronous React Demo Mode Fallback
Automatically checking backend health and failing over gracefully inside [App.jsx](file:///d:/Ecommerce%20fullstack%20app/ShopSphere/frontend/src/App.jsx):

```javascript
const testBackendConnection = async () => {
  try {
    const res = await fetch(`${API_BASE}/`);
    if (res.ok) {
      setIsDemoMode(false);
    } else {
      throw new Error("Backend offline");
    }
  } catch (err) {
    console.warn("Backend server offline. Falling back to Demo Mode.");
    setIsDemoMode(true);
    loadMockData(); // Injects mock products, promos, and dummy state
  }
};
```

---

## 🔌 API Route Reference Table

| Module | HTTP Method | Endpoint Path | Payload / Parameter | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | `UserCreate` (JSON) | Creates a new buyer or seller account |
| **Auth** | `POST` | `/auth/login` | `UserCreate` (JSON) | Verifies credentials, returns Bearer JWT |
| **Products**| `GET` | `/products/` | None | Lists all active storefront listings |
| **Products**| `POST` | `/products/` | `ProductCreate` (JSON)| Creates new listing (Seller credentials required) |
| **Products**| `PUT` | `/products/{id}` | `ProductCreate` (JSON)| Updates pricing and stock of current listing |
| **Products**| `DELETE` | `/products/{id}` | `id` (Path variable) | Removes listing from database |
| **Cart** | `POST` | `/cart/` | `CartItem` (JSON) | Creates/adds target quantity to shopping cart |
| **Cart** | `GET` | `/cart/` | None | Lists items currently stored in buyer's cart |
| **Orders** | `POST` | `/orders/` | `OrderCreate` (JSON) | Completes checkout and subtracts stock items |
| **Promos** | `GET` | `/promos/` | None | Lists active marketing discounts |

---

## 🚀 Step-by-Step Execution Guide

### 1. Database Creation
Ensure your PostgreSQL instance is running. Connect via the command line or `pgAdmin` and execute:
```sql
CREATE DATABASE shopsphere;
```

### 2. Backend Installation & Run
Open a terminal panel and run:
```bash
# Navigate to backend directory
cd "d:\Ecommerce fullstack app\ShopSphere\backend"

# Install all packages from pyproject.toml via uv
uv add fastapi uvicorn sqlalchemy psycopg2-binary asyncpg pydantic python-decouple alembic bcrypt python-jose[cryptography] passlib

# Apply Alembic schema migrations
uv run alembic upgrade head

# Seed initial store credentials, items, and promos
uv run python seed.py

# Launch development API server
uv run uvicorn main:app --reload
```

### 3. Frontend Installation & Run
Open a separate terminal panel and run:
```bash
# Navigate to frontend directory
cd "d:\Ecommerce fullstack app\ShopSphere\frontend"

# Install node dependencies
npm install

# Start local React development server
npm run dev
```

Visit the application locally at `http://localhost:5173/` and API documentation at `http://127.0.0.1:8000/docs`.
