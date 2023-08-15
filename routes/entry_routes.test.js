import app from '../app.js'
import request from 'supertest'

// test and it are synonymous functions - what ever makes ost sense syntactially
const validNames = [ 'Coding', 'Gaming', 'Food', 'Other']


    describe('POST /entries => create a new entry',  () => {
        let res

        beforeAll(async () => {
         res = await request(app).post('/entries').send({            
            category: "Food",
            content: "Food is life"
        })
    })
        test('returns JSON body with ID', () => {  
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body._id).toBeDefined()

        expect(res.body.category.name).toMatch('Food')
        expect(res.body.content).toMatch( "Food is life")
    })
})

// Nested describe()
    describe('GET /categories',  () => {  
        let res

        beforeAll(async () => {
         res = await request(app).get('/categories')
        })

        it('returns 200 status and JSON', () => {
            expect(res.status).toBe(200)
            expect(res.header['content-type']).toMatch('json')
        })

        it('Returns an array of 4 elements', () => {
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toHaveLength(4)
        })

        test('First category has "name" and id', () => {
            res.body.forEach(el => {
        expect(el.name).toBeDefined()
        expect(validNames).toContain(el.name)
        // Test for ID and ID length:
        expect(el._id).toBeDefined()
        expect(el._id).toHaveLength(24)
            })
        })
    })


