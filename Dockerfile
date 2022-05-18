FROM 984575983798.dkr.ecr.us-east-1.amazonaws.com/node16

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5002

CMD ["npm", "start"]
