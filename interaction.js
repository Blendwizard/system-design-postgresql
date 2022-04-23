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
        'answers', (
          SELECT json_object_agg(answers.id,
               json_build_object(
                'id', answers.id,
                'body', answers.body,
                'date', to_timestamp(answers.date / 1000)::date,
                'answerer_name', answerer_name,
                'helpfulness', answers.helpfulness,
                'photos', (SELECT array_agg(photos.url) FROM photos WHERE photos.answer_id = answers.id)
                )

          )
			AS answers FROM answers
            WHERE answers.question_id = questions.id
        )
      )
    )
    FROM questions

    WHERE product_id=${id};`;


    pool
    .query(query)
    .then((res) => {
      product = {};
      product.product_id = id;
      product.results = res.rows[0].array_agg;

      callback(null, product);
    })

    .catch(err => callback(err))
  }