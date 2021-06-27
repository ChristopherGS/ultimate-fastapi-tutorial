from sqlalchemy import Column, Integer, String

from app.database.base_class import Base


class Recipe(Base):
    id = Column(Integer, primary_key=True)
    label = Column(String(140))
    source = Column(String(140))
    url = Column(String(140))
