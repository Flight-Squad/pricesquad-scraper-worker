import "module-alias/register"; // Register absolute import paths
// import 'api/index'
import * as AwsConfig from "config/aws";
import * as SQS from "aws-sdk/clients/sqs";
import { scrape } from "scrape";
import logger from "config/winston";
import axios from 'axios';
import { PRICESQUAD_API } from "config/pricesquad.api";
type SQSMessage = SQS.Types.Message;

const { Consumer } = require("sqs-consumer");

const app = Consumer.create({
  queueUrl: AwsConfig.QueueUrl,
  region: AwsConfig.Region,
  handleMessageBatch: async (messages: SQSMessage[]) => {
    for (let message of messages) {
      const data = JSON.parse(message.Body);

      // Commented out because this can/should be handled more succinctly and scalably
      // if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development') {
        logger.debug(`Received Request ${data.params.requestId}`);
      // }

      try {
        const res = await scrape(data);
        const postUrl = `${PRICESQUAD_API}/tripRequest`;
        const postBody = {
          provider: data.provider,
          results: res,
          requestId: data.params.requestId,
        };
        await axios.post(postUrl, postBody);

        logger.info(JSON.stringify({requestId: data.params.requestId, res: res,}));
      } catch (e) {
        logger.error(e.message);
      }
    } // end for-loop
  } // end handleMessageBatch
});

app.on("error", err => {
  logger.error(err.message);
});

app.on("processing_error", err => {
  logger.error(err.message);
});

logger.info('Starting app...')
app.start();
