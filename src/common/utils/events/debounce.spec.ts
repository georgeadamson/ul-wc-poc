import debounce from './debounce';

describe('debounce', () => {
  it('should debounce a function', async done => {
    let callCount = 0;

    const debounced = debounce(function(value) {
      ++callCount;
      return value;
    }, 10);

    const results = [debounced('a'), debounced('b'), debounced('c')];

    expect(results).toEqual([undefined, undefined, undefined]);
    expect(callCount).toBe(0);

    // Wait for previous 1 batches of debounces to resolve:
    setTimeout(function() {
      expect(callCount).toBe(1);

      const results = [debounced('d'), debounced('e'), debounced('f')];

      expect(results).toEqual([undefined, undefined, undefined]);

      expect(callCount).toBe(1);
    }, 20);

    // Wait for previous 2 batches of debounces to resolve:
    setTimeout(function() {
      expect(callCount).toBe(2);
      done();
    }, 40);
  });
});
