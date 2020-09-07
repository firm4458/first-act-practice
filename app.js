const express = require('express');
const app = express()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('OK')
})

tasks = [{
    id : 0, // server generated
    name : 'clean the room',
    description : '',
    done : false,
}]

cur_id = 1

app.get('/tasks', (req, res) => {
    var result = tasks
    const qname = req.query.name
    const qdescription = req.query.description
    const qdone = req.query.done && (req.query.done.toLowerCase() === 'true' ? true : false)
    if(qname != null || qdescription != null || qdone != null){
        result = result.filter(task=>{
            if(qname!=null && qname!=task.name) return false
            if(qdescription!=null && qdescription!=task.description) return false
            if(qdone!=null && qdone!=task.done) return false
            return true
        })
    }
    res.send(result)
})

app.get('/tasks/:id', (req, res) => {
    const id = +req.params.id
    const result = tasks.find(task => task.id === id)
    if (result) res.send(result)
    else res.status(404).send('task with specified id not found')
})

app.post('/tasks', (req, res) => {
    const name = req.body.name ||  'untitled task'
    const description = req.body.description || ''
    const done = req.body.done == null ? false : req.body.done
    tasks.push({
        id: cur_id++,
        name,
        description,
        done,
    })
    res.send('OK')
})

app.put('/tasks/:id', (req, res) => {
    const id = +req.params.id
    const result = tasks.find(task => task.id === id)
    if(!result) res.status(404).send('task with specified id not found')
    result.name = req.body.name || result.name
    result.description = req.body.description || result.description
    result.done = req.body.done == null ? result.done : req.body.done
    res.send('OK')
})

app.delete('/tasks/:id', (req,res)=> {
    const id = +req.params.id
    for(var i=0;i<tasks.length;++i){
        const task = tasks[i]
        if(task.id===id){
            tasks.splice(i,1)
            res.send('OK')
        }
    }
    res.status(404).send('task with specified id not found')
})

app.delete('/tasks', (req,res)=> {
    const qname = req.query.name
    const qdescription = req.query.description
    const qdone = req.query.done && (req.query.done.toLowerCase() === 'true' ? true : false)
    if(qname != null || qdescription != null || qdone != null){
        tasks = tasks.filter(task=>{
            if(qname!=null && qname!=task.name) return true
            if(qdescription!=null && qdescription!=task.description) return true
            if(qdone!=null && qdone!=task.done) return true
            return false
        })
    }
    res.send('OK')
})

app.listen(3000, () => {
    console.log('App opened on port 3000')
})