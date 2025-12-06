"""测试配置与公共夹具。"""
from __future__ import annotations

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings
from app.database import Base
from app.dependencies import get_db_session
from app.main import app


@pytest.fixture(scope="session")
def test_engine() -> Generator:
    settings = get_settings()
    test_db_url = settings.test_database_url or "sqlite+pysqlite:///:memory:"
    connect_args = {"check_same_thread": False} if test_db_url.startswith("sqlite") else {}
    engine = create_engine(test_db_url, future=True, pool_pre_ping=True, connect_args=connect_args)
    Base.metadata.create_all(bind=engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def db_session(test_engine) -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(bind=connection, autoflush=False, autocommit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
            db_session.flush()
        finally:
            db_session.expunge_all()

    app.dependency_overrides[get_db_session] = override_get_db
    with TestClient(app) as http_client:
        yield http_client
    app.dependency_overrides.pop(get_db_session, None)
