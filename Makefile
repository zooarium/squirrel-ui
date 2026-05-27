# Squirrel-UI Makefile

# Use bash as shell for nvm support
SHELL := /bin/bash

# Variables
NPM = npm
VITE = npx vite
CAP = npx cap
DIST_DIR = dist
ANDROID_DIR = android

# NVM Setup: Source nvm.sh and run nvm use
NVM_SH := /home/hiren/.local/bin/nvm.sh
NVM_USE := . $(NVM_SH) && nvm use

.PHONY: help install update dev build analyze lint format test test-watch clean cap-sync cap-open-android android-build

# Default command: show help
help:
	@echo "Squirrel-UI Development Commands:"
	@echo "  make install             Install dependencies"
	@echo "  make update              Update all NPM packages"
	@echo "  make dev                 Start Vite development server"
	@echo "  make build               Build the project for production"
	@echo "  make analyze             Build + generate stats.html bundle treemap"
	@echo "  make lint                Run ESLint"
	@echo "  make format              Format code with Prettier"
	@echo "  make test                Run tests once"
	@echo "  make test-watch          Run tests in watch mode"
	@echo "  make clean               Remove build artifacts"
	@echo ""
	@echo "Capacitor/Mobile Commands:"
	@echo "  make cap-sync            Sync web assets to native platforms"
	@echo "  make cap-open-android    Open Android Studio"
	@echo "  make android-build       Build the Android application"

# Project setup
install:
	$(NVM_USE) && $(NPM) install

update:
	$(NVM_USE) && $(NPM) update

# Development
dev:
	$(NVM_USE) && $(NPM) run dev

# Production build
build:
	$(NVM_USE) && $(NPM) run build

# Bundle analysis — builds prod + outputs stats.html treemap
# Open stats.html in browser to see interactive chunk breakdown (gzip + brotli sizes)
analyze:
	$(NVM_USE) && $(NPM) run analyze
	@echo ""
	@echo "✓ Bundle report → stats.html (open in browser)"

# Quality tools
lint:
	$(NVM_USE) && $(NPM) run lint

format:
	$(NVM_USE) && $(NPM) run format

# Testing
test:
	$(NVM_USE) && $(NPM) run test

test-watch:
	$(NVM_USE) && $(NPM) run test:watch

# Capacitor / Mobile
cap-sync: build
	$(NVM_USE) && $(CAP) sync

cap-open-android:
	$(NVM_USE) && $(CAP) open android

android-build: cap-sync
	cd $(ANDROID_DIR) && ./gradlew assembleDebug

# Cleanup
clean:
	rm -rf $(DIST_DIR)
	rm -rf node_modules
	@echo "Cleaned dist and node_modules"
