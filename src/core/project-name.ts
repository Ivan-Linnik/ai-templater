import fs from 'node:fs';
import path from 'node:path';

type TPackageJsonFields = {
    name?: string;
};

const FALLBACK_PROJECT_NAME = 'unknown_project';

/** Falls back to FALLBACK_PROJECT_NAME if package.json is missing, name is empty, or JSON is invalid */
export function getProjectName(projectRoot: string): string {
    const packageJsonPath = path.join(projectRoot, 'package.json');

    try {
        const raw = fs.readFileSync(packageJsonPath, 'utf-8');
        const parsed = JSON.parse(raw) as TPackageJsonFields;

        // Strip npm scope prefix (@scope/name → name) to keep directory names filesystem-safe
        const name = parsed.name?.trim().replace(/^@[^/]+\//, '');

        return name || FALLBACK_PROJECT_NAME;
    } catch {
        return FALLBACK_PROJECT_NAME;
    }
}
