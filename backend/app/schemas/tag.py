"""标签相关 Schema。"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated, Optional, List

from pydantic import BaseModel, Field, model_validator


class TagBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=50, strip_whitespace=True)]


class TagCreate(TagBase):
    pass


class TagResponse(TagBase):
    id: int
    created_at: datetime
    usage_count: Optional[int] = None

    model_config = {
        "from_attributes": True,
    }


class TagAssignmentPayload(BaseModel):
    tag_ids: Optional[List[int]] = Field(default=None, description="已有标签 ID 列表")
    tag_names: Optional[List[str]] = Field(default=None, description="需要创建或匹配的标签名称")

    @model_validator(mode="after")
    def validate_payload(self) -> "TagAssignmentPayload":
        tag_ids = self.tag_ids or []
        tag_names = [name.strip() for name in (self.tag_names or []) if name.strip()]
        if not tag_ids and not tag_names:
            raise ValueError("tag_ids 或 tag_names 至少提供一个")
        self.tag_names = tag_names or None
        return self


class TagSort(str, Enum):
    USAGE_DESC = "usage_desc"
    NAME_ASC = "name_asc"
