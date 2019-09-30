const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;

describe('studios api routes', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('studios'),
      db.dropCollection('films')
    ]);
  });

  const studio = {
    name: 'Pixar',
    address: {
      city: 'Emeryville',
      state: 'CA',
      country: 'USA'
    }
  };

  const film = {
    title: 'There Will Be Blood',
    studio: {},
    released: 2015,
    cast: [
      { role: 'The Oil Man', actor: new ObjectId() },
      { role: 'Pastoral Boy', actor: new ObjectId() }
    ]
  };

  const filmTwo = {
    title: "There Wasn't Blood",
    studio: {},
    released: 2015,
    cast: [
      { role: 'The Oil Woman', actor: new ObjectId() },
      { role: 'Pastoral Boy', actor: new ObjectId() }
    ]
  };

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
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

  it('posts a studio', () => {
    return postStudio(studio).then(pixar => {
      expect(pixar).toEqual({
        ...studio,
        _id: expect.any(String),
        __v: 0
      });
    });
  });

  it('gets all studios', () => {
    return Promise.all([
      postStudio(studio),
      postStudio({ name: 'MGM' }),
      postStudio({ name: 'A24' })
    ])
      .then(() => {
        return request.get('/api/studios').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets a studio by id', () => {
    return postStudio(studio)
      .then(savedStudio => {
        film.studio = savedStudio._id;
        filmTwo.studio = savedStudio._id;
      })
      .then(() => {
        return Promise.all([postFilm(film), postFilm(filmTwo)]);
      })
      .then(body => {
        return request
          .get(`/api/studios/${body[0].studio}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toMatchInlineSnapshot(
              {
                ...body,
                __v: 0,
                _id: expect.any(String),
                films: expect.any(Array)
              },
              `
              Object {
                "__v": 0,
                "_id": Any<String>,
                "address": Object {
                  "city": "Emeryville",
                  "country": "USA",
                  "state": "CA",
                },
                "films": Any<Array>,
                "name": "Pixar",
              }
            `
            );
          });
      });
  });

  it('throws an error when deleting a studio with films', () => {
    return postStudio(studio)
      .then(savedStudio => {
        film.studio = savedStudio._id;
        filmTwo.studio = savedStudio._id;
      })
      .then(() => {
        return Promise.all([postFilm(film), postFilm(filmTwo)]);
      })
      .then(body => {

        return request
          .delete(`/api/studios/${body[0].studio}`)
          .expect(500);

      });
  });

  it('deletes a studio', () => {
    return postStudio(studio)
      .then(studio => {
        return request
          .delete(`/api/studios/${studio._id}`)
          .expect(200);
      })
      .then(() => {
        return request
          .get('/api/studios');
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});