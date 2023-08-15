import mongoose from 'mongoose'
import dotenv from 'dotenv'



dotenv.config()

const dbClose = async () => {console.log('db connection closed'); mongoose.connection.close() }


// Mongoose connect -> returns a promise
mongoose.connect(process.env.ATLAS_DB_URL)
    // .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed'))
    .catch(error => console.error(error))
// Middleware:


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

export { EntryModel, CategoryModel, dbClose } 