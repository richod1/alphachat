function isEmailValid(email){
    const emailRegex= /^[A-Za-z0-9._%+-]+@ttu\.edu\.gh$/;
    return emailRegex.test(email);
}

module.exports={
    isEmailValid,
}