import { EntryModel, CategoryModel, dbClose } from './db.js'



// seeds:
const categories = [{name: 'Food'}, {name: 'Gaming'}, {name: 'Coding'}, {name: 'Other'}]




//   Wibe all Database Documents:
// Delete entries first, becasue they rely on categories as ref ckeys
await CategoryModel.deleteMany()
console.log('deleted categories!')

const insertedCategories = await CategoryModel.insertMany(categories)
console.log('inserted categories!')

const entries = [
    {category: insertedCategories[0], content: 'Food is life'},
    {category: insertedCategories[2], content: 'I love coding'},
    {category: insertedCategories[1], content: 'I am not much into gaming'},
    {category: insertedCategories[3], content: 'I do not belong anywhere else'}
  ]

await EntryModel.deleteMany()
console.log('deleted entries!')


await EntryModel.insertMany(entries)
console.log('created entries!')

dbClose()