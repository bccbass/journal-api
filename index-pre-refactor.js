import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'


const app = express()
const port = 4001

// Mongoose connect -> returns a promise
mongoose.connect('mongodb+srv://bccbass:mCRZIhDZzXgtKg89@cluster0.1u5lx7t.mongodb.net/journal?retryWrites=true&w=majority')
    .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed'))
    .catch(error => console.error(error))
// Middleware:
app.use(cors())
app.use(express.json())


// Schemas:
// camelCase


    // EMBEDDED DOCUMENT EXAMBPLE 
// const entrySchema = new mongoose.Schema({
//     content: {type: String, required: true}
// })

// const categorySchema = new mongoose.Schema({
//     name: {type: String, required: true, unique: true},
//     entries: [entrySchema]
// })

// CategoryModel.create({
//     name: newCategoryName,
//     entries: [{content: "cool content", content: "Another entry document"}]
// })


// OJBET REFERENCE APPROACH OF ASSOCIATION
const entrySchema = new mongoose.Schema({
    category: {type: mongoose.ObjectId, ref: 'Category'},
    content: {type: String, required: true}
})

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
})

// Models:
// PascalCase. Takes a mmodel name and schema as arguments
const EntryModel = mongoose.model('Entry', entrySchema)

const CategoryModel = mongoose.model('Category', categorySchema)

// Create new db entries with assocation approache:

// const createEntry = async () => { 
// const theCat = await CategoryModel.findOne({name: 'Coding'})
// EntryModel.create({content: "Testing category reference updated", category: theCat._id})
// }

// createEntry()

// seeds:
const categories = [{name: 'Food'}, {name: 'Gaming'}, {name: 'Coding'}, {name: 'Other'}]
const entries = [
    {category: 'Food', content: 'Food is life'},
    {category: 'Coding', content: 'I love coding'},
    {category: 'Gaming', content: 'I am not much into gaming'}
  ]

//    Routes
app.get('/', (req, res) => 
res.send({ info: "Journal API!"})
)

app.get('/categories', async (req, res) => res.status(200).send(await CategoryModel.find()))

app.get('/entries', async (req, res) => res.status(200).send(await EntryModel.find())) 

app.get('/entries/:id', async (req, res) => {
    try {const id = req.params.id
    const entry = await EntryModel.findById(id)
    entry ? res.send(entry) : res.status(404).send({error: "Entry not found"})} 
    catch (e) {
    res.status(404).send( { error: e.message})
}})

app.post('/entries', async (req, res) => {
    try { 
        const theCat = await CategoryModel.findOne({name: req.body.category})
        if (theCat) {
        const insertedEntry = await EntryModel.create({content: req.body.content, category: theCat._id})
        res.status(201).send(insertedEntry)
        } else (res.status(400).send({error: "Category not found"}))
    } 
    catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.put('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updatedEntry = {}
        if (req.body.content){
            updatedEntry.content = req.body.content
        }
        if (req.body.category){
            const theCat = await CategoryModel.findOne({name: req.body.category})
            if (theCat) {
                updatedEntry.category = theCat._id
        }   else {
            res.status(400).send({error: "Category not found"})
        }
    }
        const entry = await EntryModel.findByIdAndUpdate(id, updatedEntry, {new: true})
        entry ? res.send(entry) : res.status(404).send({error: "Entry not found"})} 
        catch (e) {
        res.status(404).send( { error: e.message})
    }})

app.delete('/entries/:id', async (req, res) => {
    try {const id = req.params.id
        const entry = await EntryModel.findByIdAndDelete (id)
        entry ? res.sendStatus(200) : res.status(404).send({error: "Entry not found"})} 
        catch (e) {
        res.status(404).send( { error: e.message})
    }})



app.listen(port)

