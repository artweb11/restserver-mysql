# restserver-mysql
Just a REST server based on express, interacting with a mysql database

INSTALATION:
___________________________________
Run <b>"npm install"</b> in the directory.


INSTALL DATABASE
___________________________________

You can import the database in the folder `database`, or you can type <b>"npm run provision"</b> and enter the root mysql password. If there's an error, make sure the mysql executable is in the path.

Additionally, you can uninstall the database by typing <b>"npm run unprovision"</b> and enter your root mysql password. The database will be dropped.

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
