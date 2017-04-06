Truco importante cuando se crea la relationship

1. primero se crea el user:

{
    "user": {
        "name": "Danerys Targaryen",
        "email": "motherofdragons@email.com",
        "phone_number": "555 555 5555",
        "password": "drogo"
    }
}

2. http://localhost:3001//api/v1/users/login/ 

and post

{
"user": {
"name": "Danerys Targaryen",
"email": "motherofdragons@email.com",
"phone_number": "555 555 5555",
"password": "drogo"
}
}

3. Luego se crea el contacto:

{
    "contact": {
        "name": "Aerys VI",
        "email": "madking@email.com",
        "phone_number": "555 555 5555",
        "user_id": 1
    }
}
