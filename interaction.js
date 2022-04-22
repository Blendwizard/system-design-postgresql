const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'joevancamp',
  database: 'qa_database'
});


client.connect((err, res) => {
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
    answers.id,
    question_id,
    body,
    to_timestamp(date / 1000)::date AS "date",
    answerer_name,
    helpfulness,
    photos.url

    FROM answers

    JOIN photos ON photos.answer_id = answers.id

    WHERE question_id = 230773;`;


    client
    .query(query)
    .then(res => console.log(res.rows[0]))
    .catch(err => console.log("ERR::", err))
    // .then(() => client.end())
  }
