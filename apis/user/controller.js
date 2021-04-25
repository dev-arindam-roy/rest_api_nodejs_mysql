const userService = require("./service");
const moment = require('moment');
const fs = require("fs");
const appError = require("../../exception/appError");
const catchAsync = require("../../exception/catchAsync");
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

        if (requestBody.dob != undefined) {
            requestBody.dob = moment(moment(requestBody.dob, 'DD-MM-YYYY')).format('YYYY-MM-DD')
        }

        const isEmailExist = await userService.isEmailExists(requestBody.email);
        if (isEmailExist.email > 0) {
            await deleteProfileImage(req);
            throw new appError('email already exist', 404);
        }

        const createUserResult = await userService.createUser(requestBody);
        if (!createUserResult.affectedRows) {
            throw new appError('user not created', 404);
        }

        requestBody.user_id = createUserResult.insertId;
        const addAddress = await userService.addUserAddress(requestBody);
        if (!addAddress.affectedRows) {
            throw new appError('user created successfully but address info not add', 404);
        }

        const addCompany = await userService.addUserCompany(requestBody);
        if (!addCompany.affectedRows) {
            throw new appError('user created successfully but company info not add', 404);
        }

        const currentUser = await userService.getUserByUserId(createUserResult.insertId);
        if (!currentUser) {
            throw new appError('user created successfully but can not found the user record', 404);
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
            throw new appError('users not found!', 404);
        }
        result.map(function (userData) {
            delete userData.password;
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
            throw new appError('record not found!', 404);
        }
        result.password = undefined;
        if (result.profile_image != null && result.profile_image != '') {
            result.profile_image = process.env.APP_URL + 'public/uploads/images/' + result.profile_image
        }
        let apiResponse = {};
        apiResponse['isSuccess'] = 1;
        apiResponse['content'] = {
            user: result 
        }
        return res.status(200).json(apiResponse);
    })
};