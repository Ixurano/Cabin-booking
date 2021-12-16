## Projekt 1 - Stugmäklaren
### Webbtjänster och molnteknologi 21


### cabin backend 1


Node expects an `.env` file with the following entries 
```
DB_URL=<mongodb+srv://etc... etc... >
PORT=<port>
TOKEN_KEY=<token>
REFRESH_TOKEN_KEY=<token>
```  

### API Paths and possible requests

- `POST /auth/`

  ```
  Content-Type: application/json
  {
      email: "<example@example.com>"" 
      password: "12345"
  }
  ```

  

- `POST /auth/refresh/`

  ```
  Content-Type: application/json
  {
      refreshToken: <token> 
  }
  ```

- `GET /users/` 🔒

- `POST /users/`

  ```
    Content-Type: application/json
    {
        "firstName": "First",
        "lastName": "Last",
        "email": "first.last@dexample.com",
        "password": "password"
    }
  ```



- `PATCH /users/`	🔒

  ```
  Content-Type: application/json
      {
          "firstName": "First",
          "lastName": "Last",
          "email": "first.last@dexample.com",
          "password": "password"
      }
  ```



- `DELETE /users/` 🔒

  ```
      Content-Type: application/json
      {
          "email": "first.last@dexample.com",
          "password": "password"
      }
  ```



- `GET /cabins/`

- `POST /cabins/`   🔒

  ```
  Content-Type: application/json
  {
  	"adress": "example-address",
      "size": "200m2",
      "sauna": true,
      "beach": false,
      "price": 200
  }
  ```

  

- `PATCH /cabins/:id`   🔒

  ```
  Content-Type: application/json
  {
  	"adress": "example-address",
      "size": "200m2",
      "sauna": true,
      "beach": false,
      "price": 200
  }
  ```

  

- `DELETE /cabins/:id `  🔒

  ```
  Content-Type: application/json
  {
  	"adress": "example-address",
      "size": "200m2",
      "sauna": true,
      "beach": false,
      "price": 200
  }
  ```

  

- `GET /booking/id`

- `POST /booking/`   🔒

  ```
  Content-Type: application/json
  {
  	"cabin": "<id>",
      "description": "<description>",
      "startDate": "2021-09-24",
      "endDate": "2021-09-25",
      "booked": true
  }
  ```

  

- `PATCH /booking/:id `   🔒

  ```
  Content-Type: application/json
  {
  	"description": "My updated description",
      "startDate": "2021-09-22",
      "endDate": "2021-09-23",
      "booked": true
  }
  ```
  
  
  
- `DELETE /booking/:id`   🔒

  

- `GET /coffee/`   🔒
