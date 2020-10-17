var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DevSeed' , { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=> {
            console.log('DB is connected');
            app.listen(port,() => {
                console.log("Server is on http://localhost:" + port);
            })
        })
        .catch(error => console.log(error));