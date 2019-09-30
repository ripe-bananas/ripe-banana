const Film = require('../film-model');
const { ObjectId } = require('mongoose').Types;

describe('Film model', () => {

  it('valid model all properties', () => {
    const data = {
      title: 'There Will Be Blood',
      studio: new ObjectId(),
      released: 2015,
      cast: [{ role: 'The Oil Man', actor: new ObjectId() }, { role: 'Pastoral Boy', actor: new ObjectId() }]
    };

    const film = new Film(data);
    const errors = film.validateSync();
    expect(errors).toBeUndefined();

    const json = film.toJSON();
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
      cast: expect.any(Array)

    });
  });

  it('validates required', () => {
    const data = {};
    const film = new Film(data);
    const { errors } = film.validateSync();
    expect(errors.title.kind).toBe('required');
    expect(errors.studio.kind).toBe('required');
    expect(errors.released.kind).toBe('required');
  });
});