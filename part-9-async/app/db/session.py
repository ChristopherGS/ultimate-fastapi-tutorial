from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    # required for sqlite
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI_ASYNC,
    # required for sqlite
)
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
