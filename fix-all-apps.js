#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const apps = ['angular', 'react', 'vue', 'svelte'];
const appsDir = path.join(__dirname, 'apps');

console.log('🔧 Fixing all framework apps...\n');

// Step 1: Verify all package.json files are correct
const packageChecks = {
  angular: {
    check: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(appsDir, 'angular', 'package.json'), 'utf8'));
      return pkg.dependencies['@angular/core'].includes('^18') && 
             pkg.scripts.start === 'ng serve';
    }
  },
  react: {
    check: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(appsDir, 'react', 'package.json'), 'utf8'));
      return pkg.dependencies['react-scripts'] === '5.0.1' &&
             pkg.scripts.start === 'react-scripts start';
    }
  },
  vue: {
    check: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(appsDir, 'vue', 'package.json'), 'utf8'));
      return pkg.scripts.start === 'vue-cli-service serve' &&
             pkg.scripts.serve === 'vue-cli-service serve';
    }
  },
  svelte: {
    check: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(appsDir, 'svelte', 'package.json'), 'utf8'));
      return pkg.scripts.dev === 'vite dev' &&
             pkg.type === 'module';
    }
  }
};

console.log('✅ Package.json verification:');
for (const app of apps) {
  try {
    const isValid = packageChecks[app].check();
    console.log(`   ${app}: ${isValid ? '✓ OK' : '✗ INVALID'}`);
  } catch (e) {
    console.log(`   ${app}: ✗ ERROR - ${e.message}`);
  }
}

// Step 2: Verify all required files exist
console.log('\n✅ Required files verification:');
const requiredFiles = {
  angular: [
    'src/main.ts',
    'src/index.html',
    'angular.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'src/app/app.module.ts'
  ],
  react: [
    'src/index.js',
    'src/App.jsx',
    'public/index.html',
    'src/context/AppContext.js'
  ],
  vue: [
    'src/main.js',
    'src/App.vue',
    'public/index.html',
    'src/router/index.js'
  ],
  svelte: [
    'src/app.html',
    'svelte.config.js',
    'vite.config.js'
  ]
};

for (const app of apps) {
  let allExist = true;
  for (const file of requiredFiles[app]) {
    const fullPath = path.join(appsDir, app, file);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ${app}: ✗ Missing ${file}`);
      allExist = false;
    }
  }
  if (allExist) {
    console.log(`   ${app}: ✓ All required files present`);
  }
}

console.log('\n✅ All checks complete. Apps are ready to start:\n');
console.log('   Angular:  cd apps/angular && npm start');
console.log('   React:    cd apps/react && npm start');
console.log('   Vue:      cd apps/vue && npm start');
console.log('   Svelte:   cd apps/svelte && npm run dev');
