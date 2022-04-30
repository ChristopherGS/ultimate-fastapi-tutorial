## Part 14 Local Setup

(Non-Docker)

1. `pip install poetry` (or safer, follow the instructions: https://python-poetry.org/docs/#installation)
2. Install dependencies `cd` into the directory where the `pyproject.toml` is located then `poetry install`
3. If continuing from a previous part of the series, delete your current project database because we 
have made breaking DB migration changes. `rm example.db`. If you're starting here, you can ignore this step.
4. Run the DB migrations via poetry `poetry run python app/prestart.py` (only required once) (Unix users can use
the bash script if preferred)
5. [UNIX]: Run the FastAPI server via poetry with the bash script: `poetry run ./run.sh`
6. [WINDOWS]: Run the FastAPI server via poetry with the Python command: `poetry run python app/main.py`
7. Open http://localhost:8001/

### Mailgun setup
- Signup for a free account at [mailgun](https://www.mailgun.com/)
- Get your API Key and Domain name and set them as environment variables to match the config.py file (or use a .env in your backend/app directory)
- Set your [authorized recipient](https://help.mailgun.com/hc/en-us/articles/217531258-Authorized-Recipients) email addresses