import { API, Amplify } from 'aws-amplify';
import { GraphQLQuery, GraphQLSubscription, graphqlOperation } from '@aws-amplify/api';
import { CreateTodoMutation, DeleteTodoMutation, ListTodosQuery, OnCreateTodoSubscription, OnDeleteTodoSubscription, OnUpdateTodoSubscription, Todo } from './API';
import { listTodos } from './graphql/queries';
import { onCreateTodo, onUpdateTodo, onDeleteTodo } from './graphql/subscriptions';
import { useEffect, useState } from 'react';
import { createTodo, deleteTodo } from './graphql/mutations';

Amplify.configure({
  aws_appsync_region: 'us-west-2',
  aws_appsync_graphqlEndpoint: 'https://ie5nidytlzgzdilz6xokwwg5su.appsync-api.us-west-2.amazonaws.com/graphql',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: 'da2-c4onu3qff5gcthiyq3pllepb3q',
});

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState('');

  const refreshTodos = async () => {
    const returnedTodos = await API.graphql<GraphQLQuery<ListTodosQuery>>(graphqlOperation(listTodos));
    setTodos(returnedTodos.data?.listTodos?.items as any[]);
  };

  const deleteThisTodo = async (id: string) => {
    await API.graphql<GraphQLQuery<DeleteTodoMutation>>(graphqlOperation(deleteTodo, { input: { id } }));
    await refreshTodos();
  };

  const createNewTodo = async () => {
    if (description === '') return;
    await API.graphql<GraphQLQuery<CreateTodoMutation>>(graphqlOperation(createTodo, { input: { description } }));
    setDescription('');
    await refreshTodos();
  };

  useEffect(() => {
    const refreshOnEvent = { next: () => refreshTodos() };
    const onCreate = API.graphql<GraphQLSubscription<OnCreateTodoSubscription>>(graphqlOperation(onCreateTodo)).subscribe(refreshOnEvent);
    const onUpdate = API.graphql<GraphQLSubscription<OnUpdateTodoSubscription>>(graphqlOperation(onUpdateTodo)).subscribe(refreshOnEvent);
    const onDelete = API.graphql<GraphQLSubscription<OnDeleteTodoSubscription>>(graphqlOperation(onDeleteTodo)).subscribe(refreshOnEvent);
    refreshTodos();
    return () => {
      onCreate.unsubscribe();
      onUpdate.unsubscribe();
      onDelete.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h3>Todos</h3>
      <ol>
        {todos.map(todo => (
          <li key={todo.id}>{todo.description} <span onClick={() => deleteThisTodo(todo.id)}>[x]</span></li>
        ))}
      </ol>
      <h3>Add Todo</h3>
      <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
      <span onClick={() => createNewTodo()}>{' '}[Create]</span>
      <h3>About</h3>
      <ul>
        <li>Backend Defined using the AmplifyGraphQLApi CDK Construct - <a href="https://github.com/aherschel/sample-cdk-construct-app/blob/main/src/app.ts">Source</a></li>
        <li>Frontend Defined using the Amplify JS Lib, manually importing API - <a href="https://github.com/aherschel/sample-cdk-construct-app/blob/www/src/App.tsx">Source</a></li>
      </ul>
    </div>
  );
};
