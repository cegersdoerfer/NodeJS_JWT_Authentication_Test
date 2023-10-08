const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
var { expressjwt: exjwt } = require("express-jwt");

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const secret_key = "secret_key";

let users = [
    {
        id: 1,
        username: "admin",
        password: "admin"
    },
    {
        id: 2,
        username: "user",
        password: "user"
    }
];

const jwtMT = exjwt({
    secret: secret_key,
    algorithms: ['HS256']
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-type,Authorization');
    next();
    }
);
app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    for (let user of users) {
        if (username === user.username && password === user.password) {
            let token = jwt.sign({id: user.id, username: user.username}, secret_key, {expiresIn: '3m'});
            return res.json({
                success: true,
                err: null,
                token
            });
        }
    }
    return res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect'
    });
    }
);

app.get('/api/dashboard', jwtMT, (req, res) => {
    res.json({
        success: true,
        message: 'Dashboard',
        data: {
            user: req.user
        }
    });
    }
);

app.get('/api/settings', jwtMT, (req, res) => {
    res.json({
        success: true,
        message: 'Settings',
        data: {
            user: req.user
        }
    });
    }
);

app.post('/api/verify_token', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, secret_key, (err, authData) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Invalid Token'
            });
        } else {
            return res.json({
                success: true,
                message: 'Verify Token',
                data: {
                    user: authData
                }
            });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    }
);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    }
);