import Recipe from "../Recipe";
import React from "react";

const RecipeTable = ({recipes}) => {
    return (
      <>
        <div className="sections-list">
          {recipes.length && (
              recipes.map((recipe, i) => (
                <Recipe key={recipe.id} recipe={recipe}/>
              ))
          )}
          {!recipes.length && (
              <p>No recipes found!</p>
          )}
        </div>
      </>
    )
}

export default RecipeTable;