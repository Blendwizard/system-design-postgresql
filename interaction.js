const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'joevancamp',
  database: 'qa_database'
});


pool.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database...')
  }
});

  module.exports = {

    getProductQuestions: (id, callback, page = 1, count = 5) => {
    let offset = count * (page - 1);
    console.log("count", count)
    console.log("offset", offset, "page::", page)

    const query =
    `SELECT
    array_agg(
      json_build_object(
        'question_id', id,
        'question_body', question_body,
        'question_date', to_timestamp(question_date / 1000)::date,
        'asker_name', asker_name,
        'question_helpfulness', question_helpfulness,
        'reported', reported,
        'answers', (
          SELECT json_object_agg(answers.id,
               json_build_object(
                'id', answers.id,
                'body', answers.body,
                'date', to_timestamp(answers.date / 1000)::date,
                'answerer_name', answerer_name,
                'helpfulness', answers.helpfulness,
                'photos', (SELECT COALESCE(array_agg(photos.url), array[]::text[]) FROM photos WHERE photos.answer_id = answers.id)
                )

          )
			AS answers FROM answers
            WHERE answers.question_id = questions.id
        )
      )
    )
    FROM questions
    WHERE product_id=${id}
 `;
    pool
    .query(query)
    .then((res) => {
      product = {};
      product.product_id = id;
      product.results = res.rows[0].array_agg;

      callback(null, product);
    })

    .catch(err => callback(err))
  },




  getQuestionAnswers: (id, callback, page = 1, count = 5) => {
    const query = `
    SELECT json_agg(
      json_build_object(
        'answer_id', answers.id,
        'body', answers.body,
        'date', to_timestamp(answers.date / 1000)::date,
        'answerer_name',answerer_name,
        'helpfulness', answers.helpfulness,
        'photos', (
          SELECT (COALESCE(array_agg(
            json_build_object(
              'id', photos.id,
              'url', photos.url
            )
          ), array[]::json[]))
          FROM photos
          WHERE photos.answer_id = answers.id
        )
      )
      )
      FROM answers
      WHERE answers.question_id = ${id};
    `;

    pool.query(query)
    .then((res) => {
      question = {};
      question.question = id;
      question.page = page;
      question.count = count;
      question.results = res.rows[0].json_agg;
      callback(null, question);
    })
    .catch(err => callback(err));
  },




  addQuestion: ({ body, name, email, product_id }, callback) => {

    const query = `INSERT INTO questions (question_body, asker_email, asker_name, product_id) VALUES ($1, $2, $3, $4)`;
    const values = [body, email, name, parseInt(product_id)];
    pool
    .query(query, values)
    .then(res => callback(null, res))
    .catch(err => callback(err))
  },




  addAnswer: (question_id, { body, name, email, photos }, callback) => {
    const answerQuery = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4)';
    const answerValues = [question_id, body, name, email];

    // const photosQuery = 'INSERT INTO photos (answer_id) VALUES ($1)'

    // pool
    // .query(query, values)
    // .then(res => callback(null, res))
    // .catch(err => callback(err))
  }

}