import fs = require('fs');
import jetpack = require('fs-jetpack');
import { getTempPath } from './temp-path';

export function isCrossDevice(pathA: string, pathB: string): boolean {
	const tempA = getTempPath(pathA);
	const tempB = getTempPath(pathB);
	jetpack.write(tempA, '');

	try {
		fs.renameSync(tempA, tempB);
	} catch (error) {
		try {
			jetpack.remove(tempA);
		} catch {}

		if (error.code === 'EXDEV') {
			return true;
		}

		throw error;
	}

	try {
		jetpack.remove(tempB);
	} catch {}

	return false;
}
