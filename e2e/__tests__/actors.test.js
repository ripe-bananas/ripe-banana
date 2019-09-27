const request = require('../request');
const db = require('../db');

describe('actors api routes', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const actor = {
    name: 'Timothee Chalamet',
    dob: new Date('December 27, 1995'),
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

  
});