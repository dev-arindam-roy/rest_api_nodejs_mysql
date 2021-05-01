const { v4: uuidv4 } = require('uuid');
const { Random } = require("random-js");

module.exports = {
    generateRandomNumber: (minNum, maxNum) => {
        const random = new Random();
        if (minNum < maxNum) {
            return random.integer(minNum, maxNum);
        } else {
            return random.integer(111, 999);
        }
    },
    generateUniqueID: () => {
        return uuidv4();
    }
}