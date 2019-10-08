import "module-alias/register"; // Register absolute import paths
// import 'api/index'
import * as AwsConfig from "config/aws";
import * as SQS from "aws-sdk/clients/sqs";
import { scrape } from "scrape";
import logger from "config/winston";
type SQSMessage = SQS.Types.Message;

const { Consumer } = require("sqs-consumer");

const app = Consumer.create({
  queueUrl: AwsConfig.QueueUrl,
  region: AwsConfig.Region,
  handleMessageBatch: async (messages: SQSMessage[]) => {
    for (let message of messages) {
      const data = JSON.parse(message.Body);
      // console.log(message);
      // console.log(data);

      try {
        const res = await scrape(data);
        logger.info(JSON.stringify(res));
      } catch (e) {
        logger.error(e.message);
      }
    }
  }
});

app.on("error", err => {
  logger.error(err.message);
});

app.on("processing_error", err => {
  logger.error(err.message);
});

logger.info('Starting app...')
app.start();
