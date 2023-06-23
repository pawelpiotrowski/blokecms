import { isEmpty } from './is-empty';

describe('isEmpty', () => {
  it('should mark "nullish", false, and empty: string, object and array as empty', () => {
    expect(isEmpty(null)).toEqual(true);
    expect(isEmpty(undefined)).toEqual(true);
    expect(isEmpty('')).toEqual(true);
    expect(isEmpty({})).toEqual(true);
    expect(isEmpty([])).toEqual(true);
    expect(isEmpty(false)).toEqual(true);
    expect(isEmpty('1')).toEqual(false);
    expect(isEmpty({ a: '1' })).toEqual(false);
    expect(isEmpty([1])).toEqual(false);
    expect(isEmpty(true)).toEqual(false);
  });
});
