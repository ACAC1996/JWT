const express = require('express');
const { getConnection } = require('./db/db-connection-mongo');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());

getConnection();

app.use(express.json());

app.use('/usuario', require('./router/usuario'));
app.use('/estados', require('./router/estadoEquipo'));
app.use('/marca', require('./router/marca'));
app.use('/tipos', require('./router/tipoEquipo'));
app.use('/inventario', require('./router/inventario'));
app.use('/login', require('./router/auth'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});