FROM node:14.16-alpine AS builder
COPY package.json /

RUN npm set progress=false && npm config set depth 0 \
    && npm install --no-install-recommends \
    && mkdir /app \
    && cp -r node_modules /app/ 

WORKDIR /app

COPY . .

ARG BUILD_ENV

# RUN $(npm bin)/ng build --prod --build-optimizer=false --output-path=dist --configuration=${BUILD_ENV} --prod
RUN node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --output-path=dist --configuration=${BUILD_ENV}

FROM node:14.16-alpine
ENV TZ=Asia/Bangkok

RUN apk add tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && mkdir -p /app/ssl

WORKDIR /app/

COPY --from=builder /app/dist /app/dist

COPY . /app

RUN npm config set unsafe-perm true && npm install -g pm2 && npm install express express-winston winston helmet crypto cors

EXPOSE 80

CMD pm2 start pm2.json --no-daemon