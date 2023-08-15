import app from './app.js'
import request from 'supertest'

// test and it are synonymous functions - what ever makes ost sense syntactially
describe('App Test', () => { 
    test('GET /', async () => {  
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toBe('Journal API!')
    })
 })
