import fs from 'node:fs';
import { stdin as processInput, stdout as processOutput } from 'node:process';
import readline from 'node:readline/promises';
import pc from 'picocolors';
import { output } from '../lib/output.js';
import { getClaudeDir, getClaudeMdPath } from '../lib/paths.js';
async function confirmRemove(rl, question) {
    const answer = await rl.question(question);
    const normalized = answer.trim().toLowerCase();
    return normalized === 'y' || normalized === 'yes';
}
export async function runClean(options) {
    const isForce = Boolean(options.force);
    const claudeDir = getClaudeDir();
    const claudeMdPath = getClaudeMdPath();
    const isClaudeDirExists = fs.existsSync(claudeDir);
    if (!isClaudeDirExists) {
        output.info('Nothing to clean');
        return;
    }
    const rl = readline.createInterface({
        input: processInput,
        output: processOutput
    });
    try {
        if (!isForce) {
            const confirmed = await confirmRemove(rl, `${pc.bold('Remove .claude/ from this project?')} (y/N): `);
            if (!confirmed) {
                output.info('Cleanup cancelled');
                return;
            }
        }
        fs.rmSync(claudeDir, { recursive: true, force: true });
        output.success('.claude/ removed');
        const isClaudeMdExists = fs.existsSync(claudeMdPath);
        if (isClaudeMdExists) {
            const shouldRemoveMd = isForce ||
                (await confirmRemove(rl, `${pc.bold('CLAUDE.md found in project root. Remove it too?')} (y/N): `));
            if (shouldRemoveMd) {
                fs.rmSync(claudeMdPath);
                output.success('CLAUDE.md removed');
            }
            else {
                output.info('CLAUDE.md kept');
            }
        }
        output.success('Cleanup completed');
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            output.info('Cleanup cancelled');
            return;
        }
        throw error;
    }
    finally {
        rl.close();
    }
}
