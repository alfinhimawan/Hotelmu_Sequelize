import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteData, editData } from "../../assets";
import axios from 'axios'

const Table = () => {

  let [user, setUser] = useState([]);
  let navigate = useNavigate()

  useEffect(() => {
    if(sessionStorage.getItem('isLogin') != "Login"){
      navigate('/loginAdmin')
    }
  },[])

  useEffect(() => {
    axios.get(`http://localhost:8080/user`, {
        headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
    })
    .then(res => {
        console.log(res.data.user)
        setUser(res.data.user)
    })
    .catch(error => { 
    console.log(error)
    })
}, [])

function Delete (id) {
  let url = "http://localhost:8080/user/" + id
  if(window.confirm("Apakah Anda Yakin Untuk Menghapus Data?")){
      axios.delete(url, {
          headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
      })
      .then((response) => {
          console.log(response)
          window.location.reload(false);
          // tipeKamar()
      })
      .catch((error) => {
          console.log(error)
          // if(window.confirm("Error")){
          //     window.location.reload(false);
          // }
      })
  }
  // window.location.reload(false);
}

  return (
    <div className="p-4 mt-14 ">
      <button >
        <Link className='p-4 text-white primary-bg rounded-lg hidden mb-4 sm:block' to="/addDataUser">Tambah Data</Link>
      </button>
      <table className="p-4 w-full ">
        <thead className="text-left border-b-2 border-gray-200">
          {/* <th className="p-4">No</th> */}
          <th className="p-4">Foto</th>
          <th className="p-4">Nama User</th>
          <th className="p-4">Email User</th>
          <th className="p-4">Role</th>
          <th className="p-4">Aksi</th>
        </thead>
        <tbody>
          {user.map((user, index) => (
            <tr key={user.id_user}>
              {/* <td className="p-4">{user.no}</td> */}
              <td className="p-4 ">
                <img className="w-14 rounded-full" src={`http://localhost:8080/image/user/${user.foto}`} alt="" />
              </td>
              <td className="p-4">{user.nama_user}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className="flex justify-start items-center p-9">
                <Link to={`/editDataUser/${user.id_user}`}><img className='w-4' src={editData} alt="" /></Link>
                <button onClick={() => Delete(user.id_user)}><img className='w-4 ml-2' src={deleteData} alt="" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <div className="flex mt-14">
          <p className='text-base text-gray'>Menampilkan <span className='text-black'>{user !== undefined ? user.length : ''}</span> Data</p>
        </div>
      </div>
    </div>
  )
}

export default Table