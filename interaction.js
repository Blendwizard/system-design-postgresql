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
    console.log('connected!')
  }
});

  exports.queryTest = () => {
    // const query = 'SELECT * FROM questions WHERE id = 2';

    const query =
    `SELECT
    array_agg(
      json_build_object(
        'id', id,
        'product_id', product_id,
        'question_body', question_body,
        'date', to_timestamp(question_date / 1000)::date,
        'asker_name', asker_name,
        'question_helpfulness', question_helpfulness,
        'reported', reported,
        'answers', (
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
          WHERE question_id = 230774
        )
      )
    )
    FROM questions

    WHERE product_id=65638;`;


    pool
    .query(query)
    .then((res) => {
      data = res.rows[0];
      console.log(data);
    })
    .catch(err => console.log("ERR::", err))
    // .then(() => client.end())
  }