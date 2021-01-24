import mysql from 'mysql'



export interface InewConnection{
    database:string,
    host?:string,
    user?:string,
    password?:string,
    charset?:string,
    port?:number,
    timezone?:string
}

export const newConnection = ({
    database,
    host=process.env.MYSQL_ROOT_HOST || 'localhost',
    user=process.env.MYSQL_USER || 'root',
    password=process.env.MYSQL_ROOT_PASSWORD || '18791120529',
    charset=process.env.MYSQL_CHARSET || 'utf8',
    port=(process.env.MYSQL_PORT || 10073) as number,
    timezone=process.env.MYSQL_TIMEZONE || 'local'
}:InewConnection) => {
    return mysql.createConnection({
        host,
        user,
        password,
        database,
        charset,
        port:parseInt(port as any),
        timezone
    })
}



export default async <DATA=any, RESULT=any>(database:string, sql:string, data?:DATA):Promise<RESULT> => {
    return new Promise( (res, rej) => {
        let connection = newConnection({ database })
        connection.connect( err => {
            if(err){
                const error = {
                    error:err+'',
                    database,
                    sql,
                    data
                };
                return rej(error)
                console.error(error)
            }
            connection.query( sql, data, ( err, result ) => {
                connection.end()
                if(err){
                    const error = {
                        error:err+'',
                        database,
                        sql,
                        data
                    };
                    return rej(error)
                    console.error(error)
                }
                res(result)
            } )
        } )
    } )
}