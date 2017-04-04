Truco importante cuando se crea la relationship

1. primero se crea el user:

{
    "user": {
        "name": "Jon Snow",
        "email": "thekinginthenorth@email.com",
        "phone_number": "555 555 5555"
    }
}

2. Luego se crea el contacto:

{
    "contact": {
        "name": "Ned Stark",
        "email": "winterfell@email.com",
        "phone_number": "555 555 5555",
        "user_id": 1
    }
}