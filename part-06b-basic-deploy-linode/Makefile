linode_install:
	# sudo apt update
	# sudo apt install make
	sudo apt -y upgrade
	sudo apt -y install python3-pip
	pip install poetry
	poetry install
	sudo apt -y install nginx
	sudo cp nginx/default.conf /etc/nginx/sites-available/fastapi_app
	# Disable the NGINX’s default configuration file by removing its symlink
	sudo unlink /etc/nginx/sites-enabled/default
	# Reload the NGINX configuration file:
	sudo nginx -s reload

linode_run:
	gunicorn -w 2 -k uvicorn.workers.UvicornWorker