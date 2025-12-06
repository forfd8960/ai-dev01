PYTHON?=python3
PIP?=$(PYTHON) -m pip
BACKEND_DIR=backend
FRONTEND_DIR=frontend

.PHONY: backend-setup backend-run backend-lint backend-test backend-migrate frontend-setup frontend-run

backend-setup:
	cd $(BACKEND_DIR) && $(PYTHON) -m venv .venv && . .venv/bin/activate && $(PIP) install -r requirements.txt

backend-run:
	cd $(BACKEND_DIR) && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000

backend-lint:
	cd $(BACKEND_DIR) && . .venv/bin/activate && ruff check app && black --check app

backend-test:
	cd $(BACKEND_DIR) && . .venv/bin/activate && pytest

backend-migrate:
	cd $(BACKEND_DIR) && . .venv/bin/activate && alembic upgrade head

frontend-setup:
	cd $(FRONTEND_DIR) && npm install

frontend-run:
	cd $(FRONTEND_DIR) && npm run dev
