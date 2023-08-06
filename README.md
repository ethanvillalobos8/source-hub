# Source Hub

Source Hub is a web application for storing and managing links. It is built with Node.js, Express, MongoDB, and Passport.js for authentication. The application has been deployed on Heroku and can be accessed at [https://source-hub-430f992e237a.herokuapp.com/login](https://source-hub-430f992e237a.herokuapp.com/login).

## Features

- User registration and login with authentication
- Ability to add, retrieve, and delete links for each registered user
- Sessions for preserving user login state

## Local Development

### Prerequisites

- Node.js
- MongoDB

### Setup

To set up the application locally, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` to install the required dependencies.
3. Set up your environment variables:
   - Create a `.env` file in the root directory of the project.
   - Add the following line to the `.env` file: `SECRET_KEY=<your_secret_key>`.
   - Replace `<your_secret_key>` with a secure random string. This will be used as the secret for the session.
   - Also include `MONGODB_URI=<your_mongodb_uri>` where `<your_mongodb_uri>` is the connection string to your MongoDB database.
4. Run `npm start` to start the application.
5. Access the application in your browser at `http://localhost:3000`.

## Deployment

The application is currently deployed on Heroku. If you wish to deploy a version of this application yourself, follow the standard procedures for deploying a Node.js application to Heroku.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the [MIT License](LICENSE).
