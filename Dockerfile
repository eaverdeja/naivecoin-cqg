FROM node:6

RUN npm install babel-cli@6.10.1 -g --save

VOLUME /naivecoin

WORKDIR /naivecoin

ENTRYPOINT babel-node --presets env,stage-2 bin/naivecoin.js

EXPOSE 3001
