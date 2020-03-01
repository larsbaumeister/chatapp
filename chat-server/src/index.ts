import "reflect-metadata"
import {createConnection, PromiseUtils, Connection, ObjectType} from "typeorm"
import { UserGql } from './gql/UserGql'
import { MessageGql } from './gql/MessageGql'

import { DateType } from './gql/scalar-types/DateType'
import { ApolloServer } from 'apollo-server'
import { mergeSchemas } from 'graphql-tools'
import { UserRepository } from "./repo/UserRepository"
import { verify } from "jsonwebtoken"
import { Token } from "graphql"


export const JWT_SECRET = 'a super secret key'

export function getRepo<T>(ctx: CTX, repoType: ObjectType<T>) {
    return ctx.dbConnection.getCustomRepository(repoType)
}

export interface TokenData {
    id: number
    username: string
    roles: string[]
}

export interface MyAuth extends TokenData {
    isAdmin: boolean
}

export interface CTX {
    dbConnection: Connection,
    auth: MyAuth
}

function getTokenData(token: string): TokenData {
    try {
        if (token) {
            const data = verify(token, JWT_SECRET)
            if (typeof data === 'object')
                return data as TokenData
            else 
                return null
        }
        return null
    } catch (err) {
        return null
    }
}

function validateTokenAndCreateContext(token: string, con: Connection) {
    
    const tokenData = getTokenData(token)

    const context: CTX =  {
        dbConnection: con,
        auth: {
            ...tokenData,
            isAdmin: tokenData?.roles?.includes('ADMIN')
        }
    }
    return context
}

function setupApolloServer(dbConnection: Connection) {
    
    const schema = mergeSchemas({
        schemas: [ 
            MessageGql.typeDefinition,
            UserGql.typeDefinition,
            DateType.schema
        ],
        resolvers: [
            MessageGql.resolver,
            UserGql.resolver,
            DateType.resolver
        ]
    })


    const server = new ApolloServer({ 
        schema, 

        subscriptions: {
            onConnect: (connectionParams, webSocket) => {
                // this will create the context for websocket connections
                const token: string = connectionParams['authToken']
                return validateTokenAndCreateContext(token, dbConnection)
            }
        },

        context:  ({ req, connection }) => {
            // this function will create the context for the resolvers of normal http requests
            if (connection) {
                return connection.context
            } else {
                // check if the request has send an authorization header and extract the JWT token
                const tokenWithBearer = req.headers.authorization || ''
                const token = tokenWithBearer.split(' ')[1]
                return validateTokenAndCreateContext(token, dbConnection)
            }
        }
    });
    
    server.listen().then(({ url,subscriptionsUrl }) => {
        console.log(`🚀  Server ready at ${url}`)
        console.log(`🚀  Subscription Server ready at ${subscriptionsUrl}`)
    });

}



createConnection().then(async connection => {

    setupApolloServer(connection)

}).catch(error => console.log(error))
