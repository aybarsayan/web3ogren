import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './TurizmMeslekleri.module.css'; // Özel stil dosyasını import ettik

export default function TurizmMeslekleri() {
  const [language, setLanguage] = useState('tr');

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'tr' ? 'en' : 'tr'));
  };

  const meslekler = [
    { 
      isim: { tr: "Otel Genel Müdürü", en: "Hotel General Manager" }, 
      link: "/docs/your-book/camino/hotelmanager", 
      emoji: "🏨" 
    },
    { 
      isim: { tr: "Seyahat Acentesi Sahibi", en: "Travel Agency Owner" }, 
      link: "/docs/your-book/camino/travelAgency", 
      emoji: "🌐" 
    },
    { 
      isim: { tr: "Havayolu Üst Yöneticisi (CEO)", en: "Airline CEO" }, 
      link: "/docs/your-book/camino/airline", 
      emoji: "✈️" 
    },
    { 
      isim: { tr: "Tur Operatörü CEO'su", en: "Tour Operator CEO" }, 
      link: "/docs/your-book/camino/Tour%20Operator", 
      emoji: "🌍" 
    },
    { 
      isim: { tr: "Lüks Seyahat Danışmanı", en: "Luxury Travel Consultant" }, 
      link: "/docs/your-book/camino/travelConsultant", 
      emoji: "🌟" 
    },
    { 
      isim: { tr: "Kruvaziyer Gemisi Kaptanı", en: "Cruise Ship Captain" }, 
      link: "/docs/your-book/camino/Cruise", 
      emoji: "🚢" 
    },
    { 
      isim: { tr: "Seyahat Teknolojisi Uzmanı", en: "Travel Technology Specialist" }, 
      link: "/docs/your-book/camino/TravelTechnologySpecialist", 
      emoji: "💻" 
    },
    { 
      isim: { tr: "Havayolu İstasyon Müdürü", en: "Airline Station Manager" }, 
      link: "/docs/your-book/camino/AirlineStationManager", 
      emoji: "🛬" 
    },
    { 
      isim: { tr: "Otel Zinciri Pazarlama Direktörü", en: "Hotel Chain Marketing Director" }, 
      link: "/docs/your-book/camino/HotelChainMarketing", 
      emoji: "📢" 
    },
    { 
      isim: { tr: "MICE Organizatörü", en: "MICE Organizer" }, 
      link: "/docs/your-book/camino/MICE", 
      emoji: "👥" 
    },
    { 
      isim: { tr: "Golf Sahası Yöneticisi", en: "Golf Course Manager" }, 
      link: "/docs/your-book/camino/GolfCourseManager", 
      emoji: "⛳" 
    },
    { 
      isim: { tr: "Seyahat Dergisi Editörü", en: "Travel Magazine Editor" }, 
      link: "/docs/your-book/camino/Travel%20Magazine", 
      emoji: "📰" 
    },
    { 
      isim: { tr: "Seyahat Influencer'ı", en: "Travel Influencer" }, 
      link: "/docs/your-book/camino/TravelInfluencer", 
      emoji: "📸" 
    },
    { 
      isim: { tr: "Spa ve Wellness Merkezi Yöneticisi", en: "Spa and Wellness Center Manager" }, 
      link: "/docs/your-book/camino/SpaandWellness", 
      emoji: "💆" 
    },
    { 
      isim: { tr: "Özel Jet Hizmetleri Yöneticisi", en: "Private Jet Services Manager" }, 
      link: "/docs/your-book/camino/PrivateJetServices", 
      emoji: "🛩️" 
    }
  ];

  const emojiSize = '6rem';

  return (
    <Layout>
  <div className="mb-4" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px' // İsterseniz bu yüksekliği ayarlayabilirsiniz
  }}>
    <button onClick={toggleLanguage} className="btn btn-primary">
      {language === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
    </button>
  </div>

      <div className="container mt-5" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 sütunlu bir grid oluşturmak için
        gap: '30px', // Sütunlar ve satırlar arasında boşluk oluşturmak için
        margin: '0 auto', // Konteyneri sayfanın ortasına yerleştirmek için
        maxWidth: '5000px', // Konteynerin maksimum genişliği
        padding: '15px' // Konteynerin etrafındaki boşluğu ayarlamak için
      }}>
        
        {meslekler.map((meslek, index) => (
          <div key={index} style={{
            transition: 'transform 0.3s ease-in-out',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            margin: '15px', // Kartlar arasında boşluk oluşturmak için
            display: 'flex',
            flexDirection: 'column' // İçeriği dikey olarak hizalayın
          }}>
            <a href={language === 'tr' ? meslek.link : meslek.link.replace("#", "/en#")} className={`${styles.noUnderline} ${styles.darkText}`} style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1 // Bu, tüm kartların eşit boyutta olmasını sağlar
            }}>
              <div className={`card-body ${styles.cardContent}`} style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div className={styles.emojiDisplay} style={{
                  fontSize: '6rem',
                  marginBottom: '20px'
                }}>
                  {meslek.emoji}
                </div>
                <h3 className="card-title">{meslek.isim[language]}</h3>
              </div>
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
  
  
}
