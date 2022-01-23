from app.core.config import settings


def test_fetch_ideas_reddit_sync(client):
    # When
    response = client.get(f"{settings.API_V1_STR}/recipes/ideas/")
    data = response.json()

    # Then
    assert response.status_code == 200
    for key in data.keys():
        assert key in ["recipes", "easyrecipes", "TopSecretRecipes"]
