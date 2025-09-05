import express from 'express'
import Routes from './components/Routes/index.js'
import middleware from './components/Middleware/index.js'
const app = express()
const port = 80
middleware(app);
Routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server started on Port ${port}`)
})