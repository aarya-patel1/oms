from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: int
    stock: int

class ProductOut(BaseModel):
    id: int
    name: str
    price: int
    stock: int
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    product_id: int
    quantity: int

class OrderOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    status: str
    total_price: int
    class Config:
        orm_mode = True
