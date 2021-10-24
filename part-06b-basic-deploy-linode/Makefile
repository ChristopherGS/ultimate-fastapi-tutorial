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
	sudo ln -s /etc/nginx/sites-available/fastapi_app /etc/nginx/sites-enabled/

linode_run_foreground:
	# Reload the NGINX configuration file:
	sudo nginx -s reload
	# restart the Nginx service
	sudo systemctl restart nginx.service
	# The recommended configuration for proxying from Nginx is to use a UNIX domain
	# socket between Nginx and whatever the process manager that is being used to run
	# Uvicorn. Note that when doing this you will need run Uvicorn with --forwarded-allow-ips='*'
	# to ensure that the domain socket is trusted as a source from which to proxy headers.
	poetry run gunicorn --bind=unix:///tmp/uvicorn.sock -w 2 --forwarded-allow-ips='*' -k uvicorn.workers.UvicornWorker app.main:app

linode_run_background:
	# Reload the NGINX configuration file:
	sudo nginx -s reload
	# restart the Nginx service
	sudo systemctl restart nginx.service
	sudo apt install supervisor
	sudo cp fastapi_app.conf /etc/supervisor/conf.d/fastapi_app.conf
	sudo mkdir /var/log/fastapi_app
	sudo touch /var/log/fastapi_app/fastapi_app.out.log
    sudo touch /var/log/fastapi_app/fastapi_app.err.log
    sudo supervisorctl reload