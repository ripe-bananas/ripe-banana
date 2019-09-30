const request = require('../request');
const db = require('../db');

describe('actors api routes', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const actor = {
    name: 'Timothee Chalamet',
    pob: 'New York'
  };

  const film = {
    title: 'There Will Be Blood',
    studio: {},
    released: 2015,
    cast: [{ role: 'The Oil Man' }, { role: 'Pastoral Boy' }]
  };

  const filmTwo = {
    title: "There Wasn't Blood",
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

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
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

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts an actor', () => {
    return postActor(actor).then(tim => {
      expect(tim).toEqual({
        ...actor,
        _id: expect.any(String),
        __v: 0
      });
    });
  });

  it('gets all actors', () => {
    return Promise.all([
      postActor(actor),
      postActor({ name: 'Brad Pitt' }),
      postActor({ name: 'Sam Jesperson' })
    ])
      .then(() => {
        return request
          .get('/api/actors')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets actor by id', () => {
    return Promise.all([
      postFilm(film),
      postFilm(filmTwo)
    ])
      .then((films) => {
        return request
          .get(`/api/actors/${films[0].cast[0]._id}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          ...actor,
          _id: expect.any(String),
          __v: 0
        });
      });


  });
});
