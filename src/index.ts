import { onMessage } from './onMessage';

enum ExitCodes {
    Success = 0,
    Failure = 1,
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    console.log('Program Args:', args);

    const query = JSON.parse(args[0]);
    console.log('Query', query);

    try {
        await onMessage(query);
        process.exit(ExitCodes.Success);
    } catch (e) {
        console.error(e.name);
        console.error(e.message);
        console.error(e.stack);
        process.exit(ExitCodes.Failure);
    }
}

main();
