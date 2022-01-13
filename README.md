APP_SQL=3307 APP_PHP=8080 APP_NODE=8000 APP_FRONT=3000 APP_CORS=3500 docker-compose -p firstClient up

# Distributed facebook

## Requirements

- mysql
- node / npm
- docker / docker-composer

## Techs / Env

- Docker : wrap it all
- back-end : node-js
- front-end : react
- DataBase : MYSQL

## Set up

- `npm install` in both `back-end` and `front-end` folder
- `docker network create node-network` to create the network to connect all back-ends
- `APP_SQL=3306 APP_PHP=8080 APP_NODE=8000 APP_FRONT=3000 docker-compose build`
- Start 1 instance : `APP_SQL={MYSQL_PORT} APP_PHP={PHPMYADMIN_PORT} APP_NODE={NODE_PORT} APP_FRONT={REACT_PORT} docker-compose -p {name} up -d`
  - -p => creates an instance name -d => detach from it
  - Ie (3 instances) :
    - `APP_SQL=3306 APP_PHP=8080 APP_NODE=8000 APP_FRONT=3000 docker-compose -p first up -d`
    - `APP_SQL=3307 APP_PHP=8081 APP_NODE=8001 APP_FRONT=3001 docker-compose -p second up -d`
    - `APP_SQL=3308 APP_PHP=8082 APP_NODE=8002 APP_FRONT=3002 docker-compose -p third up -d`
- _TODO_ creates script sql for different users and pass it with a parameter (for now they all have the migrations in db/sql.sql)

## How to implement a new feature

### Create a new route (if needed)

- Copy the contend of the api specification (back-end/api/openapi.yaml)
- Edit it to add your different routes, [online editor](https://editor.swagger.io)
- Generate the code
  - For mac user : `brew install swagger-codegen`
    - You can generate the code by running (output must me in the gitignore to avoid the push of this) **DO NOT GENEREATE IN THE CURRENT BACK-END** (you will override everything) `swagger-codegen generate -i ./api/openapi.yaml -l nodejs-server -o ./output`
  - Others : generate it online [online editor](https://editor.swagger.io)
    - past the content of the .yaml
    - select `nodejs-server` in `Generate server` as output format
- Merge the generated code with the code in the back-end
  - Copy paste the function header of your route(s) from the generated folder to the back-end folder
  - You should only have to take the content from the controllers folder and the service folder
  - Please only copy / paste what is needed for **YOUR** changed/added route without editing the rest
- Check if your route is working with postman (note that if you have required parameter they have to be set), you should see a return code 200 if your route is working!

### Add your business logic

- Now you have to edit your function in service
- `const query = require('../db/db-connection');` will give you in query() a direct query access to the databse
- You can use the env variable `process.env.NODE_PORT` to know on witch port you are running (and by doing so knowing your identify in the database)
- Make sure your business logic is well implemented by doing requests with postman

### Implement in React

- Don't forget to add the extension to enable CORS requests [firefox](https://addons.mozilla.org/fr/firefox/addon/cors-everywhere/)
  - **TODO** invistigate why the cors everywhere component is not working on the docker (gives 404 return for the redirection to one back-end)
- Please use hooks and not component
- Try to put everything that is not dealing directly with on screens component outside of it (in the service folder for instance)
- CSS framework : material UI

## To be implemented

- [ ] Features

  - [x] friends *checked the 14/06*
    - [x] can add a friend *checked the 14/06*
    - [x] see your demands / requests *checked the 14/06*
    - [x] accept a demand *checked the 14/06*
    - [x] see my friends *checked the 14/06*
    - [x] see the friends of my friends *checked the 14/06*
    - [x] delete a friend
  - [x] messages
    - [x] write and send a message private message *checked the 14/06*
    - [x] receive and read a message private message *checked the 14/06*
    - [x] broadcast a global message @anael
  - [x] posts 
    - [x] make a post *checked the 14/06*
    - [x] see my posts *checked the 14/06*
    - [x] see the posts of my friend *checked the 14/06*
  - [x] feed *checked the 14/06*
    - [x] publish to feed *checked the 14/06*
    - [x] check feed *checked the 14/06*
    - [ ] search with key-word in the feed
  - [ ] visit
    - [x] visit my friends' pages *checked the 14/06*
      - [x] show posts (allow to see all posts (private and public)) *checked the 14/06*
      - [x] show friends *checked the 14/06*
      - [ ] show more info ?
    - [x] visit someone's page even if we are not friends
      - [ ] show posts (only allow to see public posts)
      - [x] show friends
      - [ ] show more info ?

- [ ] Snapshots
  - [ ] friends
  - [x] messages
  - [x] posts

- [ ] Front-end (UI only)
  - [x] Routing
    - [x] welcome page
    - [x] my profile
    - [x] my friends
    - [x] one friend
  - [x] Make it look ok
    - [x] style friend display
    - [x] style posts
    - [x] style messages
