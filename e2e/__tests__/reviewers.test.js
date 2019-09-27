const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;

describe.only('reviewers api routes', () => {
  beforeEach(() => {
    return db.dropCollection('reviewers');
  });

  const reviewer = {
    name: 'Joe Klause',
    company: 'Peace Pies'
  };

  const review = {
    rating: 5,
    reviewer: {},
    review: 'Really good movie!',
    film: new ObjectId()
  };

  const reviewTwo = {
    rating: 2,
    reviewer: {},
    review: 'Really really really good movie!',
    film: new ObjectId()
  };

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  function postReview(review) {
    return request
      .post('/api/reviews')
      .send(review)
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
        return request.get('/api/reviewers').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets reviewer by id', () => {
    return postReviewer(reviewer)
      .then(joe => {
        review.reviewer = joe._id;
        reviewTwo.reviewer = joe._id;
        return Promise.all([postReview(review), postReview(reviewTwo)]);
      })
      .then(joe => {
        return request.get(`/api/reviewers/${joe[0].reviewer}`).expect(200);
      })
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            reviews: expect.any(Object)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "company": "Peace Pies",
            "name": "Joe Klause",
            "reviews": Any<Object>,
          }
        `);
      });
  });

  it('updates a reviewer', () => {
    return postReviewer(reviewer)
      .then(joe => {
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
