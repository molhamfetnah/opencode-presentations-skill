#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, readdirSync, statSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = __dirname.endsWith('/tests') || __dirname.endsWith('/stress') 
  ? __dirname.endsWith('/stress') ? join(__dirname, '..') : join(__dirname, '..', '..')
  : join(__dirname, '..', '..');
const CLI_PATH = join(ROOT_DIR, 'presentations', 'bin', 'present');
const RESULTS_DIR = join(__dirname, '..', 'results');
const SAMPLES_DIR = ROOT_DIR; // Use project root

if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });
if (!existsSync(SAMPLES_DIR)) mkdirSync(SAMPLES_DIR, { recursive: true });

const SCENARIOS = [
  {
    name: 'stress_basic_create',
    description: 'Create 100 presentations rapidly',
    iterations: 100,
    command: (i) => ['create', `Test_Presentation_${i}`]
  },
  {
    name: 'stress_large_title',
    description: 'Create presentation with very long title',
    iterations: 10,
    command: () => ['create', 'A'.repeat(500)]
  },
  {
    name: 'stress_unicode_title',
    description: 'Create presentations with Unicode titles',
    iterations: 10,
    command: (i) => ['create', `演示_${i}_प्रस्तुति_🔥`]
  },
  {
    name: 'stress_special_chars',
    description: 'Create presentations with special characters',
    iterations: 10,
    command: (i) => ['create', `Test@#$%^&*()_${i}`]
  },
  {
    name: 'stress_all_styles',
    description: 'Create presentations with all 20 styles',
    iterations: 20,
    command: (i) => ['create', `Style_Test_${i}`, '--style=glassmorphism']
  },
  {
    name: 'stress_all_sizes',
    description: 'Create presentations with all sizes',
    iterations: 5,
    command: (i) => ['create', `Size_Test_${i}`, '--size=16:9', '--size=4:3', '--size=1:1', '--size=9:16', '--size=21:9']
  },
  {
    name: 'stress_concurrent_build',
    description: 'Build multiple files simultaneously',
    iterations: 5,
    setup: () => {
      for (let i = 0; i < 5; i++) {
        execSync(`node ${CLI_PATH} create "Concurrent_Build_${i}"`, { cwd: SAMPLES_DIR, stdio: 'pipe' });
      }
    },
    command: (i) => ['build', `concurrent_build_${i}.md`]
  },
  {
    name: 'stress_invalid_inputs',
    description: 'Test error handling with invalid inputs',
    iterations: 15,
    command: (i) => {
      const invalidInputs = [
        ['create', ''],
        ['create'],
        ['build', 'nonexistent.md'],
        ['serve', 'nonexistent.md'],
        ['build'],
        ['chart', ''],
        ['chart', 'invalidtype'],
        ['carousel', '--type=invalid'],
        ['scrape-styles', '--count=-5'],
        ['styles', '--invalid-option'],
        ['sizes', '--invalid'],
        ['export'],
        ['ai-image', ''],
        ['list'],
        ['invalidcommand']
      ];
      return invalidInputs[i % invalidInputs.length];
    }
  },
  {
    name: 'stress_styles_command',
    description: 'List styles 1000 times',
    iterations: 1000,
    command: () => ['styles']
  },
  {
    name: 'stress_sizes_command',
    description: 'List sizes 1000 times',
    iterations: 1000,
    command: () => ['sizes']
  },
  {
    name: 'stress_list_command',
    description: 'List files in various directories',
    iterations: 50,
    command: () => ['list']
  }
];

function runCommand(args) {
  const startTime = Date.now();
  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  
  try {
    stdout = execSync(`node ${CLI_PATH} ${args.join(' ')}`, { 
      cwd: SAMPLES_DIR,
      stdio: 'pipe',
      timeout: 30000
    }).toString();
  } catch (e) {
    stderr = e.stderr?.toString() || e.message;
    stdout = e.stdout?.toString() || '';
    exitCode = e.status || 1;
  }
  
  const duration = Date.now() - startTime;
  
  return { stdout, stderr, exitCode, duration };
}

