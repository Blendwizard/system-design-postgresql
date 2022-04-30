import http from 'k6/http';
import { sleep } from 'k6';

// LOCAL LOAD TESTING

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '15s',
      preAllocatedVUs: 300,
      maxVUs: 1100,
    },
  },
};

export default function () {

  // Get Scenario 1
  http.get(`http://localhost:3000/qa/questions/?product_id=${Math.floor(Math.random() * 1000011)}`);

  // // Get Scenario 2
  // http.get(`http://localhost:3000/qa/questions/${Math.floor(Math.random() * 3518916 )}/answers`);


  // // Post Scenario 1
  // const url = `http://localhost:3000/qa/questions/`;
  // const payload = JSON.stringify({
  //   body: 'Is this a test query from our benchmarks?',
  //   name: 'TestName',
  //   email: 'Test@EMAIL.com',
  //   product_id: 1
  // });

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  // http.post(url, payload, params);



  // // Question Puts
  // http.put(`http://localhost:3000/qa/questions/:question_id/helpful`)

  // http.put(`http://localhost:3000/qa/questions/:question_id/report`)

  // // Answer Puts
  // http.put(`http://localhost:3000/qa/answers/:answer_id/helpful`)

  // http.put(`http://localhost:3000/qa/answers/:answer_id/report`)

  sleep(1);

}