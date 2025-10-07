import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal, engine, Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Management Backend")

# CORS - allow all for demo; in production restrict to frontend URL
origins = os.getenv("FRONTEND_URLS", "*")
if origins == "*" or origins == "":
    allow_origins = ["*"]
else:
    # comma separated
    allow_origins = [u.strip() for u in origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --------------------
# Products (Inventory)
# --------------------
@app.post("/products/", response_model=schemas.ProductOut)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Product).filter(models.Product.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product already exists")
    p = models.Product(name=payload.name, price=payload.price, stock=payload.stock)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@app.get("/products/", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p

# --------------
# Orders
# --------------
@app.post("/orders/", response_model=schemas.OrderOut)
def place_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == payload.product_id).with_for_update().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    # reduce stock
    product.stock -= payload.quantity
    total = product.price * payload.quantity
    order = models.Order(product_id=payload.product_id, quantity=payload.quantity, status="Created", total_price=total)
    db.add(order)
    db.commit()
    db.refresh(order)
    # Simulate event publish (in real system we'd send to RabbitMQ)
    # We'll log to console (this helps explaining message-queue in interview)
    print(f"[EVENT] OrderCreated -> order_id={order.id} product_id={order.product_id} qty={order.quantity}")
    return order

@app.get("/orders/", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()

@app.put("/orders/{order_id}/ship", response_model=schemas.OrderOut)
def ship_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "Shipped"
    db.commit()
    db.refresh(order)
    return order
