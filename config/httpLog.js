const logger = require("./logger");
const pool = require("./database");
const appError = require("../exception/appError");

const saveApiLogs = (requestObject, responseObject) => {
    pool.query(
        `insert into api_logs(request_method, request_url, request_body, status_code, api_response) values(?,?,?,?,?)`,
        [
            requestObject.request_method,
            requestObject.request_url,
            requestObject.request_body,
            responseObject.status_code,
            responseObject.api_response
        ],
        (error, results, fields) => {
            if (error) {
                throw new appError("Error occur while saving records in api_logs table");
            }
        }
    );
}

module.exports = (req, res, next) => {
    
    /** REQUEST LOG */
    let reqObj = {};
    reqObj["request_body"] = JSON.stringify({});
    reqObj["request_url"] = `${req.protocol}://${req.get('host')}${req.path}`;
    reqObj["request_method"] = req.method;
    if (req.body.constructor === Object && Object.keys(req.body).length > 0) {
        reqObj["request_body"] = req.body;
        logger.http.http(reqObj);

        reqObj["request_body"] = JSON.stringify(req.body);
    }

    let oldSend = res.send;
    
    /** RESPONSE LOG */
    let resObj = {};
    res.send = function (data) {
        oldSend.apply(res, arguments);
        resObj["status_code"] = res.statusCode
        resObj["api_response"] = data;
        saveApiLogs(reqObj, resObj);
        
        resObj["api_response"] = JSON.parse(data);
        logger.http.http(resObj);
    }

    next();
}