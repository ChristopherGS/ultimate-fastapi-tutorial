## Part 7 Local Setup

1. `pip install poetry` (or safer, follow the instructions: https://python-poetry.org/docs/#installation)
2. Install dependencies `cd` into the directory where the `pyproject.toml` is located then `poetry install`
3. Run the DB migrations via poetry `poetry run ./prestart.sh` (only required once)
4. Run the FastAPI server via poetry `poetry run ./run.sh`
5. Open http://localhost:8001/
