const request = require('../request');
const db = require('../db');

describe('actors api routes', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('actors'),
      db.dropCollection('films'),
      db.dropCollection('studios')
    ]);
  });

  const actor = {
    name: 'Timothee Chalamet',
    dob: new Date('December 19, 1995'),
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

  function postFilm(film, filmTwo) {
    return Promise.all([
      postStudio(studio),
      postActor(actor),
      postActor({ name: 'Sam Jesperson' })
    ])
      .then(([studio, actor, actor2]) => {
        film.studio = studio._id;

        film.cast[0].actor = actor._id;

        film.cast[1].actor = actor2._id;

        filmTwo.studio = studio._id;

        filmTwo.cast[0].actor = actor._id;

        filmTwo.cast[1].actor = actor2._id;
        return Promise.all([
          request
            .post('/api/films')
            .send(film),
          request
            .post('/api/films')
            .send(filmTwo)

        ]);
      });
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
        __v: 0,
        _id: expect.any(String),
        dob: expect.any(String),
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
    return postFilm(film, filmTwo)
      .then(() => {
        return request
          .get('/api/films')
          .expect(200);
      })
      .then(({ body }) => {
        return request
          .get(`/api/actors/${body[0].cast[0].actor}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          ...actor,
          dob: expect.any(String),
          films: expect.any(Array),
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('throws error if actor is in film', () => {
    return postFilm(film, filmTwo)
      .then(() => {
        return request
          .get('/api/films');
      })
      .then(({ body }) => {
        return request
          .delete(`/api/actors/${body[0].cast[0].actor}`)
          .expect(500);
      });
  });

  it('deletes actor who isn\'t in films', () => {
    return postActor(actor)
      .then((actor) => {
        return request
          .delete(`/api/actors/${actor._id}`)
          .expect(200);
      })
      .then(() => {
        return request
          .get('/api/actors');
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});
