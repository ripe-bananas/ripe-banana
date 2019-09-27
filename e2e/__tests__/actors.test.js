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
    return postActor(actor)
      .then((tim) => {
        return request
          .get(`/api/actors/${tim._id}`)
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
