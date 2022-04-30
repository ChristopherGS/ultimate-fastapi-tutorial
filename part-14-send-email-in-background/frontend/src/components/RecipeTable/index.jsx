import Recipe from "../Recipe";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const RecipeTable = ({recipes}) => {

  const [recipeInfoModal, setRecipeInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {recipes.length && (
              recipes.map((recipe) => (
                <Recipe showRecipeInfoModal={() => setRecipeInfoModal(recipe)} key={recipe.id} recipe={recipe}  />
              ))
          )}
          {!recipes.length && (
              <p>No recipes found!</p>
          )}
        </div>
        {recipeInfoModal && <PopupModal
						modalTitle={"Recipe Info"}
						onCloseBtnPress={() => {
							setRecipeInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"label"}
									label={"Label"}
									value={recipeInfoModal?.label}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"url"}
									label={"Url"}
									value={recipeInfoModal?.url}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"source"}
									label={"Source"}
									value={recipeInfoModal?.source}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default RecipeTable;