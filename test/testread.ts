import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.cai');
var act = CombinedActorInfo.FromArrayBuffer(data.buffer);
console.log(act.ToJson(true));
