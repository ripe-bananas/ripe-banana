const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;


describe('reviews api routes', () => {
  beforeEach(() => {
    return db.dropCollection('reviews');
  });

  const review = {
    rating: 5,
    reviewer: new ObjectId(),
    review: 'Really good movie!',
    film: new ObjectId()
  };

  function postReview(review) {
    return request
      .post('/api/reviews')
      .send(review)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a review', () => {
    return postReview(review).then(rev => {
      expect(rev).toEqual({
        ...review,
        _id: expect.any(String),
        __v: 0,
        film: expect.any(String),
        reviewer: expect.any(String)
      });
    });
  });

  it('gets all reviews', () => {
    return Promise.all([
      postReview(review),
      postReview({
        rating: 4,
        reviewer: new ObjectId(),
        review: 'Really really good movie!',
        film: new ObjectId() }),
      postReview({
        rating: 2,
        reviewer: new ObjectId(),
        review: 'Really really really good movie!',
        film: new ObjectId() })
    ])
      .then(() => {
        return request
          .get('/api/reviews')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
      });
  });

  // it('gets review by id', () => {
  //   return postReview(review)
  //     .then((joe) => {
  //       return request
  //         .get(`/api/reviews/${joe._id}`)
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body).toEqual({
  //         ...review,
  //         _id: expect.any(String),
  //         __v: 0
  //       });
  //     });


  // });

  // it('updates a review', () => {
  //   return postReview(review)
  //     .then((joe) => {
  //       return request
  //         .put(`/api/reviews/${joe._id}`)
  //         .send({ company: 'Trumpets R Us' })
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body).toEqual({
  //         ...review,
  //         _id: expect.any(String),
  //         __v: 0,
  //         company: 'Trumpets R Us'
  //       });
  //     });
  // });
});