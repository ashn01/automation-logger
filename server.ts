const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const testcases =require('./testcase.ts')

const http = require('http').createServer(app);

// db
const dbName = path.join(__dirname,"data","testdb.db")
const db = new sqlite3.Database(dbName, err=>{
    if(err){
        return console.error(err.message)
    }
    console.log("Successfully connected to database")
})

app.use(express.static(path.join(__dirname, 'build')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/init',(req,res)=>{
    console.log("init")
    db.serialize(()=>{
        db.run(`CREATE TABLE AUTOMATION(
            id integer primary key, 
            name text not null,
            c_status integer,
            c_version text,
            r_pass text,
            r_fail text
            )`,(err)=>{
                if(err){
                    return console.log(err)
                }
                console.log("table created")
            }) 
        testcases.testcases.map((n,k)=>{
            db.run(`INSERT INTO AUTOMATION(name) VALUES('${n.name}')`,(err)=>{
                if(err){
                    console.log(err)
                }
            })
        })
    })
    //db.close();
    res.send("hi");
})

app.get('/insert-all',(req,res)=>{
    testcases.testcases.map((n,k)=>{
        db.run(`INSERT INTO AUTOMATION(name) VALUES('${n.name}')`,(err)=>{
            if(err){
                res.send("something goes wrong"+err);
            }
            res.send("inserted default rows");
        })
    })
})

app.get('/delete-all',(req,res)=>{
    db.run('DELETE FROM AUTOMATION',(err)=>{
        if(err)
            res.send("something goes wrong"+err);
        res.send("deleted all rows");

    })
})

app.put('/add-result',(req,res)=>{
    console.log(req.body)
    let stmt = ""
    if(req.body.c_status == 1){
        stmt = `UPDATE AUTOMATION
                SET c_status = 1, c_version = '${req.body.c_version}', r_pass = '${req.body.c_version}'
                WHERE name = '${req.body.name}'`
    }else{
        stmt = `UPDATE AUTOMATION
                SET c_status = 0, c_version = '${req.body.c_version}', r_fail = '${req.body.c_version}'
                WHERE name = '${req.body.name}'`
    }

    db.run(stmt,(err)=>{
        if(err)
            console.log(err)
        console.log("updated")
    })
    res.sendStatus(201)
})

app.get('/all',(req,res)=>{
    db.all(`SELECT * FROM AUTOMATION`,(err,rows)=>{
        if(err)
        {
            console.log(err)
            res.send("Failed to load")
        }
        //console.log(rows)
        res.send(rows)
        
    })
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/build/index.html'))
})

http.listen(8080, ()=>{
    console.log('listening on 8080')


})
