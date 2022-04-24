const express = require('express');
const app = express();
const PORT = 3000;
const { getProductQuestions } = require('./interaction')


app.get('/qa/questions', (req, res) => {
  let product = req.query.product_id;
  console.log(req.query);

  getProductQuestions(product, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(success);
    }
  }, parseInt(req.query.page), parseInt(req.query.count));

});

app.listen(PORT, () => console.log(`Listening on port...${PORT}`))