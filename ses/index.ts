import * as aws from 'aws-sdk'
const region = process.env.REGION || 'us-east-1'

export default {
    email: async ({ body, cc, to, title, from }) => {
        var params = {
            Destination: {
                CcAddresses: cc,
                ToAddresses: to
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `<p>${body}</p>`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: title
                }
            },
            Source: from,
            ReplyToAddresses: [from]
        }

        var sendPromise = new aws.SES({
            apiVersion: '2010-12-01',
            region: region || 'us-east-1'
        })
            .sendEmail(params)
            .promise()

        return sendPromise
            .then(function(data) {
                console.log(data.MessageId)
            })
            .catch(function(err) {
                console.error(err, err.stack)
            })
    }
}
