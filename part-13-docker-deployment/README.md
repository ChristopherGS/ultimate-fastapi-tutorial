## New: Run with Docker (see previous sections for running without Docker)

Make sure you have Docker and [Docker Compose](https://docs.docker.com/compose/install/) installed.

1. Ensure you are in the `part-13-docker-deployment` directory
2. Run `docker-compose -f docker-compose.local.yml up -d` (this will download the postgres
   image and build the image for the recipe app - takes about 5 mins)
3. Visit `http://localhost:8001/docs`


Windows Users: Having problems getting the volume to work properly? Review the following resources:

- [Docker on Windows - Mounting Host Directories](https://rominirani.com/docker-on-windows-mounting-host-directories-d96f3f056a2c?gi=324e01b3473a)
- [Configuring Docker for Windows Shared Drives](https://docs.microsoft.com/en-gb/archive/blogs/stevelasker/configuring-docker-for-windows-volumes)
- You also may need to add `COMPOSE_CONVERT_WINDOWS_PATHS=1` to the environment portion of your Docker Compose file.

