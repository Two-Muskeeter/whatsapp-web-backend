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
        mobile: ud.mobile,
        LOGIN_TIME: moment(),
    }, null);
    return {
        token,
    };
};