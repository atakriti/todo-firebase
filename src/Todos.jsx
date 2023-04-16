import React, { useEffect, useRef,useState } from 'react'
import { db } from "./firebase"
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore"
// ======================= IMAGE ===================
import { storage } from "./firebase"
import {ref,uploadBytes,listAll, getDownloadURL,deleteObject} from "firebase/storage"
// ======================= END IMAGE ===================
import {v4} from "uuid"
import fileImg from "./file.png"
function Todos() {
    let [todoValue, setTodoValue] = useState({ text: "", isDone: false })
    // ==================== Upload img ===================
    let [imgValue, setImgValue] = useState(null)
    let [images,setImages] = useState([])
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
        // ================== ADD IMG =================
        let imageRef = ref(storage, `imagesTodo/${imgValue.name + v4()}`)
        // then upload the image to firebase
        uploadBytes(imageRef, imgValue).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                // Here we add the todo with the image using the url
             addDoc(todosCollection, { text: todoValue.text, isDone: todoValue.isDone,img:url })
            alert("Done")
            fetchingTodos().then(data => setTodos(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        })
        
    })
        





        
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
    let deleteFun = async (id,imgUrl) => {
        let selectedUser = doc(db, "todos", id)
        
        let imageRef = ref(storage, imgUrl);
        deleteObject(imageRef).then(() => {
             deleteDoc(selectedUser)
            alert("deleted");
        }).catch((error) => {
            console.error(error);
        });

        fetchingTodos().then(data => setTodos(data.docs.map(doc => ({...doc.data(),id:doc.id}))))

    }
    // ================================ IMAGE ========================
    
    let getAllFiles = ref(storage, "imagesTodo/") // Here grab all files
    // let handleUploadImg = (e) => {
    //     e.preventDefault()
    //     // Here is like input is required
    //     if (imgValue === null) {
    //         return;
    //     }
    //     let imageRef = ref(storage, `imagesTodo/${imgValue.name + v4()}`)
    //     // then upload the image to firebase
    //     uploadBytes(imageRef, imgValue).then((snapshot) => {
    //         getDownloadURL(snapshot.ref).then((url) => {
    //             setImages(prev => [...prev,url])
    //             alert("Image uploaded")
    //         })
            
    //     })

    // }
    // =============== Delete img ================
    // let handleDeleteImg = (imgUrl) => {
    //     let imageRef = ref(storage, imgUrl);
    //     deleteObject(imageRef).then(() => {
    //         let filterOut = images.filter(url => url !== imgUrl)
    //         setImages(filterOut);
    //         alert("Image deleted");
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }
    useEffect(() => {
        //! =============== IMAGES To get all images from the store ================
        // listAll(getAllFiles).then(res => {
        //     res.items.forEach(item => {
        //         getDownloadURL(item).then(url => {
        //             setImages(prev => [...prev,url])
        //         })
        //     })
        // })
        // =============== END IMAGES ================
        // We have to map through them because its a long object and we put date() because it make it shorter, firebase made this shortcut
        fetchingTodos().then(data => setTodos(data?.docs?.map(doc => ({...doc.data(),id:doc.id}))))
    },[])
  return (
      <div>
          <form onSubmit={addFun} className="border border-slate-950 p-3 max-w-lg flex flex-col space-y-4 rounded">
              <input className='flex-1 outline-none' placeholder='Todo...' type="text" name="text" id="" value={todoValue.text} onChange={(e) => setTodoValue({...todoValue,text:e.target.value})} />
              <input type="file" name="" id="" onChange={e => setImgValue(e.target.files[0])} />
              <button className='bg-orange-400 text-white py-1'>Add</button>
          </form>
          
          <form action=""></form>
          {/* ==================== MAP ============ */}
          <ul className='mb-5 p-2 flex flex-wrap ' >
              {todos?.map(todo => (
                  <li className='border flex flex-col items-center w-full m-3 space-y-2 sm:w-40' style={todo.isDone ? { backgroundColor: "green" } : { background: "transparent" }}>
                      <img className='w-full h-96 object-cover rounded-lg mb-2 sm:h-52' src={todo.img.includes(".pdf") ? fileImg : todo.img} alt="" />
                      <span className='text-center' >{todo.text}</span>
                      <button className="bg-blue-500 w-full text-white font-bold py-1 px-5 rounded button outline-none hover:bg-blue-300" onClick={() => doneFun(todo.id,todo.isDone)}>Done</button>
                      <button className="bg-red-600  w-full text-white font-bold py-1 px-5 rounded button outline-none hover:bg-red-400" onClick={() => deleteFun(todo.id,todo.img)}>Delete</button>
                      <a target={'_blank'} href={todo.img} className='bg-yellow-600 w-full text-white font-bold py-1 px-5 rounded button outline-none text-center' >Open</a>
                  </li>
              ) )}
          </ul>
          {/* <div className="container md:flex justify-between gap-2 flex-wrap">
              
              {images.map(img => <span className='flex flex-col items-center '>
                  <img className='w-52 h-52 object-cover rounded-lg mb-2' src={img.includes(".pdf") ? fileImg : img } />
                  <button onClick={() => handleDeleteImg(img)} className='bg-red-800 text-white w-32 py-1 text-sm'>Delete</button>
                  <a target={'_blank'} href={img} className='bg-yellow-600 text-white w-32 py-1 text-sm text-center mt-2' >Open</a>
          </span>)}
          </div> */}
    </div>
  )
}

export default Todos