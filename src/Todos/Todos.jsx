import React, { useEffect, useRef,useState } from 'react'
import { db } from "../firebase"
import {collection,getDocs,updateDoc,doc,deleteDoc,addDoc} from "firebase/firestore"

function Todos() {
    let [todoValue,setTodoValue] = useState({text:"",isDone:false})
    let [todos,setTodos] = useState([])
    console.log("🚀 ~ file: Todos.jsx:8 ~ Todos ~ todos:", todos)
    let todosCollection = collection(db, "todos")
    // ================================================= Getting Data ==========================
    let fetchingTodos = async () => {
        let data = await getDocs(todosCollection)
        return data
    }
    // ============================== Adding ===============================
    let addFun = async (e) => {
        e.preventDefault()
        await addDoc(todosCollection, {text:todoValue.text,isDone:todoValue.isDone})
        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        setTodoValue({text:"",isDone:false})

    }
    // ================================ Update ===========================
    let doneFun = async (id,isDone) => {
        // We need doc from firebase/firestore to specify which user
        let selectedUser = doc(db, "todos", id)
        let changing = {isDone:!isDone}
        await updateDoc(selectedUser, changing)
        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({...doc.data(),id:doc.id}))))
        console.log(id);
    }
    // ================================ Delete ======================
    let deleteFun = async (id) => {
        let selectedUser = doc(db, "todos", id)
        await deleteDoc(selectedUser)
        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({...doc.data(),id:doc.id}))))

    }
    useEffect(() => {
        // We have to map through them because its a long object and we put date() because it make it shorter, firebase made this shortcut
        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({...doc.data(),id:doc.id}))))
    },[])
  return (
      <div>
          <form onSubmit={addFun}>
              <input placeholder='Todo...' type="text" name="text" id="" value={todoValue.text} onChange={(e) => setTodoValue({...todoValue,text:e.target.value})} />
              <button>Add</button>
          </form>
          {/* ==================== MAP ============ */}
          <ul>
              {todos.map(todo => (
                  <li style={todo.isDone ? {backgroundColor:"green"} : {background:"transparent"}}>
                      <span>{todo.text}</span>
                      <button onClick={() => doneFun(todo.id,todo.isDone)}>Done</button>
                      <button onClick={() => deleteFun(todo.id)}>Delete</button>
                  </li>
              ) )}
          </ul>
    </div>
  )
}

export default Todos