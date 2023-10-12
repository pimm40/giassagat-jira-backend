const app = require('./app')
const xmlparser = require('express-xml-bodyparser');

app.use(xmlparser())
app.listen(process.env.PORT,()=>{
    console.log(process.env.PORT)
})

// server.timeout = 10 * 60 * 1000;