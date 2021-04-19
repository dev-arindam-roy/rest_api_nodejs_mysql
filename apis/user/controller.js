const userService = require("./service");
const appError = require("../../exception/appError");
const catchAsync = require("../../exception/catchAsync");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

module.exports = {

    /** CREATE NEW USER */
    createUser: async (req, res) => {
        try {
            const requestBody = req.body;
            const salt = genSaltSync(10);
            requestBody.password = hashSync(requestBody.password, salt);
            const result = await userService.createUser(requestBody);
            return res.status(200).json({success:1});
        } catch (e) {
            return res.status(400).json({success:0});
        }
        // const requestBody = req.body;
        // const salt = genSaltSync(10);
        // requestBody.password = hashSync(requestBody.password, salt);

        // let apiResponse = {};
        // apiResponse['type'] = 'error';
        // apiResponse['is_success'] = 0;
        // apiResponse['status'] = 400;
        // apiResponse['content'] = {};
        
        // userService.createUser(requestBody, (err, results) => {
        //     if (err) {
        //         apiResponse['message'] = {
        //             custom_msg: 'error occur while creating a user',
        //             system_msg: err
        //         };
        //         return res.status(apiResponse['status']).json(apiResponse);
        //     }
            
        //     userService.getUserByUserId(results.insertId, (err, userData) => {
        //         if (err) {
        //             apiResponse['message'] = {
        //                 custom_msg: 'user created but error occur while creating the user',
        //                 system_msg: err
        //             };
        //             return res.status(apiResponse['status']).json(apiResponse);
        //         }

        //         userData.password = undefined;
        //         apiResponse['type'] = 'success';
        //         apiResponse['is_success'] = 1;
        //         apiResponse['status'] = 200;
        //         apiResponse['message'] = {
        //             custom_msg: 'user created successfully'
        //         };
        //         apiResponse['content'] = {
        //             user_id: results.insertId,
        //             user_info: userData
        //         };
        //         return res.status(apiResponse['status']).json(apiResponse);
        //     });
        // });
    },

    /** GET ALL USERS */
    getAllUsers: (req, res) => {
        let apiResponse = {};
        apiResponse['type'] = 'error';
        apiResponse['is_success'] = 0;
        apiResponse['status'] = 400;
        apiResponse['content'] = {};

        userService.getAllUsers((err, results) => {
            if (err) {
                apiResponse['message'] = {
                    custom_msg: 'error occur while fetching all users',
                    system_msg: err
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            apiResponse['type'] = 'success';
            apiResponse['is_success'] = 1;
            apiResponse['status'] = 200;

            if (results.length == 0) {
                apiResponse['message'] = {
                    custom_msg: 'no users found'
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            results.map(function (userData) {
                delete userData.password;
                //return userData.password = null;
            });
            apiResponse['message'] = {
                custom_msg: 'users list fetched successfully'
            };
            apiResponse['content'] = {
                user_list: results,
                user_count: results.length
            };
            return res.status(apiResponse['status']).json(apiResponse);
        });
    },

    /** GET USERS BY USER ID */
    getUserByUserId: catchAsync (async (req, res, next) => {
        const id = req.params.id;
        const result = await userService.getUserByUserId(id);
        if (!result) {
            throw new appError('Record not found!', 404);
        }
        return res.status(200).json({success:1, user:result});
        
        // let apiResponse = {};
        // apiResponse['type'] = 'error';
        // apiResponse['is_success'] = 0;
        // apiResponse['status'] = 400;
        // apiResponse['content'] = {};

        // userService.getUserByUserId(id, (err, results) => {
        //     if (err) {
        //         apiResponse['message'] = {
        //             custom_msg: 'error occur while fetching user by user id',
        //             system_msg: err
        //         };
        //         return res.status(apiResponse['status']).json(apiResponse);
        //     }

        //     apiResponse['type'] = 'success';
        //     apiResponse['is_success'] = 1;
        //     apiResponse['status'] = 200;

        //     if (!results) {
        //         apiResponse['message'] = {
        //             custom_msg: 'user not found'
        //         };
        //         return res.status(apiResponse['status']).json(apiResponse);
        //     }

        //     results.password = undefined;
        //     apiResponse['message'] = {
        //         custom_msg: 'users found successfully'
        //     };
        //     apiResponse['content'] = {
        //         user_info: results,
        //         user_id: id
        //     };
        //     return res.status(apiResponse['status']).json(apiResponse);
        // });
    })
};