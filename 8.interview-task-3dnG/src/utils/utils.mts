// #####################################
// # DONT CHANGE ANYTHING IN THIS FILE #
// #####################################

import os from 'os';

export const analytics = {
    getStartTime: () => {
        return process.hrtime();
    },
    getExecutionTimeInMs: (startTime: [number, number]) => {
        const endTime = process.hrtime(startTime);
        return Number((endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2));
    },
    getAverageExecutionTimeInMs: (executionTimes: number[]) => {
        return Number(
            (
                executionTimes.reduce(
                    (totalExecutionTimeInMs, currentExecutionTimeInMs) =>
                        totalExecutionTimeInMs + currentExecutionTimeInMs,
                    0,
                ) / executionTimes.length
            ).toFixed(2),
        );
    },
};

export function wrapTextInBox(text: string, wrapCharacter = '#') {
    const lines = text.split(os.EOL);
    const maxLineLength = lines.reduce((acc, cur) => Math.max(acc, cur.length), 0);

    return [
        wrapCharacter.repeat(maxLineLength + 4),
        ...lines.map((line) => `${wrapCharacter} ${line.padEnd(maxLineLength)} ${wrapCharacter}`),
        wrapCharacter.repeat(maxLineLength + 4),
    ].join(os.EOL);
}
