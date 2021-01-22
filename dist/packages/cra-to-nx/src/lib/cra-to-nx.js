#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.craToNx = void 0;
const child_process_1 = require("child_process");
function craToNx() {
    console.log('HELLO this is katerina');
    child_process_1.execSync('npm install --save-dev @nrwl/storybook');
}
exports.craToNx = craToNx;
//# sourceMappingURL=cra-to-nx.js.map