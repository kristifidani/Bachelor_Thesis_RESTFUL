1. **Environment Setup**

      - Install Node.js in your laptop before starting.
      - Create a JSON file with npm init command and complete all the automated questions.
      - Install packages dependencies with npm install.

        Package Dependencies:

       - Express – Node.js framework
       - Bryptjs - used for security reasons like encryption of password
       - Mongoose – Mongo DB package
       - Body-parser - used for parsing data coming from forms
       - Dotenv - global variables
       - Connect-flash – used for displaying error or success messages
       - Express-messages – get error or success messages and display them with connect-flash
       - Express-session – used to create a session for the user the logs in
       - Jsonwebtoken – used to generate a token when user register and confirms his/her account
       - Nodemailer – used to send confirmation email
       - Pug – server render engine
       - Express-validator – used to validate information coming from forms
       - Passport, passport-local – used for login authentication

      Now that I set up my environment and installed everything I needed, started the actual work.

2. **Folder/file main architecture and creating DB Model Schemas**

      - To begin with, I created and app.js file which, is the main file to initialize the local server, import middleware packages and initialize the connection with mongo DB.
      - In my DB, I created three collections for the user, article and comment. For these collections, I built three model schemas in the “models” folder.
      - At the “routes” folder I created two files articles.js and users.js to handle my application routes.
      - Finally at the “views” folder I have creates all my interface files.
      - Now it's good to proceed with user registration and authentication.

3. **Registration and Authentication**

      Register process: In order to register the user in have to make two requests.

      - First one is a GET request where I render the register interface which consists of a register form with inputs according to user model schema.
      - Second one is a POST request to get data from the form and attempt to register a user. At the post request I validated the inputs including regex and if nothing is wrong check if another user with the same username exists since the username is unique for all users.
      - ~~After both conditions are met I finally registered the user but with a status “false” in the mongo DB meaning that he/she has to confirm email account before being able to login. Confirmation is send through nodemailer package and with it is also attached a token that expires after 24 hours. I put the ID of token same as ID of registered user so I can track user’s status and make it “active” after confirmation. Also during the process the password is encrypted.~~

      Login process: User needs to insert the username and password in order to login. Again this process has two requests.

      - First one also is a GET requests to render the login form with username and password inputs.
      - Second one is a POST request to get values of inputs and send them to passport.js file at “config” folder. Passport allows me to create a local strategy on how I want to verify the user trying to login. In this strategy I search in the mongo DB for any user with the same username and password as the ones typed in.

      If such user exists I check its status and only if it is true the login is success. When the user logs in successfully in created a user session which contains the logged user data. Passport gives me access to such data, furthermore I create a profile page including general data, its articles and bookmarks.

4. **Other Features**

      - In the first page which is the main page are listed all articles in the website sorted by the alphabet. It is displayed only the title of article and added date. For more detailed information on article u can click on them and have available features.
      - Logged user can create, update, delete, add to bookmarks, remove from bookmarks and delete whole comments from its articles. Also logged user can click on the article’s author to go at his/her profile which has the same format for everyone.
      - If it is another user’s article then logged user can only add to bookmarks, remove from bookmarks and delete only his comments on that article.
      - At article details I have to search also for the user which is related to articles author. By finding this user I allowed logged user to view its profile for more articles he/she might like.
      - At both files I created a function for access control which I put as a parameter to all my routes in order to protect them. For example if I copy the url from my profile and log out then I try to access that url again it will redirect me to login page.
