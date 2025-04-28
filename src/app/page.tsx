'use client'
import axios from 'axios';
import { v4 as uuid } from "uuid";
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Alert } from '@mui/material';
import styles from './styles.module.css'

type Produto = {
  "id": string,
  "text": string,
  "checked": boolean
}

export default function MarketList() {
  const [lista, setLista] = useState<Produto[]>([]);
  const [item, setItem] = useState<string>("");
  const [alertErro, setAlertErro] = useState<boolean>(false);

  useEffect(() => {
    loadItens();
  }, [])


  async function loadItens() {
    const response = await axios.get(`http://localhost:3001/itens`)
    setLista(response.data)
  }
  async function handleAddItem() {
    if (item == "") {
      setAlertErro(true)
      return false;
    } else {
      setAlertErro(false)
    }

    const newItem = {
      id: uuid(),
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
  function PrecionouEnter(event: any) {
    if (event.code == 'Enter' || event.code == 'NumpadEnter') {
      handleAddItem()
    }


  }


  return (
    <div className={styles.container}>
      <h1>MarketList</h1>
      <div className={styles.grupoInput}>
        <input
          type="text"
          className={styles.produtoText}
          placeholder="Adicionar uma novo item"
          value={item}
          onChange={(e) => { setItem(e.target.value) }}
          onKeyDown={(event) => PrecionouEnter(event)}
        />
        <button className={styles.addProduto} onClick={handleAddItem}>
          <span>
            <AddIcon />
          </span></button>
      </div>
      <div className={`${styles.alert} ${alertErro && styles.erro}`} >
        <Alert severity="error">Campo de itens em branco.</Alert>
      </div>
      <ul className={styles.listaProduto}>
        {
          lista.map(value => (
            <li key={value.id} className={`${value.checked && styles.completed}`}>
              <span>{value.text}</span>
              <div>
                <button
                  className={`${styles.incheck} ${value.checked && styles.check}`}
                  onClick={() => handleUpdateItem(value.id)}>
                  {value.checked && <RadioButtonCheckedIcon /> || <RadioButtonUncheckedIcon />}
                </button>
                <button className={styles.delete} onClick={() => handleRemoveItem(value.id)}><DeleteForeverIcon /></button>
              </div>
            </li>
          ))
        }
      </ul>

    </div>
  );
}