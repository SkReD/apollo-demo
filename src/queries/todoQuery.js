import gql from 'graphql-tag';

export const todoQuery = gql`
    query Todo($id: ID){
        todo(id: $id) {
            id
            name
        }
    }
`;