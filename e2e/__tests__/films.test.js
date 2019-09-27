const request = require('../request');
const db = require('../db');
// const { ObjectId } = require('mongoose').Types;

describe.only('reviewers api routes', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('reviewers'),
      db.dropCollection('reviews'),
      db.dropCollection('actors'),
      db.dropCollection('studios')
    ]);
  });

  // const reviewer = {
  //   name: 'Joe Klause',
  //   company: 'Peace Pies'
  // };

  // const review = {
  //   rating: 5,
  //   reviewer: {},
  //   review: 'Really good movie!',
  //   film: new ObjectId()
  // };

  // const reviewTwo = {
  //   rating: 2,
  //   reviewer: {},
  //   review: 'Really really really good movie!',
  //   film: new ObjectId()
  // };

  const film = {
    title: 'There Will Be Blood',
    studio: {},
    released: 2015,
    cast: [{ role: 'The Oil Man', actor: {} }, { role: 'Pastoral Boy', actor: {} }]
  };

  const studio = {
    name: 'Pixar',
    address: {
      city: 'Emeryville',
      state: 'CA',
      country: 'USA'
    }
  };

  const actor = {
    name: 'Timothee Chalamet',
    dob: new Date('December 27, 1995'),
    pob: 'New York'
  };

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => body);
  }

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => body);
  }

  function postFilm(film) {
    return Promise.all([
      postStudio(studio),
      postActor(actor),
      postActor({ name: 'Sam Jesperson' })
    ])
      .then(result => {
        console.log(result);
        console.log(film);
      });
    // return request
    //   .post('/api/films')
    //   .send(reviewer)
    //   .expect(200)
    //   .then(({ body }) => body);
  }

  // function postReview(review) {
  //   return request
  //     .post('/api/reviews')
  //     .send(review)
  //     .expect(200)
  //     .then(({ body }) => body);
  // }

  postFilm(film);

  // it('posts a file', () => {
  //   return postReviewer(reviewer).then(joe => {
  //     expect(joe).toEqual({
  //       ...reviewer,
  //       _id: expect.any(String),
  //       __v: 0
  //     });
  //   });
});