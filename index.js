const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true
}).then((conn) => {
    console.log(`Database Connected`);
}).catch((error) => {
    console.log(`An error Occured`);
});


const app = require('./app');

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server Listening on PORT ${PORT}`);
});