"""通用 Schema 定义。"""
from __future__ import annotations

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ResponseEnvelope(BaseModel, Generic[T]):
    code: int = 200
    message: str = "Success"
    data: T


class Pagination(BaseModel):
    page: int
    limit: int
    total: int


class PaginatedResponse(ResponseEnvelope[T], Generic[T]):
    meta: Pagination


class DeleteCount(BaseModel):
    deleted: int
