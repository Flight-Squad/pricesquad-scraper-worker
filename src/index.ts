import * as AwsConfig from "config/aws";
import * as SQS from "aws-sdk/clients/sqs";
import { scrape } from "scrape";
import logger from "config/winston";
import axios from "axios";
import { PRICESQUAD_API } from "config/pricesquad.api";
import express from "express";

type SQSMessage = SQS.Types.Message;

//can comment out all of these for testing and create a script and some dummy data for testing.
const { Consumer } = require("sqs-consumer");

// https://github.com/bbc/sqs-consumer
const app = Consumer.create({
  queueUrl: AwsConfig.QueueUrl,
  region: AwsConfig.Region,
  handleMessageBatch: async (messages: SQSMessage[]) => {
    for (let message of messages) {
      await handleMessage(message);
    }
  },
  batchSize: 10,
  pollingWaitTimeMs: 500,
  visibilityTimeout: 100
});

app.on("stopped", () => {
  app.start();
});

app.on("empty", () => {
  logger.info("Queue is Empty, All messages have been processed");
});
app.on("error", err => {
  console.error(err);
});

app.on("processing_error", err => {
  logger.error(err.message);
});

logger.info("Starting app...");
app.start();

async function handleMessage(message: SQSMessage) {
  // FIXME: IMessageBody is out of date
  // FIXME: Message Chain code smell
  const data = JSON.parse(message.Body);
  const { tripId, sessionId, provider, docPath, params } = data;
  const requestId = {tripId, sessionId, provider, docPath};

  // Commented out because this can/should be handled more succinctly and scalably
  // if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development') {
  logger.debug('Received Request', requestId);
  // }

  try {
    const res = await scrape(data);
    const postUrl = `${PRICESQUAD_API}/tripRequest`;
    const postBody = {
      results: res,
      provider,
      tripId,
      sessionId,
      docPath,
      tripQuery: params,
    };

    await axios.post(postUrl, postBody);
    logger.info('Processed Request', requestId);
    // logger.info(JSON.stringify({requestId: data.params.requestId, res: res,}));
  } catch (e) {
    logger.error(e.message);
  }
}

// Fix err conn refused on port 80
const expressApp = express();

expressApp.get("/", (req, res) => res.send("hi"));
expressApp.post("/", (req, res) => res.send(201));

expressApp.listen(80);
