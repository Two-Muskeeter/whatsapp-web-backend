import { promises as fs } from 'fs';
import constant from '../../constant';
import { registrationModel } from "./model"
import { uuid } from 'uuidv4'
export const register = async (body) => {
    const fileName = './' + constant.files.userData
    let data = await fs.readFile(fileName, "utf-8");
    data = JSON.parse(data)
    if (data.findIndex((element) =>
        element.mobile == body.element
    ) > -1){

    }
    else{
        body.encryptionKey = uuid();
        const model = registrationModel(body);
        data.push(model);
        // fs.
    }

        

}