const pool = require("../../config/database");

module.exports = {
    createUser: (request) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `insert into users(first_name, last_name, email, phone, password, sex, dob, profile_image) 
                    values(?,?,?,?,?,?,?,?)`,
                [
                    request.first_name,
                    request.last_name,
                    request.email,
                    request.phone,
                    request.password,
                    request.sex,
                    request.dob,
                    request.profile_image
                ],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getAllUsers: () => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `select * from users`,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getUserByUserId: (id) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `select 
                    users.*,
                    user_address.full_address as address,
                    user_address.city as city,
                    user_address.pincode as pincode,
                    user_address.state as state,
                    user_address.country as country,
                    user_companies.company_name as company_name,
                    user_companies.salary as salary
                from users
                    left join user_address on user_address.user_id = users.id
                    left join user_companies on user_companies.user_id = users.id 
                where users.id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    isEmailExists: (email) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `select count(*) as email from users where email = ?`,
                [email],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    addUserAddress: (request) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `insert into user_address(user_id, full_address, city, pincode, state, country) 
                    values(?,?,?,?,?,?)`,
                [
                    request.user_id,
                    request.full_address,
                    request.city,
                    request.pincode,
                    request.state,
                    request.country
                ],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    addUserCompany: (request) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `insert into user_companies(user_id, company_name, salary) 
                    values(?,?,?)`,
                [
                    request.user_id,
                    request.company_name,
                    request.salary
                ],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getAddressInfo: (userId) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `select * from user_address where user_id = ?`,
                [userId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getCompanyInfo: (userId) => {
        return new Promise ((resolve, reject) => {
            pool.query(
                `select * from user_companies where user_id = ?`,
                [userId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    }
};