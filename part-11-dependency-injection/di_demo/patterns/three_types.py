from ..reddit import RedditClient

RECIPE_SUBREDDITS = ["recipes", "easyrecipes", "TopSecretRecipes"]

# 1. Constructor Injection
class Ideas:
    def __init__(self, reddit_client: RedditClient):
        self.reddit_client = reddit_client

    def fetch_ideas(self) -> dict:
        return {
            key: self.reddit_client.get_reddit_top(subreddit=key)
            for key in RECIPE_SUBREDDITS
        }


# 2. Setter Injection
class Ideas:
    _client = None

    def fetch_ideas(self) -> dict:
        return {
            key: self.client.get_reddit_top(subreddit=key) for key in RECIPE_SUBREDDITS
        }

    @property
    def client(self):
        return self._client

    @client.setter
    def client(self, value: RedditClient):
        self._client = value


# Interface Injection
