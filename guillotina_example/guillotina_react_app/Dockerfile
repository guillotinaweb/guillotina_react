FROM python:3.11.7
LABEL org.opencontainers.image.authors="Iskra"

RUN mkdir -p /usr/src/app/api
RUN mkdir -p /app

WORKDIR /usr/src/app/api

# requirements
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-deps -e /usr/src/app/api

COPY config* /app/
EXPOSE 8080
CMD ["guillotina", "-c" ,"/app/config-e2e.yaml"]