"""统一 API 响应工具。"""
from typing import Any

from fastapi import status


def create_response(data: Any, message: str = "Success", code: int = status.HTTP_200_OK) -> dict[str, Any]:
    """生成标准响应体。"""
    return {
        "code": code,
        "message": message,
        "data": data,
    }
