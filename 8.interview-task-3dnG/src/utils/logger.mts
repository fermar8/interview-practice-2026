// #####################################
// # DONT CHANGE ANYTHING IN THIS FILE #
// #####################################

let isLogginEnabled = true;

export const logger = {
    enable: () => {
        isLogginEnabled = true;
    },
    disable: () => {
        isLogginEnabled = false;
    },
    log: (...args: unknown[]) => {
        if (isLogginEnabled) {
            console.log(...args);
        }
    },
    error: (...args: unknown[]) => {
        if (isLogginEnabled) {
            console.error(...args);
        }
    },
    warn: (...args: unknown[]) => {
        if (isLogginEnabled) {
            console.warn(...args);
        }
    },
    info: (...args: unknown[]) => {
        if (isLogginEnabled) {
            console.info(...args);
        }
    },
};
