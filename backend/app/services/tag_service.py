"""标签相关业务逻辑。"""
from __future__ import annotations

from typing import Iterable, List, Optional

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from ..models import Tag, TicketTag

MAX_TAGS_PER_TICKET = 20


def _base_tag_query() -> Select:
    return select(Tag)


def get_tags_by_ids(db: Session, tag_ids: Iterable[int]) -> List[Tag]:
    ids = list(dict.fromkeys(tag_ids))
    if not ids:
        return []
    result = db.execute(_base_tag_query().where(Tag.id.in_(ids)))
    return list({tag.id: tag for tag in result.scalars().all()}.values())


def get_or_create_tags_by_names(db: Session, tag_names: Iterable[str]) -> List[Tag]:
    names = [name.strip() for name in tag_names if name.strip()]
    if not names:
        return []

    # 先查询已有标签
    existing = db.execute(_base_tag_query().where(Tag.name.in_(names))).scalars().all()
    existing_map = {tag.name.lower(): tag for tag in existing}

    tags: list[Tag] = existing.copy()
    for name in names:
        lower = name.lower()
        if lower in existing_map:
            continue
        tag = Tag(name=name)
        db.add(tag)
        tags.append(tag)
        existing_map[lower] = tag
    db.flush()
    return tags


def list_tags_with_usage(db: Session, sort: Optional[str] = None) -> List[Tag]:
    usage_stmt = (
        select(Tag, func.count(TicketTag.id).label("usage_count"))
        .outerjoin(TicketTag, Tag.id == TicketTag.tag_id)
        .group_by(Tag.id)
    )

    if sort == "usage_desc":
        usage_stmt = usage_stmt.order_by(func.count(TicketTag.id).desc(), Tag.name.asc())
    else:  # 默认按名称
        usage_stmt = usage_stmt.order_by(Tag.name.asc())

    rows = db.execute(usage_stmt).all()
    tags: List[Tag] = []
    for tag, usage_count in rows:
        setattr(tag, "usage_count", int(usage_count))
        tags.append(tag)
    return tags


def enforce_tag_limit(current_tags: List[Tag], new_tags: Iterable[Tag]) -> None:
    unique_tag_ids = {tag.id for tag in current_tags}
    for tag in new_tags:
        unique_tag_ids.add(tag.id)
    if len(unique_tag_ids) > MAX_TAGS_PER_TICKET:
        raise ValueError(f"标签数量不可超过 {MAX_TAGS_PER_TICKET} 个")
