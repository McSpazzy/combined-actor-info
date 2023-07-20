import fs from 'fs';
import { CombinedActorInfo } from '../src/index';
const [, , ...args] = process.argv;

var path = args[0];
var pathOut = args[1];

var data = fs.readFileSync(path);
var cbi = CombinedActorInfo.FromArrayBuffer(data.buffer);

var dataArray = CombinedActorInfo.ToArrayBuffer(cbi);
fs.writeFileSync(pathOut, new DataView(dataArray));

var act = CombinedActorInfo.FromArrayBuffer(dataArray);
console.log(CombinedActorInfo.ToJson(act, true));
