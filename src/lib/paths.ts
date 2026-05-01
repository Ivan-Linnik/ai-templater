import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLAUDE_DIR_NAME = '.claude';
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

// ─── Internal helpers ───────────────────────────────────────────────────

function fromProjectRoot(...segments: string[]): string {
    return path.join(getProjectRoot(), ...segments);
}

function fromClaudeDir(...segments: string[]): string {
    return fromProjectRoot(CLAUDE_DIR_NAME, ...segments);
}

// ─── Base public paths ──────────────────────────────────────────────────

/** Root of the installed ai-templater package */
export function getPackageRoot(): string {
    return PACKAGE_ROOT;
}

/** Current project root — process.cwd() at CLI invocation time */
export function getProjectRoot(): string {
    return process.cwd();
}

export function getClaudeDir(): string {
    return fromProjectRoot(CLAUDE_DIR_NAME);
}

export function getClaudeMdPath(): string {
    return fromProjectRoot('CLAUDE.md');
}

// ─── Claude internal structure ──────────────────────────────────────────

export function getClaudeAgentsDir(): string {
    return fromClaudeDir('agents');
}

export function getClaudeSharedDir(): string {
    return fromClaudeDir('shared');
}

export function getClaudeSettingsPath(): string {
    return fromClaudeDir('settings.json');
}
