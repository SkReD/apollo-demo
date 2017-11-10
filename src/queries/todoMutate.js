import gql from 'graphql-tag';

export const todoMutate = gql`
    mutation editTodo($id: ID, $name: String){
        editTodo(id: $id, name: $name) {
            id
            name
        }
    }
`;