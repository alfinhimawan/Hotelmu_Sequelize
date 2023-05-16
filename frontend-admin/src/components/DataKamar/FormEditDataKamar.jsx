import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom';

const FormEditDataKamar = () => {

    let [TipeKamar, setTipeKamar] = useState()
    let [nomorKamar, setNomorKamar] = useState()
    let [idTipeKamar, setIdTipeKamar] = useState()
    const { id } = useParams();
    let navigate = useNavigate()

    useEffect(() => {
        if(sessionStorage.getItem('isLogin') != "Login"){
          navigate('/loginAdmin')
        }
      },[])

      //get data kamar by id selected
    useEffect(() => {
        axios.get(`http://localhost:8080/kamar/${id}`, {
            headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
        })
        .then(res => {
            console.log(res.data.kamar)
            setNomorKamar(res.data.kamar.nomor_kamar)
            setIdTipeKamar(res.data.kamar.id_tipe_kamar)
        })
        .catch(error => { 
        console.log(error)
        })
    }, [])

    //get all tipe kamar data (in order to get id tipe kamar)
    useEffect(() => {
        axios.get(`http://localhost:8080/tipe_kamar`, {
            headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
        })
        .then(res => {
            console.log(res.data)
            setTipeKamar(res.data)
        })
        .catch(error => { 
        console.log(error)
        })
    }, [])

    function Edit(e){
        e.preventDefault()
        let data = {
            nomor_kamar: nomorKamar,
            id_tipe_kamar: idTipeKamar,
        }
        if(window.confirm("Selesai Merubah Data?"))
        axios.put(`http://localhost:8080/kamar/${id}`, data, {
          headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
        })
        .then(res => {
          console.log(res.data)
          navigate('/dataKamar/')
        })
        .catch(error => {
          console.log(error)
        })
      }
    //   console.log(outletExst)

  return (
    <div className='flex flex-col p-8 stroke-box mt-14 w-full'>
        <div className='mt-4 stroke-form'>
            <h1 className='text-xl font-semibold mb-4'>Edit Data Kamar</h1>
        </div>

        <form onSubmit={Edit} className='flex flex-col mb-4 stroke-form'>
            <div className='flex justify-between mt-4'>
                <div className='w-1/2 flex flex-col mb-4'>
                    <label htmlFor="checkIn" className='text-gray'>Nomor Kamar</label>
                    <input onChange={(e) => setNomorKamar(e.target.value)} value={nomorKamar} type="text" name='checkIn' placeholder='Masukkan Nama Kamar' className="bg-form p-4 border-r-[16px] border-r-[#f6f6f6] mt-2" required>
                    </input>
                </div>
                <div className='w-1/2 flex flex-col mb-4 ml-5'>
                    <label htmlFor="checkIn" className='text-gray'>Nama Tipe Kamar</label>
                    <select onChange={(e) => setIdTipeKamar(e.target.value)} value={idTipeKamar} type="text" name='checkIn' placeholder='Masukkan Nama Kamar' className="bg-form p-4 border-r-[16px] border-r-[#f6f6f6] mt-2">
                        {TipeKamar?.tipe_kamar.map(item => (
                            <option key={item.id_tipe_kamar} value={item.id_tipe_kamar}>{item.nama_tipe_kamar}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='w-full flex'>
                <Link to="/dataKamar" className='w-1/2 h-[52px] text-blue primary-stroke rounded-lg hidden sm:flex mt-4 sm:justify-center sm:items-center'>
                    Kembali
                </Link>
                <button className='w-1/2 h-[52px] text-white primary-bg rounded-lg hidden sm:block mt-4 ml-4'>
                    Ubah
                </button>
            </div>
        </form>

        <p className='text-center text-sm text-gray mt-4'>Pastikan Semua Data Telah Terisi Dengan Benar</p>

    </div>
  )
}

export default FormEditDataKamar