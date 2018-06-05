console.log(`server/start.ts`);

import * as express from 'express';
var fs = require('fs');

var app = express();

const webDir = 'web/';

app.use(async (req, res, next) => {
	console.log(req.url);
	next();
})
// Adding the static middleware at the beginning means it wins out over any routes present
// (but only interferes if the file exists)
app.use(express.static(webDir));


app.listen(8080);