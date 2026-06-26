from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.v1 import auth, product, cart, order, promo

# Initialize FastAPI app
app = FastAPI(
    title="ShopSphere API",
    description="E-commerce backend with Auth, Products, Cart, Orders, and Promos",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(product.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(order.router, prefix="/orders", tags=["Orders"])
app.include_router(promo.router, prefix="/promos", tags=["Promos"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to ShopSphere API"}
