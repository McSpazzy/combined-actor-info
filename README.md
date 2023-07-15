# combined-actor-info

** Parses Zelda TotK cai/autobuild files **


## Example

### Read

```js
import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.cai');
var act = CombinedActorInfo.FromArrayBuffer(data.buffer);
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
