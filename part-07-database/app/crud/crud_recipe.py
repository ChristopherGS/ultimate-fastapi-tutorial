from crud.base import CRUDBase
from models.recipe import Recipe
from schemas.recipe import RecipeCreate, RecipeUpdate


class CRUDRecipe(CRUDBase[Recipe, RecipeCreate, RecipeUpdate]):
    ...


recipe = CRUDRecipe(Recipe)
