# Test assignment

To setup the project after cloning the repo, run ```npm i``` then create ```.env``` file in the root and copy ```.test.env``` contents.
Then, paste a jwt token in the ```.env``` file. The given token will have access to the private route if included in the request headers.

## Before tests

To change the rate limit in tests, you need to adjust them in the ``mockConfigService`` manually.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

# Run in docker

```bash
# docker
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
