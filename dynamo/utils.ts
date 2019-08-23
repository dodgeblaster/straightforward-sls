import dynamo from './dynamo'

export const validate = ({ name, schema, data }) => {
    let invalid = 0

    Object.keys(schema).forEach(x => {
        if (!data[x] || typeof data[x] !== schema[x]) {
            invalid++
        }
    })

    if (invalid > 0) {
        throw new Error('The input was not valid for ' + name)
    }
}

export const makeQuery = def => {
    if (def.db.method === 'querySkBeginsWith') {
        return io => async data => {
            validate({
                name: def.name,
                schema: def.schema,
                data
            })
            const x = await dynamo.querySkBeginsWith(io.dynamoDb, def.table, {
                PK: def.db.PK(data),
                SK: def.db.SK(data)
            })

            return x.map(def.format.out)
        }
    }

    if (def.db.method === 'queryOnGSI1AndSk') {
        return io => async data => {
            validate({
                name: def.name,
                schema: def.schema,
                data
            })
            const x = await dynamo.queryOnGSI1AndSk(io.dynamoDb, def.table, {
                GSI1: def.db.GSI1(data),
                SK: def.db.SK(data)
            })

            return x.map(def.format.out)
        }
    }
}

export const makeScan = def => {
    return io => async () => {
        const x = await dynamo.scan(io.dynamoDb, def.table)

        if (def.filer) {
            return x.filter(def.filter).map(def.format.out)
        }
        return x.map(def.format.out)
    }
}

export const makeGet = def => {
    return io => async data => {
        validate({
            name: def.name,
            schema: def.schema,
            data
        })

        const x = await dynamo.get(io.dynamoDb, def.table, {
            PK: def.db.PK(data),
            SK: def.db.SK(data)
        })

        if (!x) {
            throw new Error('Item does not exist')
        }

        return def.format.out(x)
    }
}

export const makeCreate = def => {
    return io => async data => {
        validate({
            name: def.name,
            schema: def.schema,
            data
        })

        const dataToSave = def.format.in(data)
        const x = await dynamo.put(io.dynamoDb, def.table, dataToSave)

        return def.format.out(dataToSave)
    }
}

export const makeUpdate = def => {
    return io => async data => {
        validate({
            name: def.name,
            schema: def.schema,
            data
        })

        const dataToSave = def.format.in(data)
        await dynamo.put(io.dynamoDb, def.table, dataToSave)
        return def.format.out(dataToSave)
    }
}

export const makeUpdateAlreadyExisting = def => {
    return io => async data => {
        validate({
            name: def.name,
            schema: def.schema,
            data
        })

        const keys = {
            PK: def.db.keys.PK(data),
            SK: def.db.keys.SK(data)
        }

        await dynamo.updateAlreadyExisting(
            io.dynamoDb,
            def.table,
            keys,
            def.db.data
        )
        return def.format.out(data)
    }
}

export const makeArchive = def => {
    return io => async data => {
        validate({
            name: def.name,
            schema: def.schema,
            data
        })

        const x = await dynamo.get(io.dynamoDb, def.table, {
            PK: def.db.get.PK(data),
            SK: def.db.get.SK(data)
        })

        if (!x) {
            throw new Error('Item does not exist')
        }

        await dynamo.remove(io.dynamoDb, def.table, {
            PK: def.db.remove.PK(data),
            SK: def.db.remove.SK(data)
        })
        return def.format.out(x)
    }
}
