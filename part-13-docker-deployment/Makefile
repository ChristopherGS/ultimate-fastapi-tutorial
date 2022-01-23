NAME=fastapi-recipe-app
COMMIT_ID=$(shell git rev-parse HEAD)


heroku-login:
	HEROKU_API_KEY=${HEROKU_API_KEY} heroku container:login

build-app-heroku: heroku-login
	docker build -t registry.heroku.com/${HEROKU_APP_NAME}/web .

push-app-heroku: heroku-login
	docker push registry.heroku.com/${HEROKU_APP_NAME}/web

release-heroku: heroku-login
	heroku container:release web --app ${HEROKU_APP_NAME}

.PHONY: heroku-login build-app-heroku push-app-heroku
