.PHONY: dev server client install

# Run both the server and client concurrently using make's job parallelization
dev:
	@echo "Starting both Quantale Server and Client..."
	@$(MAKE) -j 2 server client

# Run only the FastAPI server
server:
	@echo "Starting FastAPI Server..."
	cd server && uv run python app/main.py

# Run only the Next.js client
client:
	@echo "Starting Next.js Client..."
	cd client && npm run dev

# Install dependencies for both projects
install:
	@echo "Installing Server dependencies..."
	cd server && uv sync || true
	@echo "Installing Client dependencies..."
	cd client && npm install
