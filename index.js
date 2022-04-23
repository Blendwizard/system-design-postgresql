const express = require('express');
const app = express();
const PORT = 3000;
const { getProductQuestions } = require('./interaction')


app.get('/qa/questions', (req, res) => {
  let product = req.query.product_id;

  getProductQuestions(product, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(success);
    }
  });

});

app.listen(PORT, () => console.log(`Listening on port...${PORT}`))