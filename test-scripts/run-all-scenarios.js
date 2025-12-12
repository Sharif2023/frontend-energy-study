/**
 * Master script to run all scenarios for all frameworks
 * Usage: node run-all-scenarios.js [framework] [port]
 */

const { spawn } = require('child_process');
const path = require('path');

const frameworks = ['react', 'vue', 'angular', 'svelte'];
const scenarios = [
  { name: 'simple', script: 'scenario-a-simple.js', port: 3000 },
  { name: 'medium', script: 'scenario-b-medium.js', port: 3000 },
  { name: 'complex', script: 'scenario-c-complex.js', port: 3000 }
];

const targetFramework = process.argv[2]; // Optional: specific framework
const basePort = parseInt(process.argv[3]) || 3000;

async function runScenario(framework, scenario, port) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${scenario.name} for ${framework} on port ${port} ===`);
    
    const scriptPath = path.join(__dirname, scenario.script);
    const proc = spawn('node', [scriptPath, framework, port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Completed ${scenario.name} for ${framework}`);
        resolve();
      } else {
        console.error(`✗ Failed ${scenario.name} for ${framework} with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    proc.on('error', (err) => {
      console.error(`✗ Error running ${scenario.name} for ${framework}:`, err);
      reject(err);
    });
  });
}

async function main() {
  const frameworksToTest = targetFramework ? [targetFramework] : frameworks;
  
  for (const framework of frameworksToTest) {
    const port = basePort + frameworks.indexOf(framework);
    
    for (const scenario of scenarios) {
      try {
        await runScenario(framework, scenario, port);
        // Wait 10 minutes between scenarios for thermal cooldown
        if (scenario !== scenarios[scenarios.length - 1]) {
          console.log('\n⏳ Waiting 10 minutes for thermal cooldown...');
          await new Promise(resolve => setTimeout(resolve, 600000));
        }
      } catch (error) {
        console.error(`Error in ${framework} ${scenario.name}:`, error);
        // Continue with next scenario
      }
    }
    
    // Wait between frameworks
    if (framework !== frameworksToTest[frameworksToTest.length - 1]) {
      console.log('\n⏳ Waiting 5 minutes before next framework...');
      await new Promise(resolve => setTimeout(resolve, 300000));
    }
  }
  
  console.log('\n✓ All scenarios completed!');
}

main().catch(console.error);
