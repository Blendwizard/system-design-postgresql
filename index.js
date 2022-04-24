const express = require('express');
const app = express();
const PORT = 3000;
const { getProductQuestions, getQuestionAnswers, addQuestion, addAnswer, markQuestionHelpful, reportQuestion } = require('./interaction')

// Parse incoming JSON payloads
app.use(express.json())




// Lists all questions exluding reported (still need to handle page + count and reported)
// Example: http://localhost:3000/qa/questions/?product_id=5&page=1&count=5
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
// Example: http://localhost:3000/qa/questions/34/answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log(req.params)
  getQuestionAnswers(req.params.question_id, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(success);
    }
  })
});



// Post a Question for a specific Product
/*
body	text	Text of question being asked
name	text	Username for question asker
email	text	Email address for question asker
product_id	integer	Required ID of the Product for which the question is posted
*/
app.post('/qa/questions', (req, res) => {
  addQuestion(req.body, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(201);
    }
  });
});



// Post an answer for a specific Question
/*
body	text	Text of question being asked
name	text	Username for question asker
email	text	Email address for question asker
photos	[text]	An array of urls corresponding to images to display
*/
app.post('/qa/questions/:question_id/answers', (req, res) => {
  const id = req.params.question_id;

  addAnswer(id, req.body, (err, success) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(201);
    }
  })
});



// Increments a specific Question as helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  const id = req.params.question_id;
  markQuestionHelpful(id, (err, success) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});

// Reports a Question to hide from results
app.put('/qa/questions/:question_id/report', (req, res) => {
  const id = req.params.question_id;
  reportQuestion(id, (err, success) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});



app.listen(PORT, () => console.log(`Listening on port...${PORT}`))