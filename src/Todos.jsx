import React, { useEffect, useRef,useState } from 'react'
import { db } from "./firebase"
import {collection,getDocs,updateDoc,doc,deleteDoc,addDoc} from "firebase/firestore"

function Todos() {
    let [todoValue,setTodoValue] = useState({text:"",isDone:false})
    let [todos,setTodos] = useState([])
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
          <form onSubmit={addFun} className="border border-slate-950 p-3 max-w-lg flex justify-between rounded">
              <input className='flex-1 outline-none' placeholder='Todo...' type="text" name="text" id="" value={todoValue.text} onChange={(e) => setTodoValue({...todoValue,text:e.target.value})} />
              <button>Add</button>
          </form>
          {/* ==================== MAP ============ */}
          <ul >
              {todos.map(todo => (
                  <li className='border flex justify-around items-center mt-2'  style={todo.isDone ? {backgroundColor:"green"} : {background:"transparent"}}>
                      <span className='w-96' >{todo.text}</span>
                      <button className="bg-blue-500 text-white font-bold py-1 px-5 rounded button outline-none hover:bg-blue-300" onClick={() => doneFun(todo.id,todo.isDone)}>Done</button>
                      <button className="bg-red-600 text-white font-bold py-1 px-5 rounded button outline-none hover:bg-red-400" onClick={() => deleteFun(todo.id)}>Delete</button>
                  </li>
              ) )}
          </ul>
    </div>
  )
}

export default Todos