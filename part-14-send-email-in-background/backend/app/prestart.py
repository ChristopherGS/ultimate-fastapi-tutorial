import subprocess
import sys


subprocess.run([sys.executable, "./app/backend_pre_start.py"])
subprocess.run([sys.executable, "python -m alembic upgrade head"])
subprocess.run([sys.executable, "./app/initial_data.py"])