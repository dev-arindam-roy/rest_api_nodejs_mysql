const userService = require("./service");
const moment = require('moment');
const jsonWebToken = require("jsonwebtoken");
const fs = require("fs");
const appError = require("../../exception/appError");
const catchAsync = require("../../exception/catchAsync");
const helper = require("../../helpers/helper");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const deleteProfileImage = async (req) => {
    if (req.file != undefined && req.file.filename != undefined) {
        fs.unlinkSync('./public/uploads/images/' + req.file.filename)
    }
}
module.exports = {

    /** CREATE NEW USER */
    createUser: catchAsync (async (req, res) => {
        
        const requestBody = req.body;
        
        const salt = genSaltSync(10);
        requestBody.password = hashSync(requestBody.password, salt);
        
        if (req.file != undefined && req.file.filename != undefined) {
            requestBody.profile_image = req.file.filename
        }

        if (requestBody.dob != undefined && requestBody.dob != '' && requestBody.dob != null) {
            requestBody.dob = moment(moment(requestBody.dob, 'MM-DD-YYYY')).format('YYYY-MM-DD')
        } else {
            requestBody.dob = null
        }

        if (requestBody.salary != undefined && requestBody.salary == '') {
            requestBody.salary = null
        }

        const isEmailExist = await userService.isEmailExists(requestBody.email);
        if (isEmailExist.email > 0) {
            await deleteProfileImage(req);
            throw new appError('email already exist', 400);
        }

        requestBody.hash_id = helper.generateUniqueID() + '-' + helper.generateRandomNumber(123456, 999999)
        const createUserResult = await userService.createUser(requestBody);
        if (!createUserResult.affectedRows) {
            throw new appError('user not created', 400);
        }

        requestBody.user_id = createUserResult.insertId;
        const addAddress = await userService.addUserAddress(requestBody);
        if (!addAddress.affectedRows) {
            throw new appError('user created successfully but address info not add', 400);
        }

        const addCompany = await userService.addUserCompany(requestBody);
        if (!addCompany.affectedRows) {
            throw new appError('user created successfully but company info not add', 400);
        }

        const currentUser = await userService.getUserByUserId(createUserResult.insertId);
        if (!currentUser) {
            throw new appError('user created successfully but can not found the user record', 400);
        }

        const addressInfo = await userService.getAddressInfo(createUserResult.insertId);
        const companyInfo = await userService.getCompanyInfo(createUserResult.insertId);

        currentUser.password = undefined;
        if (currentUser.profile_image != null && currentUser.profile_image != '') {
            currentUser.profile_image = process.env.APP_URL + 'public/uploads/images/' + currentUser.profile_image
        }

        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            user_id: createUserResult.insertId,
            user_info: currentUser,
            user_address_info: addressInfo,
            user_company_info: companyInfo
        }
        return res.status(200).json(apiResponse);
    }),

    /** GET ALL USERS */
    getAllUsers: catchAsync (async (req, res) => {
        const result = await userService.getAllUsers();
        if (result.length == 0) {
            throw new appError('users not found!', 400);
        }
        result.map(function (userData) {
            delete userData.password;
            if (userData.profile_image != '' && userData.profile_image != null) {
                userData.profile_image = process.env.APP_URL + 'public/uploads/images/' + userData.profile_image
            } else {
                userData.profile_image = process.env.APP_URL + 'public/uploads/images/no-image.png'
            }
        });
        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            user_count: result.length,
            users: result 
        }
        return res.status(200).json(apiResponse);
    }),

    /** GET USERS BY USER ID */
    getUserByUserId: catchAsync (async (req, res, next) => {
        const id = req.params.id;
        const result = await userService.getUserByUserId(id);
        if (!result) {
            throw new appError('record not found!', 400);
        }
        result.password = undefined;
        if (result.profile_image != null && result.profile_image != '') {
            result.profile_image = process.env.APP_URL + 'public/uploads/images/' + result.profile_image
        } else {
            result.profile_image = process.env.APP_URL + 'public/uploads/images/no-image.png'
        }
        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            user: result 
        }
        return res.status(200).json(apiResponse);
    }),

    /** LOGIN BY EMAIL-ID */
    getLoginByEmailId: catchAsync (async (req, res, next) => {
        const result = await userService.loginByEmail(req.body.email);
        if (!result) {
            throw new appError('email and password combination incorrect', 400);
        }
        const checkPassword = compareSync(req.body.password, result.password);
        if (!checkPassword) {
            throw new appError('email and password combination incorrect', 400);
        }
        let payload = {
            name: result.first_name + ' ' + result.last_name,
            email: result.email,
            phone: result.phone
        };
        const jsontoken = jsonWebToken.sign({ payload: payload }, process.env.JWT_KEY, {
            expiresIn: "1h"
        });
        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            token: jsontoken 
        }
        return res.status(200).json(apiResponse);
    }),

    /** DELETE USERS BY USER ID */
    deleteUser: catchAsync (async (req, res, next) => {
        const isUserExist = await userService.getUserByUserId(req.body.user_id);
        if (!isUserExist) {
            throw new appError('user not found!', 400);
        }
        const delUser = await userService.deleteUser(req.body.user_id);
        if (!delUser.affectedRows) {
            throw new appError('user not found!', 400);
        }
        if (isUserExist.profile_image != '') {
            fs.unlinkSync('./public/uploads/images/' + isUserExist.profile_image);
        }
        const delAddress = await userService.deleteUserAddress(req.body.user_id);
        const delCompany = await userService.deleteUserCompany(req.body.user_id);
        
        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            user_id: req.body.user_id
        }
        return res.status(200).json(apiResponse);
    }),

    /** GET AUTH USER INFO */
    getAuthUser: catchAsync (async (req, res, next) => {
        if (req.decoded.payload.email != undefined) {
            const result = await userService.loginByEmail(req.decoded.payload.email);
            if (!result) {
                throw new appError('email address not found', 401);
            }
            let apiResponse = {};
            apiResponse['isSuccess'] = 1;
            apiResponse['content'] = {
                auth_user: req.decoded.payload
            }
            return res.status(200).json(apiResponse);
        } else {
            throw new appError('invalid token', 401);
        }
    })
};