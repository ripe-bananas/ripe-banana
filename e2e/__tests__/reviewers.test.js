const request = require('../request');
const db = require('../db');

describe('reviewers api routes', () => {
  beforeEach(() => {
    return db.dropCollection('reviewers');
  });

  const reviewer = {
    name: 'Joe Klause',
    company: 'Peace Pies'
  };

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts an reviewer', () => {
    return postReviewer(reviewer).then(joe => {
      expect(joe).toEqual({
        ...reviewer,
        _id: expect.any(String),
        __v: 0
      });
    });
  });

  it('gets all reviewers', () => {
    return Promise.all([
      postReviewer(reviewer),
      postReviewer({ name: 'Brad Pitt', company: 'Alchemy' }),
      postReviewer({ name: 'Sam Jesperson', company: 'Mazes USA' })
    ])
      .then(() => {
        return request
          .get('/api/reviewers')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets reviewer by id', () => {
    return postReviewer(reviewer)
      .then((joe) => {
        return request
          .get(`/api/reviewers/${joe._id}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          ...reviewer,
          _id: expect.any(String),
          __v: 0
        });
      });


  });

  it('updates a reviewer', () => {
    return postReviewer(reviewer)
      .then((joe) => {
        return request
          .put(`/api/reviewers/${joe._id}`)
          .send({ company: 'Trumpets R Us' })
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          ...reviewer,
          _id: expect.any(String),
          __v: 0,
          company: 'Trumpets R Us'
        });
      });
  });
});
