const Studio = require('../studio');

describe('Studio model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'Pixar',
      address: {
        city: 'Emeryville',
        state: 'CA',
        country: 'USA'
      }
    };

    const studio = new Studio(data);
    const errors = studio.validateSync();
    expect(errors).toBeUndefined();

    const json = studio.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });
  });

  it('validates required', () => {
    const data = {};
    const studio = new Studio(data);
    const { errors } = studio.validateSync();
    console.log(errors);
    expect(errors.name.kind).toBe('required');
  });
});