# trim-repeated

> Trim a consecutively repeated substring: `foo--bar---baz` → `foo-bar-baz`

## Install

```
$ npm install trim-repeated
```

## Usage

```js
import trimRepeated from 'trim-repeated';

trimRepeated('foo--bar---baz', '-');
//=> 'foo-bar-baz'

trimRepeated('foo@#@#baz', '@#');
//=> 'foo@#baz'
```

### trimRepeated(input, target)

#### input

*Required*\
Type: `string`

#### target

*Required*\
Type: `string`

Substring to trim.

## Related

- [`condense-whitespace`](https://github.com/sindresorhus/condense-whitespace) - Remove leading, trailing and repeated whitespace from a string
