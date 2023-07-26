import fs from 'fs';
import { CombinedActorInfo, base64ToCai, caiToBase64 } from '../src/index';
const [, , ...args] = process.argv;


var path = args[0];

console.log('Reading', path);

(async () => {
    var data = fs.readFileSync(path);
    var cai = CombinedActorInfo.FromArrayBuffer(data.buffer);

    var base64 = await caiToBase64(cai);
    console.log(base64)

    if (base64) {
        base64ToCai(base64).then(a => {
            console.log(a)
        }).catch(e => {
            console.log(e)
        })
    }


})();
