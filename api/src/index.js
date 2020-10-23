var mongoose = require('mongoose');
var app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect(app.get('uri') , { 
                                    useNewUrlParser: true, 
                                    useUnifiedTopology: true,
                                    useFindAndModify: false })
        .then(()=> {
            console.log('DB is connected!!');
            console.log(`CLUSTER: ${app.get('cluster')}`);
            app.listen(app.get('port'),() => {
                console.log(`PORT: ${app.get('port')}`);
            })
        })
        .catch(error => console.log(error));