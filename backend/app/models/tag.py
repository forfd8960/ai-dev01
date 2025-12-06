"""Tag 模型定义。"""
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:  # pragma: no cover
    from .ticket import Ticket


class Tag(Base):
    """标签实体。"""

    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    tickets: Mapped[list["Ticket"]] = relationship(
        "Ticket", secondary="ticket_tags", back_populates="tags", lazy="selectin"
    )

    __table_args__ = (
        CheckConstraint("length(trim(name)) > 0", name="tag_name_not_empty"),
        UniqueConstraint("name", name="uq_tag_name"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Tag(id={self.id!r}, name={self.name!r})"
