import { onMessage } from './onMessage';

enum ExitCodes {
    Success = 0,
    Failure = 1,
}

async function main(): Promise<void> {
    try {
        const args = process.argv.slice(2);
        console.log('Program Args:', args);

        const query = JSON.parse(args[0]);
        console.log('Query', query);

        await onMessage(query);
        process.exit(ExitCodes.Success);
    } catch (e) {
        // See https://github.com/Flight-Squad/pricesquad-scraper-worker/issues/8
        // Use try-catch to force process to exit with non-zero code on uncaught exception
        console.error(e.name);
        console.error(e.message);
        console.error(e.stack);
        process.exit(ExitCodes.Failure);
    }
}

main();
