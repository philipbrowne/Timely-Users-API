# TimelyMD Assessment - RESTful User API

More Detailed API Documentation at https://documenter.getpostman.com/view/16012846/UVXgMxHC

Base URL: https://timelymd-assessment.herokuapp.com/

## Model:

**User** {username, first_name, last_name, email, reset_password_token, reset_password_token_used, is_admin}

## Routes:

### Auth Routes

**POST /auth/token** - Login for user. { username, password } => { token } Returns JWT Bearer token which can be used to authenticate further requests. New token can be obtained from this endpoint.

**POST /auth/register** - User must include { username, password, firstName, lastName, email } Returns JWT token which can be used to authenticate further requests.

**POST /auth/recover** - Sends password reset link to user. {email} => Password Reset Email. Must include valid user email address. Uses Nodemailer

**GET /auth/reset/:token** - Reset Password Form using link generated and emailed to user. Password and Confirm password in form must be identical and between 6-20 characters long.

**POST /auth/reset/:token** - Resets Password for user using above form. Returns new JWT Bearer Token to authenticate further requests.

### User **Routes**

**GET /users/** - Returns list of all users. Authorization required: Logged In as User or Admin.

**POST /users/** - Adds a new user. This is not the registration endpoint --- instead, this is only for admin users to add new users. The new user being added can be an admin using the isAdmin property (true/false). Required: {username, password, firstName, lastName, email}

**GET /users/:username** - Returns { username, firstName, lastName, isAdmin } for specific username if found. Authorization required: Either logged in as the current user in URL or Admin.

**PATCH /users/:username** - Updates user. Returns { username, firstName, lastName, email, isAdmin } Authorization required: Either logged in as the current user in URL or Admin.

**DELETE /users/:username** - Deletes User. Authorization required: Either logged in as the current user in URL or Admin.

## Heroku Deployment

This project is deployed on Heroku at https://timelymd-assessment.herokuapp.com

## Local Deployment in Docker Container

**Requirements: Docker**

To deploy locally in Docker Container:

    docker-compose up

Access above routes at http://localhost:3000/ using Curl, Postman, or Insomnia

You will need to change credentials in docker-compose file to a GMail user/pw under the environment variables FROM_USER, FROM_PW . I have put the environment variables in the Docker Deployment but they are not listed publicly.

## Testing locally

To run tests using Jest in local environment:

    git clone https://github.com/philipbrowne/Timely-Users-API.git
    cd Timely-Users-API/backend
    npm install
    npm test

This does not require the Environment variables for Email User/Password to be added.
