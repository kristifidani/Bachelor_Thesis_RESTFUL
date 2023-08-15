# Bachelor's Thesis Project: Community-Driven Article Sharing Web Application

# Overview

Welcome to the repository for my Bachelor's thesis project! This web application, built using **Node.js** with the **Express.js** framework, **MongoDB**, and **Pug** templates, showcases my skills in full-stack development. The application allows users to engage with articles, create content, and interact within a community-driven environment. Let's delve into the key technologies that power this project:

### Node.js and Express.js

- **Node.js**: This runtime environment enables server-side JavaScript execution, making it an ideal choice for building scalable and efficient web applications. It allows us to use JavaScript both on the client and server sides, leading to a more cohesive development experience.

- **Express.js**: A powerful and minimalistic web application framework built on top of Node.js, Express.js simplifies the creation of web applications and APIs. It provides features for routing, middleware integration, and handling HTTP requests, making it an excellent choice for building the server-side of our application.

### MongoDB

- **MongoDB**: As a NoSQL database, MongoDB offers flexibility and scalability in storing and managing data. Its document-oriented nature allows us to store complex data structures without rigid schema requirements. This is particularly beneficial for applications where data models might evolve over time, such as a dynamic article-sharing platform.

### Pug Templates

- **Pug (formerly Jade)**: A template engine that simplifies the process of creating HTML content by offering a more concise and intuitive syntax. Pug templates help separate the presentation layer from the application's logic, enhancing maintainability and readability of the codebase.

### Passport.js

- **Passport.js**: A popular authentication middleware for Node.js, Passport.js simplifies the implementation of user authentication strategies. It provides a seamless way to integrate various authentication methods, such as local authentication (username and password) and third-party login providers (OAuth).

These technologies collectively empower the creation of a robust and interactive web application that encompasses user registration, authentication, article management, commenting, and more. The use of Node.js, Express.js, MongoDB, and Pug templates ensures a scalable and efficient architecture that can evolve alongside the needs of the project and its user base.

## Project Structure

- **app.js**: The central file that initializes the local server, middleware packages, and connects to the MongoDB cluster.
- **models**: Contains the model schemas for the database, including users, articles, and comments.
- **routes**: Defines route functionalities for user interactions and core functionalities.
- **views**: Pug templates that render the visual interface of the application.
- **config**: Configuration settings, including Passport.js setup for enhanced security.

# Project Functionalities

### User Registration and Authentication

1. **Registration Process**
   - **GET Request**: Users are welcomed with a registration form rendered by a GET request. The form aligns with the user model schema, featuring inputs that capture key information such as name, surname, email, and username.
   - **POST Request**: During the POST request, inputs are meticulously validated using regular expressions and other techniques. This ensures data integrity and security. The system also prevents duplicate usernames and dispatches confirmatory emails with activation tokens, enhancing the verification process.

2. **Login Process**
   - **GET Request**: The GET request renders a user-friendly login form that users can interact with.
   - **POST Request**: Leveraging Passport.js, the POST request orchestrates the user authentication process. Only users with active accounts and valid credentials can successfully log in, adding an essential layer of security to the application.

### Article Interaction

- **Main Page**: The main page elegantly presents articles in alphabetical order, making use of MongoDB's querying capabilities. Article titles and dates serve as inviting teasers that encourage users to explore further.

- **Article Creation**: Authenticated users wield the power to create compelling articles. The process involves providing a title and content, allowing users to showcase their thoughts and share valuable insights with the community.

- **Article Editing/Deleting**: Authors retain control with the ability to update or delete their article content. This feature ensures that authors can keep their pieces up-to-date and relevant.

- **Commenting**: Articles come alive through the comments section, where users can share their thoughts, engage with others, and foster meaningful discussions. This interactive element enhances user engagement and the sense of community within the platform.

- **Bookmarking**: Users can bookmark articles for later reference. This feature allows users to curate their favorite content, making it easily accessible for future use.

- **User Profiles**: User profiles showcase personalized data, offering a comprehensive view of a user's contributions to the platform. The profile includes authored articles, comments, and bookmarks. This feature not only promotes user engagement but also establishes a sense of identity within the community.

### Access Control

- **User Authentication**: Routes are carefully protected to ensure that only authenticated users gain access to specific functionalities. This approach safeguards user data and promotes a secure user experience.

- **User Authorization**: Article editing and deletion privileges are reserved for the respective authors. This ensures that only those who have created the content can modify or remove it, adding an additional layer of data integrity and control.

These functionalities collectively create an immersive and dynamic user experience. Users can contribute content, engage in discussions, and interact with the community while benefiting from authentication and access controls. The combination of these features results in a comprehensive platform that fosters collaboration and knowledge sharing.

## Getting Started

1. **Node.js Installation**: Ensure Node.js is installed from [Node.js](https://nodejs.org/en/download).

2. **Clone the Repository**: Use `git clone https://github.com/kristifidani/Bachelor_Thesis_RESTFUL.git` to clone the repository.

3. **Install Dependencies**: Run `npm install` to install project dependencies.

4. **Set up MongoDB**: Make sure you have a running MongoDB instance or use MongoDB Atlas.

5. **Configure Environment Variables**: Create a `.env` file based on `DB_HOST=<URL> JWT_SECRET=<JWT> SECRET_2=<SESSION>`.

6. **Run the Application**: Execute `npm start` to start the application.
