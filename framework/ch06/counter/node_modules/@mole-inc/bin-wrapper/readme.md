# bin-wrapper [![Node CI](https://github.com/mole-inc/bin-wrapper/actions/workflows/nodejs.yml/badge.svg)](https://github.com/mole-inc/bin-wrapper/actions/workflows/nodejs.yml)

> Binary wrapper that makes your programs seamlessly available as local dependencies

[![Downloads](https://badgen.net/npm/dm/@mole-inc/bin-wrapper)](https://www.npmjs.com/package/@mole-inc/bin-wrapper)
[![Version](https://badgen.net/npm/v/@mole-inc/bin-wrapper)](https://www.npmjs.com/package/@mole-inc/bin-wrapper)
[![codecov](https://codecov.io/gh/mole-inc/bin-wrapper/branch/master/graph/badge.svg)](https://codecov.io/gh/mole-inc/bin-wrapper)

## Install

```
$ npm install @mole-inc/bin-wrapper
```


## Usage

```js
import {BinWrapper} from '@mole-inc/bin-wrapper';

const base = 'https://github.com/imagemin/gifsicle-bin/raw/master/vendor';
const bin = new BinWrapper()
	.src(`${base}/macos/gifsicle`, 'darwin')
	.src(`${base}/linux/x64/gifsicle`, 'linux', 'x64')
	.src(`${base}/win/x64/gifsicle.exe`, 'win32', 'x64')
	.dest(path.join('vendor'))
	.use(process.platform === 'win32' ? 'gifsicle.exe' : 'gifsicle')
	.version('>=1.71');

(async () => {
	await bin.run(['--version']);
	console.log('gifsicle is working');
})();
```

Get the path to your binary with `bin.path`:

```js
console.log(bin.path);
//=> 'path/to/vendor/gifsicle'
```

> if you have the requested binary installed globally, this one will be used instead (if everything works)

## API

### `new BinWrapper(options)`

Creates a new `BinWrapper` instance.

#### options

Type: `Object`

##### skipCheck

Type: `boolean`<br>
Default: `false`

Whether to skip the binary check or not.

##### filename

Type: `string`<br>
Default: `undefined`

Set the binary filename.

##### gotOptions

Type: `object`<br>
Default: `undefined`

Any of the [`https.request`](https://nodejs.org/api/https.html#https_https_request_options_callback) options.

https://github.com/sindresorhus/got/tree/v11#options

### .src(url, [os], [arch])

Adds a source to download.

#### url

Type: `string`

Accepts a URL pointing to a file to download.

#### os

Type: `string`

Tie the source to a specific OS.

#### arch

Type: `string`

Tie the source to a specific arch.

### .dest(destination)

#### destination

Type: `string`

Accepts a path which the files will be downloaded to.

### .use(binary)

#### binary

Type: `string`

Define which file to use as the binary.

### .path

Returns the full path to your binary.

### .version(range)

#### range

Type: `string`

Define a [semver range](https://github.com/isaacs/node-semver#ranges) to check
the binary against.

### .run([arguments])

Runs the search for the binary. If no binary is found it will download the file
using the URL provided in `.src()`.

#### arguments

Type: `Array`<br>
Default: `['--version']`

Command to run the binary with. If it exits with code `0` it means that the
binary is working.


## License

This is a fork of [kevva/bin-wrapper](https://github.com/kevva/bin-wrapper).

see LICENSE file.
