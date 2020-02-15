import * as SQS from 'aws-sdk/clients/sqs';
export const Region = process.env.AWS_QUEUE_REGION;
export const QueueUrl = process.env.AWS_QUEUE;
export type SQSMessage = SQS.Types.Message;
