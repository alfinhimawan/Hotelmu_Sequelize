import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteData, editData } from '../../assets'
import axios from 'axios'

const Table = () => {

    let [kamar, setKamar] = useState([]);
    let navigate = useNavigate()

    useEffect(() => {
      if(sessionStorage.getItem('isLogin') != "Login"){
        navigate('/loginAdmin')
      }
    },[])

    useEffect(() => {
      axios.get(`http://localhost:8080/kamar`, {
          headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
      })
      .then(res => {
          console.log(res.data)
          setKamar(res.data)
      })
      .catch(error => { 
        console.log(error)
      })
    }, [])

    function Delete (id) {
      let url = "http://localhost:8080/kamar" + id
      if(window.confirm("Apakah Anda Yakin Untuk Menghapus Data?")){
          axios.delete(url, {
              headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
          })
          .then((response) => {
              console.log(response)
              window.location.reload(false);
              member()
          })
          .catch((error) => {
              console.log(error)
              if(window.confirm("Error")){
                  window.location.reload(false);
              }
          })
      }
      // window.location.reload(false);
  }

  function Delete (id) {
    let url = "http://localhost:8080/kamar/" + id
    if(window.confirm("Apakah Anda Yakin Untuk Menghapus Data?")){
        axios.delete(url, {
            headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
        })
        .then((respone) => {
            kamar()
            navigate('/dataKamar/')
        })
        .catch((error) => {
            console.log(error)
        })
        window.location.reload(false)
    }
}


  return (
    <div className='p-4 mt-14 '>
      <button >
        <Link className='p-4 text-white primary-bg rounded-lg hidden mb-4 sm:block' to="/addDataKamar">Tambah Data</Link>
      </button>
        <table className='p-4 w-full '>
            <thead className='text-left border-b-2 border-gray-200'>
                {/* <th className='p-4'>ID Kamar</th> */}
                <th className='p-4'>Nomer Kamar</th>
                <th className='p-4'>Nama Tipe Kamar</th>
                {/* <th className='p-4'>Harga</th> */}
                <th className='p-4'>Aksi</th>
            </thead>
            <tbody>
                {kamar.kamar?.map((kamar, index) => (
                    <tr key={kamar.id_kamar}>
                        {/* <td className='p-4'>{kamar.no}</td> */}
                        <td className='p-4'>{kamar.nomor_kamar}</td>
                        <td className='p-4'>{kamar.tipe_kamar.nama_tipe_kamar}</td>
                        {/* <td className='p-4'>{kamar.id_tipe_kamar}</td> */}
                        <td className='flex justify-start items-center p-4'>
                            <Link to={`/editDataKamar/${kamar.id_kamar}`}><img className='w-4' src={editData} alt="" /></Link>
                            <button onClick={() => Delete(kamar.id_kamar)}><img className='w-4 ml-2' src={deleteData} alt="" /></button>
                        </td>
                    </tr>
                ))
                }
            </tbody>
        </table>

      <div className="flex">
        <div className='flex mt-14'>
          <p className='text-base text-gray'>Menampilkan <span className='text-black'>{kamar.kamar !== undefined ? kamar.kamar.length : ''}</span> Data</p>
        </div>
      </div>
    </div>
  )
}

export default Table