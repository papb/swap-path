# swap-path ![Build Status](https://github.com/papb/swap-path/workflows/CI/badge.svg)

> Swap two files or folders.

## Highlights

* Written in TypeScript
* Cross-platform
* [Simple Promise-based API](https://github.com/papb/zip#api)


## Install

```
$ npm install swap-path
```


## Usage

Assume you have two files:

* `foo.txt` with content `Foo`
* `bar.txt` with content `Bar`

```js
const swap = require('swap-path');

(async () => {
	await swap('foo.txt', 'bar.txt');
})();
```

Result:

* `foo.txt` with content `Bar`
* `bar.txt` with content `Foo`

This is done very fast simply by renaming the files appropriately.

Also works with directories. You can also swap a file with a directory.


## TypeScript usage

`swap-path` is written in TypeScript and comes with complete type declarations. This means that you will have great code completions right in your editor, and also means that you can use it perfectly with TypeScript:

```ts
import swap = require('swap-path');
// ...
```


## API

### swap(pathA, pathB, options?)

### swap.sync(pathA, pathB, options?)

Swaps the two files/folders in `pathA` and `pathB` very quickly by renaming their paths in the filesystem. Throws an error if one of them does not exist (or both).

If both paths are identical (or resolve to the same path), nothing is done.

#### pathA and pathB

Type: `string`

They can each be absolute or relative to `process.cwd()`. In windows, either `/` or `\\` can be used as path separators.

#### options

Type: `object`

##### crossDevice

Type: `boolean`\
Default: `true`

Whether or not to allow swapping paths across different devices. This is relevant because swapping across devices is much slower, since a copy must be created. If `false` and the two given paths are on different devices, an `EXDEV` error will be thrown.


## License

MIT © [Pedro Augusto de Paula Barbosa](https://github.com/papb)
