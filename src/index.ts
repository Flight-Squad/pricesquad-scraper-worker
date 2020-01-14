import * as AwsConfig from 'config/aws';
import logger from 'config/winston';
import express from 'express';
import { Consumer } from 'sqs-consumer';
import { onMessage } from './onMessage';
import { SQSMessage } from 'config/aws';

// https://github.com/bbc/sqs-consumer
const app = Consumer.create({
    queueUrl: AwsConfig.QueueUrl,
    region: AwsConfig.Region,
    handleMessageBatch: async (messages: SQSMessage[]) => {
        for (const message of messages) {
            await onMessage(message);
        }
    },
    batchSize: 10,
    pollingWaitTimeMs: 500,
    visibilityTimeout: 100,
});

app.on('stopped', () => {
    app.start();
});

app.on('empty', () => {
    logger.info('Queue is Empty, All messages have been processed');
});
app.on('error', err => {
    console.error(err);
});

app.on('processing_error', err => {
    logger.error(err.message);
});

logger.info('Starting app...');
app.start();

// Fix err conn refused on port 80
const expressApp = express();

expressApp.get('/', (req, res) => res.send('hi'));
expressApp.post('/', (req, res) => res.send(201));

expressApp.listen(80 || process.env.PORT);
