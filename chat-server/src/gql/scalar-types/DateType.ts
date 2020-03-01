import { GraphQLScalarType, Kind } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';


export const DateType =  {

    schema: 'scalar Date',

    resolver: {

        Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Date Datatype',
            serialize(value: Date) {
                return value.toISOString()
            },
            parseValue(value) {
                return new Date(value)
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT) {
                    return new Date(ast.value) // ast value is always in string format
                }
                return null;
            }
        })

    }

}

