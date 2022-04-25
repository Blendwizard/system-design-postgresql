const request = require('supertest');
const app = require('./app');


describe("Testing the primary GET route", () => {
  test("It should respond to a GET with a 200 code", () => {
    return request(app)
      .get("/qa/questions/?product_id=450000")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should respond with an object', () => {
    return request(app)
      .get("/qa/questions/?product_id=450000")
      .then(response => {
        expect(typeof JSON.parse(response.text)).toBe('object');
      });
  });

  test('Results should be an array', () => {
    return request(app)
      .get("/qa/questions/?product_id=450000")
      .then(response => {
        console.log(JSON.parse(response.text))
      });
  });


});
