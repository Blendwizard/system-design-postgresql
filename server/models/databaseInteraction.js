const { Pool } = require('pg');
require('dotenv').config()
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
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
    WHERE product_id=${id} AND reported = 0
 `;
    pool
    .query(query)
    .then((res) => {
      product = {};
      product.product_id = id;
      product.results = res.rows[0].array_agg;

      callback(product);
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
      WHERE answers.question_id = ${id} AND reported = 0;
    `;

    pool.query(query)
    .then((res) => {
      question = {};
      question.question = id;
      question.page = page;
      question.count = count;
      question.results = res.rows[0].json_agg;
      callback(question);
    })
    .catch(err => callback(err));
  },




  addQuestion: ({ body, name, email, product_id }, callback) => {

    const query = `INSERT INTO questions (question_body, asker_email, asker_name, product_id) VALUES ($1, $2, $3, $4)`;
    const values = [body, email, name, parseInt(product_id)];
    pool
    .query(query, values)
    .then(res => callback(res))
    .catch(err => callback(err))
  },



  addAnswer: (question_id, { body, name, email, photos }, callback) => {

    const query = `WITH new_answer_id AS (
      INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id)
      INSERT INTO photos (answer_id, url)
      SELECT id, $5 FROM new_answer_id;`
    ;

    const values = [question_id, body, name, email, photos];

    pool.query(query, values)
    .then(res => callback(res))
    .catch(err => callback(err));

  },

  markQuestionHelpful: (id, callback) => {
    const query = `UPDATE questions
    SET question_helpfulness = question_helpfulness + 1
    WHERE id = $1;`;

    const value = [id];

    pool
    .query(query, value)
    .then(res => callback(res))
    .catch(err => callback(err));
  },


  reportQuestion: (id, callback) => {
    const query = `UPDATE questions
    SET reported = 1
    WHERE id = $1
    `;
    const value = [id];

    pool
    .query(query, value)
    .then(res => callback(res))
    .catch(err => callback(err));
  },

  markAnswerHelpful: (id, callback) => {
    const query = ` UPDATE answers
    SET helpfulness = helpfulness + 1
    WHERE id = $1;
    `;
    const value = [id];
    pool
    .query(query, value)
    .then(res => callback(res))
    .catch(err => callback(err));
  },

  reportAnswer: (id, callback) => {
    const query = `
      UPDATE answers
      SET reported = 1
      WHERE id = $1;
    `;
    const value = [id];
    pool
    .query(query, value)
    .then(res => callback(res))
    .catch(err => callback(err));
  }

}