const Client = require( "node-rest-client" ).Client;
const client = new Client( {
    requestConfig: {
        timeout: 3000
    },
    responseConfig: {
        timeout: 1000
    }
} );

exports.client = client;