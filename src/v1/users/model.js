export const registrationModel = (body) => {
    const model = {
        mobile: body.mobile ? body.mobile : '',
        name: body.name ? body.name : '',
        image: body.image ? body.image : '',
        email: body.email ? body.email : '',
        encryption_key: body.encryptionKey ? body.encryptionKey : ''
    }
    return model
}

export const mobileOtpModel = (body) => {
    const model = {
        mobile: body.mobile ? body.mobile : '',
        otp: body.otp ? body.otp : '',
        sent_on: body.sentTime ? body.sentTime : ''
    }
    return model
}