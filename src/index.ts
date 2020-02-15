import { onMessage } from './onMessage';

const args = process.argv.slice(2);
console.log('Program Args:', args);

const query = JSON.parse(args[0]);
console.log('Query', query);

onMessage(query);
