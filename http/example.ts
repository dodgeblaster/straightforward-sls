import http from './index'

export const jsonResponse = async () => {
    return http.out({
        id: '1234',
        name: 'John'
    })
}

export const postInputAndJsonResponse = async event => {
    const data = http.in(event)

    // .. logic and db stuff

    return http.out({
        id: '1234',
        name: data.id
    })
}
