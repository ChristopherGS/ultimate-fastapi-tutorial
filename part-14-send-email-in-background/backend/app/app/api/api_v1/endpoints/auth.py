from typing import Any

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from loguru import logger
from sqlalchemy.orm.session import Session

from app import crud
from app import schemas
from app.api import deps
from app.core.auth import (
    authenticate,
    create_access_token,
)
from app.models.user import User
from app.clients.email import EmailClient
from app.core.email import send_registration_confirmed_email
from app.core.config import settings


router = APIRouter()


@router.post("/login")
def login(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Get the JWT for a user with data from OAuth2 request form body.
    """

    user = authenticate(email=form_data.username, password=form_data.password, db=db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {
        "access_token": create_access_token(sub=user.id),
        "token_type": "bearer",
    }


@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: User = Depends(deps.get_current_user)):
    """
    Fetch the current logged in user.
    """

    user = current_user
    return user


@router.post("/signup", response_model=schemas.User, status_code=201)
def create_user_signup(
    *,
    db: Session = Depends(deps.get_db),
    email_client: EmailClient = Depends(deps.get_email_client),
    background_tasks: BackgroundTasks,
    user_in: schemas.user.UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in.
    """

    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user = crud.user.create(db=db, obj_in=user_in)

    if settings.email.SEND_REGISTRATION_EMAILS:
        # Trigger email (asynchronous)
        background_tasks.add_task(
            send_registration_confirmed_email, user=user, client=email_client
        )

    return user
