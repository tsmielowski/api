/**
 * Api url
 * @public
 * @readonly
 * @type {string}
 */
const API_URL = "https://api.sunrise-sunset.org/json";
/**
 * Api response status "INVALID_DATE"
 * @public
 * @readonly
 * @type {string}
 */
const INVALID_DATE = "INVALID_DATE";
/**
 * Api response status "INVALID_REQUEST"
 * @public
 * @readonly
 * @type {string}
 */
const INVALID_REQUEST = "INVALID_REQUEST";
/**
 * Api response status "OK"
 * @public
 * @readonly
 * @type {string}
 */
const OK = "OK";
/**
 * Api response status "REQUEST_TIMEOUT_ERROR"
 * @public
 * @readonly
 * @type {string}
 */
const REQUEST_TIMEOUT_ERROR = "REQUEST_TIMEOUT_ERROR";
/**
 * Api response status "RESPONSE_TIMEOUT_ERROR"
 * @public
 * @readonly
 * @type {string}
 */
const RESPONSE_TIMEOUT_ERROR = "RESPONSE_TIMEOUT_ERROR";
/**
 * Api response status "UNKNOWN_ERROR"
 * @public
 * @readonly
 * @type {string}
 */
const UNKNOWN_ERROR = "UNKNOWN_ERROR";

module.exports = { API_URL, INVALID_DATE, INVALID_REQUEST, OK, REQUEST_TIMEOUT_ERROR, RESPONSE_TIMEOUT_ERROR, UNKNOWN_ERROR };