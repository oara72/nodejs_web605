# Integrating WebSockets Into Our API #

*Note: File is best viewed in a editor with markdown preview turned on*

You'll want to grab a copy of the code as it stands from our last lesson. A copy of the code can be found at: [https://github.com/ShawnCC/web615_contactbook_backend/tree/week3](https://github.com/ShawnCC/web615_contactbook_backend/tree/week3)

You'll also want to grab a copy of the Socket.IO client app. We'll be using one later on. A copy of the code can be found at: [https://github.com/ShawnCC/web615_socket_client](https://github.com/ShawnCC/web615_socket_client)

Be sure to install all dependencies for both projects before you go any further

* We'll start by installing Socket.IO in our application by running the command ``` npm i socket.io -S ```

* Next open up app.js in the root of the project
    * In app.js we'll require Socket.IO after we setup our server, and we'll pass our server instance to Socket.IO. It'll look something like this: (I've included the previous lines for clarity)
        ```
        const app = express();
        const server = http.createServer(app);
        const io = require('socket.io').listen(server);
        ```
    * Next in app.js we'll create a small piece of middleware that will include our Socket.IO instance in our request object, this will allow all of our endpoints to access Socket.IO. The middleware will go right above where we define our routes
    ```
    // This middleware includes Socket.IO instance in the request object so that all
    // of the endpoints have access to Socket.IO
    app.use((req, res, next) => {
        req.io = io;
        next();
    });
    ```

* With that in place we can now send out socket events in our endpoint

* Open up contacts.js in /routes/api/v1
    * We'll emit a socket event in our create contact endpoint. At the end of the endpoint where we handle a successful creation of a contact right before we respond with a status and JSON we'll add the following code
    ```
    // Emit a socket event so that client apps know a new contact was
    // created
    req.io.emit('POST/api/v1/contacts/', null);
    ```
    * The first parameter is the event name (what the client listens for, I typically just use the endpoint), and the second parameter is optional and is whatever data you'd like to send to the client

* Now launch both the contact book backend app, and the socket.io client app

* If you create a new contact using postman, in the socket.io client you should see a log that the contact was successfully created

* Now if we add the req.io.emit code to our PUT and DELETE endpoints for contact (be sure to give them unique event names) and send requests to them we can also see in the socket.io client app that those requests emit socket events as well

* With all that in place, any client applications that get data from our API can listen for events and ensure they have the most up to date data from our API

Completed code is available at: https://github.com/ShawnCC/web615_contactbook_backend/tree/week4

