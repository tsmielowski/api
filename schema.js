const { makeExecutableSchema } = require( "graphql-tools" );
const { merge } = require( "lodash" );
const sunriseSunset = require( "./lib/sunrise-sunset/schema" );

const rootResolvers = {
    Query: {
        supportedAPI: () => [ "SunriseSunset" ],
        version: () => "1.0.0"
    }
};
const rootSchema = [`

    type Query {
        supportedAPI : [String!]! @cacheControl(maxAge: 300)
        version      : String @cacheControl(maxAge: 300)
    }

    schema {
        query : Query
    }

`];
const resolvers = merge( rootResolvers, sunriseSunset.resolvers );
const typeDefs = [ ...rootSchema, ...sunriseSunset.schema ];
const schema = makeExecutableSchema( { resolvers, typeDefs } );

exports.schema = schema;