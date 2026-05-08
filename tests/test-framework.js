export function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

export function it(name, fn) {
  try {
    fn();
    console.log(`    ✓ ${name}`);
    return { pass: true };
  } catch (e) {
    console.log(`    ✗ ${name}`);
    console.log(`      Error: ${e.message}`);
    return { pass: false, error: e };
  }
}

export function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertIn(value, array, message) {
  if (!array.includes(value)) {
    throw new Error(message || `${value} not in [${array.join(', ')}]`);
  }
}