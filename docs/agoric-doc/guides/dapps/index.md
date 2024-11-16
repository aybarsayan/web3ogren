---
title: Agoric Dapps
---

# Agoric Dapps

**Bu, Agoric Dapp projeleri için genel bir rehberdir.**

Dapp, tipik olarak bir tarayıcı tabanlı kullanıcı arayüzüne, kamuya açık bir API sunucusuna ve Agoric blok zincirinde çalışan bir sözleşmeye sahip olan _dağıtık uygulama_dır.

## Dapp Kullanımı

Eğer ’yi kurduysanız ve bir dapp'i yerel olarak, simüle edilmiş bir Agoric VM üzerinde çalıştırmayı denemek istiyorsanız (yani, gerçek bir kamu zincirinde çalışmayacak), aşağıdaki adımları takip edin:

1. SDK'nin en son beta sürümünü alın.

   ```sh
   cd agoric-sdk
   git checkout beta
   yarn && yarn build
   ```

2. Yeni bir yerel dapp şablonu oluşturmak için `agoric init` komutunu çalıştırın.

   ```sh
   # Burada Fungible Faucet Dapp'ini seçtik.
   # 'my-fungible-faucet' yerine kendi seçtiğiniz bir adı yazabilirsiniz.
   agoric init --dapp-template dapp-fungible-faucet --dapp-branch beta my-fungible-faucet
   cd my-fungible-faucet
   # Proje bağımlılıklarını yükleyin
   agoric install
   # Agoric VM'yi başlatın
   agoric start --reset
   ```

3. Bu komutu açık bırakın (bu, simüle edilmiş ortamınızdır).
4. Ayrı bir terminalde, sözleşmeyi ve API'yi VM'ye dağıtın.

   ```sh secondary style2
   # Sözleşmenin yeni bir örneğini VM'ye dağıtın
   agoric deploy contract/deploy.js
   # VM'nin API sunucusunu sıfırlayın
   agoric deploy api/deploy.js
   ```

5. Üçüncü bir terminalde, aşağıdakileri çalıştırın.

   ```sh secondary style3
   # Kullanıcı arayüzünü başlatın
   cd ui && yarn start
   ```

6. Artık dapp'inizi görüntülemek için  adresine gidebilirsiniz.

## Bu Dapp'i Değiştirme

Agoric sisteminde, bileşenler JavaScript ile yazılmıştır.

## Bileşenler

Bir Agoric dapp projesindeki önemli dizinler şunlardır:

-  zincir üzerindeki akıllı sözleşmeyi tanımlar.
-  zincirle bağlı sunucunun `/api` HTTP son noktasını tanımlar.
-  kullanıcıların kişisel cüzdanları ile API sunucusunu bağlayan tarayıcı kullanıcı arayüzünü tanımlar.

Bu üst düzey klasördeki diğer dosya ve dizinler genellikle değiştirilmemelidir.

### Sözleşme Dizini

`contract` dizininde düzenlenebilecek aşağıdaki dosyaları bulabilirsiniz:

- **src dizini**: Sözleşme kaynak kodu, `src/contract.js` ile başlar.

Ayrıca genellikle düzenlenmemesi gereken dosya ve klasörler vardır:

- **deploy.js**: Genel Agoric sözleşme dağıtım betiği.

### API Dizini

`api` dizininde düzenlenebilecek aşağıdaki dosyaları bulabilirsiniz:

- **src dizini**: API HTTP son noktaları için işleyici, `src/handler.js` ile başlar.

Ayrıca genellikle düzenlenmemesi gereken dosya ve klasörler vardır:

- **deploy.js**: Genel Agoric API işleyici dağıtım betiği.

### UI Dizini

`ui` dizini neredeyse tamamen sizin kontrolünüzdedir. Genellikle düzenlenmemesi gereken tek dosya ve klasörler şunlardır:

- **public/lib**: Agoric UI kütüphanesi.
- **public/conf**: `contract/deploy.js` betiği tarafından oluşturulan yapılandırma dosyaları.

## Daha Fazla Bilgi

.