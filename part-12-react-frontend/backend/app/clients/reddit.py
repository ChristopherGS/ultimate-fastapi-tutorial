import typing as t

from httpx import Client, Response, HTTPError


class RedditClientError(Exception):
    def __init__(self, message: str, raw_response: t.Optional[Response] = None):
        self.message = message
        self.raw_response = raw_response
        super().__init__(self.message)


class RedditClient:
    base_url: str = "https://www.reddit.com"
    base_error: t.Type[RedditClientError] = RedditClientError

    def __init__(self) -> None:
        self.session = Client()
        self.session.headers.update(
            {"Content-Type": "application/json", "User-agent": "recipe bot 0.1"}
        )

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

    def get_reddit_top(self, *, subreddit: str, limit=5) -> dict:
        """Fetch the top n entries from a given subreddit."""

        # If you get empty responses from the subreddit calls, set t=month instead.
        url = f"/r/{subreddit}/top.json?sort=top&t=week&limit={limit}"
        response = self._perform_request("get", url)
        subreddit_recipes = response.json()
        subreddit_data = []
        for entry in subreddit_recipes["data"]["children"]:
            score = entry["data"]["score"]
            title = entry["data"]["title"]
            link = entry["data"]["url"]
            subreddit_data.append(f"{str(score)}: {title} ({link})")

        return subreddit_data
