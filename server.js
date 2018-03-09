const { Engine } = require( "apollo-engine" );
const { graphqlExpress, graphiqlExpress } = require( "apollo-server-express" );
const bodyParser = require( "body-parser" );
const compression = require( "compression" );
const express = require( "express" );
const depthLimit = require( "graphql-depth-limit" );
const { createServer } = require( "http" );
const { client } = require( "./lib/sunrise-sunset/connector" );
const { SunriseSunset } = require( "./lib/sunrise-sunset/models" );
const { schema } = require( "./schema" );

const run = ( { ENGINE_API_KEY, PORT: portFromEnv = 3000 } = {} ) => {
    const app = express();

    if ( ENGINE_API_KEY ) {
        const engine = new Engine( {
            dumpTraffic: true,
            endpoint: "/graphql",
            engineConfig: {
                apiKey: ENGINE_API_KEY,
/*
                frontends: [ {
                    endpoints: [ "/graphql" ],
                    extensions: {
                        strip: [],
                        blacklist: []
                    }
                } ],
*/
                logging: {
                    level: "DEBUG"
                },
                persistedQueries: {
                    store: "pq"
                },
                queryCache: {
                    privateFullQueryStore: "privateResponseCache",
                    publicFullQueryStore: "publicResponseCache"
                },
                reporting: {
                    debugReports: true
                },
                stores: [
                    {
                        name: "pq",
                        inMemory: {
                            cacheSize: "5000000"
                        }
                    }, {
                        name: "privateResponseCache",
                        inMemory: {
                            cacheSize: 10485760
                        }
                    }, {
                        name: "publicResponseCache",
                        inMemory: {
                            cacheSize: 10485760
                        }
                    }
                ]
            },
            graphqlPort: portFromEnv
        } );

        engine.start();
        process.on( "SIGINT", () => {
            engine.stop();
            process.exit();
        } );
        app.use( engine.expressMiddleware() );
    }

    app.use( compression() );
    app.use( "/graphql", bodyParser.json(), graphqlExpress( req => {
        const query = req.query.query || req.body.query || "";

        if ( query.length > 2000 ) {
            throw new Error( "Query too large" );
        }

        return {
            cacheControl: true,
            context: {
                SunriseSunset: new SunriseSunset( client )
            },
            schema,
            tracing: true,
            validationRules: [ depthLimit( 5 ) ]
        };
    } ) );
    app.use( "/graphiql", graphiqlExpress( {
        endpointURL: "/graphql"
    } ) );

    const server = createServer( app );

    server.listen( portFromEnv, () => {
        console.log( `API Server is now running on http://localhost:${portFromEnv}` );
    } );
    return server;
};

exports.run = run;