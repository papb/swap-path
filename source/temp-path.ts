import jetpack = require('fs-jetpack');

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomString(length: number): string {
	return [...new Array(length)].map(() => {
		return alphabet[Math.floor(Math.random() * alphabet.length)];
	}).join('');
}

export function getTempPath(path: string): string {
	return `${jetpack.path(path)}.tmp-${randomString(8)}`;
}
