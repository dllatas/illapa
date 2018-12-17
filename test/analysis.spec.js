const { describe, it } = require('mocha');
const { assert } = require('chai');

describe('illapa test suite', () => {
  it('Dummy test', async () => {
    const actual = 'dummy';
    const expected = 'dummy';
    assert.strictEqual(actual, expected);
  });
});
