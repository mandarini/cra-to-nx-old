#!/usr/bin/env node

import { exec, execSync } from 'child_process';
import {
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
  ensureDirSync,
  createFileSync,
  moveSync,
  copySync,
  removeSync,
} from 'fs-extra';
// import * as yargsParser from 'yargs-parser';

const inquirer = require('inquirer');

// const parsedArgs = yargsParser(process.argv, {
//   string: ['version'],
//   boolean: ['verbose'],
// });

function directoryExists(filePath: string): boolean {
  try {
    return statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function isYarn() {
  try {
    statSync('yarn.lock');
    return true;
  } catch (e) {
    return false;
  }
}

function addDependency(dep: string) {
  // const stdio = parsedArgs.verbose ? [0, 1, 2] : ['ignore', 'ignore', 'ignore'];
  if (isYarn()) {
    execSync(`yarn add -D ${dep}`);
  } else {
    execSync(`npm i --save-dev ${dep}`);
  }
}

async function main() {
  // const version = parsedArgs.version ? parsedArgs.version : `^10.0.0`;

  const output = require('@nrwl/workspace/src/utils/output').output;
  output.log({ title: 'Nx initialization' });

  addDependency(`@nrwl/workspace`);
  execSync(`nx g @nrwl/workspace`, {
    stdio: [0, 1, 2],
  });

  execSync('npm install', { stdio: ['ignore', 'ignore', 'ignore'] });

  const buildCmd = isYarn() ? `"yarn ng build"` : `"npm run ng build"`;

  output.success({
    title: 'You are on an Nx workspace now!',
    bodyLines: [`test`, `test`, `test`],
  });
}

function createNxWorkspaceForReact() {
  execSync(
    `npx create-nx-workspace temp-workspace --appName=webapp --preset=react --style=css --nx-cloud`
  );

  execSync(
    `${
      isYarn() ? 'yarn add --dev' : 'npm i --save-dev'
    } react-scripts @testing-library/jest-dom eslint-config-react-app react-app-rewired`
  );

  execSync(`rm -rf apps/webapp/* apps/webapp/{.babelrc,.browserslistrc}`);

  execSync(
    `mv ./{README.md,package.json,tsconfig.json,src,public} temp-workspace/apps/webapp`
  );

  execSync(`cd temp-workspace`);

  execSync(`nx g @nrwl/workspace:run-commands serve \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired start" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands build \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired build" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands lint \
  --project webapp \
  --command "node ../../node_modules/.bin/eslint src/**/*.tsx src/**/*.ts" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands test \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired test --watchAll=false" \
  --cwd "apps/webapp"`);

  // copySync(``) Copy the config-overrides here

  execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);
  execSync(`echo "node_modules" >> .gitignore`);

  execSync('cd ../');
  execSync('mv temp-workspace/* ./');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
