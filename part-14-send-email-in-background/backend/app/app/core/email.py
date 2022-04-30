from app.clients.email import EmailClient, MailGunSendData
from app.schemas.user import UserCreate



def send_registration_confirmed_email(
	client: EmailClient,
	user: UserCreate
) -> None:
	send_data = MailGunSendData(
		to=[user.email],
		subject='Your registration is confirmed',
		text='test')
	response = client.send_email(send_data=send_data)

	if response.status_code > 299:
		...
	# log error


