const Actor = require('../actor-model');

describe('Actor model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'Timothee Chalamet',
      dob: new Date('December 27, 1995'),
      pob: 'New York'
    };

    const actor = new Actor(data);
    const errors = actor.validateSync();
    expect(errors).toBeUndefined();

    const json = actor.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });

  });

  it('validates required', () => {
    const data = {};
    const actor = new Actor(data);
    const { errors } = actor.validateSync();
    expect(errors.name.kind).toBe('required');
  });


});