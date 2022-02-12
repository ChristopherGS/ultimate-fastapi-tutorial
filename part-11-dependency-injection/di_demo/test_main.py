from main import fetch_ideas

from unittest.mock import patch

REDDIT_RESPONSE_DATA = {
    "recipes": [
        "2825: Air Fryer Juicy Steak Bites (https://i.redd.it/6zdbb0zvrag81.jpg)"
    ],
    "easyrecipes": [
        "189: Meals for when you have absolutely no energy to cook? (https://www.reddit.com/r/easyrecipes/comments/smbbr5/meals_for_when_you_have_absolutely_no_energy_to/)"
    ],
}


def test_fetch_ideas():
    # Given
    with patch("main.get_reddit_top") as mocked_get_reddit:
        mocked_get_reddit.return_value = REDDIT_RESPONSE_DATA

        # When
        subject = fetch_ideas()

    # Then
    assert subject["recipes"]
    assert subject["easyrecipes"]
