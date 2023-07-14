# combined-actor-info

** Parses Zelda TotK cai/autobuild files **

Ability to create coming soon

** Example **

```js
    import { CombinedActorInfo } from 'combined-actor-info';
    import fs from 'fs/promises';

    var data = await fs.readFile('autobuild.cai');
    var entry = await CombinedActorInfo.FromArrayBuffer(data.buffer);
    console.log(JSON.stringify(entry, null, 4));
```