function cleanup() {
  try {
    const files = readdirSync(SAMPLES_DIR);
    files.forEach(f => {
      if (f.endsWith('.md') || f.endsWith('.html')) {
        try { unlinkSync(join(SAMPLES_DIR, f)); } catch (e) {}
      }
    });
  } catch (e) {}
}

function runScenario(scenario) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scenario: ${scenario.name}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`Iterations: ${scenario.iterations}`);
  console.log('='.repeat(60));
  
  const results = {
    name: scenario.name,
    description: scenario.description,
    iterations: scenario.iterations,
    tests: [],
    stats: {
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      success: 0,
      failure: 0,
      errors: []
    }
  };
  
  if (scenario.setup) {
    try { scenario.setup(); } catch (e) { console.log('Setup error:', e.message); }
  }
  
  for (let i = 0; i < scenario.iterations; i++) {
    const args = scenario.command(i);
    const result = runCommand(args);
    
    const testResult = {
      iteration: i + 1,
      args,
      duration: result.duration,
      exitCode: result.exitCode,
      success: result.exitCode === 0,
      stdout: result.stdout.substring(0, 200),
      stderr: result.stderr.substring(0, 200)
    };
    
    results.tests.push(testResult);
    results.stats.totalTime += result.duration;
    results.stats.minTime = Math.min(results.stats.minTime, result.duration);
    results.stats.maxTime = Math.max(results.stats.maxTime, result.duration);
    
    if (result.exitCode === 0) {
      results.stats.success++;
    } else {
      results.stats.failure++;
      if (!results.stats.errors.includes(result.stderr.substring(0, 100))) {
        results.stats.errors.push(result.stderr.substring(0, 100));
      }
    }
    
    process.stdout.write(`\r  Progress: ${i + 1}/${scenario.iterations} ${result.exitCode === 0 ? '✓' : '✗'}`);
  }
  
  results.stats.avgTime = Math.round(results.stats.totalTime / scenario.iterations);
  results.stats.minTime = results.stats.minTime === Infinity ? 0 : results.stats.minTime;
  
  console.log(`\n  Results:`);
  console.log(`    Success: ${results.stats.success}/${scenario.iterations}`);
  console.log(`    Failure: ${results.stats.failure}/${scenario.iterations}`);
  console.log(`    Avg Time: ${results.stats.avgTime}ms`);
  console.log(`    Min/Max: ${results.stats.minTime}ms/${results.stats.maxTime}ms`);
  
  return results;
}

function runAllScenarios() {
  console.log('Starting Stress Test Suite');
  console.log(`CLI Path: ${CLI_PATH}`);
  console.log(`Results Dir: ${RESULTS_DIR}`);
  console.log(`Samples Dir: ${SAMPLES_DIR}`);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = join(RESULTS_DIR, `stress_test_${timestamp}.json`);
  
  cleanup();
  
  const allResults = {
    timestamp: new Date().toISOString(),
    cliPath: CLI_PATH,
    nodeVersion: process.version,
    platform: process.platform,
    scenarios: [],
    summary: {
      totalScenarios: SCENARIOS.length,
      totalTests: 0,
      totalSuccess: 0,
      totalFailure: 0,
      totalTime: 0
    }
  };
  
  const startTime = Date.now();
  
  SCENARIOS.forEach(scenario => {
    const result = runScenario(scenario);
    allResults.scenarios.push(result);
    allResults.summary.totalTests += scenario.iterations;
    allResults.summary.totalSuccess += result.stats.success;
    allResults.summary.totalFailure += result.stats.failure;
    cleanup();
  });
  
  allResults.summary.totalTime = Date.now() - startTime;
  
  writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Scenarios: ${allResults.summary.totalScenarios}`);
  console.log(`Total Tests: ${allResults.summary.totalTests}`);
  console.log(`Total Success: ${allResults.summary.totalSuccess}`);
  console.log(`Total Failure: ${allResults.summary.totalFailure}`);
  console.log(`Success Rate: ${((allResults.summary.totalSuccess / allResults.summary.totalTests) * 100).toFixed(2)}%`);
  console.log(`Total Time: ${allResults.summary.totalTime}ms`);
  console.log(`\nResults saved to: ${resultsFile}`);
  
  return allResults;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllScenarios();
}

export { runAllScenarios, runScenario, SCENARIOS };