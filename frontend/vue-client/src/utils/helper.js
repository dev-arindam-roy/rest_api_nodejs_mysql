const changeDateFormat = (date, format = 'MDY', seperator = '-') => {
    let returnDate = ''
    if (date != '' && date != undefined) {
        let dateArr = date.split('-')
        if (format === 'MDY' ) {
            returnDate = dateArr[1] + seperator + dateArr[2] + seperator + dateArr[0]
        } else if (format === 'YMD') {
            returnDate = dateArr[0] + seperator + dateArr[1] + seperator + dateArr[2]
        } else {
            returnDate = dateArr[2] + seperator + dateArr[1] + seperator + dateArr[0]
        }
    }
    return returnDate
}

const customHelper = {
    dateFormat: changeDateFormat
}

export default customHelper;