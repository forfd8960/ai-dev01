"""Ticket 模型定义。"""
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:  # pragma: no cover - 类型检查辅助
    from .tag import Tag

PRIORITY_VALUES = ("low", "medium", "high")
STATUS_VALUES = ("pending", "completed")


class Ticket(Base):
    """Ticket 实体。"""

    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    priority: Mapped[str] = mapped_column(
        Enum(*PRIORITY_VALUES, name="ticket_priority_enum"),
        nullable=False,
        default="medium",
        server_default="medium",
    )
    status: Mapped[str] = mapped_column(
        Enum(*STATUS_VALUES, name="ticket_status_enum"),
        nullable=False,
        default="pending",
        server_default="pending",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary="ticket_tags", back_populates="tickets", lazy="selectin"
    )

    __table_args__ = (
        CheckConstraint("length(trim(title)) > 0", name="ticket_title_not_empty"),
    )

    def __repr__(self) -> str:  # pragma: no cover - 便于调试
        return f"Ticket(id={self.id!r}, title={self.title!r})"
