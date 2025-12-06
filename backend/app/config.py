"""应用配置模块，使用 pydantic-settings 加载 .env 配置。"""
from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """项目根配置。"""

    app_name: str = Field(default="Project Alpha API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    api_v1_prefix: str = Field(default="/api", alias="API_V1_PREFIX")

    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/project_alpha_dev",
        alias="DATABASE_URL",
    )
    test_database_url: Optional[str] = Field(
        default="sqlite+pysqlite:///:memory:", alias="TEST_DATABASE_URL"
    )

    cors_origins_raw: str = Field(default="http://localhost:5173", alias="CORS_ORIGINS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> List[str]:
        """将逗号分隔的字符串解析为列表，并去除首尾空格。"""
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """提供带缓存的设置对象，避免重复读取文件。"""

    return Settings()  # type: ignore[call-arg]
