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

const query = 'SELECT * FROM questions WHERE id = 1';

client
.query(query)
.then(res => console.log('RESULTS::', res.rows[0]))
.catch(err => console.log('ERROR:::', err))
.then(() => client.end())


