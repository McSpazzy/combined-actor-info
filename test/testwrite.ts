import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.json');
var cbi = CombinedActorInfo.FromArrayBuffer(data.buffer);

// console.log(CombinedActorInfo.ToJson(cbi, true));
var dataArray = CombinedActorInfo.ToArrayBuffer(cbi);
fs.writeFileSync('./test/testout.cai', new DataView(dataArray));

var act = CombinedActorInfo.FromArrayBuffer(dataArray);
console.log(CombinedActorInfo.ToJson(act, true));

