import fs from 'node:fs';
import path from 'node:path';
function getPathStatSafe(targetPath) {
    try {
        return fs.statSync(targetPath);
    }
    catch {
        return null;
    }
}
export function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}
export function tryCopyFile(sourcePath, targetPath) {
    const sourceStat = getPathStatSafe(sourcePath);
    if (!sourceStat?.isFile()) {
        return false;
    }
    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    return true;
}
export function tryCopyDir(sourceDir, targetDir) {
    const sourceStat = getPathStatSafe(sourceDir);
    if (!sourceStat?.isDirectory()) {
        return false;
    }
    ensureDir(targetDir);
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
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
                }
                else {
                    isCopied = false;
                }
            }
            catch {
                isCopied = false;
            }
        }
    }
    return isCopied;
}
