import { mapResponseToPublishers } from '../Components/Filters/FilterPublisher';

// tests are defined by calling test(), with a name and a method (the method is the actual test)
// using expect(variable) and any number of extensions: https://jestjs.io/docs/en/expect
// typically .toBe(value), .not. , .toBeFalsy/Truthy(), toHaveLength(n), toHaveProperty(key, value?), toBeNull(), toContain(item), toEqual(value)
// expect(promise).resolves.toBe(value) for promises / things that dont resolve right away

test('Publisher mapping function handles single dataset publisher correctly', () => {
  const testResponse = [
    {
      name: 'Eksempel',
      id: 101,
      datasets: [100, 101],
      coordinations: [105],
    },
  ];

  const mapped = mapResponseToPublishers(testResponse, 'datasets');
  expect(mapped.length).toBe(1);
  expect(mapped[0].name).toBe('Eksempel');
  expect(mapped[0].id).toBe(101);
  expect(mapped[0].count).toBe(2);
});

test('Publisher mapping function handles single coordination publisher correctly', () => {
  const testResponse = [
    {
      name: 'Eksempel',
      id: 101,
      datasets: [100, 101],
      coordinations: [105],
    },
  ];

  const mapped = mapResponseToPublishers(testResponse, 'coordinations');
  expect(mapped.length).toBe(1);
  expect(mapped[0].name).toBe('Eksempel');
  expect(mapped[0].id).toBe(101);
  expect(mapped[0].count).toBe(1);
});

test('Publisher mapping function handles single mixed publisher correctly', () => {
  const testResponse = [
    {
      name: 'Eksempel',
      id: 101,
      datasets: [100, 101],
      coordinations: [105],
    },
  ];

  const mapped = mapResponseToPublishers(testResponse, 'both');
  expect(mapped.length).toBe(1);
  expect(mapped[0].name).toBe('Eksempel');
  expect(mapped[0].id).toBe(101);
  expect(mapped[0].count).toBe(3);
});
