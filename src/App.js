import './App.css';

import { useState, useEffect } from 'react';
import {BsTrash, BsBookmarkCheck, BsBookmarkFill} from 'react-icons/bs';

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState("");

  // load todos ao carregar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => data)
      .catch(err => console.log(err));
      
      setLoading(false);
      setTodos(res);
    }

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.floor(Math.random() * 10000),
      title: title,
      time,
      done: false
    }

    console.log(todo);  
    console.log(title);

    await fetch(`${API}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    });
    // estado anterior + novo todo
    setTodos((prevState) => [...prevState, todo]);

    setTitle("");
    setTime("");
    
  }

  if (loading) {
    return <p>Carregando...</p>
  }


  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: 'DELETE'
    });
    console.log(id);
    setTodos((prevState) => prevState.filter(todo => todo.id !== id));
  }

  const handleFill = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = {...todo, done: !todo.done};

    await fetch(`${API}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    });

    setTodos((prevState) => prevState.map(todo => todo.id === id ? updatedTodo : todo));
  };

  const unmarkFill = async (id) => {
    const data = await fetch(`${API}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({done: false})
    });
    setTodos((prevState) => prevState.map(todo => todo.id === id ? {...todo, done: false} : todo));
  }

  return (
    <div className="App">

      <div className='todo-header'>
        <h1>Gestão de tarefas</h1>
      </div>

      <div className='form-todo'>
        <h2>insira sua nova tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>o que vai fazer?</label>
            <input type='text' id='title' placeholder='titulo da tarefa' value={title} onChange={(e) => setTitle(e.target.value)} 
            required/>
          </div>
          <div className='form-control'>
            <label htmlFor='title'>Duracao</label>
            <input type='text' id='title' placeholder='tempo duracao' value={time} onChange={(e) => setTime(e.target.value)} 
            required/>
          </div>
          <button type='submit'>Adicionar</button>

        </form>
      </div>

      <div className='list-todo'>
        <h2>lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {loading && <p>Carregando...</p>}
        {todos.map(todo => (
          <div key={todo.id} className='todo'>
            <div className='todo-title'>
              <h4 className={todo.done ? 'todo-done' : ""}>Título: {todo.title} - {todo.id}</h4>
              <p> Duração: {todo.time}</p>
            </div>
            <div className='todo-actions'>
              <button onClick={() => handleDelete(todo.id)}><BsTrash/></button>
              {todo.done ? <button onClick={() => unmarkFill(todo.id)}><BsBookmarkFill/></button> : <button onClick={() => handleFill(todo.id)}><BsBookmarkCheck/></button>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
