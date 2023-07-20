# combined-actor-info

** Parses Zelda TotK cai/autobuild files **

## Example

### Read

From CAI File
```js
import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.cai');
var act = CombinedActorInfo.FromArrayBuffer(data.buffer);
console.log(act.ToJson(true));
```

From Save File
```js
import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/progress.sav');
var act = CombinedActorInfo.FromSaveFileArrayBuffer(data.buffer, 1);
console.log(act.ToJson(true));
```

### Write

```js
import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.json');
var cbi = CombinedActorInfo.FromArrayBuffer(data.buffer);
var dataArray = CombinedActorInfo.ToArrayBuffer(cbi);
fs.writeFileSync('./test/testout.cai', new DataView(dataArray));
```


Special thanks to fuse_it_or_lose_it from The Hyrule Engineers Discord for doing a most of the testing grunt work.