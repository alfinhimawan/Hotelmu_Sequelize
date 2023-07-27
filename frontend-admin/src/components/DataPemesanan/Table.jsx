import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteData, editData } from "../../assets";
import axios from "axios";
import moment from "moment";

const Table = () => {
  let [pemesanan, setPemesanan] = useState([]);
  let [search, setSearch] = useState([]);
  let [searchNama, setSearchNama] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isLogin") != "Login") {
      navigate("/loginAdmin");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/pemesanan`, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data.pemesanan);
        setPemesanan(res.data.pemesanan);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const handleCari = () => {
    let data = {
      tgl_check_in: search,
    };
    axios
      .post(`http://localhost:8080/pemesanan/search`, data, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.pemesanan);
        setPemesanan(res.data.pemesanan);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchByName = () => {
    let data = {
      nama_tamu: searchNama,
    };
    axios
      .post(`http://localhost:8080/pemesanan/findByNamaTamu`, data, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.pemesanan);
        setPemesanan(res.data.pemesanan);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (search !== "") {
      handleCari();
    } else if (search === "") {
      axios
        .get(`http://localhost:8080/pemesanan`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res.data.pemesanan);
          setPemesanan(res.data.pemesanan);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [search]);

  useEffect(() => {
    if (searchNama !== "") {
      handleSearchByName();
    } else if (searchNama === "") {
      axios
        .get(`http://localhost:8080/pemesanan`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res.data.pemesanan);
          setPemesanan(res.data.pemesanan);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [searchNama]);

  function Delete(id) {
    let url = "http://localhost:8080/pemesanan/" + id;
    if (window.confirm("Apakah Anda Yakin Untuk Menghapus Data?")) {
      // console.log(id)
      axios
        .delete(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response);
          window.location.reload(false);
          // tipeKamar()
        })
        .catch((error) => {
          console.log(error);
          // if(window.confirm("Error")){
          //     window.location.reload(false);
          // }
        });
    }
    // window.location.reload(false);
  }

  return (
    <div className="p-4 mt-14">
      <div className="flex items-center gap-5">
      <div className="flex space-x-1">
          <input
            type="date"
            id="default-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-4 py-2 text-black-700 bg-white border rounded-full focus:border-primary-400 focus:ring-primary-300 focus:outline-none focus:ring focus:ring-opacity-40"
            placeholder="Search..."
          />
          <button className="px-4 text-white primary-bg rounded-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex space-x-1">
          <input
            type="text"
            id="default-search"
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
            className="block w-full px-4 py-2 text-black-700 bg-white border rounded-full focus:border-primary-400 focus:ring-primary-300 focus:outline-none focus:ring focus:ring-opacity-40"
            placeholder="Search..."
          />
          <button className="px-4 text-white primary-bg rounded-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <table className="p-4 w-full ">
        <thead className="text-left border-b-2 border-gray-200">
          {/* <th className='p-4'>No</th> */}
          <th className="p-4">Nomer Pemesanan</th>
          <th className="p-4">Nama Pemesan</th>
          <th className="p-4">Email Pemesanan</th>
          <th className="p-4">Tgl Pemesanan</th>
          <th className="p-4">Check In</th>
          <th className="p-4">Check Out</th>
          <th className="p-4">Nama Tamu</th>
          <th className="p-4">Jumlah Kamar</th>
          <th className="p-4">Status</th>
          <th className="p-4">Aksi</th>
        </thead>
        <tbody>
          {pemesanan?.map((pemesanan, index) => (
            <tr key={pemesanan.id_pemesanan}>
              {/* <td className='p-4'>{pemesanan.no}</td> */}
              <td className="p-4">{pemesanan.nomor_pemesanan}</td>
              <td className="p-4">{pemesanan.customer.nama}</td>
              <td className="p-4">{pemesanan.customer.email}</td>
              <td className="p-4">
                {moment(pemesanan.tgl_pemesanan).format("YYYY-MM-DD")}
              </td>
              <td className="p-4">
                {moment(pemesanan.tgl_check_in).format("YYYY-MM-DD")}
              </td>
              <td className="p-4">
                {moment(pemesanan.tgl_check_out).format("YYYY-MM-DD")}
              </td>
              <td className="p-4">{pemesanan.nama_tamu}</td>
              <td className="p-4">{pemesanan.jumlah_kamar}</td>
              <td className="p-4">{pemesanan.status_pemesanan}</td>
              <td className="flex justify-start items-center p-6 my-auto">
                <Link to={`/editPemesanan/${pemesanan.id_pemesanan}`}>
                  <img className="w-4" src={editData} alt="" />
                </Link>
                <button onClick={() => Delete(pemesanan.id_pemesanan)}>
                  <img className="w-4 ml-2" src={deleteData} alt="" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <div className="flex mt-14">
          <p className="text-base text-gray">
            Menampilkan{" "}
            <span className="text-black">
              {pemesanan !== undefined ? pemesanan?.length : ""}
            </span>{" "}
            Data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Table;
