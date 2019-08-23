import sns, { snsInput } from './index'

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
    await sns.emit(example)
}
