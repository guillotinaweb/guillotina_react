# e2e Cypress

e2e for guillotina react

## Run tests

```
# Run postgres
docker run \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -p 127.0.0.1:5432:5432 \
    --name postgres \
    postgres:9.6

# Run guillotina
docker run -v <path to project>/e2e/g_conf/:/g_conf/ \
    --link=postgres -p 127.0.0.1:8080:8080 \
    guillotina/guillotina:latest \
    g -c '{"databases": [{"db": {"storage": "postgresql", "dsn": "postgres://guillotina:@postgres/guillotina"}}], "root_user": {"password": "root"}}'

# Install modules
yarn

# Open cypress test runner
yarn run cypress open

# Run cypress test on headless mode
yarn run cypress run
```