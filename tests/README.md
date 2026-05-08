# Presentations Plugin - Test Suite v2.0.0

Comprehensive test suite for the OpenCode Presentations Plugin.

## Test Results

**Status: PRODUCTION READY** ✓  
**All 20 Functional Tests: PASSED (100%)**  
**Avg Response Time: ~130ms**

## Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| CLI Commands | 8 | ✓ |
| Error Handling | 6 | ✓ |
| Validation | 4 | ✓ |
| Feature Flags | 2 | ✓ |

## Quick Start

```bash
# Run functional tests
npm test

# Run stress tests
npm run stress

# Run all tests
npm run full
```

## Test Files

```
tests/
├── run-tests.js         # Functional test suite (20 tests)
├── stress/              # Stress test scenarios
│   └── stress-test.js   # Load & performance tests
├── results/            # Test output reports (JSON)
├── samples/            # Sample files for testing
├── EVALUATION.md       # Test evaluation report
└── README.md           # This file
```

## Functional Test Results

| Test | Result | Time |
|------|--------|------|
| Help Command | ✓ | 135ms |
| Version Command | ✓ | 119ms |
| List Styles | ✓ | 134ms |
| List Sizes | ✓ | 140ms |
| Create Presentation | ✓ | 135ms |
| Create with Style | ✓ | 132ms |
| Create with Size | ✓ | 132ms |
| List Command | ✓ | 128ms |
| Chart Template | ✓ | 132ms |
| Carousel Template | ✓ | 118ms |
| Error: Missing Title | ✓ | 121ms |
| Warning: Invalid Style | ✓ | 138ms |
| Error: Invalid Size | ✓ | 134ms |
| Error: Invalid Chart Type | ✓ | 129ms |
| Error: Invalid Carousel Type | ✓ | 119ms |
| Build Presentation | ✓ | 137ms |
| AI Generate Guidance | ✓ | 125ms |
| All 20 Styles Available | ✓ | 134ms |
| All 5 Sizes Available | ✓ | 126ms |
| Error: Unknown Command | ✓ | 122ms |

## Stress Test Scenarios

| Scenario | Iterations | Description |
|----------|------------|-------------|
| stress_basic_create | 100 | Rapid presentation creation |
| stress_large_title | 10 | 500+ character titles |
| stress_unicode_title | 10 | Unicode characters (Arabic, Chinese, Hindi) |
| stress_special_chars | 10 | Special characters (@#$%^&*()) |
| stress_all_styles | 20 | Cycle through all 20 styles |
| stress_all_sizes | 5 | Test all 5 slide sizes |
| stress_concurrent_build | 5 | Parallel build operations |
| stress_invalid_inputs | 15 | Error case handling |
| stress_styles_command | 1000 | Command repetition |
| stress_sizes_command | 1000 | Command repetition |
| stress_list_command | 50 | File listing |

## Running Tests

### From Project Root

```bash
cd /path/to/opencode-presentations-skill

# Functional tests
node tests/run-tests.js

# Stress tests
node tests/stress/stress-test.js
```

### From Tests Directory

```bash
cd tests
npm test
```

## Test Output

Results saved as JSON in `results/` directory:

```json
{
  "timestamp": "2026-05-08T15:48:05.317Z",
  "nodeVersion": "v22.22.1",
  "platform": "linux",
  "tests": [
    {
      "name": "Help Command",
      "success": true,
      "duration": 135
    }
  ],
  "summary": {
    "total": 20,
    "passed": 20,
    "failed": 0,
    "rate": "100.0%"
  }
}
```

## CI Integration

Add to GitHub Actions:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Run Tests
        run: |
          cd tests
          node run-tests.js
```

## Debugging

If tests fail:

1. Check Node.js version: `node --version` (requires 18+)
2. Verify CLI path exists: `ls presentations/bin/present`
3. Check file permissions: `chmod +x presentations/bin/present`
4. Review test output: `cat results/test_report_*.json`
5. Run single test with verbose: `node -e "import('./run-tests.js')"`

## Performance Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| Help Command | < 500ms | ~135ms |
| Create Presentation | < 500ms | ~135ms |
| List Styles | < 500ms | ~134ms |
| Build HTML | < 2s | ~137ms |

## Coverage Areas

- ✓ CLI argument parsing
- ✓ File system operations
- ✓ Error handling
- ✓ Input validation
- ✓ Unicode support (i18n)
- ✓ Path resolution (cross-platform)
- ✓ Performance under load
- ✓ Concurrent operations
- ✓ Edge cases (empty, large, special chars)

## Maintenance

When adding new features:

1. Add test cases to `run-tests.js`
2. Add stress scenarios to `stress-test.js`
3. Update this README
4. Run full test suite
5. Commit with test results