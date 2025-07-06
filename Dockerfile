FROM node:24-bookworm-slim
# Install Chrome dependencies
RUN apt-get update
RUN apt install -y \
  libnss3 \
  libdbus-1-3 \
  libatk1.0-0 \
  libgbm-dev \
  libasound2 \
  libxrandr2 \
  libxkbcommon-dev \
  libxfixes3 \
  libxcomposite1 \
  libxdamage1 \
  libatk-bridge2.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libcups2
# Copy everything from your project to the Docker image. Adjust if needed.
COPY package.json package*.json yarn.lock* pnpm-lock.yaml* bun.lockb* bun.lock* tsconfig.json* remotion.config.* ./
COPY src ./src
# If you have a public folder:
COPY public ./public
# Install the right package manager and dependencies
RUN npm i
# Install Chrome
RUN npx remotion browser ensure
# The command to start the server
CMD ["node", "--experimental-strip-types", "src/server.ts"]

EXPOSE 8080