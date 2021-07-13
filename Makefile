install:
	npm install

start:
	heroku local -f Procfile.dev

start-backend:
	json-server --watch db.json --port 3001

start-frontend:
	npm start

.PHONY: test
