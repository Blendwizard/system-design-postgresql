const express = require('express');
const app = express();
const PORT = 3000;
const { getProductQuestions, getQuestionAnswers } = require('./interaction')

// Lists all questions exluding reported (still need to handle page + count and reported)
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


// Gets all answers to a specific question excluding reported
app.get('/qa/questions/:question_id/answers', (req, res) =>{
  console.log(req.params)
  getQuestionAnswers(req.params.question_id, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(success);
    }
  })
});


app.listen(PORT, () => console.log(`Listening on port...${PORT}`))