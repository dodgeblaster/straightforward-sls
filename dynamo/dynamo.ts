export default {
    scan: async (db, TABLE) => {
        const params = {
            TableName: TABLE
        }

        const x = await db.scan(params).promise()
        return x.Items
    },

    get: async (db, TABLE, keys) => {
        const params = {
            TableName: TABLE,
            Key: keys
        }

        const x = await db.get(params).promise()
        return x.Item
    },

    put: async (db, TABLE, data) => {
        const params = {
            TableName: TABLE,
            Item: data
        }

        return await db.put(params).promise()
    },

    updateAlreadyExisting: async (db, TABLE, keys, toUpdate) => {
        const makeString = x =>
            Array.from({ length: x + 1 })
                .map(x => 'a')
                .join('')

        const ExpressionAttributeNames = Object.keys(toUpdate).reduce(
            (acc, x, i) => {
                const validKey = '#' + makeString(i)

                acc[validKey] = x

                return acc
            },
            {}
        )

        const ExpressionAttributeValues = Object.keys(toUpdate).reduce(
            (acc, x, i) => {
                const validKey = ':' + makeString(i)

                acc[validKey] = toUpdate[x]

                return acc
            },
            {}
        )

        const UpdateExpression = Object.keys(toUpdate).reduce((acc, x, i) => {
            const validKey = '#' + makeString(i)
            const validValue = ':' + makeString(i)
            const comma = i === 0 ? '' : ', '

            return acc + comma + validKey + ' = ' + validValue
        }, 'set ')

        const params = {
            TableName: TABLE,
            Key: keys,
            ConditionExpression: 'attribute_exists(PK)',
            UpdateExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            ReturnValues: 'ALL_NEW'
        }

        const x = await db.update(params).promise()
    },

    querySkBeginsWith: async (db, TABLE, keys) => {
        const params2 = {
            TableName: TABLE,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': keys.PK,
                ':sk': keys.SK
            }
        }

        const x2 = await db.query(params2).promise()
        return x2.Items
    },

    queryOnGSI1: async (db, TABLE, x) => {
        const params = {
            TableName: TABLE,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1 = :org_id',
            ExpressionAttributeValues: {
                ':org_id': x
            }
        }

        const r = await db.query(params).promise()

        return r.Items
    },

    queryOnGSI1AndSk: async (db, TABLE, x) => {
        const params = {
            TableName: TABLE,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1 = :org_id AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':org_id': x.GSI1,
                ':sk': x.SK
            }
        }

        const r = await db.query(params).promise()
        return r.Items
    },

    queryOnGSI2: async (db, TABLE, x) => {
        const params = {
            TableName: TABLE,
            IndexName: 'GSI2',
            KeyConditionExpression: 'GSI2 = :org_id',
            ExpressionAttributeValues: {
                ':org_id': x
            }
        }

        const r = await db.query(params).promise()
        return r.Items
    },

    remove: async (db, TABLE, keys) => {
        const params = {
            TableName: TABLE,
            Key: keys,
            ReturnValues: 'ALL_OLD'
        }

        return await db.delete(params).promise()
    }
}
