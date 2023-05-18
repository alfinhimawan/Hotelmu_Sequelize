import React, { useEffect, useState } from 'react'
import { capacity, capacityRiwayat, dateRiwayat, durationRiwayat, email, personRiwayat } from "../../assets";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const ListPemesanan = () => {

  let [riwayat, setRiwayat] = useState()

  useEffect(() => {
    let id_customer = window.sessionStorage.getItem("id_customer")
    axios.get(`http://localhost:8080/pemesanan/findById/${id_customer}`, {
        headers : {'Authorization' : 'Bearer ' + sessionStorage.getItem('token')}
    })
    .then(res => {
        console.log(res.data.pemesanan)
        setRiwayat(res.data.pemesanan)
    })
    .catch(error => { 
    console.log(error)
    })
}, [])

  return (
    <div className="mt-20 flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium">Riwayat Pemesanan</h1>
          <p className="text-sm text-gray"></p>
        </div>
      </div>

      <div className="flex flex-col mt-14">
        {riwayat?.map((riwayat, i) => (
          <Link to={`/rincianPemesanan/${riwayat.id_pemesanan}`} className={`mt-5 w-full px-4 py-6 stroke-form`}>
              <div className="flex justify-between">
                <h1 className="text-base font-medium">Nomor Pemesanan {riwayat.nomor_pemesanan}</h1>
                <div className="px-3 py-2 bg-orange text-orange rounded-lg">
                  {riwayat.status_pemesanan}
                </div>
              </div>

              <div className='flex justify-between mt-2'>
                <div className={`flex `}>
                  <div className="flex">
                    <img src={personRiwayat} className='w-5' alt="person" />
                    <p className="text-gray text-sm ml-2">{riwayat.customer.nama}</p>
                  </div>
                  <div className="flex ml-10">
                    <img src={email} className='w-5' alt="person" />
                    <p className="text-gray text-sm ml-2">{riwayat.customer.email}</p>
                  </div>
                  <div className="flex ml-10">
                    <img src={capacityRiwayat} className='w-5' alt="person" />
                    <p className="text-gray text-sm ml-2">{riwayat.jumlah_kamar} Kamar</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex justify-center items-center">
                    <img src={dateRiwayat} className='w-5' alt="date" />
                    <p className="text-gray text-sm ml-2">{moment(riwayat.createdAt).format('YYYY-MMM-DD')}</p>
                  </div>
                </div>
              </div>
          </Link>
        ))}
      </div>

      <div className="flex">
        <div className='flex mt-14'>
          <p className='text-base text-gray'>Menampilkan <span className='text-black'>{riwayat !== undefined ? riwayat.length : ''}</span> Data</p>
        </div>
      </div>

    </div>
  );
};

export default ListPemesanan;
