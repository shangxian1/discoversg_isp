const express = require('express');
const app = express();
const port = 3000;
const AIRoute = require('./AIroute');

app.use('/', AIRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));