# e2e Cypress

e2e for guillotina react

## Run tests

```
# Run postgres
docker run \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 127.0.0.1:5432:5432 \
    --name postgres \
    postgres:12.17

# Run guillotina
docker run --rm -it -v $PWD/e2e/g_conf/:/g_conf/ \
    --link=postgres -p 127.0.0.1:8080:8080 \
    plone/guillotina:latest \
    g -c /g_conf/config.yaml

# Install modules
yarn

# Open cypress test runner
yarn run cypress open

# Run cypress test on headless mode
yarn run cypress run
```
