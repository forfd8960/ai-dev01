"""Ticket 相关业务逻辑。"""
from __future__ import annotations

from typing import Iterable, Sequence, Optional, List, Tuple

from sqlalchemy import Select, asc, desc, func, select
from sqlalchemy.orm import Session, joinedload

from ..models import Tag, Ticket, TicketTag
from ..schemas.ticket import TicketPriority, TicketStatus
from .tag_service import (
    enforce_tag_limit,
    get_or_create_tags_by_names,
    get_tags_by_ids,
)

DEFAULT_PAGE = 1
DEFAULT_LIMIT = 20
MAX_LIMIT = 100
SORT_MAP = {
    "created_at": desc(Ticket.created_at),
    "created_at_asc": asc(Ticket.created_at),
    "updated_at": desc(Ticket.updated_at),
    "updated_at_asc": asc(Ticket.updated_at),
}


def _base_ticket_query() -> Select:
    return select(Ticket).options(joinedload(Ticket.tags))


def paginate(page: Optional[int], limit: Optional[int]) -> Tuple[int, int]:
    page = page or DEFAULT_PAGE
    limit = limit or DEFAULT_LIMIT
    page = max(page, 1)
    limit = max(min(limit, MAX_LIMIT), 1)
    return page, limit


def list_tickets(
    db: Session,
    *,
    page: Optional[int] = None,
    limit: Optional[int] = None,
    tag_names: Optional[Sequence[str]] = None,
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    sort: Optional[str] = None,
    search: Optional[str] = None,
) -> Tuple[List[Ticket], int, int, int]:
    page, limit = paginate(page, limit)
    stmt = _base_ticket_query()
    count_stmt = select(func.count(func.distinct(Ticket.id))).select_from(Ticket)

    filters = []
    tag_names_list = [name.strip() for name in (tag_names or []) if name.strip()]
    if tag_names_list:
        stmt = stmt.join(Ticket.tags)
        count_stmt = count_stmt.join(Ticket.tags)
        filters.append(Tag.name.in_(tag_names_list))
    if status:
        filters.append(Ticket.status == status.value)
    if priority:
        filters.append(Ticket.priority == priority.value)
    if search and search.strip():
        like_pattern = f"%{search.strip()}%"
        filters.append(Ticket.title.ilike(like_pattern))

    if filters:
        stmt = stmt.where(*filters)
        count_stmt = count_stmt.where(*filters)

    total = db.execute(count_stmt).scalar_one()

    order_by_clause = SORT_MAP.get(sort or "created_at", desc(Ticket.created_at))
    stmt = stmt.order_by(order_by_clause).offset((page - 1) * limit).limit(limit)

    tickets = db.execute(stmt).scalars().unique().all()
    return tickets, total, page, limit


def create_ticket(
    db: Session, *, title: str, description: Optional[str], priority: TicketPriority
) -> Ticket:
    ticket = Ticket(title=title, description=description, priority=priority.value)
    db.add(ticket)
    db.flush()
    return ticket


def get_ticket_or_404(db: Session, ticket_id: int) -> Optional[Ticket]:
    stmt = _base_ticket_query().where(Ticket.id == ticket_id)
    return db.execute(stmt).scalars().first()


def update_ticket(
    db: Session,
    ticket: Ticket,
    *,
    title: Optional[str] = None,
    description: Optional[str] = None,
    priority: Optional[TicketPriority] = None,
) -> Ticket:
    if title is not None:
        ticket.title = title
    if description is not None:
        ticket.description = description
    if priority is not None:
        ticket.priority = priority.value
    db.add(ticket)
    db.flush()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket: Ticket) -> None:
    db.delete(ticket)
    db.flush()


def delete_tickets_by_ids(db: Session, ids: Sequence[int]) -> int:
    if not ids:
        return 0
    stmt = select(Ticket).where(Ticket.id.in_(ids))
    tickets = db.execute(stmt).scalars().all()
    deleted = 0
    for ticket in tickets:
        db.delete(ticket)
        deleted += 1
    db.flush()
    return deleted


def update_ticket_status(db: Session, ticket: Ticket, status: TicketStatus) -> Ticket:
    ticket.status = status.value
    db.add(ticket)
    db.flush()
    db.refresh(ticket)
    return ticket


def add_tags_to_ticket(
    db: Session,
    ticket: Ticket,
    *,
    tag_ids: Optional[Iterable[int]] = None,
    tag_names: Optional[Iterable[str]] = None,
) -> List[Tag]:
    tag_ids = tag_ids or []
    tag_names = tag_names or []

    tags_from_ids = get_tags_by_ids(db, tag_ids)
    tags_from_names = get_or_create_tags_by_names(db, tag_names)

    new_tags = tags_from_ids + tags_from_names
    enforce_tag_limit(ticket.tags, new_tags)

    existing_tag_ids = {tag.id for tag in ticket.tags}
    for tag in new_tags:
        if tag.id in existing_tag_ids:
            continue
        ticket.tags.append(tag)

    db.add(ticket)
    db.flush()
    db.refresh(ticket)
    return ticket.tags


def remove_tag_from_ticket(db: Session, ticket: Ticket, tag_id: int) -> List[Tag]:
    ticket.tags = [tag for tag in ticket.tags if tag.id != tag_id]
    db.add(ticket)
    db.flush()
    db.refresh(ticket)
    return ticket.tags
