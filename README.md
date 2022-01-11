# TimelyMD Assessment - RESTful User API

## Model:

**User** {username, first_name, last_name, email, reset_password_token, reset_password_token_used, is_admin}

## Routes:

### Auth Routes

**POST /auth/token** - Login for user. { username, password } => { token } Returns JWT token which can be used to authenticate further requests. New token can be obtained from this endpoint.

**POST /auth/register** - User must include { username, password, firstName, lastName, email } Returns JWT token which can be used to authenticate further requests.

**POST /auth/recover** - Sends password reset link to user. {email} => Password Reset Email. Must include valid user email address. Uses SendGrid API.

**GET /auth/reset/:token** - Reset Password Form using link generated and emailed to user. Password and Confirm password in form must be identical and between 6-20 characters long.

**POST /auth/reset/:token** - Resets Password for user using above form.

### User **Routes**

**POST /users/** - Adds a new user. This is not the registration endpoint --- instead, this is only for admin users to add new users. The new user being added can be an admin.

**GET /users/** - Returns list of all users. Authorization required: Logged In as User.

**GET /users/:username** - Returns { username, firstName, lastName, isAdmin } for specific username if found. Authorization required: Either logged in as the current user in URL or Admin.

**PATCH /users/:username** - Updates user. Returns { username, firstName, lastName, email, isAdmin } Authorization required: Either logged in as the current user in URL or Admin.

**DELETE /users/:username** - Deletes User. Authorization required: Either logged in as the current user in URL or Admin.
