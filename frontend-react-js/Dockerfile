FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install -g npm@9.5.1
EXPOSE ${PORT}
CMD ["npm", "start"]
