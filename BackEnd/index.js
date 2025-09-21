import express from 'express'
import Routes from './components/Routes/index.js'
import middleware from './components/Middleware/index.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express()
const port = 80
middleware(app);
Routes(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('*wildcard', (req, res) => {
    res.sendFile(path.join(__dirname,'dist','index.html'));
});

app.listen(port, () => {
  console.log(`Server started on Port ${port}`)
})