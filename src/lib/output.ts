import pc from 'picocolors';

type TOutputLevel = 'info' | 'success' | 'warning' | 'error';

const PREFIX = pc.dim('[ai-templater]');

const SYMBOLS: Record<TOutputLevel, string> = {
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
} satisfies Record<TOutputLevel, (text: string) => string>;

function format(level: TOutputLevel, message: string): string {
    const symbol = SYMBOLS[level];
    const color = COLOR[level];

    return `${PREFIX} ${color(`${symbol} ${message}`)}`;
}

export const output = {
    info(message: string): void {
        console.log(format('info', message));
    },

    warning(message: string): void {
        console.warn(format('warning', message));
    },

    error(message: string): void {
        console.error(format('error', message));
    },

    success(message: string): void {
        console.log(format('success', message));
    }
};
