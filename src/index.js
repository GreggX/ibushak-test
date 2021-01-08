const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const phones = require('./api/cellphones.route')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1/', phones)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

app.listen(port, () => {
  console.log(`express server listening on port ${port}`)
})