const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const bcrypt = require('bcryptjs');
const xss = require('xss');

const UsersService = {
    getAllUsers(knex) {
      return knex.select("*").from("users");
    },
  
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(([user]) => user);
    },
  
    getByuser_name(knex, user_name) {
      return knex
        .from('users')
        .select('*')
        .where("user_name", user_name)
        .first();
    },

    getByID(knex, id) {
      return knex
        .from('users')
        .select('*')
        .where("id", id)
        .first();
    },
  
    deleteUser(knex, user_name) {
        console.log(user_name);
      return knex('users')
        .where({ user_name })
        .delete();
    },
  
    updateUser(knex, user_name, newUserFields) {
      return knex('users')
        .where({ user_name })
        .update(newUserFields);
    },
    hasUserWithUserName(db, user_name) {
      return db('users')
        .where({ user_name })
        .first()
        .then(user => !!user);
    },
    validatePassword(password) {
      if (password.length < 8) {
        return "Password must be longer than 8 characters";
      }
      if (password.length > 72) {
        return "Password must be less than 72 characters";
      }
      if (password.startsWith(" ") || password.endsWith(" ")) {
        return "Password must not start or end with empty spaces";
      }
      if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
        return "Password must contain 1 upper case, lower case, number and special character";
      }
      return null;
    },
    hashPassword(password) {
     return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
      return {
        id: user.id,
        full_name: xss(user.full_name),
        user_name: xss(user.user_name),
      };
    }
  };
  
  module.exports = UsersService;