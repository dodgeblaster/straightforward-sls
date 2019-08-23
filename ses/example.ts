import * as aws from 'aws-sdk'
import ses from './index'

const config = {
    aws,
    region: 'us-east-2'
}

const example = {
    title: 'Example',
    to: ['garysjenningsdr@gmail.com'],
    cc: [],
    from: 'garysjenningsdr@gmail.com',
    body: 'html'
}

export const main = async () => {
    await ses(config).email(example)
}
