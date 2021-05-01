const moment = require('moment');
const regx = require("../../config/regx");
const validationErrorCode = 400;

module.exports = {

    userData: (request) => {
        return new Promise ((resolve, reject) => {
            
            if (request.first_name != undefined) {
                if (request.first_name == '') {
                    reject({message: 'first name can not be empty', statusCode: validationErrorCode})
                }
                if (!regx.alphaWithSpace.test(request.first_name)) {
                    reject({message: 'first name only accept alpha characters', statusCode: validationErrorCode})
                }
            }
            if (request.last_name != undefined) {
                if (request.last_name == '') {
                    reject({message: 'last name can not be empty', statusCode: validationErrorCode})
                }
                if (!regx.alphaWithSpace.test(request.last_name)) {
                    reject({message: 'last name only accept alpha characters', statusCode: validationErrorCode})
                }
            }
            if (request.email != undefined) {
                if (request.email == '') {
                    reject({message: 'email can not be empty', statusCode: validationErrorCode})
                }
                if (!regx.email.test(request.email)) {
                    reject({message: 'invalid email addresss', statusCode: validationErrorCode})
                }
            }
            if (request.phone != undefined) {
                if (request.phone == '') {
                    reject({message: 'phone number can not be empty', statusCode: validationErrorCode})
                }
                if (!regx.mobile.test(request.phone)) {
                    reject({message: 'invalid phone number', statusCode: validationErrorCode})
                }
            }
            if (request.password != undefined) {
                if (request.password == '') {
                    reject({message: 'password can not be empty', statusCode: validationErrorCode})
                }
                if (!regx.password.test(request.password)) {
                    reject({message: 'password need to be strong, like Ari#1234', statusCode: validationErrorCode})
                }
            }
            if (request.sex != undefined) {
                if (request.sex != '' && request.sex != null) {
                    let sexList = ['male', 'female', 'other']
                    if (sexList.indexOf(request.sex) == -1) {
                        reject({message: 'invalid or incorrect sex', statusCode: validationErrorCode})
                    }
                }
            }
            if (request.dob != undefined) {
                if (request.dob != '' && request.dob != null) {
                    if (!moment(request.dob, 'MM-DD-YYYY', true).isValid()) {
                        reject({message: 'invalid date of birth or incorrect format, it should be mm-dd-yyyy', statusCode: validationErrorCode})
                    }
                }
            }
            if (request.full_address != undefined) {
                if (request.full_address == '') {
                    reject({message: 'full address can not be empty', statusCode: validationErrorCode})
                }
            }
            if (request.salary != undefined) {
                if (request.salary != '') {
                    if (!regx.salary.test(request.salary)) {
                        reject({message: 'incorrect salary', statusCode: validationErrorCode})
                    }
                }
            }
            resolve('OK')
        });
    }
}