import gql from 'graphql-tag';

export const todosQuery = gql`
    query Todos($withError: Boolean) {
        todos(withError: $withError) {
            id,
            name
        }
    }
`;