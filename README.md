# Tech Alchemy Assignment - Task 2
This repository contains the solution for the Tech Alchemy assignment - Task 2

<details open="open">
  <ol>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
    	<a href="#api-documentaion">API Documentation<a>
    </li>
    <li>
    	<a href="#how-to-use">How to use</a>
    </li>
        <li>
    	<a href="#conventional-commits">Conventional Commits</a>
    </li>
    <li>
    	<a href="#dependencies">Dependencies</a>
    </li>
    <li>
    	<a href="#tests">Tests</a>
    </li>
  </ol>
</details>

## <a id="installation">Installation</a>

1. Clone the repository by running the following command:
```shell
git clone https://github.com/apalesujay/tech-alchemy-task2.git
```
2. Go to directory the directory `tech-alchemy-task2`.
3. Run `npm install` to install the dependencies.
4. To run the application in the development environment, run `npm run dev`.
5. To run the application in the production environment, follow steps 6 to 7.
6. Create a `.env` file at the root of the project. Copy the content from `.env.dev` to `.env` file.
7. Run `npm start`.

## <a id="api-documentation">API Documentation</a>

You will find the API documentation on the following link:

[Postman API Documentation](https://documenter.getpostman.com/view/2512429/TzJsecoR)

## <a id="how-to-use">How to use</a>

### Auth APIs
1. Use `/signup` API for user registration.
2. Use `/login` API for login.
3. Use `/refresh` API for refreshing the session. This is a protected API.
4. Use `/logout` API to logout. This is a protected API.

This project uses access token and refresh token for handling the authentication. These two types of tokens are needed to access the protected routes:
* Access Token i.e. Json Web Token is valid for 1hr.
* Refresh Token i.e. simple UUID v4 String which is valid for 1 month, to be used for re-assigning a combination of access token (JWT) and refresh token (cookie) to the user.
* If the current access token is expired, a request to `/refresh` must be made with current access token and refresh token to get a new set of access token and refresh token.
* If current refresh token is expired, user must login again using `/login` API to get the new set of access token and refresh token.
* Access token must be passed as a Bearer token in the Authorization header of the request and refresh token must be passed as a cookie in the request to access the protected APIs.

### Weather API
Weather API does not require authentication. Anyone can access this API.

### News API

`/news` API is a protected route. User must login to use this API.

## <a id="conventional-commits">Conventional Commits</a>
This project follows the rules for writing commit messages as specified by the [ConventionalCommits.org](https://www.conventionalcommits.org/en/v1.0.0/).

## <a id="dependencies">Dependencies</a>

#### Main Dependencies

* Express
* Mongoose
* UUID
* JSONWebToken
* Bcrypt
* Axios
* Luxon
* Winston
* LRU Cache

#### Development Dependencies

* Typescript
* ESLint
* Prettier
* Nodemon
* Jest
* Supertest
* Husky
* Commitizen

## <a id="tests">Tests</a>

To execute the unit tests run `npm test`.
