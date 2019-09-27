const Review = require('../review-model');
const { ObjectId } = require('mongoose').Types;


describe('Review model', () => {

  it('valid model all properties', () => {
    const data = {
      rating: 5,
      reviewer: new ObjectId(),
      review: 'Really good movie!',
      film: new ObjectId()
    };

    const review = new Review(data);
    const errors = review.validateSync();
    expect(errors).toBeUndefined();

    const json = review.toJSON();
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)

    });
  });

  it('validates required', () => {
    const data = {};
    const review = new Review(data);
    const { errors } = review.validateSync();
    expect(errors.rating.kind).toBe('required');
    expect(errors.reviewer.kind).toBe('required');
    expect(errors.review.kind).toBe('required');
    expect(errors.film.kind).toBe('required');
  });
});