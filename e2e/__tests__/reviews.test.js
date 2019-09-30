const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;


describe('reviews api routes', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('reviews'),
      db.dropCollection('films'),
      db.dropCollection('reviewers')
    ]);
  });

  const reviewer = {
    name: 'Joe Klause',
    company: 'Peace Pies'
  };

  const review = {
    rating: 5,
    review: 'Really good movie!',
  };

  const reviewTwo = {
    rating: 4,
    review: 'Really really good movie!',
  };

  const reviewThree = {
    rating: 2,
    review: 'Really really really good movie!',
  };

  const film = {
    title: 'There Will Be Blood',
    studio: new ObjectId(),
    released: 2015,
    cast: [
      { role: 'The Oil Man', actor: new ObjectId() },
      { role: 'Pastoral Boy', actor: new ObjectId() }
    ]
  };

  function postReview(review) {
    return request
      .post('/api/reviews')
      .send(review)
      .expect(200)
      .then(({ body }) => body);
  }

  function postFilm(film) {
    return request
      .post('/api/films')
      .send(film)
      .expect(200)
      .then(({ body }) => body);
  }

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a review', () => {
    return Promise.all([
      postFilm(film),
      postReviewer(reviewer)
    ])
      .then(([film, reviewer]) => {
        review.film = film._id;
        review.reviewer = reviewer._id;
      })
      .then(() => {
        return postReview(review).then(rev => {
          expect(rev).toEqual({
            ...review,
            _id: expect.any(String),
            __v: 0,
          });
        });
      });
  });

  it('gets all reviews', () => {

    return Promise.all([
      postFilm(film),
      postReviewer(reviewer)
    ])
      .then(([film, reviewer]) => {
        review.film = film._id;
        review.reviewer = reviewer._id;
        reviewTwo.film = film._id;
        reviewTwo.reviewer = reviewer._id;
        reviewThree.film = film._id;
        reviewThree.reviewer = reviewer._id;
        return Promise.all([
          postReview(review),
          postReview(reviewTwo),
          postReview(reviewThree)
        ]);
      })
      .then(() => {
        return request
          .get('/api/reviews')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  //Delete test

});