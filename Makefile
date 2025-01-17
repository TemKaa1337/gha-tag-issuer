.PHONY: setup snapshot tests

up:
	@docker compose up -d --build

down:
	@docker compose down

node-cli:
	@docker compose exec node zsh
