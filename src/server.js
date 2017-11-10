const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const typeDefs = `
  type Todo {
    id: ID!
    name: String
  }
  
  type Query {
    todos: [Todo],
    todo(id: ID): Todo
  }
  
  type Mutation {
    editTodo(id: ID, name: String): Todo
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
`;

const todos = [
    {
        id: '1',
        name: 'Feed the cat'
    },
    {
        id: '2',
        name: 'Buy a dog'
    }
];

const resolvers = {
    Query: {
        todos() {
            return todos;
        },
        todo(o, {id}) {
            return todos.find(todo => todo.id === id);
        }
    },
    Mutation: {
        editTodo(root, doc) {
            todos.find(todo => todo.id == doc.id).name = doc.name;
            return doc;
        },
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// The root provides a resolver function for each API endpoint

const PORT = 4000;

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({
    schema
}));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

app.listen(PORT);