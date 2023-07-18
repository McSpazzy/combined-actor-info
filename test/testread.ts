import fs from 'fs';
import { CombinedActorInfo } from '../src/index';
const [, , ...args] = process.argv;

var path = './test\\test.cai';

if (args[0] !== null) {
    path = args[0];
}

console.log(args[0], path);

var data = fs.readFileSync(path);
var act = CombinedActorInfo.FromArrayBuffer(data.buffer);
console.log(CombinedActorInfo.ToJson(act, true));
