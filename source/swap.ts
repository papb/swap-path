import { SwapOptions } from './types';
import jetpack = require('fs-jetpack');
import { getTempPath } from './temp-path';
import { isCrossDevice } from './is-cross-device';

function checkExistence(pathA: string, pathB: string): void {
	if (!jetpack.exists(pathA)) {
		throw new Error(`Path A ("${pathA}") does not exist.`);
	}

	if (!jetpack.exists(pathB)) {
		throw new Error(`Path B ("${pathB}") does not exist.`);
	}
}

function expandOptions(options?: SwapOptions): Required<SwapOptions> {
	return {
		crossDevice: options?.crossDevice ?? true
	};
}

function checkValidCall(pathA: string, pathB: string, options?: SwapOptions): void {
	checkExistence(pathA, pathB);
	if (!expandOptions(options).crossDevice && isCrossDevice(pathA, pathB)) {
		const error = new Error('Refusing to swap paths across different devices, since the `crossDevice` option was set to false.');
		(error as any).code = 'EXDEV';
		throw error;
	}
}

function samePath(pathA: string, pathB: string): boolean {
	return jetpack.path(pathA) === jetpack.path(pathB);
}

export function swapSync(pathA: string, pathB: string, options?: SwapOptions): void {
	checkValidCall(pathA, pathB, options);
	if (samePath(pathA, pathB)) {
		return;
	}

	const temp = getTempPath(pathA);
	jetpack.move(pathA, temp);
	jetpack.move(pathB, pathA);
	jetpack.move(temp, pathB);
}

export async function swapAsync(pathA: string, pathB: string, options?: SwapOptions): Promise<void> {
	checkValidCall(pathA, pathB, options);
	if (samePath(pathA, pathB)) {
		return;
	}

	const temp = getTempPath(pathA);
	await jetpack.moveAsync(pathA, temp);
	await jetpack.moveAsync(pathB, pathA);
	await jetpack.moveAsync(temp, pathB);
}
