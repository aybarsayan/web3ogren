import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function Hello() {

  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://docs.google.com/spreadsheets/d/1kuh78sof01Ei5L0Yw2UUobzCXAPjDNzp/edit?usp=sharing&ouid=117551557215689919278&rtpof=true&sd=true';
    }, 3000); // 1 second delay
  }, []); // an empty dependency array ensures this runs once on component mount

  return (
    <Layout title="Tercih" description="Üniversite Tercih">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '75vh',
          fontSize: '20px',
        }}
      >
        <img
          src="/img/mesaj.svg" // Resmin yolu düzgün olarak belirtilmiştir
          alt="Değerli Web3 Derneği"
          style={{ width: '400px', height: 'auto' }}
        />
      </div>
    </Layout>
  );
}
