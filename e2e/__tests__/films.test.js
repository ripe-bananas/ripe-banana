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
    cast: [{ role: 'The Oil Man' }, { role: 'Pastoral Boy' }]
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
        console.log(film);
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
      expect(joe).toMatchInlineSnapshot(`
        Object {
          "__v": 0,
          "_id": "5d8e9bb77854d90c2192351a",
          "cast": Array [
            Object {
              "_id": "5d8e9bb77854d90c21923518",
              "actor": "5d8e9bb77854d90c21923518",
              "role": "The Oil Man",
            },
            Object {
              "_id": "5d8e9bb77854d90c21923519",
              "actor": "5d8e9bb77854d90c21923519",
              "role": "Pastoral Boy",
            },
          ],
          "released": 2015,
          "studio": "5d8e9bb77854d90c21923517",
          "title": "There Will Be Blood",
        }
      `);
    });
  });
});
