"""Ticket 相关 Schema。"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated, Optional, List

from pydantic import BaseModel, Field, model_validator

from .tag import TagResponse

TITLE_FIELD = Field(min_length=1, max_length=255, strip_whitespace=True)
DESCRIPTION_FIELD = Field(default=None, strip_whitespace=False)


class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TicketStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"


class TicketBase(BaseModel):
    title: Annotated[str, TITLE_FIELD]
    description: Optional[str] = DESCRIPTION_FIELD
    priority: TicketPriority = TicketPriority.MEDIUM


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    title: Annotated[Optional[str], TITLE_FIELD] = None
    description: Optional[str] = DESCRIPTION_FIELD
    priority: Optional[TicketPriority] = None

    @model_validator(mode="after")
    def validate_payload(self) -> "TicketUpdate":
        if not any([self.title is not None, self.description is not None, self.priority is not None]):
            raise ValueError("至少提供一个需要更新的字段")
        return self


class TicketStatusUpdate(BaseModel):
    status: TicketStatus


class TicketResponse(TicketBase):
    id: int
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    tags: List[TagResponse] = Field(default_factory=list)

    model_config = {
        "from_attributes": True,
    }


class TicketListResponse(BaseModel):
    items: List[TicketResponse]
    total: int
    page: int
    limit: int


class TicketBatchDelete(BaseModel):
    ids: List[int]

    @model_validator(mode="after")
    def validate_ids(self) -> "TicketBatchDelete":
        if not self.ids:
            raise ValueError("需要至少提供一个 ID")
        return self
