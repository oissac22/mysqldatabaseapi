require('dotenv').config()

import express from 'express'
import query from './mysql'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'



const api = express()


api.use(express.urlencoded({extended:false}))
api.use(express.json())


function randomName(){
    const uniqueRand = () => Math.trunc(Math.random() * 100000000)
    return uniqueRand() + uniqueRand() + uniqueRand() + uniqueRand() + uniqueRand();
}



api.all('/*', (req,res,next) => {
    const key = req.headers.accesskey
    console.log('req.headers :>> ', req.headers);
    console.log('key :>> ', key);
    console.log('atual :>> ', ( process.env.API_KEY || '48y1rj89787kr2318dfwpo8h4t9y45' ));
    if(key !== ( process.env.API_KEY || '48y1rj89787kr2318dfwpo8h4t9y45' ))
        return res.status(404).send('Página não encontrada')
    next()
})



api.get('/test', async (req,res) => {
    try{
        const result = await query('mysql','select now()')
        res.json({
            ok:true,
            return:'api mysql server ok',
            testSql:result
        })
    }catch(error){
        res.json({error})
    }
})



api.get('/', async (req,res) => {
    try{
        const result = await query('mysql','show databases')
        res.json({
            ok:true,
            data:result
        })
    }catch(error){
        res.json({error})
    }
})



api.get('/backup', async (req,res) => {
    const randName = randomName()
    const pathTmpFiles = path.join( __dirname, '..' )
    const sqlName = randName + '.sql'
    const zipName = randName + '.zip'
    exec(`mysqldump -P ${process.env.MYSQL_PORT || 10073} -u root -f -r "${sqlName}" -p${process.env.MYSQL_ROOT_PASSWORD || '18791120529'} --all-databases`, (error, stdout) => {
        exec(`zip ${zipName} ${sqlName}`, (err, stdout) => {
            fs.unlink(sqlName, (err) => console.error(err) )
            res.sendFile(path.join(pathTmpFiles, zipName), (err) => {
                fs.unlink( zipName , (err) => console.error(err) )
                if(err) console.log( err )
            })
        })
        
    })
})



api.get('/backup/:database', async (req,res) => {
    const {database} = req.params as {database:string}
    const randName = randomName()
    const pathTmpFiles = path.join( __dirname, '..' )
    const sqlName = randName + '.sql'
    const zipName = randName + '.zip'
    exec(`mysqldump -P ${process.env.MYSQL_PORT || 10073} -u root -f -r "${sqlName}" -p${process.env.MYSQL_ROOT_PASSWORD || '18791120529'} ${database}`, (error, stdout) => {
        exec(`zip ${zipName} ${sqlName}`, (err, stdout) => {
            fs.unlink(sqlName, (err) => console.error(err) )
            res.sendFile(path.join(pathTmpFiles, zipName), (err) => {
                fs.unlink( zipName , (err) => console.error(err) )
                if(err) console.log( err )
            })
        })
        
    })
})



api.get('/backup/:database/:table', async (req,res) => {
    const {database, table} = req.params as {database:string, table:string}
    const randName = randomName()
    const pathTmpFiles = path.join( __dirname, '..' )
    const sqlName = randName + '.sql'
    const zipName = randName + '.zip'
    exec(`mysqldump -P ${process.env.MYSQL_PORT || 10073} -u root -f -r "${sqlName}" -p${process.env.MYSQL_ROOT_PASSWORD || '18791120529'} ${database} ${table}`, (error, stdout) => {
        exec(`zip ${zipName} ${sqlName}`, (err, stdout) => {
            fs.unlink(sqlName, (err) => console.error(err) )
            res.sendFile(path.join(pathTmpFiles, zipName), (err) => {
                fs.unlink( zipName , (err) => console.error(err) )
                if(err) console.log( err )
            })
        })
        
    })
})



api.post('/newdatabase', async (req,res) => {
    try{
        const {database} = req.body as { database:string }
        if(!database) return res.json({error:`database property undefined`})
        const result = await query('',`create database ${database}`)
        res.json({
            ok:true,
            data:result
        })
    }catch(error){
        res.json({error})
    }
})



api.delete('/:database', async (req,res) => {
    try{
        const {database} = req.params as { database:string }
        const result = await query('',`drop database ${database}`)
        res.json({
            ok:true,
            data:result
        })
    }catch(error){
        res.json({error})
    }
})



api.post('/:database', async (req,res) => {
    try{
        const {database} = req.params as {database:string};
        const data = (req.body || {} ) as {[key:string]:any};
        const sql:string = data.sql;
        if(!sql) return res.send({error:`sql param undefined`})
        delete data.sql;
        const result = await query(database,sql,data)
        res.json({
            ok:true,
            data:result
        })
    }catch(error){
        res.json({error})
    }
})



api.all('/*', (req,res) => res.status(404).send('Página não encontrada') )



api.listen(80, () => console.log('run in port 80'))