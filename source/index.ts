import { swapSync, swapAsync } from './swap';

type Swap = typeof swapAsync & { sync: typeof swapSync };

const swap = swapAsync as Swap;
swap.sync = swapSync;

export = swap;
