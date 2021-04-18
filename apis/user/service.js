const pool = require("../../config/database");

module.exports = {
    createUser: (request, callBack) => {
        pool.query(
            `insert into users(first_name, last_name, email, phone, password, sex) 
                values(?,?,?,?,?,?)`,
            [
                request.first_name,
                request.last_name,
                request.email,
                request.phone,
                request.password,
                request.sex
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllUsers: callBack => {
        pool.query(
            `select * from users`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `select * from users where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};