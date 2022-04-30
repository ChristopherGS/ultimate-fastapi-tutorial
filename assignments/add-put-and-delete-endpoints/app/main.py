from fastapi import FastAPI, APIRouter, Query

from typing import Optional

from app.schemas import (
    RecipeSearchResults,
    Recipe,
    RecipeCreate,
    RecipeUpdateRestricted,
)
from app.recipe_data import RECIPES


app = FastAPI(title="Recipe API", openapi_url="/openapi.json")

api_router = APIRouter()


@api_router.get("/", status_code=200)
def root() -> dict:
    """
    Root GET
    """
    return {"msg": "Hello, World!"}


@api_router.get("/recipe/{recipe_id}", status_code=200, response_model=Recipe)
def fetch_recipe(*, recipe_id: int) -> dict:
    """
    Fetch a single recipe by ID
    """

    result = [recipe for recipe in RECIPES if recipe["id"] == recipe_id]
    if result:
        return result[0]


@api_router.get("/search/", status_code=200, response_model=RecipeSearchResults)
def search_recipes(
    *,
    keyword: Optional[str] = Query(None, min_length=3, example="chicken"),
    max_results: Optional[int] = 10
) -> dict:
    """
    Search for recipes based on label keyword
    """
    if not keyword:
        # we use Python list slicing to limit results
        # based on the max_results query parameter
        return {"results": RECIPES[:max_results]}

    results = filter(lambda recipe: keyword.lower() in recipe["label"].lower(), RECIPES)
    return {"results": list(results)[:max_results]}


@api_router.post("/recipe/", status_code=201, response_model=Recipe)
def create_recipe(*, recipe_in: RecipeCreate) -> dict:
    """
    Create a new recipe (in memory only)
    """
    new_entry_id = len(RECIPES) + 1
    recipe_entry = Recipe(
        id=new_entry_id,
        label=recipe_in.label,
        source=recipe_in.source,
        url=recipe_in.url,
    )
    RECIPES.append(recipe_entry.dict())

    return recipe_entry


# Assignment Part 1: Add a PUT endpoint
@api_router.put("/recipe/", status_code=200, response_model=Recipe)
def update_recipe(*, recipe_in: RecipeUpdateRestricted) -> dict:
    """
    Update a recipe (in memory only)
    """
    # In part 5 you'll see how to raise an error correctly
    # where this index does not exist
    recipe = RECIPES.pop(recipe_in.id - 1)
    recipe["label"] = recipe_in.label
    RECIPES.append(recipe)

    return recipe


# Assignment Part 2: Add a DELETE endpoint
@api_router.delete("/recipe/{recipe_id}", status_code=200, response_model=Recipe)
def delete_recipe(*, recipe_id: int) -> dict:
    """
    Delete a recipe (in memory only)
    """
    # In part 5 you'll see how to raise an error correctly
    # where this index does not exist
    return RECIPES.pop(recipe_id - 1)


app.include_router(api_router)


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
