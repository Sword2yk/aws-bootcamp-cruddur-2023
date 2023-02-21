FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm uninstall react-scripts
RUN npm install -D react-scripts
EXPOSE ${PORT}
CMD ["npm", "start"]
