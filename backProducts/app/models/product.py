from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from app.database.database import Base

class Product(Base):
    __tablename__ = "product"

    id_product = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid4, index=True
    )
    name = Column(String(255), index=True)
    price = Column(Integer, index=True)
    quantity = Column(Integer, index=True)
    description = Column(String(255), index=True)
