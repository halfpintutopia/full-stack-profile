#What type of OS is it running on?
FROM node:20.1.0-alpine3.16
#Docker in this image by default is going to run with the user Node, it does not run as sudo or our own user
#So we hav eto set that up for us in the operating system
#Docker likes to run from the home directory but can run on /var/www/
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "app.js"]