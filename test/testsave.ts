import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

const [, , ...args] = process.argv;
var path = args[0];
var index = args[1];

var data = fs.readFileSync(path);
var act = CombinedActorInfo.FromSaveFileArrayBuffer(data.buffer, Number(index));
console.log(CombinedActorInfo.ToJson(act, true));
