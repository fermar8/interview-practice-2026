// #####################################
// # DONT CHANGE ANYTHING IN THIS FILE #
// #####################################

import { getStore, task } from './todo.mjs';
import { logger } from './utils/logger.mjs';
import { analytics, wrapTextInBox } from './utils/utils.mjs';

const store = await getStore();
const executionTimes: number[] = [];
logger.disable();

for (let i = 0; i < 50; i++) {
    const startTime = analytics.getStartTime();
    task(store);
    executionTimes.push(analytics.getExecutionTimeInMs(startTime));
}

logger.enable();
task(store);

console.log();
console.log(
    wrapTextInBox(`✅  Task completed on average in ${analytics.getAverageExecutionTimeInMs(executionTimes)}ms`),
);
