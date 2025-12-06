"""Ticket 相关 API 路由。"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..dependencies import get_db_session
from ..schemas.common import DeleteCount
from ..schemas.tag import TagAssignmentPayload, TagResponse
from ..schemas.ticket import (
    TicketBatchDelete,
    TicketCreate,
    TicketListResponse,
    TicketPriority,
    TicketResponse,
    TicketStatus,
    TicketStatusUpdate,
    TicketUpdate,
)
from ..services import ticket_service
from ..utils.responses import create_response

router = APIRouter()


def _ticket_list_response(
    db: Session,
    *,
    page: int,
    limit: int,
    tags: Optional[str],
    status_filter: Optional[TicketStatus],
    priority: Optional[TicketPriority],
    sort: Optional[str],
    search: Optional[str],
):
    tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else None
    items, total, current_page, current_limit = ticket_service.list_tickets(
        db,
        page=page,
        limit=limit,
        tag_names=tag_list,
        status=status_filter,
        priority=priority,
        sort=sort,
        search=search,
    )

    payload = TicketListResponse(
        items=[TicketResponse.model_validate(item) for item in items],
        total=total,
        page=current_page,
        limit=current_limit,
    )
    return create_response(payload.model_dump())


@router.get("/", response_model=dict)
def list_tickets(
    *,
    db: Session = Depends(get_db_session),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    tags: Optional[str] = Query(default=None, description="逗号分隔的标签名称"),
    status_filter: Optional[TicketStatus] = Query(default=None, alias="status"),
    priority: Optional[TicketPriority] = Query(default=None),
    sort: Optional[str] = Query(default="created_at"),
    search: Optional[str] = Query(default=None),
):
    return _ticket_list_response(
        db,
        page=page,
        limit=limit,
        tags=tags,
        status_filter=status_filter,
        priority=priority,
        sort=sort,
        search=search,
    )


@router.get("/search", response_model=dict)
def search_tickets(
    *,
    db: Session = Depends(get_db_session),
    q: str = Query(..., description="标题关键词"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    tags: Optional[str] = Query(default=None),
    status_filter: Optional[TicketStatus] = Query(default=None, alias="status"),
):
    return _ticket_list_response(
        db,
        page=page,
        limit=limit,
        tags=tags,
        status_filter=status_filter,
        priority=None,
        sort="created_at",
        search=q,
    )


@router.get("/{ticket_id}", response_model=dict)
def get_ticket(ticket_id: int, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    response = TicketResponse.model_validate(ticket)
    return create_response(response.model_dump())


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db_session)):
    ticket = ticket_service.create_ticket(
        db,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
    )
    db.commit()
    db.refresh(ticket)
    response = TicketResponse.model_validate(ticket)
    return create_response(response.model_dump(), code=status.HTTP_201_CREATED)


@router.put("/{ticket_id}", response_model=dict)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    try:
        ticket = ticket_service.update_ticket(
            db,
            ticket,
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
        )
        db.commit()
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    db.refresh(ticket)
    response = TicketResponse.model_validate(ticket)
    return create_response(response.model_dump())


@router.patch("/{ticket_id}/status", response_model=dict)
def update_ticket_status(ticket_id: int, payload: TicketStatusUpdate, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    ticket = ticket_service.update_ticket_status(db, ticket, payload.status)
    db.commit()
    db.refresh(ticket)
    response = TicketResponse.model_validate(ticket)
    return create_response(response.model_dump())


@router.delete("/{ticket_id}", response_model=dict)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    ticket_service.delete_ticket(db, ticket)
    db.commit()
    return create_response({"deleted": True})


@router.delete("/batch", response_model=dict)
def delete_tickets(payload: TicketBatchDelete, db: Session = Depends(get_db_session)):
    deleted = ticket_service.delete_tickets_by_ids(db, payload.ids)
    db.commit()
    result = DeleteCount(deleted=deleted)
    return create_response(result.model_dump())


@router.post("/{ticket_id}/tags", response_model=dict)
def add_tags(ticket_id: int, payload: TagAssignmentPayload, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    try:
        tags = ticket_service.add_tags_to_ticket(
            db,
            ticket,
            tag_ids=payload.tag_ids,
            tag_names=payload.tag_names,
        )
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    response = [TagResponse.model_validate(tag) for tag in tags]
    return create_response([tag.model_dump() for tag in response])


@router.delete("/{ticket_id}/tags/{tag_id}", response_model=dict)
def remove_tag(ticket_id: int, tag_id: int, db: Session = Depends(get_db_session)):
    ticket = ticket_service.get_ticket_or_404(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket 不存在")
    tags = ticket_service.remove_tag_from_ticket(db, ticket, tag_id)
    db.commit()
    response = [TagResponse.model_validate(tag) for tag in tags]
    return create_response([tag.model_dump() for tag in response])
