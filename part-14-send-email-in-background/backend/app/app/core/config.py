import logging
import pathlib
import sys

from dotenv import load_dotenv
from loguru import logger
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator
from typing import List, Optional, Union

from app.core.logging import InterceptHandler


load_dotenv()


# Project Directories
ROOT = pathlib.Path(__file__).resolve().parent.parent


class EmailSettings(BaseSettings):
    MAILGUN_API_KEY: str = "update me"
    MAILGUN_DOMAIN_NAME: str = "update me"
    MAILGUN_BASE_URL: str = "https://api.mailgun.net/v3/"
    SEND_REGISTRATION_EMAILS: bool = True


class DBSettings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///example.db"
    FIRST_SUPERUSER: EmailStr = "admin@recipeapi.com"
    FIRST_SUPERUSER_PW: str = "CHANGEME"


class LoggingSettings(BaseSettings):
    LOGGING_LEVEL: int = logging.INFO  # logging levels are ints


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    JWT_SECRET: str = "TEST_SECRET_DO_NOT_USE_IN_PROD"
    ALGORITHM: str = "HS256"

    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:8001",  # type: ignore
    ]

    # Origins that match this regex OR are in the above list are allowed
    BACKEND_CORS_ORIGIN_REGEX: Optional[
        str
    ] = "https.*\.(netlify.app|herokuapp.com)"  # noqa: W605

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    db: DBSettings = DBSettings()
    email: EmailSettings = EmailSettings()
    logging: LoggingSettings = LoggingSettings()

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"


def setup_app_logging(config: Settings) -> None:
    """Prepare custom logging for our application."""
    LOGGERS = ("uvicorn.asgi", "uvicorn.access")
    logging.getLogger().handlers = [InterceptHandler()]
    for logger_name in LOGGERS:
        logging_logger = logging.getLogger(logger_name)
        logging_logger.handlers = [InterceptHandler(level=config.logging.LOGGING_LEVEL)]

    logger.configure(
        handlers=[{"sink": sys.stderr, "level": config.logging.LOGGING_LEVEL}]
    )


settings = Settings()
