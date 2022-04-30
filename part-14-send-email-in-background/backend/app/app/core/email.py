from loguru import logger

from app.clients.email import EmailClient, MailGunSendData
from app.schemas.user import UserCreate
from app.models.user import User
from app.core.config import settings



def send_registration_confirmed_email(
	client: EmailClient,
	user: User
) -> None:
	send_data = MailGunSendData(
		from_=f'admin@{settings.email.MAILGUN_DOMAIN_NAME}',
		to=[str(user.email)],
		subject='Registration Confirmed',
		text=f'Hi {user.first_name}, \nYour registration is confirmed!')
	response = client.send_email(data=send_data)

	if response.status_code > 299:
		logger.error(f'Failed to send confirmation email for user: {user.email}, error: {response.error}')
	else:
		logger.info(response.text)
