// NOTE: You should use your own student number in the place of "D01234567" as the database name
const database = "D00218937";

// do not change the code below
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(`mongodb://localhost/${database}`,{ useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {console.log("connected to", db.client.s.url);});