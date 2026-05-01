#!/usr/bin/env node

/**
 * CLI entrypoint. Handles argument parsing, command routing, and basic UX.
 */

import {runAdd} from './commands/add.js';
import {runClean} from './commands/clean.js';
import {runInit} from './commands/init.js';
import {output} from './lib/output.js';

const AVAILABLE_COMMANDS = {
    init: 'Initialize project with AI instructions',
    add: 'Add a new direction to existing .claude setup',
    clean: 'Remove .claude/ and CLAUDE.md from the project'
} as const;

const CLI_NAME = 'ait';
const HELP_FLAGS = ['--help', '-h'];

/** process.argv = [node, script, ...args] */
const args = process.argv.slice(2);

const command = args[0];
const flags = args.slice(1);

function printHelp(): void {
    const commands = Object.entries(AVAILABLE_COMMANDS)
        .map(([name, description]) => `  ${name.padEnd(10)} ${description}`)
        .join('\n');

    const helpText = `${CLI_NAME}

Usage:
  ${CLI_NAME} init [--force]
  ${CLI_NAME} add [direction]
  ${CLI_NAME} clean [--force]

Commands:
${commands}

Options:
  --force    Skip confirmations (init: recreate .claude; clean: remove all without prompts)
  -h, --help Show this help message

`;

    console.log(helpText);
}

async function main(): Promise<number> {
    const isHelpRequested =
        !command || command === 'help' || HELP_FLAGS.includes(command);
    const isCommandHelpRequested = flags.some(flag => HELP_FLAGS.includes(flag));

    if (isHelpRequested || isCommandHelpRequested) {
        printHelp();

        return 0;
    }

    switch (command) {
        case 'init': {
            const isForce = flags.includes('--force');

            await runInit({force: isForce});

            return 0;
        }

        case 'add': {
            const directionArg = flags.find(f => !f.startsWith('--'));

            await runAdd({directionArg});

            return 0;
        }

        case 'clean': {
            const isForce = flags.includes('--force');

            await runClean({force: isForce});

            return 0;
        }

        default: {
            output.error(`Unknown command "${command}"`);
            printHelp();

            return 1;
        }
    }
}

// Runs CLI with top-level error handling
main()
    .then(code => {
        process.exit(code);
    })
    .catch(error => {
        output.error('Unexpected error');
        console.error(error);

        process.exit(1);
    });
