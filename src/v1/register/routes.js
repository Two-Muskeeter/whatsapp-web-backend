import constant from "../../constant.js"
import serviceResponse from "../../serviceResponse.js"
import { register } from "./controller.js"

const routes = (app) => {

    app.post('/v1/register', (req, res) => {
        register(req.body).then((result) => {
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