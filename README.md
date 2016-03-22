# restserver-mysql
Just a REST server based on express, interacting with a mysql database

INSTALATION:
___________________________________
Run <b>"npm install"</b> in the directory.


INSTALL DATABASE
___________________________________

You can import the database in the folder `database`, or you can type <b>"npm run provision"</b> and enter the mysql password. If there's an error, make sure the mysql executable is in the path.

RUN SERVER
___________________________________

You can start the application with the command <b>"npm start"</b>. This will the server on the default port 3000.

Available REST points:

GET /books

GET /books?[filter]=[query] - type, name, year, author

GET /books/:id - get book by id

POST /books ( requires all params: name, type, year, author )

PUT /books/:id - update book by id

DELETE /books/:id - delete book
