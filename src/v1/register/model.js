export const registrationModel = (body) => {
    const model = {
        mobile: body.mobile,
        name: body.name,
        image: body.image,
        encryptionKey: body.encryptionKey
    }
    return model
}