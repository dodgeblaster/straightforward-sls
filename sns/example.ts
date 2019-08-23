import * as aws from 'aws-sdk'
import sns, { snsInput } from './index'

const config = {
    aws,
    region: 'us-east-2'
}

const example = {
    event: 'USER_CREATED',
    data: {
        id: '1234',
        name: 'John'
    }
}

export const receiveAnEventAndEmit = async event => {
    // receive
    const data = snsInput(event)

    // emit
    await sns(config).emit(example)
}
