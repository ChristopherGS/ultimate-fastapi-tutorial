## Part 11 Local Setup

1. `pip install poetry` (or safer, follow the instructions: https://python-poetry.org/docs/#installation)
2. Install dependencies `cd` into the directory where the `pyproject.toml` is located then `poetry install`
3. If continuing from a previous part of the series, delete your current project database because we 
have made breaking DB migration changes. `rm example.db`. If you're starting here, you can ignore this step.
4. Run the DB migrations via poetry `poetry run python app/prestart.py` (only required once) (Unix users can use
the bash script if preferred)
5. [UNIX]: Run the FastAPI server via poetry with the bash script: `poetry run ./run.sh`
6. [WINDOWS]: Run the FastAPI server via poetry with the Python command: `poetry run python app/main.py`
7. Open http://localhost:8001/
