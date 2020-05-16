function makeUsersArray() {
    return [
        {
            id: 1,
            fullname: 'Shawn Alexander',
            username: 'sAlexander123@gmail.com',
            password: 'secret'
        },
        {
            id: 2,
            fullname: 'Jesse James',
            username: 'jjames',
            password: 'secret'
        }
    ]
}

module.exports = {
    makeUsersArray
}