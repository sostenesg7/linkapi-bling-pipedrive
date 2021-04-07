FROM node:14.15.0-slim

# ENV NODE_ENV=production
ENV TZ=America/Recife
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package.json .

# RUN npm install
RUN npm install tsc -g

COPY . .

# RUN npm run build

# Start
CMD [ "npm", "start" ]