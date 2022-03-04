import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }, []);

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:description, amount:amount});
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items,response.data]);
        setDescription('');
        setAmount('');
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  };

  function remove(id) {
    const json = JSON.stringify({id:id});
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
  };

  return (
    <div className="container">
      <h3>Shopping List</h3>
      <form onSubmit={save}>
        <label>New Item</label>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder='Type Description'/>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='Type Amount'/>
        <button>Add</button>
      </form>
      <ul>
        {items?.map(item => (
          <li key={item.id}>
            <p>{item.description}</p>&nbsp;
            <p>{item.amount}</p>&nbsp;
            <a href="#" className="delete" onClick={() => remove(item.id)}>Delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
