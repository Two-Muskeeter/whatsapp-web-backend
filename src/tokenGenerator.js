import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from './config'
const { security } = config

const sign = (data, expTime) => {
    const { sign } = jwt;
    return sign(
        { ...data },
        security.secretKey,
        // { expiresIn: expTime || security.expTime }
    );

}

export const LoginToken = (ud) => {
    const token = sign({
        user: ud.user,
        id: ud.user_id,
        LOGIN_TIME: moment(),
    }, null);
    return {
        token,
    };
};


export const verifyToken = function (req, res, next) {
    let authorization = req.headers['authorization'];
    if (authorization) {
        let tokenBearer = authorization.split(' ');
        let token = tokenBearer[1];

        jwt.verify(token, config.security.secretKey, function (err, decoded) {
            if (err) {
                res.status(403).send(serviceResponse({ error: { message: 'Unauthorized' } }));
            }
            else {
                req.DECODED = decoded.user;
                req.id = decoded.user.user_id;
                next();
            }
        });
    }
    else {
        res.status(403).send(serviceResponse({ error: { message: 'Invalid Request' } }));
    }
};