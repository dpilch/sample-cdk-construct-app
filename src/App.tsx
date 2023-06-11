import { API, Amplify } from 'aws-amplify';
import { GraphQLQuery, GraphQLSubscription, graphqlOperation } from '@aws-amplify/api';
import { CreateTodoMutation, DeleteTodoMutation, ListTodosQuery, OnCreateTodoSubscription, OnDeleteTodoSubscription, OnUpdateTodoSubscription, Todo } from './API';
import { listTodos } from './graphql/queries';
import { onCreateTodo, onUpdateTodo, onDeleteTodo } from './graphql/subscriptions';
import { useEffect, useState } from 'react';
import { createTodo, deleteTodo } from './graphql/mutations';
import appConfig from './appConfig';

Amplify.configure(appConfig);

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
        <li>Backend Defined using the AmplifyGraphQLApi CDK Construct - <a href="https://github.com/aherschel/sample-cdk-construct-app/blob/main/backend/stacks/backend-stack.ts">Source</a></li>
        <li>Amplify Build Defined using the Amplify Experimental L2 CDK Constructs - <a href="https://github.com/aherschel/sample-cdk-construct-app/blob/main/backend/stacks/deployment-stack.ts">Source</a></li>
        <li>Client Defined using the Amplify JS Lib, manually importing API - <a href="https://github.com/aherschel/sample-cdk-construct-app/blob/main/src/App.tsx">Source</a></li>
      </ul>
    </div>
  );
};
