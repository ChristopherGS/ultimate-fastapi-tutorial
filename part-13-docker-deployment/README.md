## New: Run with Docker (see previous sections for running without Docker)

Make sure you have Docker and [Docker Compose](https://docs.docker.com/compose/install/) installed.

1. Ensure you are in the `part-13-docker-deployment` directory
2. Run `docker-compose -f docker-compose.local.yml up -d` (this will download the postgres
   image and build the image for the recipe app - takes about 5 mins)
3. Visit `http://localhost:8001/docs`

