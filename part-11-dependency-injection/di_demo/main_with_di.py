from reddit import RedditClient


RECIPE_SUBREDDITS = ["recipes", "easyrecipes", "TopSecretRecipes"]


def fetch_ideas(reddit_client: RedditClient) -> dict:
    return {
        key: reddit_client.get_reddit_top(subreddit=key) for key in RECIPE_SUBREDDITS
    }
