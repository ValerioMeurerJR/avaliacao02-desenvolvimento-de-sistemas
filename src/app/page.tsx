'use client'
import axios from 'axios';
import { v4 as uuid } from "uuid";
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type Produto = {
  "id": string,
  "text": string,
  "checked": boolean
}

export default function MarketList() {
  const [lista, setLista] = useState<Produto[]>([]);
  const [item, setItem] = useState<string>();
  useEffect(() => {
    loadItens();
  }, [])


  async function loadItens() {
    const response = await axios.get(`http://localhost:3001/itens`)
    setLista(response.data)
  }

  async function handleAddItem() {
    const newItem = {
      id: uuid,
      text: item,
      checked: false
    }
    await axios.post('http://localhost:3001/itens', newItem)
    await loadItens()
    setItem('')
  }

  async function handleRemoveItem(id: string) {
    await axios.delete(`http://localhost:3001/itens/${id}`)
    loadItens()
  }

  async function handleUpdateItem(id: string) {
    const response = await axios.get(`http://localhost:3001/itens/${id}`)
    console.log(response.data.checked)
    let checked: boolean
    if (response.data.checked == false) {
      checked = true
    } else {
      checked = false
    }
    await axios.patch(`http://localhost:3001/itens/${id}`, {
      "checked": checked
    })
    loadItens()
  }


  return (
    <div className="container">
      <h1>ToDo List</h1>
      <div className="grupo-input">
        <input
          type="text"
          placeholder="Adicionar uma nova tarefa"
          value={item}
          onChange={(e) => { setItem(e.target.value) }}
        />
        <button id="add-tarefa" onClick={handleAddItem}>
          <span className="material-symbols-outlined">
          <AddIcon />
          </span></button>
      </div>
      <ul id="lista-tarefa">
        {
          lista.map(value => (
            <li key={value.id} className={`${value.checked && "completed"}`}>
              <span>{value.text}</span>
              <div>
                <button className="check material-symbols-outlined" onClick={() => handleUpdateItem(value.id)}><CheckIcon /></button>
                <button className="material-symbols-outlined delete" onClick={() => handleRemoveItem(value.id)}><DeleteForeverIcon /></button>
              </div>
            </li>
          ))
        }
      </ul>

    </div>
  );
}