# Stage 1: Build Stage
FROM node:lts-alpine as build-stage

# Setting up working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Building the project
RUN npm run build


# # Stage 2 NGINX
FROM nginx as production-stage

RUN mkdir /app

# Copy nginx.conf file
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=build-stage /app/next.config.js ./
COPY --from=build-stage /app/.next ./usr/share/nginx/html
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package.json ./package.json

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
# # ENTRYPOINT ["npm", "run", "dev"]