import jetpack = require('fs-jetpack');
import { FSJetpack } from 'fs-jetpack/types';
import pkgDir = require('pkg-dir');
import tempy = require('tempy');

const rootDir = pkgDir.sync(__dirname)!;
const fixtures = jetpack.path(rootDir, 'test/fixtures');

export async function getTempFixturesCopy(): Promise<FSJetpack> {
	const dir = tempy.directory();
	await jetpack.copyAsync(fixtures, dir, { overwrite: true });
	return jetpack.cwd(dir);
}

export function attemptRemove(dir: FSJetpack): void {
	try {
		jetpack.remove(dir.cwd());
	} catch {}
}
