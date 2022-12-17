# WeLoveMovies Server

Server API interface for storing and delivering movies, theaters, reviews, and critics data

## Links

* [App Demo](https://kf-we-love-movies.netlify.app)
* [App Documentation](https://github.com/kaschaefreeman/starter-movie-front-end)

## Technology

### Built with:

* Node.js
  * Express server framework
  * Morgan and pino for logging
  * CORS for safer request headers
  * NanoID for request id unique string generation
* PostgreSQL database
  * Knex.js for query building
* Testing on Jest framework and Supertest

## Installation

To install the server run `npm i` then `npm start`
Since nodemon is included running `npm run start:dev` will start the server and automatically restart when changes to the directory are made.

If you have the frontend application installed, both the server and app must be running concurrently for the app to fetch properly in development environment.

The server will start locally by default on [http://localhost:5000/](http://localhost:5000/), and will use a separate PostgreSQL database from the production server.

## API Documentation

All get requests return JSON response. All put requests require application/json body, and return JSON response.

### Endpoints for Movies:

The movies route only allows for get requests.  Functionality is added to list all movies, and read a movie by id.

#### Get By Movies: `GET /api/movies`

* Requests all movie entries
* Successful get request will return an object of data with an array of movie objects

```json

{

  "data": [

    {

      "id":1,

      "title":"Spirited Away",

      "runtime_in_minutes":125,

      "rating":"PG",

      "description":"Chihiro ...",

      "image_url":"https://imdb-api.com/..."

    }

    // ...

  ]

}

```

The route also accepts the query /movies?is_showing=true.  The response will also be the same as above but with some records excluded.

#### Get Movie By Id: `GET /api/movies/:movieId`

* This route will return a single movie by ID.
* There are four different cases to consider:
  * `GET /movies/:movieId`
  * `GET /movies/:movieId` (incorrect ID)
  * `GET /movies/:movieId/theaters`
  * `GET /movies/:movieId/reviews`

##### **`GET /movies/:movieId`**

* Successful get request will return an object of data with an array of a single movie object

```json

{
  "data": {
    "id": 1,
    "title": "Spirited Away",
    "runtime_in_minutes": 125,
    "rating": "PG",
    "description": "Chihiro...",
    "image_url": "<https://imdb-api.com/>..."
  }
}

```

##### **`GET /movies/:movieId (incorrect ID)`**

If the given ID does not match an existing movie, an unsuccessful get request will be made, and the following will be returned:

```json

{
  "error": "Movie cannot be found."
}

```

The response will have `404` as the status code.

##### **`GET /movies/:movieId/theaters`**

This route will return all the `theaters` where the movie is playing.

The response from the server for a request to `/movies/1/theaters` will look like the following.

```json
{
  "data": [
    {
      "theater_id": 2,
      "name": "Hollywood Theatre",
      "address_line_1": "4122 NE Sandy Blvd.",
      "address_line_2": "",
      "city": "Portland",
      "state": "OR",
      "zip": "97212",
      "created_at": "2021-02-23T20:48:13.342Z",
      "updated_at": "2021-02-23T20:48:13.342Z",
      "is_showing": true,
      "movie_id": 1
    }
    // ...
  ]
}
```

##### **`GET /movies/:movieId/reviews`**

This route will return all the `reviews` for the movie, including all the `critic` details added to a `critic` key of the review.

The response from the server for a request to `/movies/1/reviews` will look like the following.

```json
{
  "data": [
    {
      "review_id": 1,
      "content": "Lorem markdownum ...",
      "score": 3,
      "created_at": "2021-02-23T20:48:13.315Z",
      "updated_at": "2021-02-23T20:48:13.315Z",
      "critic_id": 1,
      "movie_id": 1,
      "critic": {
        "critic_id": 1,
        "preferred_name": "Chana",
        "surname": "Gibson",
        "organization_name": "Film Frenzy",
        "created_at": "2021-02-23T20:48:13.308Z",
        "updated_at": "2021-02-23T20:48:13.308Z"
      }
    }
    // ...
  ]
}
```

### Endpoints for Theaters:

#### Get Movie By Id: `GET /api/movies/:movieId`

This route will return all the `theaters` and, the movies playing at each theatre added to the `movies` key.

The response from the server will look like the following.

```json
{
  "data": [
    {
      "theater_id": 1,
      "name": "Regal City Center",
      "address_line_1": "801 C St.",
      "address_line_2": "",
      "city": "Vancouver",
      "state": "WA",
      "zip": "98660",
      "created_at": "2021-02-23T20:48:13.335Z",
      "updated_at": "2021-02-23T20:48:13.335Z",
      "movies": [
        {
          "movie_id": 1,
          "title": "Spirited Away",
          "runtime_in_minutes": 125,
          "rating": "PG",
          "description": "Chihiro...",
          "image_url": "https://imdb-api.com...",
          "created_at": "2021-02-23T20:48:13.342Z",
          "updated_at": "2021-02-23T20:48:13.342Z",
          "is_showing": false,
          "theater_id": 1
        }
        // ...
      ]
    }
    // ...
  ]
}
```

### Endpoints for Reviews:

The reviews route allows for reviews to be updated and deleted.

#### `PUT /reviews/:reviewId`

A body like the following should be passed along with the request:

```json

  {
    "data": {
       "score": 3,
      "content": "New content..."
    }
  }

```

The response will include the entire review record with the newly patched content, and the critic information set to the `critic` property.

```json
{
  "data": {
    "review_id": 1,
    "content": "New content...",
    "score": 3,
    "created_at": "2021-02-23T20:48:13.315Z",
    "updated_at": "2021-02-23T20:48:13.315Z",
    "critic_id": 1,
    "movie_id": 1,
    "critic": {
      "critic_id": 1,
      "preferred_name": "Chana",
      "surname": "Gibson",
      "organization_name": "Film Frenzy",
      "created_at": "2021-02-23T20:48:13.308Z",
      "updated_at": "2021-02-23T20:48:13.308Z"
    }
  }
}
```

#### `PUT /reviews/:reviewId` (incorrect ID)

If the given ID does not match an existing review, a response like the following will be returned:

```json
{
  "error": "Review cannot be found."
}
```

The response will have `404` as the status code response.

#### `DELETE /reviews/:reviewId`

The server should respond with `204 No Content`.

#### `DELETE /reviews/:reviewId` (incorrect ID)

If the given ID does not match an existing review, a response like the following will be returned:

```json
{
  "error": "Review cannot be found."
}
```

The response will have `404` as the status code response.
