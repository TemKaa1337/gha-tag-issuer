.PHONY: setup snapshot tests

up:
	@docker compose up -d --build

down:
	@docker compose down

node-cli:
	@docker compose exec node zsh

build:
	@docker compose exec node npm run build

tests:
	@docker compose exec node npm test
