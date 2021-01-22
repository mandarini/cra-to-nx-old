import { execSync } from 'child_process';

export function craToNx() {
  execSync('npm install --save-dev @nrwl/workspace');
}
