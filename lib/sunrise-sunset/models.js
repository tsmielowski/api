const { merge } = require( "lodash" );
const { API_URL, INVALID_DATE, INVALID_REQUEST, OK, REQUEST_TIMEOUT_ERROR, RESPONSE_TIMEOUT_ERROR, UNKNOWN_ERROR } = require( "./consts" );
/**
 * Method parses api response
 * @param {Object} params
 * @param {Object} params.data Api respnse
 * @param {Object} params.data.results Api response data
 * @param {string} params.data.status Api response status
 * @param {string} params.INVALID_DATE Api response status "INVALID_DATE"
 * @param {string} params.INVALID_REQUEST Api response status "INVALID_REQUEST"
 * @param {string} params.OK Api response status "OK"
 * @param {string} params.UNKNOWN_ERROR Api sresponse status "UNKNOWN_ERROR"
 * @private
 * @returns {Object} Parsed api data
 */
const parse = ( { data, INVALID_DATE, INVALID_REQUEST, OK, UNKNOWN_ERROR } ) => {
    data = data || {};
    data.results = data.results || null;
    data.status = data.status || UNKNOWN_ERROR;

    let result = null;
    let results = data.results;
    let status = [ INVALID_DATE, INVALID_REQUEST, OK, UNKNOWN_ERROR ].find( item => item === data.status ) || UNKNOWN_ERROR;

    if ( status === OK && results && typeof results === "object" ) {
        result = {
            sunrise: results.sunrise || "",
            sunset: results.sunset || "",
            solarNoon: results.solar_noon || "",
            dayLength: results.day_length || "",
            civilTwilightBegin: results.civil_twilight_begin || "",
            civilTwilightEnd: results.civil_twilight_end || "",
            nauticalTwilightBegin: results.nautical_twilight_begin || "",
            nauticalTwilightEnd: results.nautical_twilight_end || "",
            astronomicalTwilightBegin: results.astronomical_twilight_begin || "",
            astronomicalTwilightEnd: results.astronomical_twilight_end || ""
        };
    } else {
        status = UNKNOWN_ERROR;
    }

    return { result, status };
};
/**
 * Method parses latitude and longitude parameters
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @private
 * @returns {Object|null} Object with parsed latitude and longitude or null if parsing fails
 */
const parseCoordinates = ( lat, lng ) => {
    lat = parseFloat( lat );
    lng = parseFloat( lng );
    let coordinates = null;

    if ( !isNaN( lat ) && !isNaN( lng ) ) {
        coordinates = {
            lat: Math.floor( lat ) === lat ? lat.toFixed( 1 ) : lat.toString(),
            lng: Math.floor( lng ) === lng ? lng.toFixed( 1 ) : lng.toString()
        };
    }

    return coordinates;
};
/**
 * Method parses date parameter
 * @param {string} date Date
 * @private
 * @returns {Object|null} Object with parsed date or null if parsing fails
 */
const parseDate = date => {
    date = date.toString();
    let parsedDate = null;

    if ( date.match( /^\d{4}-\d{2}-\d{2}$/ ) ) {
        const d = new Date( date );

        if ( ( d.getTime() || d.getTime() === 0 ) && d.toISOString().slice( 0, 10 ) === date ) {
            parsedDate = { date };
        }
    } else if ( date === "today" ) {
        parsedDate = { date };
    }

    return parsedDate;
};
/**
 * Method parses request parameters
 * @param {Object} params
 * @param {string} params.date Date
 * @param {number} params.lat Latitude
 * @param {number} params.lng Longitude
 * @param {string} params.INVALID_DATE Api response status "INVALID_DATE"
 * @param {string} params.INVALID_REQUEST Api response status "INVALID_REQUEST"
 * @private
 * @returns {Object|string} Object with parsed request parameters or error status if parsing fails
 */
const parseParameters = ( { date, lat, lng, INVALID_DATE, INVALID_REQUEST } ) => {
    const parsedCoordinates = parseCoordinates( lat, lng ) || INVALID_REQUEST;
    const parsedDate = parseDate( date ) || INVALID_DATE;

    return ( parsedCoordinates === INVALID_REQUEST && parsedCoordinates ) ||
        ( parsedDate === INVALID_DATE && INVALID_DATE ) || merge( parsedCoordinates, parsedDate );
};
/**
 * @public
 */
class SunriseSunset {
    /**
     * Constructor
     * @constructs SunriseSunset
     * @param {Object} client Client object
     */
    constructor( client ) {
        this.client = client;
        this.client.registerMethod( "sunriseSunset", API_URL, "GET" );
    }
    /**
     * Method executes api get request
     * @param {Object} params
     * @param {string} [params.date="today"] Date
     * @param {number} params.lat Latitude
     * @param {number} params.lng Longitude
     * @public
     * @returns {Object} Promise object
     */
    get( { date = "today", lat, lng } ) {
        return new Promise( ( resolve, reject ) => {
            const parsedParameters = parseParameters( { date, lat, lng, INVALID_DATE, INVALID_REQUEST } );

            if ( typeof parsedParameters === "string" ) {
                resolve( { status: parsedParameters } );
            } else {
                const request = this.client.methods.sunriseSunset( {
                    parameters: parsedParameters
                }, ( data, res ) => {
                    console.log( "url", res.responseUrl );
                    resolve( parse( { data, INVALID_DATE, INVALID_REQUEST, OK, UNKNOWN_ERROR } ) );
                });

                this.client.on( "error", error => {
                    console.error( "error on the client", error );
                    resolve( { status: UNKNOWN_ERROR } );
                } );
                request.on( "error", error => {
                    console.error( "error on the request", error );
                    resolve( { status: UNKNOWN_ERROR } );
                } );
                request.on( "requestTimeout", req => {
                    console.error( "request timeout" );
                    req.abort();
                    resolve( { status: REQUEST_TIMEOUT_ERROR } );
                } );
                request.on( "responseTimeout", () => {
                    console.error( "response timeout" );
                    resolve( { status: RESPONSE_TIMEOUT_ERROR } )
                } );
            }
        } );
    }
};

exports.SunriseSunset = SunriseSunset;