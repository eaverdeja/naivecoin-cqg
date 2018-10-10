FROM node:10

# set working directory
WORKDIR /naivecoin

# install and cache naivecoin dependencies
COPY package.json /naivecoin/package.json

# install project dependencies
RUN npm install --silent

# install dev build dependencies
RUN npm install nodemon babel-cli@6.10.1 -g --save

ENTRYPOINT nodemon --ignore data/ --exec babel-node --presets env,stage-2 bin/naivecoin.js

EXPOSE 3001
