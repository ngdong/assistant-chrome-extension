describe('api/v1/__module__(lowerCase)', () => {
  const sum = (a: number, b: number) => a + b;
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
