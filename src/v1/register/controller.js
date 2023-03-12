import { promises as fs } from 'fs';
import constant from '../../constant';
import { mobileOtpModel, registrationModel } from "./model";
import { v4 as uuid } from 'uuid';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import { LoginToken } from '../../tokenGenerator';

export const sendLoginOtp = async (body) => {
    try {

        const userDatafile = constant.files.userData
        const userOtpfile = constant.files.mobileOtp

        body.otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        body.sentTime = moment().format('X')
        let otpData = await fs.readFile(userOtpfile, "utf-8");
        otpData = JSON.parse(otpData)
        let otpModel = mobileOtpModel(body)
        otpData.push(otpModel)
        otpData = JSON.stringify(otpData)
        await fs.writeFile(userOtpfile, otpData)
        let data = await fs.readFile(userDatafile, "utf-8");
        data = JSON.parse(data)
        if (data.findIndex((element) =>
            element.mobile == body.mobile
        ) > -1) {
            return { OTP: body.otp }
        }
        else {
            body.encryptionKey = uuid();
            const userModel = registrationModel(body);
            data.push(userModel);
            await fs.writeFile(userDatafile, JSON.stringify(data))
            return { OTP: body.otp }
        }

    }
    catch (err) {
        console.error(err)
    }

}


export const verifyLoginOtp = async (body) => {
    try {
        const userDatafile = constant.files.userData
        const userOtpfile = constant.files.mobileOtp
        // let userData = await fs.readFile(userDatafile, "utf-8");
        let otpData = await fs.readFile(userOtpfile, "utf-8");
        otpData = JSON.parse(otpData)
        otpData = otpData.reverse();
        let res = otpData.find((element) => element.mobile == body.mobile)
        if (res && res.otp == body.otp) {
            return (LoginToken({ mobile: res.mobile }) )
        }
        else {
            throw ({ message: 'Invalid OTP' })
        }
    }
    catch (err) {
        console.error(err)
    }

}
