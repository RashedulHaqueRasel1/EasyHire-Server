# EasyHire Server

Welcome to the EasyHire server repository! This project powers the backend of the EasyHire website, providing APIs and services for job listings, user authentication, and more.

## Live Link

You can access the live version of the EasyHire website here: [EasyHire Live](https://easyhire-live-link.com)

## Features

1. **Job Listings:** APIs to create, read, update, and delete job listings.
2. **User Authentication:** Secure user authentication and authorization using JWT.
3. **User Profiles:** Manage user profiles, including updating and viewing.
4. **Application Management:** APIs to handle job applications from users.


## Technology Used

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Middleware (Cors, Body Parser)


## Dependencies

- [Express](https://www.npmjs.com/package/express): Web framework for Node.js.
- [Cors](https://www.npmjs.com/package/cors): Node.js middleware for enabling CORS.
- [Body-Parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware.
- [JWT](https://www.npmjs.com/package/jsonwebtoken): JSON Web Token implementation for authentication.
- [Axios](https://www.npmjs.com/package/axios): Promise-based HTTP client for Node.js and the browser.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/RashedulHaqueRasel1/EasyHire-Server.git

2. Navigate to the project directory:
   ```sh
   cd EasyHire-Server
   
3. Install all dependencies:
   ```sh
   npm install

4. Set up environment variables:
   ``sh
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret

   5. Run the server:
      nodemon index.js
