// import dynamo from './utils/dynamo'
import {
    makeArchive,
    makeCreate,
    makeGet,
    makeQuery,
    makeUpdate
} from './utils'

const formatOut = x => ({
    id: x.SK,
    memberId: x.PK,
    type: x.type,
    targetId: x.GSI1,
    role: x.role
})

const formatIn = x => ({
    PK: x.memberId,
    SK: x.accountId,
    type: x.type,
    GSI1: x.targetId,
    role: x.role
})

const table = `my-table`

// io = aws.DynamoDB.DocumentClient({
// region: process.env.REGION
//         })

export default io => ({
    getMembersAccounts: async data => {
        const def = {
            table,
            name: 'getMembersAccounts',
            schema: {
                memberId: 'string'
            },

            db: {
                method: 'querySkBeginsWith',
                PK: x => x.memberId,
                SK: () => 'account'
            },

            format: {
                out: formatOut
            }
        }

        return await makeQuery(def)(io)(data)
    },

    getOrgsAccounts: async data => {
        const def = {
            table,
            name: 'getOrgsAccounts',
            schema: {
                orgId: 'string'
            },

            db: {
                method: 'queryOnGSI1AndSk',
                GSI1: x => x.orgId,
                SK: () => 'account'
            },

            format: {
                out: formatOut
            }
        }

        return await makeQuery(def)(io)(data)
    },

    getAccount: async data => {
        const def = {
            table,
            name: 'getAccount',
            schema: {
                memberId: 'string',
                accountId: 'string'
            },
            db: {
                PK: x => x.memberId,
                SK: x => x.accountId
            },
            format: {
                out: formatOut
            }
        }
        return await makeGet(def)(io)(data)
    },

    createAccount: async data => {
        const def = {
            table,
            name: 'createAccount',
            schema: {
                memberId: 'string',
                accountId: 'string',
                type: 'string',
                targetId: 'string',
                role: 'string'
            },

            format: {
                in: formatIn,
                out: formatOut
            }
        }
        return await makeCreate(def)(io)(data)
    },

    updateAccount: async data => {
        const def = {
            table,
            name: 'updateAccount',
            schema: {
                memberId: 'string',
                accountId: 'string',
                type: 'string',
                targetId: 'string',
                role: 'string'
            },

            format: {
                in: formatIn,
                out: formatOut
            }
        }
        return await makeUpdate(def)(io)(data)
    },

    archiveAccount: async data => {
        const def = {
            table,
            name: 'archiveAccount',
            schema: {
                memberId: 'string',
                accountId: 'string'
            },
            db: {
                get: {
                    PK: x => x.memberId,
                    SK: x => x.accountId
                },
                remove: {
                    PK: x => x.memberId,
                    SK: x => x.accountId
                }
            },
            format: {
                out: formatOut
            }
        }

        return await makeArchive(def)(io)(data)
    }
})
