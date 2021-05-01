module.exports = {
    
    alphaWithSpace: /^[A-Z a-z]+$/,
    email: /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    number: /^[0-9]+$/,
    password: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/,
    mobile: /^[0-9]{10,12}$/,
    salary: /^\d{4,8}$/,
}