const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hiresprint'
});

DB.connect((err: any) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

//Vamos a declarar las rutas de nuestra API

app.get('/', (req: any, res: any) => {
    const SQL_QUERY = 'SELECT * FROM productos';
    DB.query(SQL_QUERY, (err: any, result: any) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});     




