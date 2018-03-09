const { INVALID_DATE, INVALID_REQUEST, OK, REQUEST_TIMEOUT_ERROR, RESPONSE_TIMEOUT_ERROR, UNKNOWN_ERROR } = require( "./consts" );

const resolvers = {
    Query: {
        sunriseSunset: () => ( {
            getDayDetail: ( { date = "today", lat, lng }, context ) => context.SunriseSunset.get( { date, lat, lng } ),
            getSunrise: ( { date = "today", lat, lng }, context ) => context.SunriseSunset.get( { date, lat, lng } ),
            getSunset: ( { date = "today", lat, lng }, context ) => context.SunriseSunset.get( { date, lat, lng } )
        } )
    }
};
const schema = [`

type DayDetail @cacheControl(maxAge: 300) {
    dayLength : String!
    solarNoon : String!
}

type DayDetailResponse @cacheControl(maxAge: 60) {
    result : DayDetail
    status : SunriseSunsetStatus!
}

type SunriseDetail @cacheControl(maxAge: 300) {
    astronomicalTwilightBegin : String!
    civilTwilightBegin        : String!
    nauticalTwilightBegin     : String!
    sunrise                   : String!
}

type SunriseResponse @cacheControl(maxAge: 60) {
    result : SunriseDetail
    status : SunriseSunsetStatus!
}

type SunsetDetail @cacheControl(maxAge: 300) {
    astronomicalTwilightEnd   : String!
    civilTwilightEnd          : String!
    nauticalTwilightEnd       : String!
    sunset                    : String!
}

type SunsetResponse @cacheControl(maxAge: 60) {
    result : SunsetDetail
    status : SunriseSunsetStatus!
}

type SunriseSunset @cacheControl(maxAge: 300) {
    getDayDetail(lat: Float!, lng: Float!, date: String) : DayDetailResponse
    getSunrise(lat: Float!, lng: Float!, date: String) : SunriseResponse
    getSunset(lat: Float!, lng: Float!, date: String) : SunsetResponse
}

enum SunriseSunsetStatus {
    ${ INVALID_DATE }
    ${ INVALID_REQUEST }
    ${ OK }
    ${ REQUEST_TIMEOUT_ERROR }
    ${ RESPONSE_TIMEOUT_ERROR }
    ${ UNKNOWN_ERROR }
}

extend type Query {
    sunriseSunset : SunriseSunset!
}

`];

module.exports = { resolvers, schema };