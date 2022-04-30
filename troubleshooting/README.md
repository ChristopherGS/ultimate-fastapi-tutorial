# Troubleshooting Guide

Computers are annoying and will hurt you. Here are the gotchas that have been reported/I've discovered.

If you find one missing, please open a PR!

### python-multipart dependency (Ubuntu)

Error:
```python
  • Installing python-multipart (0.0.5): Failed

  EnvCommandError
...
ImportError: libffi.so.6: cannot open shared object file: No such file or directory
```

Fix:
Reinstall Python so that libffi.so.6 is updated as [described in this SO answer](https://stackoverflow.com/questions/61875869/ubuntu-20-04-upgrade-python-missing-libffi-so-6)


### Poetry Issues on Windows

Make sure you use the downloadable Python install and **not** the Python install from the Microsoft Store.

`poetry command not found`

Reinstall poetry using the recommended powershell install approach: 
https://python-poetry.org/docs/master/#installing-with-the-official-installer

`(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -`

Also make sure Add Poetry to your PATH

The installer installs the poetry tool to Poetry’s bin directory. This location depends on your system:

$HOME/.local/bin for Unix
%APPDATA%\Python\Scripts on Windows

(restart command prompt after updating your path)


C:\Users\Chris\repos\ultimate-fastapi-tutorial\part-06-jinja-templates>poetry run app/main.py

  OSError

  [WinError 193] %1 is not a valid Win32 application

  at ~\AppData\Local\Programs\Python\Python310\lib\subprocess.py:1435 in _execute_child
      1431│             sys.audit("subprocess.Popen", executable, args, cwd, env)
      1432│
      1433│             # Start the process
      1434│             try:
    → 1435│                 hp, ht, pid, tid = _winapi.CreateProcess(executable, args,
      1436│                                          # no special security
      1437│                                          None, None,
      1438│                                          int(not close_fds),
      1439│                                          creationflags,




https://stackoverflow.com/a/25652030/2339348
"You need python.exe to be visible on the search path"
Instead run `poetry run python app/main.py` (don't forget the `python` call)


https://docs.python.org/3/using/windows.html#using-python-on-windows
Windows 7 support, please install Python 3.8.


More MS Store Python issues: https://docs.python.org/3/using/windows.html#known-issues


Poetry envs taking up too much space?

Run `poetry env list` (copy the value)
then `poetry remove {YOUR_VENV_NAME}` to remove.