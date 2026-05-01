import fs from 'node:fs';
import path from 'node:path';

import {getPackageRoot} from '../lib/paths.js';

type TWriteClaudeMdResult = 'created' | 'updated' | 'skipped';

export function readClaudeMdTemplate(): string {
    const templatePath = path.join(getPackageRoot(), 'templates', 'claude.md');

    return fs.readFileSync(templatePath, 'utf-8');
}

/** Creates if absent, skips if present (unless force), always overwrites when force is true */
export function writeClaudeMd(
    targetClaudeFile: string,
    isForce: boolean
): TWriteClaudeMdResult {
    const newContent = readClaudeMdTemplate();

    let currentContent: string | null = null;

    try {
        currentContent = fs.readFileSync(targetClaudeFile, 'utf-8');
    } catch (error) {
        const isFileNotExistsError =
            error instanceof Error && 'code' in error && error.code === 'ENOENT';

        if (!isFileNotExistsError) {
            throw error;
        }
    }

    if (currentContent === null) {
        fs.writeFileSync(targetClaudeFile, newContent, 'utf-8');

        return 'created';
    }

    if (!isForce) {
        return 'skipped';
    }

    fs.writeFileSync(targetClaudeFile, newContent, 'utf-8');

    return 'updated';
}
