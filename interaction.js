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

  exports.getProductQuestions = (id, callback) => {
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
        'answers', json_build_object(
          (SELECT answers.id FROM answers WHERE question_id = 230774),
          (
            SELECT json_build_object(
              'id', answers.id,
              'body', body,
              'date', to_timestamp(date / 1000)::date,
              'answerer_name', answerer_name,
              'helpfulness', helpfulness,
              'photos', (
                SELECT array_agg(
                  photos.url
                )
                FROM photos
                WHERE answer_id = 45032
                )
              )
            FROM answers
            WHERE question_id IN (SELECT id
              FROM questions WHERE product_id = 1
              )
          )
        )
      )
    )
    FROM questions

    WHERE product_id=${id};`;


    pool
    .query(query)
    .then((res) => {
      masterObj = {};
      masterObj.product_id = id;
      masterObj.results = res.rows[0].array_agg;
      callback(null, masterObj);
    })

    .catch(err => callback(err))
  }