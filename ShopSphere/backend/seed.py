from app.database.database import SessionLocal
from app.models.User.user_models import User
from app.models.Products.products_model import Product
from app.models.Cart.cart_model import Cart
from app.models.Orders.order_model import Order
from app.models.Promos.promo_model import Promo
from app.core.security import hash_password

def seed_db():
    db = SessionLocal()
    try:
        print("Checking data in database...")
        
        # 1. Create Users if they don't exist
        buyer = db.query(User).filter(User.username == "buyer").first()
        if not buyer:
            print("Creating buyer user...")
            buyer = User(
                username="buyer",
                password=hash_password("password"),
                role="buyer"
            )
            db.add(buyer)
            db.commit()
            db.refresh(buyer)
            
        seller = db.query(User).filter(User.username == "seller").first()
        if not seller:
            print("Creating seller user...")
            seller = User(
                username="seller",
                password=hash_password("password"),
                role="seller"
            )
            db.add(seller)
            db.commit()
            db.refresh(seller)

        # 2. Create Products if empty
        if db.query(Product).count() == 0:
            print("Creating products...")
            products = [
                Product(name="Quantum Mech Keyboard", price=129.99, stock=50, seller_id=seller.id),
                Product(name="Cyberpunk Holographic Jacket", price=199.99, stock=20, seller_id=seller.id),
                Product(name="Nebula Soundbuds Pro", price=89.99, stock=100, seller_id=seller.id),
                Product(name="AeroSport Active Smartwatch", price=249.99, stock=35, seller_id=seller.id),
                Product(name="NeonPulse RGB Mouse", price=59.99, stock=120, seller_id=seller.id),
            ]
            db.add_all(products)

        # 3. Create Promos if empty
        if db.query(Promo).count() == 0:
            print("Creating promos...")
            promos = [
                Promo(code="SAVE10", discount=10.0, active=True),
                Promo(code="SUPER20", discount=20.0, active=True),
                Promo(code="FREESHIP", discount=5.0, active=True),
            ]
            db.add_all(promos)

        db.commit()
        print("Database seeding check/update completed successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
