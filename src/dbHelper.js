import pg from 'pg';
import CONFIG from './config';
const { Pool } = pg;
export const getPool = () => {
    const connectionString = 'postgres://atul:LpgrdrMtmTh3chBkNhNV9DgAhSiZ2Smg@dpg-cg719jg2qv28u2r3qvp0-a.oregon-postgres.render.com/whatsapp_clone?sslmode=no-verify'
    const pool = new Pool({ connectionString });
    return pool;
}

export const tranExecute = async (client, query) => {
    try {
        const { rows } = await client.query(query);
        return Promise.resolve(rows)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const tranExecuteOne = async (client, query) => {
    try {
        const { rows } = await client.query(query);
        return Promise.resolve(rows.length > 0 ? rows[0] : null)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const tranInsert = async (client, schemaName, tableName, param) => {
    try {
        let paramKeys = Object.keys(param);
        const text = `
        INSERT INTO "${schemaName}"."${tableName}"
        ("${paramKeys.join('", "')}") 
        VALUES
        (${paramKeys.map((i, ind) => `$${ind + 1}`).join(', ')})
        RETURNING *`;
        const values = paramKeys.map(i => param[i])
        const { rows } = await client.query(text, values);
        return Promise.resolve(rows[0]);
    } catch (error) {
        return Promise.reject(error)
    }
}

export const execute = async (query) => {
    const pool = getPool();
    try {
        const { rows } = await pool.query(query);
        return Promise.resolve(rows)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const    executeOne = async (query) => {
    const pool = getPool();
    try {
        const { rows } = await pool.query(query);
        return Promise.resolve(rows.length > 0 ? rows[0] : null)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const findOne = async (schemaName, tableName, query) => {
    const pool = getPool();
    try {
        let cond = [];
        for (let [key, value] of Object.entries(query)) {
            cond.push(`${schemaName}."${tableName}"."${key}" = '${value}'`)
        }
        const q = `SELECT * FROM ${schemaName}."${tableName}" WHERE ${cond.join(' OR ')}`
        const { rows } = await pool.query(q);
        return Promise.resolve(rows.length > 0 ? rows[0] : null)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const findById = async (schemaName, tableName, query, returnType) => {
    const pool = getPool();
    try {
        let cond = [];
        for (let [key, value] of Object.entries(query)) {
            cond.push(`${schemaName}."${tableName}"."${key}" = '${value}'`)
        }
        const q = `SELECT * FROM ${schemaName}."${tableName}" WHERE ${cond.join()}`

        const { rows } = await pool.query(q);
        return Promise.resolve(rows.length > 0 ? (returnType == 'Array' ? rows : rows[0]) : (returnType == 'Array' ? rows : null))
    } catch (error) {
        return Promise.reject(error);
    }
}

export const find = async (schemaName, tableName) => {
    const pool = getPool();
    try {
        const query = `SELECT * FROM ${schemaName}."${tableName}" `
        const { rows } = await pool.query(query);
        return Promise.resolve(rows)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const insert = async (schemaName, tableName, param) => {
    const pool = getPool();
    try {
        await pool.connect();

        let paramKeys = Object.keys(param);
        const text = `
        INSERT INTO "${schemaName}"."${tableName}"
        ("${paramKeys.join('", "')}") 
        VALUES
        (${paramKeys.map((i, ind) => `$${ind + 1}`).join(', ')})
        RETURNING *`;
        const values = paramKeys.map(i => param[i])

        const { rows } = await pool.query(text, values);
        return Promise.resolve(rows[0]);
    } catch (error) {
        return Promise.reject(error)
    }
}

export const insertMany = async (schemaName, tableName, param) => {
    const pool = getPool();
    try {
        let itemKeys = Object.keys(param[0])
        let query = "INSERT INTO " + schemaName + '.' + "\"" + tableName + "\"" + " (" + "\"" + itemKeys.join('","') + "\"" + ") VALUES ";//( '" + itemValues.join("', '") + "' ) ";
        for (let obj of param) {
            let itemValues = []
            itemKeys.forEach(function (item) {
                let val = obj[item]
                if (val) {
                    val = val.toString()
                    val = val.replace(/'/g, "''")
                }

                itemValues.push(val);
            });
            query += " (\'" + itemValues.join('\',\'') + "\'),"
        }
        query = query.slice(0, -1)
        const { rowCount } = await pool.query(query);
        return Promise.resolve(rowCount)
    } catch (error) {
        return Promise.reject(error);
    }
}

export const update = async (schemaName, tableName, queryParam, updateParam) => {
    const pool = getPool();
    try {
        let queryKeys = Object.keys(queryParam);
        let updateKeys = Object.keys(updateParam);

        let tableToUpdate = [];
        let colTOUpdate = [];
        let colToQuery = [];
        tableToUpdate.push(`UPDATE "${schemaName}"."${tableName}" SET`);

        updateKeys.map((item, index) => {
            const value = updateParam[item];
            const isNull = value === null || value === undefined || value.length === 0;
            const isString = typeof value === 'string';
            const q = `"${item}"=${isNull ? null : `'${isString ? value.replace(/'/g, "''") : value}'`}`;
            colTOUpdate.push(q);
        });

        queryKeys.map((item, index) => {
            const isNull = item === null;
            const q = `"${item}"=${isNull ? null : `'${queryParam[item]}'`}`;
            colToQuery.push(q);
        });

        const query = tableToUpdate.concat(colTOUpdate.join(', '), "where", colToQuery.join(' and '), "RETURNING *").join(" ");
        const { rows } = await pool.query(query);
        return Promise.resolve(rows[0]);
    } catch (error) {
        return Promise.reject(error)
    }
}