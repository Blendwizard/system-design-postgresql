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




-- ATTEMPTS TO FORMAT (objects and arrays)


-- Formatted Questions
SELECT
array_agg(
  json_build_object(
    'id', id,
    'product_id', product_id,
    'question_body', question_body,
    'date', to_timestamp(question_date / 1000)::date,
    'asker_name', asker_name,
    'question_helpfulness', question_helpfulness,
    'reported', reported,
    'answers', (SELECT json_build_object('answers', answers.body) FROM answers WHERE answers.id = 1)
  )
)
FROM questions

WHERE product_id=65638;

-- END

-- Formatting answers object (Missing object key at the moment)
SELECT  answers.id, json_build_object(
  'id', answers.id,
  'body', body,
  'date', to_timestamp(date / 1000)::date,
  'answerer_name', answerer_name,
  'helpfulness', helpfulness
)

FROM answers

WHERE question_id = 230774;

--END

-- Formatting photos array (USING answer_id that has photos AS PLACEHOLDER)
SELECT array_agg(
  photos.url
)

FROM photos

WHERE answer_id = 45032;





--STACKED
SELECT
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

WHERE product_id=65638;
--end




SELECT  id, body, to_timestamp(date / 1000)::date, answerer_name, helpfulness

FROM answers
WHERE question_id IN (SELECT id FROM public.questions WHERE product_id = 1);

-- WHERE question_id = questions.id;




    -- TROUBLE SHOOTING

    -- Get a list of question ids for a single product with the ID of 1.
    SELECT id FROM questions WHERE questions.product_id = 1;

    -- Get a list of answers for a single questions with the question id of 1.
    SELECT * FROM answers WHERE question_id = 1;




--GETTING PRODUCT QUESTIONS MAIN ROUTE
    -- FIXED VERSION USING SAMPLE PRODUCT 5
    SELECT
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
              'photos', (SELECT COALESCE(array_agg(photos.url),array[]::text[]) FROM photos WHERE photos.answer_id = answers.id)
            )
          )
			  AS answers FROM answers
        WHERE answers.question_id = questions.id
        )
      )
    )
    FROM questions

    WHERE product_id=5;

------------------------------------------------------



--GETTING ANSWERS FOR 1 QUESTION ROUTE
    --USING SAMPLE QUESTION ID 34
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
WHERE answers.question_id = 34;

------------------------------------------------------


--INSERTING ANSWER FOR 1 QUESTION, AND UPDATING PHOTOS TABLE TIED TO ANSWER
  -- USING SAMPLE INPUTS

WITH new_answer_id AS (
	INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES (1, 'it does come in burgundy!!!', 'Billy Bob', 'billybob@mail.com')
	RETURNING id
)
INSERT INTO photos (answer_id, url)
SELECT id, 'somephotoURLvalue' FROM new_answer_id;






-- CREATING INDICIES

-- Primary GET
-- Index on question_id column in Answers table
CREATE INDEX answers_questionId_index on answers(question_id);

--Index on product_id column in Questions table
CREATE INDEX questions_productId_index on questions(product_id);

-- Index on answer_id in Photos table
CREATE INDEX photos_answerId_index on photos(answer_id);