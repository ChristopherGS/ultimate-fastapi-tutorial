from typing import Generator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api import deps


async def override_reddit_dependency() -> MagicMock:
    mock = MagicMock()
    reddit_stub = {
        "recipes": [
            "2085: the best chicken wings ever!! (https://i.redd.it/5iabdxh1jq381.jpg)",
        ],
        "easyrecipes": [
            "74: Instagram accounts that post easy recipes? (https://www.reddit.com/r/easyrecipes/comments/rcluhd/instagram_accounts_that_post_easy_recipes/)",
        ],
        "TopSecretRecipes": [
            "238: Halal guys red sauce - looking for recipe. Tried a recipe from a google search and it wasn’t nearly spicy enough. (https://i.redd.it/516yb30q9u381.jpg)",
            "132: Benihana Diablo Sauce - THE AUTHENTIC RECIPE! (https://www.reddit.com/r/TopSecretRecipes/comments/rbcirf/benihana_diablo_sauce_the_authentic_recipe/)",
        ],
    }
    mock.get_reddit_top.return_value = reddit_stub
    return mock


@pytest.fixture
def client() -> Generator:
    with TestClient(app) as client:
        app.dependency_overrides[deps.get_reddit_client] = override_reddit_dependency
        yield client
        app.dependency_overrides = {}
