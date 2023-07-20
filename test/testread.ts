import fs from 'fs';
import { CombinedActorInfo } from '../src/index';
const [, , ...args] = process.argv;

var path = args[0];
var pathOut = args[1];

var data = fs.readFileSync(path);
var cbi = CombinedActorInfo.FromArrayBuffer(data.buffer);

console.log(CombinedActorInfo.ToJson(cbi, true));
fs.writeFileSync(pathOut, CombinedActorInfo.ToJson(cbi, true));
