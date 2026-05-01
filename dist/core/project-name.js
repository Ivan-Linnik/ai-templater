import fs from 'node:fs';
import path from 'node:path';
const FALLBACK_PROJECT_NAME = 'unknown_project';
export function getProjectName(projectRoot) {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    try {
        const raw = fs.readFileSync(packageJsonPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const name = parsed.name?.trim().replace(/^@[^/]+\//, '');
        return name || FALLBACK_PROJECT_NAME;
    }
    catch {
        return FALLBACK_PROJECT_NAME;
    }
}
