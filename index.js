const express = require('express');
const app = express();
const PORT = 3000;
const {queryTest} = require('./interaction')


app.get('/', (req, res) => {
  res.send("Hello!!!")
  queryTest();
});

app.listen(PORT, () => console.log(`Listening on port...${PORT}`))