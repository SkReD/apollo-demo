import gql from 'graphql-tag';

export const todosQuery = gql`
    query {
        todos {
            id
            name
        }
    }
`;