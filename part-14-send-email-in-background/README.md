## Part 14 Local Setup

(Non-Docker)

1. `pip install poetry`
2. Install dependencies `cd` into the directory where the `pyproject.toml` is located then `poetry install`
3. If continuing from a previous part of the series, delete your current project database because we 
have made breaking DB migration changes. `rm example.db`. If you're starting here, you can ignore this step.
4. Run the DB migrations via poetry `poetry run ./prestart.sh` (only required once)
5. Run the FastAPI server via poetry `poetry run ./run.sh`
6. Open http://localhost:8001/

