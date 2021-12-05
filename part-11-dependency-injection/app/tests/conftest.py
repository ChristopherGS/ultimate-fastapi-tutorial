import pytest
from fastapi.testclient import TestClient


async def override_reddit_dependency() -> MagicMock:
    mock = MagicMock()
    mock.send_templated_email.return_value = {"MessageId": "123"}
    return mock

@pytest.fixture()
def client() -> Generator:
    with TestClient(app) as c:
        # app.dependency_overrides[deps.get_db] = lambda: db
        app.dependency_overrides[
            deps.get_cloudformation_client
        ] = override_cloudformation_dependency
        app.dependency_overrides[deps.get_route53_client] = override_ecs_dependency
        yield c
        app.dependency_overrides = {}