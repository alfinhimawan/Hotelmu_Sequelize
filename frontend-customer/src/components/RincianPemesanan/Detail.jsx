import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const Detail = () => {

  let [pemesanan, setPemesanan] = useState([]);
  let [user, setUser] = useState([]);
  let [harga, setHarga] = useState([]);
  let [tipeKamar, setTipeKamar] = useState([]);
  let [ordersDet, setOrdersDet] = useState([]);
  let [namaPemesan, setNamaPemesan] = useState([])
  let [email, setEmail] = useState([])
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/pemesanan/` + id, {
        headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
    })
    .then(res => {
        console.log(res.data.pemesanan)
        setPemesanan(res.data.pemesanan)
    })
    .catch(error => { 
    console.log(error)
    })
}, [])

useEffect(() => {
  axios.get(`http://localhost:8080/pemesanan/` + id, {
      headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
  })
  .then(res => {
      console.log(res.data.pemesanan.customer.nama)
      setNamaPemesan(res.data.pemesanan.customer.nama)
  })
  .catch(error => { 
  console.log(error)
  })
}, [])

useEffect(() => {
  axios.get(`http://localhost:8080/pemesanan/` + id, {
      headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
  })
  .then(res => {
      console.log(res.data.pemesanan.customer.email)
      setEmail(res.data.pemesanan.customer.email)
  })
  .catch(error => { 
  console.log(error)
  })
}, [])

useEffect(() => {
  axios.get(`http://localhost:8080/pemesanan/` + id, {
      headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
  })
  .then(res => {
      console.log(res.data.pemesanan.user)
      setUser(res.data.pemesanan.user)
  })
  .catch(error => { 
  console.log(error)
  })
}, [])

useEffect(() => {
  axios.get(`http://localhost:8080/detail_pemesanan/` + id, {
      headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
  })
  .then(res => {
      console.log(res.data.detail_pemesanan.harga)
      setHarga(res.data.detail_pemesanan.harga)
  })
  .catch(error => { 
  console.log(error)
  })
}, [])

