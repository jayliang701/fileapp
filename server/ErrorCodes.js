/**
 * Created by YDY on 2016/2/23.
 */

var CODES = require("weroll/ErrorCodes");

//user
CODES.NO_SUCH_USER = 10001;
CODES.USER_EXISTED = 10002;
CODES.NICKNAME_USED = 10003;

//social
CODES.BLOCKED = 20001;

module.exports = CODES;
