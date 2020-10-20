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

    const mapped = mapResponseToPublishers(testResponse, true);
    expect(mapped.length).toBe(1);
    expect(mapped[0][0]).toBe('Eksempel'); // prop 0 is name
    expect(mapped[0][1]).toBe(101); // prop 1 is id
    expect(mapped[0][4]).toBe(2); // prop 4 is length
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

    const mapped = mapResponseToPublishers(testResponse, false);
    expect(mapped.length).toBe(1);
    expect(mapped[0][0]).toBe('Eksempel');
    expect(mapped[0][1]).toBe(101);
    expect(mapped[0][4]).toBe(1);
});
