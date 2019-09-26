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

  it('posts a studio', () => {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          ...studio,
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});