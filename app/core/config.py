from functools import lru_cache
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_env: str = Field(default='local', alias='APP_ENV')
    database_url: str = Field(alias='DATABASE_URL')
    redis_url: str = Field(alias='REDIS_URL')
    jwt_secret_key: str = Field(alias='JWT_SECRET_KEY', min_length=24)
    jwt_refresh_secret_key: str = Field(alias='JWT_REFRESH_SECRET_KEY', min_length=24)
    access_token_expire_minutes: int = Field(default=15, alias='ACCESS_TOKEN_EXPIRE_MINUTES', ge=1)
    refresh_token_expire_days: int = Field(default=7, alias='REFRESH_TOKEN_EXPIRE_DAYS', ge=1)
    allowed_origins: str = Field(alias='ALLOWED_ORIGINS')
    frontend_url: str = Field(
    default="http://localhost:3000",
    alias="FRONTEND_URL",
    )

    smtp_host: str = Field(default="", alias="SMTP_HOST")
    smtp_port: int = Field(default=587, alias="SMTP_PORT")
    smtp_user: str = Field(default="", alias="SMTP_USER")
    smtp_password: str = Field(default="", alias="SMTP_PASSWORD")
    email_from: str = Field(
    default="noreply@rescuebite.kz",
    alias="EMAIL_FROM",
    )

    @field_validator('allowed_origins')
    @classmethod
    def no_wildcard_origins(cls, value: str) -> str:
        origins = [item.strip() for item in value.split(',') if item.strip()]
        if '*' in origins:
            raise ValueError('Wildcard CORS origins are not allowed')
        return value

    @property
    def cors_origins(self) -> list[str]:
        return [item.strip() for item in self.allowed_origins.split(',') if item.strip()]
    


@lru_cache
def get_settings() -> Settings:
    return Settings()
