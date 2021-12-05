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

