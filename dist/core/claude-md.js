import fs from 'node:fs';
import path from 'node:path';
import { getPackageRoot } from '../lib/paths.js';
export function readClaudeMdTemplate() {
    const templatePath = path.join(getPackageRoot(), 'templates', 'claude.md');
    return fs.readFileSync(templatePath, 'utf-8');
}
export function writeClaudeMd(targetClaudeFile, isForce) {
    const newContent = readClaudeMdTemplate();
    let currentContent = null;
    try {
        currentContent = fs.readFileSync(targetClaudeFile, 'utf-8');
    }
    catch (error) {
        const isFileNotExistsError = error instanceof Error && 'code' in error && error.code === 'ENOENT';
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
