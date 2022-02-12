from main_with_di import fetch_ideas

import pytest


class FakeClient:
    def get_reddit_top(self, subreddit: str) -> dict:
        return {
            "recipes": [
                "2825: Air Fryer Juicy Steak Bites (https://i.redd.it/6zdbb0zvrag81.jpg)"
            ],
            "easyrecipes": [
                "189: Meals for when you have absolutely no energy to cook? (https://www.reddit.com/r/easyrecipes/comments/smbbr5/meals_for_when_you_have_absolutely_no_energy_to/)"
            ],
        }


@pytest.fixture
def fake_reddit_client():
    return FakeClient()


def test_fetch_ideas(fake_reddit_client):
    # When
    subject = fetch_ideas(reddit_client=fake_reddit_client)

    # Then
    assert subject["recipes"]
    assert subject["easyrecipes"]
