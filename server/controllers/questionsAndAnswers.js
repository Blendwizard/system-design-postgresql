const models = require('../models');

module.exports = {

  getQuestions: (req, res) => {
    let product = req.query.product_id;
    console.log(req.query);
    models.database.getProductQuestions(product, (err, success) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(success);
      }
    }, parseInt(req.query.page), parseInt(req.query.count));
  },

  getAnswers: (req, res) => {
    console.log(req.params)
    models.database.getQuestionAnswers(req.params.question_id, (err, success) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(success);
      }
    })
  },

  postQuestion:  (req, res) => {
    models.database.addQuestion(req.body, (err, success) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(201);
      }
    });
  },

  postAnswer: (req, res) => {
    const id = req.params.question_id;
    models.database.addAnswer(id, req.body, (err, success) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(201);
      }
    })
  },

  indicateQuestionHelpful: (req, res) => {
    const id = req.params.question_id;
    models.database.markQuestionHelpful(id, (err, success) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    })
  },

  indicateQuestionReported: (req, res) => {
    const id = req.params.question_id;
    models.database.reportQuestion(id, (err, success) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    })
  },


  indicateAnswerHelpful: (req, res) => {
    const id = req.params.answer_id;
    models.database.markAnswerHelpful(id, (err, success) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    })
  },

  indicateAnswerReported: (req, res) => {
    const id = req.params.answer_id;
    models.database.reportAnswer(id, (err, success) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    })
  }
}