useEffect(() => {
  axios.get(`http://localhost:8080/pemesanan/` + id, {
      headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
  })
  .then(res => {
      console.log(res.data.pemesanan.tipe_kamar.nama_tipe_kamar)
      setTipeKamar(res.data.pemesanan.tipe_kamar.nama_tipe_kamar)
  })
  .catch(error => { 
  console.log(error)
  })
}, [])

    useEffect(() => {
      axios.get(`http://localhost:8080/pemesanan/idOrder/${id}`, {
        headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
      })
      .then(res => {
        console.log("order det :" + res.data)
        setOrdersDet(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    }, [])
    
    console.log(ordersDet)
    const arrPrice = ordersDet.map((item) => {
        return item.harga
    })

    console.log(arrPrice)

    const totalPrice = arrPrice.reduce((acc, currentVal) => acc + currentVal, 0)

    console.log(totalPrice)

    // function getDuration() {

    //     const startDate = moment(pemesanan?.tgl_check_in).format('YYYY-MMM-DD');
    //     const endDate = moment(pemesanan?.tgl_check_out).format('YYYY-MMM-DD');
    //     const longStay = moment.duration(endDate.diff(startDate))

    //     return longStay;  
    // } 
    
    const formatStartDt = moment(pemesanan?.tgl_check_in).format("YYYY-MM-DD");
    const formatEndDt = moment(pemesanan?.tgl_check_out).format("YYYY-MM-DD");

    const startDate = moment(formatStartDt);
    const endDate = moment(formatEndDt);
    const longStay = moment.duration(endDate.diff(startDate)).asDays();

    function handlePrint() {
        window.print();
      }

  return (
    <div className='flex flex-col p-8 stroke-box mt-14 w-full'>
        <div className='mt-4 stroke-form'>
            <h1 className='text-xl font-semibold mb-4'>Rincian Pemesanan</h1>
        </div>
        
        {/* {pemesanan.map((pemesanan, index) => ( */}
        <div className='flex flex-col w-full bg-box p-4 rounded-lg my-6'>
            <div className='flex p-4 ml-6 w-full'>
                <div className='flex flex-col w-1/2'>
                    <h1 className='text-sm text-gray'>Nama Customer</h1>
                    <p className='text-sm font-semibold mt-4'>{namaPemesan}</p>
                </div>
                <div className='flex flex-col ml-96 w-1/2'>
                    <h1 className='text-sm text-gray'>Nama Tamu</h1>
                    <p className='text-sm font-semibold mt-4'>{pemesanan.nama_tamu}</p>
                </div>
            </div>
            <div className='flex p-4 ml-6 w-full'>
                <div className='flex flex-col w-1/2'>
                    <h1 className='text-sm text-gray'>Email Pemesan</h1>
                    <p className='text-sm font-semibold mt-4'>{email}</p>
                </div>
                <div className='flex flex-col ml-96 w-1/2'>
                    <h1 className='text-sm text-gray'>Tgl Pemesanan</h1>
                    <p className='text-sm font-semibold mt-4'>{moment(pemesanan.tgl_pemesanan).format('YYYY-MMM-DD')}</p>
                </div>
            </div>
            <div className='flex p-4 ml-6 w-full'>
                <div className='flex flex-col w-1/2'>
                    <h1 className='text-sm text-gray'>Tgl Check In</h1>
                    <p className='text-sm font-semibold mt-4'>{moment(pemesanan.tgl_check_in).format('YYYY-MMM-DD')}</p>
                </div>
                <div className='flex flex-col ml-96 w-1/2'>
                    <h1 className='text-sm text-gray'>Tgl Check Out</h1>
                    <p className='text-sm font-semibold mt-4'>{moment(pemesanan.tgl_check_out).format('YYYY-MMM-DD')}</p>
                </div>
            </div>
            <div className='flex p-4 ml-6 w-full'>
                <div className='flex flex-col w-1/2'>
                    <h1 className='text-sm text-gray '>Jumlah Kamar</h1>
                    <p className='text-sm font-semibold mt-4'>{pemesanan.jumlah_kamar} Kamar</p>
                </div>
                <div className='flex flex-col ml-96 w-1/2'>
                    <h1 className='text-sm text-gray'>Tipe Kamar</h1>
                    <p className='text-sm font-semibold mt-4'>{tipeKamar}</p>
                </div>
            </div>
            <div className='flex p-4 ml-6 w-full'>
                <div className='flex flex-col w-1/2'>
                    <h1 className='text-sm text-gray'>Lama Penginapan</h1>
                    <p className='text-sm font-semibold mt-4'>{longStay} Hari</p>
                </div>
                <div className='flex flex-col ml-96 w-1/2'>
                    <h1 className='text-sm text-gray '>Status Penginapan</h1>
                    <p className='text-sm font-semibold mt-4'>{pemesanan.status_pemesanan}</p>
                </div>
            </div>
        </div>
        {/* ))} */}

        <div className='flex flex-col py-4'>
            <h1 className='text-sm'>Total Harga</h1>
            <p className='text-xl mt-4 font-semibold'>{totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
        </div>

        <div className='flex w-full mt-4'>
            <Link to='/riwayat' className='w-1/2 h-[52px] sm:flex justify-center items-center primary-text primary-stroke rounded-lg hidden mr-4'>
                kembali
            </Link>
            <button onClick={handlePrint} className='w-1/2 h-[52px] sm:flex justify-center items-center text-white primary-bg rounded-lg hidden'>
                Cetak
            </button>
        </div>

        <div>
            <p className='text-lg text-gray mt-4 text-center'>Pastikan Semua Data Telah Terisi Dengan Benar</p>
        </div>
    </div>
  )
}

export default Detail