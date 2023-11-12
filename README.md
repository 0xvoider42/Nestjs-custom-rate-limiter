## Test assignment

To setup the project after cloning the repo, run ```npm i``` then create ```.env``` file in root and copy ```.test.env``` contents to it.
Then create a jwt token and paste it in the ```.env``` file. The given token will have an access to the private route if included in the request headers.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

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
