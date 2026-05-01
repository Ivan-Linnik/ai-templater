import fs from 'node:fs';
import path from 'node:path';
import { stdin as processInput, stdout as processOutput } from 'node:process';
import readline from 'node:readline/promises';
import { tryCopyFile } from '../lib/copy.js';
import { output } from '../lib/output.js';
import { getClaudeAgentsDir, getClaudeDir, getClaudeSharedDir, getPackageRoot } from '../lib/paths.js';
import { askDirection, askLanguage } from '../lib/prompts.js';
function parseDirection(value) {
    const normalized = value.trim().toLowerCase();
    if (['fe', 'frontend'].includes(normalized))
        return 'fe';
    if (['be', 'backend'].includes(normalized))
        return 'be';
    return undefined;
}
function getDirectionAgentFiles(direction, packageRoot) {
    const agentsDir = path.join(packageRoot, 'agents');
    const targetAgentsDir = getClaudeAgentsDir();
    const fe = ['architect-fe', 'reviewer-fe'];
    const be = ['architect-be', 'reviewer-be'];
    const names = direction === 'fe' ? fe : be;
    return names.map(name => ({
        src: path.join(agentsDir, `${name}.md`),
        dest: path.join(targetAgentsDir, `${name}.md`),
        label: `agents/${name}.md`
    }));
}
function getDirectionSharedFiles(direction, packageRoot, language) {
    const sharedDir = path.join(packageRoot, 'shared');
    const targetSharedDir = getClaudeSharedDir();
    const feFiles = [
        'code-style-ts',
        'code-style-styles',
        'imports',
        'review-checklist-fe'
    ];
    const beFiles = ['review-checklist-be'];
    const beTs = ['code-style-ts', 'imports'];
    const names = direction === 'fe' ? feFiles : [...beFiles, ...(language === 'ts' ? beTs : [])];
    return names.map(name => ({
        src: path.join(sharedDir, `${name}.md`),
        dest: path.join(targetSharedDir, `${name}.md`),
        label: `shared/${name}.md`
    }));
}
export async function runAdd(options) {
    const claudeDir = getClaudeDir();
    if (!fs.existsSync(claudeDir)) {
        output.error('.claude/ not found. Run ait init first');
        return;
    }
    const packageRoot = getPackageRoot();
    const rl = readline.createInterface({
        input: processInput,
        output: processOutput
    });
    try {
        const direction = options.directionArg !== undefined
            ? (parseDirection(options.directionArg) ?? (await askDirection(rl)))
            : await askDirection(rl);
        if (direction === 'both') {
            output.error('Use ait init --force to reinitialize with both directions');
            return;
        }
        const language = direction === 'be' ? await askLanguage(rl) : undefined;
        const directionLabel = language
            ? `${direction.toUpperCase()} / ${language.toUpperCase()}`
            : direction.toUpperCase();
        output.info(`Adding [${directionLabel}] to existing .claude setup`);
        const agentFiles = getDirectionAgentFiles(direction, packageRoot);
        let agentCopyFailed = false;
        for (const file of agentFiles) {
            const copied = tryCopyFile(file.src, file.dest);
            if (!copied) {
                output.warning(`${file.label} was not copied`);
                agentCopyFailed = true;
            }
        }
        if (!agentCopyFailed) {
            output.success('Agent files added');
        }
        const sharedFiles = getDirectionSharedFiles(direction, packageRoot, language);
        let sharedCopyFailed = false;
        for (const file of sharedFiles) {
            const copied = tryCopyFile(file.src, file.dest);
            if (!copied) {
                output.warning(`${file.label} was not copied`);
                sharedCopyFailed = true;
            }
        }
        if (!sharedCopyFailed) {
            output.success('Shared files added');
        }
        output.success('Done');
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            output.info('Cancelled');
            return;
        }
        throw error;
    }
    finally {
        rl.close();
    }
}
