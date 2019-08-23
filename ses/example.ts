import ses from './index'

const example = {
    title: 'Example',
    to: ['johnsmith@gmail.com'],
    cc: [],
    from: 'johnsmith@gmail.com',
    body: 'html'
}

export const main = async () => {
    await ses.email(example)
}
