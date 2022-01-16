import Recipe from "../Recipe";
import React from "react";

const RecipeTable = ({recipes}) => {
    recipes.map((recipe, i) => {
      console.log(recipe)
    })
    return (
      <>
      <h2> Recipes </h2>
        <div className="sections-list">
          {recipes.length && (
              recipes.map((recipe, i) => (
                <Recipe key={recipe.id} data={recipe}/>
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