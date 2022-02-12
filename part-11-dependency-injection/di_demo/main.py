import httpx

RECIPE_SUBREDDITS = ["recipes", "easyrecipes", "TopSecretRecipes"]


def get_reddit_top(subreddit: str) -> None:
    response = httpx.get(
        f"https://www.reddit.com/r/{subreddit}/top.json?sort=top&t=day&limit=5",
        headers={"User-agent": "recipe bot 0.1"},
    )
    subreddit_recipes = response.json()
    subreddit_data = []
    for entry in subreddit_recipes["data"]["children"]:
        score = entry["data"]["score"]
        title = entry["data"]["title"]
        link = entry["data"]["url"]
        subreddit_data.append(f"{str(score)}: {title} ({link})")
    return subreddit_data


def fetch_ideas() -> dict:
    return {key: get_reddit_top(subreddit=key) for key in RECIPE_SUBREDDITS}
