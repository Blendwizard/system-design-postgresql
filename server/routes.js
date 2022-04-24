const controller = require('./controllers');

router = require('express').Router();

// Gets all questions for specific product exluding reported (still need to handle page + count and reported)
router.get('/qa/questions', controller.questionsAndAnswers.getQuestions);

// Gets all answers to a specific question excluding reported
router.get('/qa/questions/:question_id/answers', controller.questionsAndAnswers.getAnswers);

// Post a Question for a specific Product
router.post('/qa/questions', controller.questionsAndAnswers.postQuestion);

// Post an answer for a specific Question
router.post('/qa/questions/:question_id/answers', controller.questionsAndAnswers.postAnswer);

// Increments a specific Question as helpful
router.put('/qa/questions/:question_id/helpful', controller.questionsAndAnswers.indicateQuestionHelpful);

// Reports a Question to hide from results
router.put('/qa/questions/:question_id/report', controller.questionsAndAnswers.indicateQuestionReported);

// Increments a specific Answer as helpful
router.put('/qa/answers/:answer_id/helpful', controller.questionsAndAnswers.indicateAnswerHelpful);

// Reports an Answer to hide from results
router.put('/qa/answers/:answer_id/report', controller.questionsAndAnswers.indicateAnswerReported);


module.exports = router;