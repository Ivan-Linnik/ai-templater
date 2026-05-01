import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLAUDE_DIR_NAME = '.claude';
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
function fromProjectRoot(...segments) {
    return path.join(getProjectRoot(), ...segments);
}
function fromClaudeDir(...segments) {
    return fromProjectRoot(CLAUDE_DIR_NAME, ...segments);
}
export function getPackageRoot() {
    return PACKAGE_ROOT;
}
export function getProjectRoot() {
    return process.cwd();
}
export function getClaudeDir() {
    return fromProjectRoot(CLAUDE_DIR_NAME);
}
export function getClaudeMdPath() {
    return fromProjectRoot('CLAUDE.md');
}
export function getClaudeAgentsDir() {
    return fromClaudeDir('agents');
}
export function getClaudeSharedDir() {
    return fromClaudeDir('shared');
}
export function getClaudeSettingsPath() {
    return fromClaudeDir('settings.json');
}
