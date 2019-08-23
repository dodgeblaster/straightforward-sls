const example = {
    title: 'Example',
    to: ['garysjenningsdr@gmail.com'],
    cc: [],
    from: 'garysjenningsdr@gmail.com',
    body: 'html'
}

export default config => ({
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

        var sendPromise = new config.aws.SES({
            apiVersion: '2010-12-01',
            region: config.region || 'us-east-1'
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
})
