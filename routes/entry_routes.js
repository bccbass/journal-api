import { Router } from 'express'
import { EntryModel, CategoryModel } from '../db.js'

const router = Router()
// .populate() will take an object ref id and populate its fields. Params are path and select which fields you want to show in a string. A minus will exclude that category. 
router.get('/', async (req, res) => res.status(200).send(await EntryModel.find().populate({path: 'category', select: 'name -_id'} ))) 

router.get('/:id', async (req, res) => {
    try {const id = req.params.id
    const entry = await EntryModel.findById(id).populate({path: 'category', select: 'name -_id'} )
    entry ? res.send(entry) : res.status(404).send({error: "Entry not found"})} 
    catch (e) {
    res.status(404).send( { error: e.message})
}})

router.post('', async (req, res) => {
    try { 
        const theCat = await CategoryModel.findOne({name: req.body.category})
        if (theCat) {
        const insertedEntry = await EntryModel.create({content: req.body.content, category: theCat})
        res.status(201).send(insertedEntry)
        } else (res.status(400).send({error: "Category not found"}))
    }
    catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updatedEntry = {}
        if (req.body.content){
            updatedEntry.content = req.body.content
        }
        if (req.body.category){
            const theCat = await CategoryModel.findOne({name: req.body.category})
            if (theCat) {
                updatedEntry.category = theCat
        }   else {
            res.status(400).send({error: "Category not found"})
        }
    }
        const entry = await EntryModel.findByIdAndUpdate(id, updatedEntry, {new: true})
        entry ? res.send(entry) : res.status(404).send({error: "Entry not found"})} 
        catch (e) {
        res.status(404).send( { error: e.message})
    }})

router.delete('/:id', async (req, res) => {
    try {const id = req.params.id
        const entry = await EntryModel.findByIdAndDelete (id)
        entry ? res.sendStatus(200) : res.status(404).send({error: "Entry not found"})} 
        catch (e) {
        res.status(404).send( { error: e.message})
    }})

    export default router 