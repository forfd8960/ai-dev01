"""FastAPI 依赖注入相关函数。"""
from typing import Generator

from sqlalchemy.orm import Session

from .database import get_db


def get_db_session() -> Generator[Session, None, None]:
    """包装数据库会话，方便在 FastAPI 中引用。"""
    yield from get_db()
