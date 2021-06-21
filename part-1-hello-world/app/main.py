from fastapi import FastAPI, APIRouter


RECIPES = [
    {'label': "Chicken Vesuvio",
     "source": "Serious Eats",
     "url":"http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html"},
    {"label": "Chicken Paprikash",
     "source":"No Recipes",
     "url":"http://norecipes.com/recipe/chicken-paprikash/"},
    {"label": "Cauliflower and Tofu Curry Recipe",
     "source": "Serious Eats",
     "url": "http://www.seriouseats.com/recipes/2011/02/cauliflower-and-tofu-curry-recipe.html"}
]


app = FastAPI(
    title="Recipe API", openapi_url="/openapi.json"
)

api_router = APIRouter()

@api_router.get("/", status_code=200)
def root() -> dict:
    """
    Root GET
    """
    return {"msg": "Hello, World!"}


@api_router.get("/search", keyword: str = None, status_code=200)
def search_recipes() -> dict:
    """
    Search for recipes based on keyword
    """
    return {"msg": "Hello, World!"}


app.include_router(api_router)


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
