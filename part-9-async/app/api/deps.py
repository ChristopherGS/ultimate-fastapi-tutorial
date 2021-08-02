from typing import Generator

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session, SessionLocal



def get_db() -> Generator:
    db = SessionLocal()
    db.current_user_id = None
    try:
        yield db
    finally:
        db.close()


async def get_db_async() -> AsyncSession:
    async with async_session() as session:
        yield session
