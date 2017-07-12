// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var request = require('superagent');
var Setting = require("./Setting");
// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

var mongoose = require('mongoose');
mongoose.connect(Setting.mongodb); // connect to our database
//attach lister to connected event
mongoose.connection.once('connected', function () {
    console.log("Connected to database")
});
mongoose.connection.on('error', console.error.bind(console, '连接错误:'));
var Person = require('./models/db');
//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,accept, authorization, content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/static', express.static('public'));

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/editPerson')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function (req, res) {
        if (req.body._id === undefined) {
            var person = new Person();		// create a new instance of the Bear model
            person.name = req.body.name || "";
            person.age = req.body.age || "";
            person.sex = req.body.sex || "";
            person.phone = req.body.phone || "";
            person.address = req.body.address || "";
            person.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: '创建成功!',
                    status: true,
                    data: person
                });
            });
        } else {
            Person.findById(req.body._id, function (err, person) {

                if (err) {
                    res.send(err);
                }
                for (item in req.body) {
                    if (typeof(req.body[item]) !== undefined) {
                        person[item] = req.body[item];
                    }
                }
                person.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json(
                        {
                            "message": "修改成功！",
                            "status": true,
                            data: person
                        }
                    );
                });

            });
        }

    });
router.route('/getAllPerson')
// get all the bears (accessed at GET http://localhost:8080/api/bears)
    .post(function (req, res) {
        Person.find(function (err, Persons) {
            if (err)
                res.send(err);

            res.json({
                message: '获取全部成功!',
                status: true,
                data: Persons
            });
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/getOnePerson')
// get the bear with that id
    .post(function (req, res) {
        Person.findById(req.body.id, function (err, person) {
            if (err)
                res.send(err);
            res.json(
                {
                    "message": "id查询成功！",
                    "status": true,
                    data: person
                }
            );
        });
    });

router.route('/deletePerson')
// delete the bear with this id
    .post(function (req, res) {
        Person.remove({
            _id: req.body._id
        }, function (err, person) {
            if (err)
                res.send(err);

            res.json({
                status:true,
                message: '删除成功'
            });
        });
    });
    // 正在热映
    router.route('/movie/in_theaters').get(function (req, res) {
            var originalUrl = req.originalUrl.replace("/api","");
            var sreq = request.get(Setting.proxyHOST + originalUrl);
            sreq.pipe(res);
            sreq.on('end', function (error, res) {
                console.log('请求in_theaters成功');
            });
        })

        // router.route('/Audit/GetOrder').post(function (req, res) {
        //     var sreq = request.post(Setting.proxyHOST + req.originalUrl);
        //     sreq.pipe(res);
        //     sreq.on('end', function (error, res) {
        //         console.log('请求GetOrder成功');
        //     });
        // })

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
