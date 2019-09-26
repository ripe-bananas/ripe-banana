const request = require('../request');
const db = require('../db');

describe('studios api routes', () => {
  beforeEach(() => {
    return db.dropCollection('studios');
  });

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
    return postStudio(studio).then(savedStudio => {
      return request
        .get(`/api/studios/${savedStudio._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
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
              "name": "Pixar",
            }
          `);
        });
    });
  });
});
