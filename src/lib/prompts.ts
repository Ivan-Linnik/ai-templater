import type readline from 'node:readline/promises';
import pc from 'picocolors';

import {output} from './output.js';

export type TDirection = 'fe' | 'be' | 'both';

export type TLanguage = 'ts' | 'go' | 'python' | 'other';

export async function askDirection(rl: readline.Interface): Promise<TDirection> {
    while (true) {
        const answer = await rl.question(
            `\n${pc.bold('Select project direction:')}\n  [1] Frontend\n  [2] Backend\n  [3] Both\n> `
        );
        const normalized = answer.trim().toLowerCase();

        if (['1', 'fe', 'frontend'].includes(normalized)) return 'fe';
        if (['2', 'be', 'backend'].includes(normalized)) return 'be';
        if (['3', 'both'].includes(normalized)) return 'both';

        output.warning('Enter 1, 2, or 3.');
    }
}

export async function askLanguage(rl: readline.Interface): Promise<TLanguage> {
    while (true) {
        const answer = await rl.question(
            `\n${pc.bold('Select backend language:')}\n  [1] Node.js / TypeScript\n  [2] Go\n  [3] Python\n  [4] Other\n> `
        );
        const normalized = answer.trim().toLowerCase();

        if (['1', 'ts', 'typescript', 'node', 'node.js'].includes(normalized))
            return 'ts';
        if (['2', 'go', 'golang'].includes(normalized)) return 'go';
        if (['3', 'python'].includes(normalized)) return 'python';
        if (['4', 'other'].includes(normalized)) return 'other';

        output.warning('Enter 1, 2, 3, or 4.');
    }
}
