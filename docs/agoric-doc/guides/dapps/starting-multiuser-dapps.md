---
title: Çok Kullanıcılı Dapp'lere Başlangıç
---

# Çok Kullanıcılı Dapp'lere Başlangıç

Bir dapp geliştirirken, halka açık olarak dağıtmadan önce birden fazla kullanıcı ile nasıl davrandığını test etmeniz gerekebilir. Bu kullanıcılar, sözleşme dağıtıcısı, müzayedeci, teklif veren, alıcı, satıcı gibi farklı rollere sahip olabilirler.

Agoric CLI (Komut Satırı Arayüzü), çok kullanıcılı dapp'leri geliştirmek ve test etmek için yerel bir zincir çok kullanıcılı senaryosu sunmaktadır.

## Kullanım

1. Dapp'inizi,  belgesinde açıklandığı gibi başlatın.
2. Simüle edilmiş zincirle test etmek için `agoric start` komutunu kullandıktan sonra, simüle edilmiş zinciri Control-C ile durdurun.
3. Agoric SDK içerisindeki Golang bağımlılıklarını derlemek için aşağıdaki komutu çalıştırın:

   ```sh
   cd agoric-sdk/packages/cosmic-swingset && make
   ```

4. `agd` ikilisinin `$PATH`'inizde olup olmadığını kontrol etmek için aşağıdaki komutu çalıştırın.

   ```sh
   # $PATH'inizde olması gereken dizini gösterir.
   echo ${GOBIN-${GOPATH-$HOME/go}/bin}
   # Oraya yüklenen bir ikiliyi çalıştırmayı deneyin.
   agd version --long
   ```

   (Eğer ikili çalışmıyorsa, onu `$PATH`'inize eklemeniz gerekir.)

5. Aşağıdaki komutu çalıştırarak gerçek bir yerel zincir başlatın. Agoric sürecini sıfırdan başlatmak isterseniz, sonuna `--reset` seçeneğini ekleyin.

   ```sh
   agoric start local-chain --rebuild
   ```

Henüz çalışan istemciler olmayacak, ancak zincir başlayacak ve tam işlevsel olacaktır.

Zinciri arka planda çalıştırmak isteyeceksiniz, bu nedenle sisteminizde arka plan işlemlerini nasıl yöneteceğinizi bilmelisiniz. Örneğin, Unix benzeri sistemler, Agoric işlemini arka planda başlatmak ve _chain.log_ dosyasına kaydetmek için aşağıdakini kullanabilir:

```sh
agoric start local-chain >& chain.log &
```

Yukarıdaki yerel zincire bağlı bir yerel solo makine başlatmak için (yani, API ag-solo'nuz için) aşağıdaki komutu çalıştırın:

```sh
agoric start local-solo 8000
```

Bunun bir hata vermesi veya uzun sürmesi (yani, bir dakikadan fazla) gerektiğini unutmayın, bu süreçte yerel zincirinizin `validTxs=1` gibi bir şey kaydediyor olması gerekir. Yerel ag-solo kullanıma hazır olana kadar 50'den fazla gidiş-dönüş (her biri 2 saniye) gerçekleşecektir.

Bu, HTTP üzerinden TCP portu 8000’de dinleyen bir solo makine başlatır.

Diğer yerel ag-solo'ları başlatmak için, her biri için benzersiz bir port numarası kullanmalısınız (örn. 8001 veya 8002).

```sh
agoric start local-solo 
```

Her yeni yerel ag-solo için, ya:

- Her yerel-solo port numarasına karşılık gelen cüzdanı açmak için şu komutu çalıştırın:
  - `agoric open --hostport=localhost:`
- Veya cüzdanı açın, görüntülenen URL'yi alın ve ardından o URL'yi göreceğiniz tarayıcıya kopyalayıp yapıştırın:
  - `agoric open --no-browser --hostport=localhost:`

Her ag-solo'nuzun çalıştığını ve bir cüzdanı olduğunu doğrulamak için, kullandığınız her port için `http://localhost:/` adresine bağlanın.

Sözleşmenizi ve API dağıtım betiklerinizi API ag-solo'sunu kullanarak aşağıdaki komutla çalıştırın.

```sh
agoric deploy 
```

Port 8000, `agoric deploy` işlemleri için varsayılandır. Farklı bir portta çalışan bir ag-solo'ya dağıtım yapmak için `agoric deploy --hostport=127.0.0.1:` komutunu kullanın.

Dapp UI'nızı farklı istemcilerle kullanmak için, farklı tarayıcılarda (veya aynı tarayıcının farklı profillerinde) `https://wallet.agoric.app/locator/` adresine bağlanmanız gerekecek. Ardından, kullanmak istediğiniz ag-solo'nun localhost adresini doldurmanız gerekecek. Bu, tarayıcıdaki süreçleri kendi cüzdanlarına bağlar, böylece her bir istemci için veri paylaşımını önler (örn. çerezler, depolama, vb.). UI'nızı her tarayıcıda test etmelisiniz.

## Örnek

İşte bir kullanım senaryosu örneği.

1. Yerel zinciri ve ag-solo'ları başlatın.

   ```sh
   # Golang bağımlılıklarını inşa edin.
   (cd agoric-sdk/packages/cosmic-swingset && make)
   # agd ikilisinin $PATH'inizde olup olmadığını ve çalıştığını kontrol edin.
   agd version --long
   # Bir Dapp dizini başlatın.
   agoric init foo
   # Dapp dizinine geçin.
   cd foo
   # NPM bağımlılıklarını yükleyin.
   agoric install
   # Yerel zinciri başlatın, chain.log'a kaydederek.
   agoric start local-chain >& chain.log &
   # Yerel bir API ag-solo başlatın (bitmesi bir dakikadan fazla sürüyor).
   agoric start local-solo 8000 >& solo-8000.log &
   # İlgili cüzdanı açın.
   agoric open --hostport=localhost:8000
   # İkinci bir ag-solo başlatın.
   agoric start local-solo 8001 >& solo-8001.log &
   # İkinci ilgili cüzdanı açın.
   agoric open --hostport=localhost:8001
   # Başlatmak istediğiniz diğer ag-solo'lar için (8002, 8003, vb.) tekrarlayın.
   ```

2. İlk istemci tarayıcısını yapılandırın.
3. Bir tarayıcı (veya yeni bir profil) açın ve `https://wallet.agoric.app/locator/` adresine gidin.

   

4. Önerilen adresi (`http://localhost:8000`) koruyun.
5. **Aç** butonuna tıklayın ve cüzdanın ve REPL'nin (Okuma-Değerlendirme-Yazdırma Döngüsü) açıldığını doğrulayın.
6. REPL'de `console.log(8000)` yazın.
7. **Enter** tuşuna basın ve komut ile çıktıyı REPL geçmişinde görün.

   

### Ek Bir İstemci Tarayıcısını Yapılandırın

1. Farklı bir tarayıcı açın. Sadece başka bir sekme veya pencere değil, çerezleri diğer ag-solo tarayıcılarıyla paylaşmayan tamamen farklı bir tarayıcı veya tarayıcı profili. Örneğin, açık bir Chrome penceresi varsa, yeni bir Chrome profili oluşturun veya bir Firefox veya Safari penceresi açın.
2. `https://wallet.agoric.app/locator/` adresine gidin ve açılan sayfada adresi `http://localhost:8001` olarak ayarlayın.
3. **Kaydet** butonuna tıklayın.
4. **Aç** butonuna tıklayın ve cüzdan sayfasının açıldığını doğrulayın. (**Not**: Henüz erişiminiz olmayacak.)
5. REPL'de `console.log(8001)` yazın, **Enter** tuşuna basın ve `console.log` komutunu ve çıktısını REPL geçmişinde görün.

   

Bu bölümü, kaç tane ag-solo başlatırsanız başlatın tekrarlayabilirsiniz.

### UI'yi Test Edin

```sh
# Sözleşmeyi ve API hizmetini dağıtın.
agoric deploy contract/deploy.js api/deploy.js
# UI'yı başlatın.
(cd ui && yarn start)
```

UI'yı kullanmak istediğiniz her tarayıcı/profil için `http://localhost:3000` adresine gidin.  
UI cüzdanınızı açtığında, tarayıcı aynı URL'ye yönlendirilmelidir; bu URL'yi o tarayıcı veya profilin `https://wallet.agoric.app/locator/` sayfasına girdiğiniz URL ile aynı olmalıdır.