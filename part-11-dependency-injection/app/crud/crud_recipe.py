from typing import Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdateRestricted, RecipeUpdate


class CRUDRecipe(CRUDBase[Recipe, RecipeCreate, RecipeUpdate]):
    def update(
        self,
        db: Session,
        *,
        db_obj: Recipe,
        obj_in: Union[RecipeUpdate, RecipeUpdateRestricted]
    ) -> Recipe:
        db_obj = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj


recipe = CRUDRecipe(Recipe)
