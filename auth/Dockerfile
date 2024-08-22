# Specifies the base image for the Docker container. `node:alpine` is a lightweight Node.js image based on Alpine Linux, which helps keep the image size small.
FROM node:alpine

# Install CURL
RUN apk add --no-cache curl

# Specifies the working directory for the Docker container. This is the directory where the application code is stored.
WORKDIR /app

# Copies the package.json file from the host machine to the working directory of the Docker container. This is done before running npm install to take advantage of Docker’s layer caching mechanism. If the package.json file hasn’t changed, Docker can reuse the cached layer, which speeds up the build process.
COPY package.json .

# Installs the dependencies listed in the package.json file.
RUN npm install

# Copies the application code from the host machine to the working directory of the Docker container.
COPY . .

# Exposes port 3000 to the host machine.
EXPOSE 3000

# Exposes port 3000 to the host machine.
CMD ["npm", "start"]