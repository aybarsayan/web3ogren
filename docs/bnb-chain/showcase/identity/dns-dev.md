---
title: Başlarken - SpaceID
description: Bu kılavuz, Space ID SDK kullanarak bir ismi çözmek için gereken adımları kapsamaktadır. Projenizi oluşturma, SDK'yı kurma ve ismi çözmek için gerekli kodu yazma süreçleri detaylı bir şekilde açıklanmıştır.
keywords: [SpaceID, SDK, isim çözme, JavaScript, Node.js, API]
---

# Başlarken - SpaceID

## Space ID SDK Kullanarak Bir İsmi Çözme

### Adım 1: Projenizi Kurun

1. **Node.js ve npm'i Kurun**  
   Node.js ve npm'in kurulu olduğundan emin olun. Bunları Node.js resmi web sitesinden indirebilirsiniz.

2. **Yeni Bir Proje Oluşturun**  
   Terminalinizi açın ve yeni bir proje dizini oluşturun:

   ```bash
   mkdir spaceid-tutorial
   cd spaceid-tutorial
   npm init -y
   ```

3. **Space ID SDK'yı Kurun**  
   Space ID SDK paketini npm ile kurun:

   ```bash
   npm install @spaceid/sdk
   ```

### Adım 2: Bir İsmi Çözmek İçin Kodu Yazın

1. **Bir JavaScript Dosyası Oluşturun**  
   Proje dizininizde `resolveName.js` adında bir dosya oluşturun.

2. **Space ID SDK'yı İçe Aktarın**  
   `resolveName.js` dosyasının en üstüne Space ID SDK'yı içe aktarın:

   ```javascript
   const { SpaceID } = require('@spaceid/sdk');
   ```

3. **Space ID SDK'yı Başlatın**  
   SDK'yı gerekli parametrelerle başlatın:

   ```javascript
   const spaceId = new SpaceID({
       endpoint: 'https://api.spaceid.io', // API uç noktası
       apiKey: 'your_api_key' // Gerçek API anahtarınız ile değiştirin
   });
   ```

4. **Bir İsmi Çözün**  
   SDK kullanarak bir ismi çözmek için bir fonksiyon yazın:

   ```javascript
   async function resolveName(name) {
       try {
           const result = await spaceId.resolveName(name);
           console.log(`Adres ${name} için: ${result.address}`);
       } catch (error) {
           console.error('İsim çözme hatası:', error);
       }
   }
   ```

5. **Fonksiyonu Çağırın**  
   `resolveName` fonksiyonunu örnek bir isimle çağırın:

   ```javascript
   resolveName('example.eth');
   ```

### Adım 3: Kodu Çalıştırın

1. **Betiği Çalıştırın**  
   Terminalinizde betiği çalıştırın:

   ```bash
   node resolveName.js
   ```

2. **Sonucu Görüntüleyin**  
   Her şey doğru ayarlandığında, terminal çıktısında sağlanan isim için çözülen adresi görmelisiniz.

## Örnek Kod

İşte `resolveName.js` için tamamlanmış kod:

```javascript
const { SpaceID } = require('@spaceid/sdk');

const spaceId = new SpaceID({
    endpoint: 'https://api.spaceid.io',
    apiKey: 'your_api_key'
});

async function resolveName(name) {
    try {
        const result = await spaceId.resolveName(name);
        console.log(`Adres ${name} için: ${result.address}`);
    } catch (error) {
        console.error('İsim çözme hatası:', error);
    }
}

resolveName('example.eth');
```

> 'your_api_key' kısmını gerçek API anahtarınızla, 'example.eth' kısmını ise çözmek istediğiniz isimle değiştirin. Daha fazla bilgi için bu [blog](https://nodereal.io/blog/en/how-to-resolve-a-name-through-spaceid-sdk/)u okuyabilirsiniz.