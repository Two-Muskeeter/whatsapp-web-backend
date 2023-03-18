import constant from "../../constant.js"
import serviceResponse from "../../serviceResponse.js"
import { sendLoginOtp,verifyLoginOtp } from "./controller.js"

const routes = (app) => {

    app.post('/v1/send-login-otp', (req, res) => {
        sendLoginOtp(req.body).then((result) => {
            res.send(serviceResponse({
                result,
                status: constant.apiStatus.success,
                allowed: true,
            }))
        }).catch((error) => {
            res.send(serviceResponse({ error, status: constant.apiStatus.failed }))
        })
    })


    app.post('/v1/verify-login-otp', (req, res) => {
        verifyLoginOtp(req.body).then((result) => {
            res.send(serviceResponse({
                result,
                status: constant.apiStatus.success,
                allowed: true,
            }))
        }).catch((error) => {
            res.send(serviceResponse({ error, status: constant.apiStatus.failed }))
        })
    })
}
export default routes;