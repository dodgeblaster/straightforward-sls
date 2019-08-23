export const snsInput = e => {
    const snsMessage = e.Records[0].Sns
    const data = JSON.parse(snsMessage.Message)
    return data
}
export default config => ({
    emit: async ({ event, data }) => {
        const SNS = new config.aws.SNS({ region: config.region || 'us-east-1' })

        const arn = await SNS.createTopic({ Name: event }).promise()

        return SNS.publish({
            Subject: event,
            Message: JSON.stringify(data),
            TopicArn: arn.TopicArn
        }).promise()
    }
})
