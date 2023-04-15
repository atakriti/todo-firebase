import React, { useEffect, useRef,useState } from 'react'
import { db } from "./firebase"
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore"
// ======================= IMAGE ===================
import { storage } from "./firebase"
import {ref,uploadBytes,listAll, getDownloadURL,deleteObject} from "firebase/storage"
// ======================= END IMAGE ===================
import {v4} from "uuid"

function Todos() {
    let [todoValue, setTodoValue] = useState({ text: "", isDone: false })
    // ==================== Upload img ===================
    let [imgValue, setImgValue] = useState(null)
    let [images,setImages] = useState([])
    console.log("🚀 ~ file: Todos.jsx:15 ~ Todos ~ images:", images)
    // ==================== End Upload img ===================
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
// ======================= IMAGE ===================
    // ================================ Delete ======================
    let deleteFun = async (id) => {
        let selectedUser = doc(db, "todos", id)
        await deleteDoc(selectedUser)
        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({...doc.data(),id:doc.id}))))

    }
    // ================================ IMAGE ========================
    
    let getAllFiles = ref(storage, "imagesTodo/") // Here grab all files
    let handleUploadImg = (e) => {
        e.preventDefault()
        if (imgValue === null) {
            return;
        }
        let imageRef = ref(storage, `imagesTodo/${imgValue.name + v4()}`)
        // then upload the image to firebase
        uploadBytes(imageRef, imgValue).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImages(prev => [...prev,url])
                alert("Image uploaded")
            })
            
        })

    }
    // =============== Delete img ================
    let handleDeleteImg = (imgUrl) => {
        let imageRef = ref(storage, imgUrl);
        deleteObject(imageRef).then(() => {
            let filterOut = images.filter(url => url !== imgUrl)
            setImages(filterOut);
            alert("Image deleted");
        }).catch((error) => {
            console.error(error);
        });
    }
    useEffect(() => {
        // =============== IMAGES ================
        listAll(getAllFiles).then(res => {
            res.items.forEach(item => {
                getDownloadURL(item).then(url => {
                    setImages(prev => [...prev,url])
                })
            })
        })
        // =============== END IMAGES ================
        // We have to map through them because its a long object and we put date() because it make it shorter, firebase made this shortcut
        fetchingTodos().then(data => setTodos(data?.docs?.map(doc => ({...doc.data(),id:doc.id}))))
    },[])
  return (
      <div>
          <form onSubmit={addFun} className="border border-slate-950 p-3 max-w-lg flex justify-between rounded">
              <input className='flex-1 outline-none' placeholder='Todo...' type="text" name="text" id="" value={todoValue.text} onChange={(e) => setTodoValue({...todoValue,text:e.target.value})} />
              <button>Add</button>
          </form>
          <h1 className='font-bold text-2xl my-4'>Upload an Image</h1>
          <form onSubmit={handleUploadImg} className='mb-10'>
              <input type="file" name="" id="" onChange={e => setImgValue(e.target.files[0])} />
              <button className='bg-amber-500 px-3 py-1 rounded-md text-white'>Upload</button>
          </form>
          <form action=""></form>
          {/* ==================== MAP ============ */}
          <ul >
              {todos?.map(todo => (
                  <li className='border flex justify-around items-center mt-2'  style={todo.isDone ? {backgroundColor:"green"} : {background:"transparent"}}>
                      <span className='w-96' >{todo.text}</span>
                      <button className="bg-blue-500 text-white font-bold py-1 px-5 rounded button outline-none hover:bg-blue-300" onClick={() => doneFun(todo.id,todo.isDone)}>Done</button>
                      <button className="bg-red-600 text-white font-bold py-1 px-5 rounded button outline-none hover:bg-red-400" onClick={() => deleteFun(todo.id)}>Delete</button>
                  </li>
              ) )}
          </ul>
          <div className="container md:flex justify-between gap-x-2">
              
              {images.map(img => <span className='flex flex-col '>
                  <img className='w-full rounded-lg mb-2' src={img} />
                  <button onClick={()=>handleDeleteImg(img)} className='bg-red-800 text-white px-2 py-1'>Delete</button>
          </span>)}
          </div>
    </div>
  )
}

export default Todos