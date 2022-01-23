# Update the Heroku names to match yours
# Add the HEROKU_API_KEY to your CI env vars
HEROKU_APP_NAME=fastapi-recipe-app
HEROKU_FRONTEND_APP_NAME=fastapi-recipe-app-frontend
COMMIT_ID=$(shell git rev-parse HEAD)


heroku-login:
	HEROKU_API_KEY=${HEROKU_API_KEY} heroku container:login

build-app-heroku: heroku-login
	docker build -t registry.heroku.com/$(HEROKU_APP_NAME)/web ./backend

push-app-heroku: heroku-login
	docker push registry.heroku.com/$(HEROKU_APP_NAME)/web

release-heroku: heroku-login
	heroku container:release web --app $(HEROKU_APP_NAME)

deploy-frontend-heroku: heroku-login
	git subtree push --prefix part-13-docker-deployment/frontend https://heroku:${HEROKU_API_KEY}@git.heroku.com/$(HEROKU_FRONTEND_APP_NAME).git master


.PHONY: heroku-login build-app-heroku push-app-heroku deploy-frontend-heroku
