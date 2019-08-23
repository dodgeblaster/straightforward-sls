export const getSingleDynamoEvent = event => event.Records[0].dynamodb.NewImage
export const getDynamoEventType = event => event.Records[0].eventName
