import { promises as fs } from 'fs';
import constant from '../../constant';
import { mobileOtpModel, registrationModel } from "./model";
import { v4 as uuid } from 'uuid';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import { LoginToken } from '../../tokenGenerator';
import { executeOne, insert } from '../../dbHelper';
const { schemaName, tableName } = constant

export const sendLoginOtp = async (body) => {
    try {
        body.otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        body.sentTime = moment().format('X')
        let otpModel = mobileOtpModel(body)
        await insert(schemaName.otp, tableName.mobile_otp, otpModel)
        const res = await executeOne(`select * from ${schemaName.user}.${tableName.user_detail} where mobile = '${body.mobile}'`)
        if (res) {
            return { OTP: body.otp }
        }
        else {
            body.encryptionKey = uuid();
            const userModel = registrationModel(body);
            await insert(schemaName.user, tableName.user_detail, userModel)
            return { OTP: body.otp }
        }

    }
    catch (err) {
        console.error(err)
    }

}


export const verifyLoginOtp = async (body) => {
    try {
        const otpRes = await executeOne(`select * from ${schemaName.otp}.${tableName.mobile_otp} where mobile = '${body.mobile}' order by id desc limit 1`)
        if (otpRes && otpRes.otp == body.otp) {
            const userRes = await executeOne(`select * from ${schemaName.user}.${tableName.user_detail} where mobile = '${body.mobile}'`)
            return (LoginToken({ mobile: userRes }))
        }
        else {
            throw ({ message: 'Invalid OTP' })
        }
    }
    catch (err) {
        console.error(err)
    }

}
