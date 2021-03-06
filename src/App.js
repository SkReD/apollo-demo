import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import graphql from 'react-apollo/graphql';
import {todosQuery} from './queries/todosQuery';
import {todoMutate} from './queries/todoMutate';


class Todos extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.data.todos !== prevProps.data.todos) {
            console.log('new data!');
        }
    }
    render() {
        if (this.props.data.loading) {
            return <img src={logo} className="App-logo" alt="logo"/>;
        } else if (this.props.data.error) {
            return JSON.stringify(this.props.data.error, null, 4);
        }
        else {
            return this.props.data.todos.map(todo =>
                <div key={todo.id}>
                    {todo.name}
                    <button onClick={() => this.props.onEdit(todo)}>edit</button>
                </div>
            );
        }
    }
}

const TodosWithData = graphql(todosQuery)(Todos);

class TodoForm extends Component {
    render() {
        return <form onSubmit={(event) => {
            event.preventDefault();
            this.props.mutate({
                variables: {id: this.props.editTodo.id, name: this.editInput.value}
            })
                .then(() => {
                    this.props.onSuccess();
                })
        }}>
            <input defaultValue={this.props.editTodo.name} ref={input => this.editInput = input}/>
            <button type='submit'>Save</button>
        </form>
    }
}

const TodoFormWithMutation = graphql(todoMutate, {
    options(props) {
        return {
            variables: {
                withError: props.withError
            }
        }

    }
})(TodoForm);

class App extends Component {
    constructor(...args) {
        super(...args);
        this.state = {withError: false};
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="App-intro">
                    <button onClick={() => this.setState({withError: !this.state.withError})}>
                        {this.state.withError ? 'Request without error' : 'Request with error'}
                    </button>
                    <button onClick={() => this.setState({rerender: !this.state.rerender})}>Rerender</button>
                    <button onClick={() => this.setState({unmountTodosOnEdit: !this.state.unmountTodosOnEdit})}>
                        {this.state.unmountTodosOnEdit ? 'Dont unmount todos on edit' : 'Unmount todos on edit'}
                    </button>
                    {
                        this.state.editTodo &&
                            <TodoFormWithMutation editTodo={this.state.editTodo} onSuccess={() => this.setState({editTodo: null})}/>
                    }
                    {
                        this.state.unmountTodosOnEdit && this.state.editTodo
                            ? null
                            : <TodosWithData withError={this.state.withError} onEdit={(todo) => this.setState({editTodo: todo})}/>
                    }
                </div>
            </div>
        );
    }
}


export default App;
