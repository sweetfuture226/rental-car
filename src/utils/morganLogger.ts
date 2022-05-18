const morgan = require('morgan')
const path = require('path');
const fs = require('fs')


// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });

const morganLogger = () => morgan('combined', { stream: accessLogStream });

export default morganLogger;