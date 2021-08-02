from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from typing import Any, Optional

from app import crud
from app.api import deps
from app.schemas.recipe import Recipe, RecipeCreate, RecipeSearchResults
from app.models.recipe import Recipe as RecipeModel

router = APIRouter()


@router.get("/{recipe_id}", status_code=200, response_model=Recipe)
def fetch_recipe(
    *,
    recipe_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Fetch a single recipe by ID
    """
    result = crud.recipe.get(db=db, id=recipe_id)
    if not result:
        # the exception is raised, not returned - you will get a validation
        # error otherwise.
        raise HTTPException(
            status_code=404, detail=f"Recipe with ID {recipe_id} not found"
        )

    return result


@router.get("/search/", status_code=200, response_model=RecipeSearchResults)
def search_recipes(
    *,
    keyword: str = Query(None, min_length=3, example="chicken"),
    max_results: Optional[int] = 100,
    db: Session = Depends(deps.get_db),
) -> dict:
    """
    Search for recipes based on label keyword
    """
    recipes = crud.recipe.get_multi(db=db)
    results = filter(lambda recipe: keyword.lower() in recipe.label.lower(), recipes)
    users = crud.user.get_multi(db=db)

    return {"results": list(results)[:100], "users": list(users)[:max_results]}


@router.get("/search/async", status_code=200, response_model=RecipeSearchResults)
async def search_recipes(
        *,
        keyword: str = Query(None, min_length=3, example="chicken"),
        max_results: Optional[int] = 100,
        db: Session = Depends(deps.get_db_async),
) -> dict:
    """
    Search for recipes based on label keyword
    """
    recipes = await crud.recipe.get_multi_async(db)
    results = filter(lambda recipe: keyword.lower() in recipe.label.lower(), recipes.scalars().all())
    users = await crud.user.get_multi_async(db=db)

    return {"results": list(results)[:100], "users": list(users.scalars().all())[:max_results]}


@router.post("/", status_code=201, response_model=Recipe)
def create_recipe(
    *, recipe_in: RecipeCreate, db: Session = Depends(deps.get_db)
) -> dict:
    """
    Create a new recipe (in memory only)
    """
    recipe = crud.recipe.create(db=db, obj_in=recipe_in)

    return recipe
