const Reviewer = require('../reviewer-model');

describe('Reviewer model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'Joe Klause',
      company: 'Peace Pies'
    };

    const reviewer = new Reviewer(data);
    const errors = reviewer.validateSync();
    expect(errors).toBeUndefined();

    const json = reviewer.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });

  });

  it('validates required', () => {
    const data = {};
    const reviewer = new Reviewer(data);
    const { errors } = reviewer.validateSync();
    expect(errors.name.kind).toBe('required');
  });


});