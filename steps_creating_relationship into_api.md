Steps to creating a JSON API

1. mkdir contact_book
2. navigate to cd contact_book

3. install ```npm init```

4. install ```npm i async body-parser express morgan sequelize sequelize-cli sqlite3 -S```

5. install ```npm i nodemon -D```

6. ...


create contact_book

> In the body tab we'll select raw and our content-type as JSON and add the following JSON to our request body
{
    "contact": {
        "name": "Shawn",
        "email": "test@email.com",
        "phone_number": "555 555 5555"
    }
}

