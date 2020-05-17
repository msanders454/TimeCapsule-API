

# The Time Capsule

“Memories will last forever”

## How it works 

This is a fun little app that users can create in order to remember memories/ talk to themselves in the future. Give yourself some life advice, or just a funny Meme to laugh at.

Users will create an account and and login in. Once they are logged in, they can start making capsules. Once a user has a capsule, it will either be locked or be available to view. The capsules will blink when they are able to view.

## Demo

[Live Page](https://time-capsule-client.msanders454.now.sh/capsules)

## Demo Log in

### Client Side Code

[Client-side code](https://github.com/msanders454/TimeCapsule-Client/tree/master/src)

## Endpoints

This api is used to store user account information as well a capsule information.

### users

- GET /api/users/
Returns all users arrays with user_name's data.

- POST /api/users
Verifies 3 inputs (password, user_name, full_name) and creates a new user

- GET /api/users/:user_name
Returns an array with only user_name's data.

- DELETE /api/users/:user_name
Deleted the array with only user_name's data.

- PATCH /api/users/:user_name
Updates the array with only user_name's data.


## capsule
- GET /api/capsule
Returns an array with all capsule entries.

- POST /api/capsule
Adds a new capsule entry to the database.

- GET /api/capsule/:capsule_id
Returns an array with only capsule_id's data.

- DELETE /api/expenses/:expense_id
Deletes the array with only capsule_id's data

- PATCH /api/capsule/:capsule_id
Updates the array with only capsule_id's data.

- GET /api/capsule/:capsule_usernumber
Returns an array with only capsule_usernumber's data.

- DELETE /api/capsule/:capsule_usernumber
Deletes the array with only capsule_id's data

- PATCH /api/capsule/:capsule_usernumber
Updates the array with only capsule_usernumber's data.


## auth
- POST /api/auth
Verifies input and creates a token key for an existing user.


## Screen Shots

![Mobile Page](https://github.com/msanders454/TimeCapsule-Client/blob/master/src/Images/mobile.PNG)
![Add Capsule Page](https://github.com/msanders454/TimeCapsule-Client/blob/master/src/Images/add.PNG)
![Capsule List](https://github.com/msanders454/TimeCapsule-Client/blob/master/src/Images/Capsuleslist.PNG)


## Tech Stack

**Front-End**

- HTML
- CSS
- JavaScript
- jQuery
- Moment.js

**Back-End**

- Node.js
- Express.js
- Postgres
- Mongoose
- Mocha + Chai
- Moment.js

**Others**

- Github
- Heroku

