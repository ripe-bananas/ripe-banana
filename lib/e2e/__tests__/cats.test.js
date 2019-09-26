const request = require('../request');
const db = require('../db');

describe('cats api', () => {
  beforeEach(() => {
    return db.dropCollection('cats');
  });

  const felix = {
    name: 'felix',
    type: 'tuxedo',
    lives: 9,
    hasSidekick: false,
    media: ['movies', 'comics'],
    year: 1919
  };

  function postCat(cat) {
    return request
      .post('/api/cats')
      .send(cat)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a cat', () => {
    return postCat(felix).then(cat => {
      expect(cat).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...felix
      });
    });
  });

  it('gets a cat by id', () => {
    return postCat(felix).then(cat => {
      return request
        .post('/api/vet-visits')
        .send({
          score: 20,
          cat: cat._id
        })
        .expect(200)
        .then(() => {
          return request.get(`/api/cats/${cat._id}`).expect(200);
        })
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              visits: [
                {
                  _id: expect.any(String)
                }
              ]
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "hasSidekick": false,
              "lives": 9,
              "media": Array [
                "movies",
                "comics",
              ],
              "name": "felix",
              "type": "tuxedo",
              "visits": Array [
                Object {
                  "_id": Any<String>,
                },
              ],
              "year": 1919,
            }
          `
          );
        });
    });
  });

  it('gets a list of cats', () => {
    const firstCat = {
      name: 'cat 1',
      lives: 9,
      year: 2019,
      hasSidekick: false
    };
    return Promise.all([
      postCat(firstCat),
      postCat({ name: 'cat 2', lives: 9, year: 2019, hasSidekick: false }),
      postCat({ name: 'cat 3', lives: 9, year: 2019, hasSidekick: false })
    ])
      .then(() => {
        return request.get('/api/cats').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: firstCat.name,
          year: firstCat.year
        });
      });
  });

  it('updates a cat', () => {
    return postCat(felix)
      .then(cat => {
        cat.lives = 2;
        return request
          .put(`/api/cats/${cat._id}`)
          .send(cat)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.lives).toBe(2);
      });
  });

  it('deletes a cat', () => {
    return postCat(felix).then(cat => {
      return request.delete(`/api/cats/${cat._id}`).expect(200);
    });
  });
});
