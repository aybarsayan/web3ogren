# Kurulum 🛠️

## Node.js 🟩

Node.js, JavaScript kodlarını lokalde çalıştırmamızı sağlar. Projemizde KILT SDK kodlarını da lokalde çalıştırmak için Node.js'e ihtiyacımız var! 🏃‍♀️

📥 Node.js'i [buradan](https://nodejs.org/tr) indirin. Versiyon 16.0 ve üstü işimizi görecektir.

## Gereksinimler 📋

Yeni bir klasör oluşturun ve adı `kilt-rocks` olsun. 📂 İşte burada kütüphaneleri yükleyeceğiz:

- KILT SDK-JS 🌐 - KILT işlemleri için
- dotenv 🔒 - Gizli bilgileri saklamak için
- ts-node ve TypeScript 🛡️ - TypeScript kodlarını çalıştırmak için

---
:::caution 🚨 TypeScript Nereden Çıktı ya?
TypeScript, JavaScript'in büyük kardeşi gibi bir şey. Tip güvenliği ekliyor ve Microsoft tarafından geliştirildi. 🖥️ Eğer JavaScript biliyorsanız, TypeScript'e alışmanız hızlı olacak! 🚀
:::

:::note 📝
Projede çok temel TypeScript kullanacağız, yani korkmayın!
:::

---

## Paket Kurulumu 📦

Terminalde aşağıdaki kodları çalıştırmalısınız. 🖥️

```javascript
npm init -y //🎉 Otomatik bir 'package.json' dosyası oluşturur.
npm install @kiltprotocol/sdk-js dotenv typescript ts-node //📦 KILT SDK, dotenv ve TypeScript'i yükler.
```

## Proje Klasörlerinin Ayarlanması 📁

Klasör yapınız şu şekilde olmalı:

```
└─ kilt-rocks/ # proje klasörü
	├─ node_modules 
    ├─ attester/ # tüm attester kodlarının bulunduğu klasör
    ├─ claimer/ # tüm claimer kodlarının bulunduğu klasör
    ├─ verify.ts # tüm verifier kodları
    ├─ .env # çevre değişkenleri ve gizli bilgi dosyası
    ├─ package.json # otomatik oluşan dosya 
    └─ yarn.lock # otamatik oluşan dosya 2
```

## PILT Tokenlar 🪙

Peregrine Testnet'i kullanacağız, yani PILT tokenlarına ihtiyacımız var. Ücretsiz alabileceğiz, yani endişelenmeyin! 💦

## Blokzincir Bağlantısı 🌐

Blokzincirle bağlantı için SDK'yi ayarlamalıyız. `Kilt.connect(address)` kodu ile Peregrine Testnet'e bağlanacağız. 🤝 

`.env` dosyasına Peregrine ağı için olan uzantıyı eklemeliyiz:

```dotenv title="dotenv"
WSS_ADDRESS=wss://peregrine.kilt.io //🔗 Peregrine ağına bağlantı için WebSocket adresi
```

Tüm ayarlar tamam! 🎉 Şimdi başlayabiliriz! 🚀
