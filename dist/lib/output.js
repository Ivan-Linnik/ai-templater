import pc from 'picocolors';
const PREFIX = pc.dim('[ai-templater]');
const SYMBOLS = {
    info: '○',
    success: '✔',
    warning: '!',
    error: '✖'
};
const COLOR = {
    info: pc.blue,
    success: pc.green,
    warning: pc.yellow,
    error: pc.red
};
function format(level, message) {
    const symbol = SYMBOLS[level];
    const color = COLOR[level];
    return `${PREFIX} ${color(`${symbol} ${message}`)}`;
}
export const output = {
    info(message) {
        console.log(format('info', message));
    },
    warning(message) {
        console.warn(format('warning', message));
    },
    error(message) {
        console.error(format('error', message));
    },
    success(message) {
        console.log(format('success', message));
    }
};
