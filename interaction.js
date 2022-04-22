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
    const query = ''
    client
    .query(query)
    .then(res => console.log("A GET request made this query:::", res.rows[0]))
    .catch(err => console.log("ERR::", err))
    .then(() => client.end())
  }
