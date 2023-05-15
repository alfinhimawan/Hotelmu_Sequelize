import React from 'react'
import styles from "../style";
import { Alasan, CTA, Footer, Hero, Navbar, Rekan, Rekomendasi, Header, Search } from '../components/LandingPage'
import { Detail } from '../components/DetailPemesanan';


const DetailPemesanan = () => {
  return (
    <div className="bg-white w-full overflow-hidden">
      <div className={`gray-bg ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Header />
        </div>
      </div>  

      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-white ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
            <Detail />
        </div>
      </div>

      <div className={`gray-bg mt-20 ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>  
    </div>
  )
}

export default DetailPemesanan