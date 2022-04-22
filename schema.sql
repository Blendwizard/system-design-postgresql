-- Staging tables
CREATE TABLE staging_questions (
  id INT,
  product_id INT,
  body TEXT,
  date_written BIGINT,
  asker_name TEXT,
  asker_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE staging_answers (
  id INT,
  question_id INT,
  body TEXT,
  date_written BIGINT,
  answerer_name TEXT,
  answerer_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE staging_photos (
  id INT,
  answer_id INT,
  url TEXT
);




-- Custom Tables
CREATE TABLE products (
  id INT NOT NULL,
  PRIMARY KEY(id)
);

-- Populate product IDs from staged questions
INSERT INTO products (id)
  SELECT DISTINCT product_id
  FROM staging_questions
  ORDER BY product_id;

CREATE TABLE questions (
  id SERIAL NOT NULL,
  product_id INT NOT NULL,
  body TEXT,
  date_written BIGINT,
  asker_name TEXT,
  asker_email TEXT,
  reported SMALLINT,
  helpful INT,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE answers (
  id SERIAL NOT NULL,
  question_id INT NOT NULL,
  body TEXT,
  date_written BIGINT,
  answerer_name TEXT,
  answerer_email TEXT,
  reported SMALLINT,
  helpful INT,
  PRIMARY KEY(id),
  FOREIGN KEY(question_id) REFERENCES questions(id)
);

CREATE TABLE photos (
  id SERIAL NOT NULL,
  answer_id INT NOT NULL,
  url TEXT,
  PRIMARY KEY(id),
  FOREIGN KEY(answer_id) REFERENCES answers(id)
);



-- Queries for transferring between DBs

--staged questions to questions table
INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
SELECT product_id, body, date_written, asker_name, asker_email, reported, helpful
FROM staging_questions;

-- staged answers to answers table
INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
SELECT question_id, body, date_written, answerer_name, answerer_email, reported, helpful
FROM staging_answers;

-- staged photos to photos table
INSERT INTO photos (answer_id, url)
SELECT answer_id, url
FROM staging_photos;








-- Altering field names

--QUESTIONS TABLE RENAMING
ALTER TABLE questions RENAME COLUMN body TO question_body;

ALTER TABLE questions RENAME COLUMN date_written TO question_date;

ALTER TABLE questions RENAME COLUMN helpful TO question_helpfulness;

ALTER TABLE questions RENAME COLUMN helpful TO question_helpfulness;


--QUESTIONS TABLE RENAMING
ALTER TABLE answers RENAME COLUMN date_written TO date;

ALTER TABLE answers RENAME COLUMN helpful TO helpfulness;


-- Custom Query Experiments

-- Question data (may need refining)
SELECT
id AS question_id,
product_id,
question_body,
to_timestamp(question_date / 1000)::date,
asker_name,
question_helpfulness,
reported

FROM questions

WHERE product_id=65638;

-- Answer data (may need refining)
SELECT
answers.id,
question_id,
body,
to_timestamp(date / 1000)::date AS "date",
answerer_name,
helpfulness,
photos.url

FROM answers

JOIN photos ON photos.answer_id = answers.id

WHERE question_id = 230773;