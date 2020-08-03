import test from 'ava';
import swap = require('../source');
import { FSJetpack } from 'fs-jetpack/types';
import { getTempFixturesCopy, attemptRemove } from './helpers';

test.beforeEach(async t => {
	t.context = {
		fixtures: await getTempFixturesCopy()
	};
});

function getFixtures(t: any): FSJetpack {
	return t.context.fixtures;
}

test.afterEach.always(t => {
	attemptRemove(getFixtures(t));
});

async function swapChecking(
	fixtures: FSJetpack,
	pathA: string,
	pathB: string,
	checker: () => void | Promise<void>
): Promise<void> {
	pathA = fixtures.path(pathA);
	pathB = fixtures.path(pathB);

	// Async
	await swap(pathA, pathB);
	await checker();
	await swap(pathA, pathB);

	// Async with option
	await swap(pathA, pathB, { crossDevice: false });
	await checker();
	await swap(pathA, pathB, { crossDevice: false });

	// Sync
	swap.sync(pathA, pathB);
	await checker();
	swap.sync(pathA, pathB);

	// Sync with option
	swap.sync(pathA, pathB, { crossDevice: false });
	await checker();
	swap.sync(pathA, pathB, { crossDevice: false });
}

test('does nothing with identical paths', async t => {
	const fixtures = getFixtures(t);
	await swap(
		fixtures.path('baz/baz.txt'),
		fixtures.path('baz') + '/../baz//baz.txt'
	);
	t.is(fixtures.read('baz/baz.txt'), 'Baz\n');
});

test('swaps two files', async t => {
	const fixtures = getFixtures(t);
	await swapChecking(fixtures, 'foo.txt', 'bar.txt', () => {
		t.is(fixtures.read('foo.txt'), 'Bar\n');
		t.is(fixtures.read('bar.txt'), 'Foo\n');
	});
});

test('swaps two folders', async t => {
	const fixtures = getFixtures(t);
	await swapChecking(fixtures, 'baz', 'qux', () => {
		t.is(fixtures.read('baz/qux.txt'), 'Qux\n');
		t.is(fixtures.read('qux/baz.txt'), 'Baz\n');
	});
});

test('swaps file and folder', async t => {
	const fixtures = getFixtures(t);
	await swapChecking(fixtures, 'foo.txt', 'baz', () => {
		t.is(fixtures.read('baz'), 'Foo\n');
		t.is(fixtures.read('foo.txt/baz.txt'), 'Baz\n');
	});
});

test('refuses to swap when path does not exist', async t => {
	const fixtures = getFixtures(t);
	await t.throwsAsync(async () => {
		await swap(fixtures.path('does-not-exist'), fixtures.path('foo.txt'));
	});
	await t.throwsAsync(async () => {
		await swap(fixtures.path('foo.txt'), fixtures.path('does-not-exist'));
	});
	await t.throwsAsync(async () => {
		await swap(fixtures.path('does-not-exist-1'), fixtures.path('does-not-exist-2'));
	});
});
