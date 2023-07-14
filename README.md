# combined-actor-info

** Parses Zelda TotK cai/autobuild files **

Ability to create coming soon

** Example **

```js
    import { CombinedActorInfo } from 'combined-actor-info';
    import fs from 'fs/promises';

    fs.readFile('C:\\Users\\Andy\\Desktop\\favorites plus working zero point flyer\\my_autobuilder_29.cai').then(data => {
        var entry = CombinedActorInfo.FromArrayBuffer(data.buffer);
        console.log(JSON.stringify(entry, null, 4));
    });
```
