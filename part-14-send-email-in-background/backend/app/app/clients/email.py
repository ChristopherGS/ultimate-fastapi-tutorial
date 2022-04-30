import typing as t

from httpx import Client, Response, HTTPError
from loguru import logger
from pydantic import BaseModel


class EmailClientError(Exception):
    def __init__(self, message: str, raw_response: t.Optional[Response] = None):
        self.message = message
        self.raw_response = raw_response
        super().__init__(self.message)


class EmailClientConfig(BaseModel):
    BASE_URL: str = "https://api.mailgun.net/v3"


class MailGunConfig(EmailClientConfig):
    API_KEY: str
    DOMAIN_NAME: str


class MailGunSendData(BaseModel):
    from_: str
    to: t.List[str]
    subject: str
    text: str


class EmailClient:

    def __init__(self, config: MailGunConfig) -> None:
        self.config = config
        self.base_url: str = self.config.BASE_URL 
        self.base_error: t.Type[EmailClientError] = EmailClientError
        self.session = Client(auth=("api", str(self.config.API_KEY)))

    def _perform_request(  # type: ignore
        self, method: str, path: str, *args, **kwargs
    ) -> Response:
        res = None
        try:
            res = getattr(self.session, method)(
                f"{self.base_url}{path}", *args, **kwargs
            )
            res.raise_for_status()
        except HTTPError:
            raise self.base_error(
                f"{self.__class__.__name__} request failure:\n"
                f"{method.upper()}: {path}\n"
                f"Message: {res is not None and res.text}",
                raw_response=res,
            )
        return res

    def send_email(self, data: MailGunSendData):
        data = data.dict()

        # expected MailGun dict keys conflict with python from keyword
        data['from'] = data.pop('from_')
        return self._perform_request(
            method='post',
            path=f'{self.config.DOMAIN_NAME}/messages',
            data=data)
 