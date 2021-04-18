const userService = require("./service");

module.exports = {

    /** CREATE NEW USER */
    createUser: (req, res) => {
        const requestBody = req.body;
        let apiResponse = {};
        apiResponse['type'] = 'error';
        apiResponse['is_success'] = 0;
        apiResponse['status'] = 400;
        apiResponse['content'] = {};

        userService.createUser(requestBody, (err, results) => {
            if (err) {
                apiResponse['message'] = {
                    custom_error: 'error occur while creating a user',
                    system_error: err
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }
            
            userService.getUserByUserId(results.insertId, (err, userData) => {
                if (err) {
                    apiResponse['message'] = {
                        custom_error: 'user created but error occur while creating the user',
                        system_error: err
                    };
                    return res.status(apiResponse['status']).json(apiResponse);
                }

                userData.password = undefined;
                apiResponse['type'] = 'success';
                apiResponse['is_success'] = 1;
                apiResponse['status'] = 200;
                apiResponse['message'] = {
                    success_message: 'user created successfully'
                };
                apiResponse['content'] = {
                    user_id: results.insertId,
                    user_info: userData
                };
                return res.status(apiResponse['status']).json(apiResponse);
            });
        });
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
                    custom_error: 'error occur while fetching all users',
                    system_error: err
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            apiResponse['type'] = 'success';
            apiResponse['is_success'] = 1;
            apiResponse['status'] = 200;

            if (results.length == 0) {
                apiResponse['message'] = {
                    custom_error: 'no users found'
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            results.map(function (userData) {
                delete userData.password;
                //return userData.password = null;
            });
            apiResponse['message'] = {
                success_message: 'users list fetched successfully'
            };
            apiResponse['content'] = {
                user_list: results,
                user_count: results.length
            };
            return res.status(apiResponse['status']).json(apiResponse);
        });
    },

    /** GET USERS BY USER ID */
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        let apiResponse = {};
        apiResponse['type'] = 'error';
        apiResponse['is_success'] = 0;
        apiResponse['status'] = 400;
        apiResponse['content'] = {};

        userService.getUserByUserId(id, (err, results) => {
            if (err) {
                apiResponse['message'] = {
                    custom_error: 'error occur while fetching user by user id',
                    system_error: err
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            apiResponse['type'] = 'success';
            apiResponse['is_success'] = 1;
            apiResponse['status'] = 200;

            if (!results) {
                apiResponse['message'] = {
                    custom_error: 'user not found'
                };
                return res.status(apiResponse['status']).json(apiResponse);
            }

            results.password = undefined;
            apiResponse['message'] = {
                success_message: 'users found successfully'
            };
            apiResponse['content'] = {
                user_info: results,
                user_id: id
            };
            return res.status(apiResponse['status']).json(apiResponse);
        });
    }
};