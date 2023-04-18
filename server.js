const express = require('express'),
app = express(),
port = process.env.PORT || 3003,
server = app.listen(port, () => console.log(`Preach It!! ${port}`))
app.use(express.static('public'))