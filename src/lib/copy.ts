import fs from 'node:fs';
import path from 'node:path';

function getPathStatSafe(targetPath: string): fs.Stats | null {
    try {
        return fs.statSync(targetPath);
    } catch {
        return null;
    }
}

export function ensureDir(dirPath: string): void {
    fs.mkdirSync(dirPath, {recursive: true});
}

/** Returns true if copied, false if source is missing or not a file */
export function tryCopyFile(sourcePath: string, targetPath: string): boolean {
    const sourceStat = getPathStatSafe(sourcePath);

    if (!sourceStat?.isFile()) {
        return false;
    }

    ensureDir(path.dirname(targetPath));

    fs.copyFileSync(sourcePath, targetPath);

    return true;
}

/** Returns true if all entries were copied, false if source is missing or any entry failed */
export function tryCopyDir(sourceDir: string, targetDir: string): boolean {
    const sourceStat = getPathStatSafe(sourceDir);

    if (!sourceStat?.isDirectory()) {
        return false;
    }

    ensureDir(targetDir);

    const entries = fs.readdirSync(sourceDir, {withFileTypes: true});

    let isCopied = true;

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const targetPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            const isNestedCopied = tryCopyDir(sourcePath, targetPath);

            if (!isNestedCopied) {
                isCopied = false;
            }

            continue;
        }

        if (entry.isFile()) {
            const isFileCopied = tryCopyFile(sourcePath, targetPath);

            if (!isFileCopied) {
                isCopied = false;
            }

            continue;
        }

        if (entry.isSymbolicLink()) {
            try {
                const realPath = fs.realpathSync(sourcePath);
                const realStat = fs.statSync(realPath);

                if (realStat.isFile()) {
                    ensureDir(path.dirname(targetPath));
                    fs.copyFileSync(realPath, targetPath);
                } else {
                    isCopied = false;
                }
            } catch {
                isCopied = false;
            }
        }
    }

    return isCopied;
}
