import { ApolloClient, DefaultOptions } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getAuthTokenFromCookie } from '../App'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'

let client: ApolloClient<NormalizedCacheObject> | undefined

export function recreateClient() {
    client = undefined
}

export function getApolloClient() {
    if( !client ) {
    
        const authToken = getAuthTokenFromCookie()[0]

        const httpLink = new HttpLink({
            uri: 'http://localhost:4000/graphql',
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
        
        const wsLink = new WebSocketLink({
            uri: 'ws://localhost:4000/graphql',
            options: {
                reconnect: true,
                connectionParams: {
                    authToken: authToken
                }
            }
        })

        const terminatingLink = split(({ query }) => {
            const def = getMainDefinition(query);
            if (def.kind === 'OperationDefinition') {
                const opDef = def as OperationDefinitionNode
                return opDef.operation === 'subscription'
            }
            return false;
        }, wsLink, httpLink)

        const apolloLink = ApolloLink.from([terminatingLink])


        client = new ApolloClient({
            link: apolloLink,
            cache: new InMemoryCache()
        })
    }

    return client
}
