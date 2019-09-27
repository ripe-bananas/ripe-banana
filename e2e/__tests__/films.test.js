const request = require('../request');
const db = require('../db');
// const { ObjectId } = require('mongoose').Types;

describe.only('reviewers api routes', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('reviewers'),
      db.dropCollection('reviews'),
      db.dropCollection('actors'),
      db.dropCollection('studios'),
      db.dropCollection('films')
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
    cast: [{ role: 'The Oil Man' }, { role: 'Pastoral Boy' }]
  };

  const filmTwo = {
    title: 'There Wasn\'t Blood',
    studio: {},
    released: 2015,
    cast: [{ role: 'The Oil Woman' }, { role: 'Pastoral Boy' }]
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
      .then(([studio, actor, actor2]) => {
        film.studio = studio._id;
        film.cast[0].actor = actor._id;
        film.cast[0]._id = actor._id;
        film.cast[1].actor = actor2._id;
        film.cast[1]._id = actor2._id;
        return request
          .post('/api/films')
          .send(film)
          .expect(200);
      })
      .then(({ body }) => body);
  }

  // function postReview(review) {
  //   return request
  //     .post('/api/reviews')
  //     .send(review)
  //     .expect(200)
  //     .then(({ body }) => body);
  // }

  it('posts a film', () => {
    return postFilm(film).then(joe => {
      expect(joe).toMatchInlineSnapshot(
        {
          _id: expect.any(String),
          cast: expect.any(Array),
          studio: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "cast": Any<Array>,
          "released": 2015,
          "studio": Any<String>,
          "title": "There Will Be Blood",
        }
      `);
    });
  });

  it('gets all films', () => {
    return Promise.all([
      postFilm(film),
      postFilm(filmTwo)
    ])
      .then(() => {
        return request
          .get('/api/films')
          .expect(200);
      })
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toBe(2);
      });
  });


});
