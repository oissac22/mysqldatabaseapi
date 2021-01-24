import axios from 'axios'
import { OkPacket } from 'mysql'


const TMP_DATABASE = 'tmpDatabaseTest'


const api = axios.create({
    baseURL:'http://localhost'
})



describe(`test`, () => {
    
    it(`test url`, async () => {
        const result = await api.get(`/test`)
        expect(result).toHaveProperty('data')
        expect(result.data).toHaveProperty('ok', true)
        expect(result.data).toHaveProperty('return', 'api mysql server ok')
        expect(result.data).toHaveProperty('testSql')
    })



    it(`database list`, async () => {
        const result = await api.get(`/`)
        expect(result).toHaveProperty('data')
        expect(result.data).toHaveProperty('ok', true)
        expect(result.data).toHaveProperty('data')
        var data:{Database:string}[] = result.data.data;
        expect(data).toHaveProperty('length')
        expect(data.find( line => line.Database === 'mysql' )).toHaveProperty('Database','mysql')
    })



    it(`create new database`, async () => {
        const result = await api.post(`/newdatabase`, {database:TMP_DATABASE})
        expect(result).toHaveProperty('data')
        expect(result.data).toHaveProperty('ok', true)
        var data:OkPacket = result.data.data;
        expect(data).toHaveProperty('affectedRows',1)
    })



    it(`select query test`, async () => {
        const result = await api.post(`/${TMP_DATABASE}`, {sql:'select now() now'})
        expect(result).toHaveProperty('data')
        expect(result.data).toHaveProperty('ok', true)
        var data:{now:string}[] = result.data.data;
        expect(data).toHaveProperty('length')
        expect(data.find( line => true )).toHaveProperty('now')
    })

    

    it(`delete new database`, async () => {
        const result = await api.delete(`/${TMP_DATABASE}`)
        expect(result).toHaveProperty('data')
        expect(result.data).toHaveProperty('ok', true)
        var data:OkPacket = result.data.data;
        expect(data).toHaveProperty('affectedRows')
    })

    it(`new backup all databases`, async () => {
        const result = await api.get(`/backup`)
        expect(result).toHaveProperty('status',200)
    })

    it(`new backup mysql databases`, async () => {
        const result = await api.get(`/backup/mysql`)
        expect(result).toHaveProperty('status',200)
    })

    it(`new backup mysql databases, func table`, async () => {
        const result = await api.get(`/backup/mysql/func`)
        expect(result).toHaveProperty('status',200)
    })

})