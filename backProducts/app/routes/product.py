from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.database.database import get_db

router_product = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Not found"}},
)

# 📌 Obtener todos los productos
@router_product.get("/", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [
        {
            "id_product": str(product.id_product),
            "name": product.name,
            "price": product.price,
            "quantity": product.quantity,
            "description": product.description,
        }
        for product in products
    ]

# 📌 Crear un producto
@router_product.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {
        "id_product": str(db_product.id_product),
        "name": db_product.name,
        "price": db_product.price,
        "quantity": db_product.quantity,
        "description": db_product.description,
    }

# 📌 Obtener un producto por ID
@router_product.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id_product == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id_product": str(product.id_product),
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity,
        "description": product.description,
    }

# 📌 Actualizar un producto existente
@router_product.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str, product: ProductUpdate, db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(Product.id_product == product_id).first()
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump(exclude_unset=True).items():
        setattr(existing_product, key, value)
    db.commit()
    db.refresh(existing_product)
    return {
        "id_product": str(existing_product.id_product),
        "name": existing_product.name,
        "price": existing_product.price,
        "quantity": existing_product.quantity,
        "description": existing_product.description,
    }

# 📌 Eliminar un producto
@router_product.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id_product == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
