// const core = require('@actions/core');
import { getInput, setFailed } from "@actions/core";
// const github = require('@actions/github');
import { fromEnv } from "@aws-sdk/credential-providers";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

try {
    const TOPIC_ARN = getInput("TOPIC_ARN") || process.env.TOPIC_ARN;
    let snsClient = new SNSClient({ credentials: fromEnv() });
    if (TOPIC_ARN == undefined) {
        throw new Error('No TOPIC_ARN defined as input or environment');
    }
    let message = `{
"Repository": ${process.env.GITHUB_REPOSITORY},
"Branch": ${process.env.GITHUB_REF}
"URL": https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}
"Message": ${getInput("MESSAGE") || 'Testing'}}`;
    const response = await snsClient.send(
        new PublishCommand( {
            TopicArn: TOPIC_ARN,
            Message: message
        }),
    );
    console.log(response);
} catch (error) {
    setFailed(error.message);
}
