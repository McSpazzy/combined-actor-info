import fs from 'fs';
import { CombinedActorInfo } from '../src/index';

var data = fs.readFileSync('test/progress.sav');
var act = CombinedActorInfo.FromSaveFileArrayBuffer(data.buffer, 1);
console.log(CombinedActorInfo.ToJson(act, true));
