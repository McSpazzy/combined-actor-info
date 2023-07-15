import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('./test/test.json');
var cbi = CombinedActorInfo.FromArrayBuffer(data.buffer);
var dataArray = CombinedActorInfo.ToArrayBuffer(cbi);
fs.writeFileSync('./test/testout.cai', new DataView(dataArray));
