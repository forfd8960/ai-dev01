"""标签相关 API 路由。"""
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db_session
from ..schemas.tag import TagResponse, TagSort
from ..services import tag_service
from ..utils.responses import create_response

router = APIRouter()


@router.get("/", response_model=dict)
def list_tags(
    *,
    db: Session = Depends(get_db_session),
    sort: Optional[TagSort] = Query(default=TagSort.NAME_ASC, description="排序方式"),
):
    tags = tag_service.list_tags_with_usage(db, sort=sort.value if sort else None)
    response = [TagResponse.model_validate(tag).model_dump() for tag in tags]
    return create_response(response)
