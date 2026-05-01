import fs from 'node:fs';
import path from 'node:path';
import { stdin as processInput, stdout as processOutput } from 'node:process';
import readline from 'node:readline/promises';
import pc from 'picocolors';
import { writeClaudeMd } from '../core/claude-md.js';
import { getProjectName } from '../core/project-name.js';
import { ensureDir, tryCopyFile } from '../lib/copy.js';
import { output } from '../lib/output.js';
import { getClaudeAgentsDir, getClaudeDir, getClaudeMdPath, getClaudeSettingsPath, getClaudeSharedDir, getPackageRoot, getProjectRoot } from '../lib/paths.js';
import { askDirection, askLanguage } from '../lib/prompts.js';
function ensurePathExists(targetPath, label) {
    if (!fs.existsSync(targetPath)) {
        throw new Error(`Required source is missing: ${label} (${targetPath})`);
    }
}
function getAgentFiles(direction, packageRoot) {
    const agentsDir = path.join(packageRoot, 'agents');
    const targetAgentsDir = getClaudeAgentsDir();
    const always = ['code-styler', 'implementer', 'snapshot-creator'];
    const fe = ['architect-fe', 'reviewer-fe'];
    const be = ['architect-be', 'reviewer-be'];
    const names = [
        ...always,
        ...(direction === 'fe' || direction === 'both' ? fe : []),
        ...(direction === 'be' || direction === 'both' ? be : [])
    ];
    return names.map(name => ({
        src: path.join(agentsDir, `${name}.md`),
        dest: path.join(targetAgentsDir, `${name}.md`),
        label: `agents/${name}.md`
    }));
}
function getSharedFiles(direction, packageRoot, language) {
    const sharedDir = path.join(packageRoot, 'shared');
    const targetSharedDir = getClaudeSharedDir();
    const always = ['code-comments'];
    const feOnly = [
        'code-style-ts',
        'code-style-styles',
        'imports',
        'review-checklist-fe'
    ];
    const beOnly = ['review-checklist-be'];
    const beTs = ['code-style-ts', 'imports'];
    const both = [...feOnly, ...beOnly];
    const names = [
        ...always,
        ...(direction === 'fe' ? feOnly : []),
        ...(direction === 'be' ? beOnly : []),
        ...(direction === 'be' && language === 'ts' ? beTs : []),
        ...(direction === 'both' ? both : [])
    ];
    return names.map(name => ({
        src: path.join(sharedDir, `${name}.md`),
        dest: path.join(targetSharedDir, `${name}.md`),
        label: `shared/${name}.md`
    }));
}
async function confirmClaudeRewrite(rl) {
    const answer = await rl.question(`${pc.bold('.claude already exists in the project root. Do you want to replace it?')} (y/N): `);
    const normalized = answer.trim().toLowerCase();
    return normalized === 'y' || normalized === 'yes';
}
export async function runInit(options) {
    const isForce = Boolean(options.force);
    const projectRoot = getProjectRoot();
    const packageRoot = getPackageRoot();
    const projectName = getProjectName(projectRoot);
    const rl = readline.createInterface({
        input: processInput,
        output: processOutput
    });
    try {
        const direction = await askDirection(rl);
        const language = direction === 'be' ? await askLanguage(rl) : undefined;
        const sourceAgentsFile = path.join(packageRoot, 'templates', 'agents.md');
        const sourceClaudeMdFile = path.join(packageRoot, 'templates', 'claude.md');
        const sourceSettingsFile = path.join(packageRoot, 'templates', 'settings.json');
        const targetClaudeDir = getClaudeDir();
        const targetAgentsDir = getClaudeAgentsDir();
        const targetSharedDir = getClaudeSharedDir();
        const targetAgentsFile = path.join(targetClaudeDir, 'AGENTS.md');
        const targetSettingsFile = getClaudeSettingsPath();
        const targetClaudeFile = getClaudeMdPath();
        const isClaudeDirExists = fs.existsSync(targetClaudeDir);
        ensurePathExists(sourceAgentsFile, 'templates/agents.md');
        ensurePathExists(sourceClaudeMdFile, 'templates/claude.md');
        ensurePathExists(sourceSettingsFile, 'templates/settings.json');
        if (isClaudeDirExists && !isForce) {
            const isRewriteConfirmed = await confirmClaudeRewrite(rl);
            if (!isRewriteConfirmed) {
                output.warning('Initialization cancelled. Existing .claude was kept');
                return;
            }
        }
        if (isClaudeDirExists) {
            output.info('Removing existing .claude directory');
            fs.rmSync(targetClaudeDir, { recursive: true, force: true });
        }
        const directionLabel = language
            ? `${direction.toUpperCase()} / ${language.toUpperCase()}`
            : direction.toUpperCase();
        output.info(`Initializing Claude setup for project "${projectName}" [${directionLabel}]`);
        ensureDir(targetClaudeDir);
        ensureDir(targetAgentsDir);
        ensureDir(targetSharedDir);
        output.success('.claude structure initialized');
        const agentFiles = getAgentFiles(direction, packageRoot);
        let agentCopyFailed = false;
        for (const file of agentFiles) {
            const copied = tryCopyFile(file.src, file.dest);
            if (!copied) {
                output.warning(`${file.label} was not copied`);
                agentCopyFailed = true;
            }
        }
        if (!agentCopyFailed) {
            output.success('Agent files copied');
        }
        const sharedFiles = getSharedFiles(direction, packageRoot, language);
        let sharedCopyFailed = false;
        for (const file of sharedFiles) {
            const copied = tryCopyFile(file.src, file.dest);
            if (!copied) {
                output.warning(`${file.label} was not copied`);
                sharedCopyFailed = true;
            }
        }
        if (!sharedCopyFailed) {
            output.success('Shared files copied');
        }
        const isAgentsFileCopied = tryCopyFile(sourceAgentsFile, targetAgentsFile);
        if (!isAgentsFileCopied) {
            output.warning('AGENTS.md was not copied to .claude');
        }
        const isSettingsFileCopied = tryCopyFile(sourceSettingsFile, targetSettingsFile);
        if (!isSettingsFileCopied) {
            output.warning('settings.json was not copied to .claude');
        }
        const writeClaudeMdResult = writeClaudeMd(targetClaudeFile, isForce);
        if (writeClaudeMdResult === 'created') {
            output.success('CLAUDE.md created in the project root');
        }
        if (writeClaudeMdResult === 'updated') {
            output.success('CLAUDE.md updated in the project root');
        }
        if (writeClaudeMdResult === 'skipped') {
            output.info('CLAUDE.md already exists in the project root. Keeping the existing file');
        }
        output.success('Initialization completed');
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            output.info('Initialization cancelled');
            return;
        }
        throw error;
    }
    finally {
        rl.close();
    }
}
