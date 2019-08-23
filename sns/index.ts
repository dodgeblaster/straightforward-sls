import * as aws from 'aws-sdk'
const region = process.env.REGION || 'us-east-1'

export const snsInput = e => {
    const snsMessage = e.Records[0].Sns
    const data = JSON.parse(snsMessage.Message)
    return data
}
export default {
    emit: async ({ event, data }) => {
        const SNS = new aws.SNS({ region })

        const arn = await SNS.createTopic({ Name: event }).promise()

        return SNS.publish({
            Subject: event,
            Message: JSON.stringify(data),
            TopicArn: arn.TopicArn
        }).promise()
    }
}
