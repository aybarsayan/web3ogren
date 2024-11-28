---
title: SP Düğümü Çalıştır - BNB Greenfield SP
description: Bu kılavuz, BNB Greenfield SP Düğümünün kurulumu ve yapılandırması için gerekli adımları sağlamaktadır. Başarıyla kurduktan sonra, SP Ağına nasıl katılacağınız hakkında bilgi bulacaksınız.
keywords: [SP, Düğüm, BNB Greenfield, yapılandırma, ağ katılımı]
---

Bu kılavuz, bir SP Düğümü kurmanıza yardımcı olur. SP Düğümünü başarıyla kurduğunuzda, çevrimiçi hale getirmek için `SP Ağına Katılma kılavuzunu` takip edebilirsiniz.

- `Ön Koşullar`
    - `Önerilen Donanım`
    - `Cüzdan Hazırlığı`
    - `Veritabanı Yapılandırması`
    - `PieceStore Yapılandırması`
    - `Ağ Geçidi Yapılandırması`
        - `1. https sertifikalarında hem yol tarzı hem de sanal tarz yönlendiricilerin desteklenmesi`
        - `2. CORS Yapılandırması`
        - `3. Nginx için Örnek CORS Yapılandırması`
        - `4. Nginx yapılandırması hakkında diğer SSS`
- `Depolama Sağlayıcısı Oluştur`
    - `1. SP’yi Derle`
    - `2. SP Yapılandırması`
        - `Yapılandırma şablonu oluşturun`
        - `Yapılandırmayı yazın`
    - `3. SP’yi Çalıştır`

---

## Ön Koşullar

### Önerilen Donanım

Aşağıda önerilen donanım gereksinimleri listelenmiştir:

- Son sürüm Mac OS X, Linux veya Windows çalıştıran bir VPS;
- 16 çekirdek CPU, 64 GB bellek (RAM);
- 1 Gbps ağ bağlantısı ve 10MB/s+ yükleme/indirme hızı;
- Arka uç depolama için en az 1 TB disk alanı;
- 50GB+ SQL veritabanı;
- Piece Store: AWS S3, MinIO (Beta);
- Yeterli BNB token’ları olan 6 Greenfield hesabı.

:::danger "ÖNEMLİ"
Her depolama sağlayıcısı, farklı amaçlarla hizmet eden 7 farklı hesabı tutacaktır.
:::

### Cüzdan Hazırlığı

- `Operator Account`: StorageProvider bilgilerini düzenlemek için kullanılır. Lütfen `EditStorageProvider` ve `UpdateStorageProviderStatus` işlemlerinin gaz ücretini ödeyebilmek için yeterli BNB’ye sahip olduğundan emin olun.
- `Funding Account`: Staking token’larını yatırmak ve kazançları almak için kullanılır. Bu hesapta yeterli para olduğundan emin olmak önemlidir ve SP, bir teminat olarak bir depozitoyu göndermelidir. En az `500+` BNB, staking için gereklidir. `CreateStorageProvider` teklifini zincir üzerinde göndermek için bu adresi kullanmalısınız. `Staking` için `500BNB` dışında, fonlama adresinin daha fazla veri depolamak için VGF oluşturmak amacıyla yeterli token’a sahip olması gerektiğinden, bu hesaba en az `510BNB` yatırılmasını **öneririz**.
- `Seal Account`: Kullanıcının nesnesini mühürlemek için kullanılır. `SealObject` işleminin gaz ücretini ödeyebilmek için yeterli BNB’ye sahip olduğundan emin olun. Bu hesaba `10BNB` yatırılmasını öneriyoruz.
- `Approval Account`: Kullanıcının taleplerini onaylamak için kullanılır. Bu hesabın BNB token’ı bulundurması gerekmez.
- `GC Account`: SP için özel bir adrestir ve SP, yerel olarak süresi dolmuş veya istenmeyen depolamayı temizlemek için kullanır. Zincir üzerinde işlem göndermeye devam edeceği için yeterli BNB token’ına sahip olduğundan emin olun.
- `Maintenance Account`: Bakım modunda SP’nin kendi kendini test etmesi için kullanılır. Bu hesap, başka kullanıcıların oluşturma isteği başarısız olurken, nesne ve kovası oluşturmak için Zincir tarafından beyaz listeye alınacaktır.
- `Bls Account`: Nesneleri mühürlerken bütünlüğü sağlamak için bls imzası oluşturmak için kullanılır, bu hesaba para yatırılması gerekmez.

Aşağıda altı hesap bulunmaktadır, bu hesapları oluşturmak için aşağıdaki komutu kullanabilirsiniz:

```shell
./build/bin/gnfd keys add operator --keyring-backend os
./build/bin/gnfd keys add seal --keyring-backend os
./build/bin/gnfd keys add approval --keyring-backend os
./build/bin/gnfd keys add gc --keyring-backend os
./build/bin/gnfd keys add maintenance --keyring-backend os
./build/bin/gnfd keys add bls --keyring-backend os --algo eth_bls
```

ve ardından bu özel anahtarları SP dağıtımı için hazırlamak üzere dışa aktarın:

```shell
./build/bin/gnfd keys export operator --unarmored-hex --unsafe  --keyring-backend os
./build/bin/gnfd keys export seal --unarmored-hex --unsafe --keyring-backend os
./build/bin/gnfd keys export approval --unarmored-hex --unsafe --keyring-backend os
./build/bin/gnfd keys export gc --unarmored-hex --unsafe --keyring-backend os
./build/bin/gnfd keys export bls --unarmored-hex --unsafe --keyring-backend os
```

:::danger "ÖNEMLİ"
`FundingAddress`, staking token’larını yatırmak ve kazançları almak için kullanılır. Bu nedenle, kullanıcıların kendi `FundingAddress` genel anahtarını ve özel anahtarını hazırlamaları gerektiğini unutmayın. Ve `FundingAddress` özel anahtarını güvenlik için soğuk cüzdanda saklayın!

`OperatorAddress`, `SealAddress`, `ApprovalAddress`, `GCAddress` ve `BlsAddress` özel anahtarları sıcak cüzdanda saklanabilir, çünkü bunlar genellikle işlem göndermek için kullanılır.

Eğer `gnfd` ikili dosyasında `FundingAddress` genel anahtarı ve özel anahtarını oluşturmak isterseniz, aşağıdaki komutları çalıştırabilirsiniz:

```shell
./build/bin/gnfd keys add funding --keyring-backend os
./build/bin/gnfd keys export funding --unarmored-hex --unsafe  --keyring-backend os
```

maintenance account SP dağıtımı için gerekli değildir, ancak kendi kendini test etmek için dışa aktarılmalıdır:

```shell
./build/bin/gnfd keys export maintenance --unarmored-hex --unsafe --keyring-backend os
```

Lütfen bu yedi özel anahtarı güvende tutun!

Ayrıca, bls genel anahtarını elde edin ve Storage Provider oluşturma teklifini doldurmak için bls kanıtı oluşturun.

`bls_pub_key`:

```shell
./build/bin/gnfd keys show bls --keyring-backend os --output json | jq -r '.pubkey_hex' 
```

`bls_proof`:

```shell
# Yukarıdaki bls_pub_key’ini doğru bls genel anahtarı imzaladığınızdan emin olmak için ${bls_pub_key} ile değiştirin!!!
./build/bin/gnfd keys sign "${bls_pub_key}" --from bls --keyring-backend os
```

### Veritabanı Yapılandırması

İki veritabanı oluşturmalısınız: `${SpDB.Database}` ve `${BsDB.Database}`. Her iki değeri de `yapılandırma dosyasından` bulabilirsiniz.

:::danger "ÖNEMLİ"
`${BsDB.Database}`, **utf8mb4_unicode_ci** karakter seti ve sıralaması gerektirir.
:::

Aşağıdaki örnek `${SpDB.Database}`'yi `storage_provider_db` ve `${BsDB.Database}`'yi `block_syncer` olarak varsaymaktadır.

```shell
# mysql'e giriş yapın ve veritabanı oluşturun
# Veritabanı için varsayılan kodlama utf8mb4_unicode_ci olmalıdır
mysql> CREATE DATABASE storage_provider_db;
mysql> CREATE DATABASE block_syncer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Veritabanı kodlama formatını kontrol edin
mysql> show create database block_syncer;
```

Görmek istediğimiz kodlama bu:

| Veritabanı     | Veritabanı Oluştur                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| block_syncer | CREATE DATABASE `block_syncer` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` */ |

### PieceStore Yapılandırması

Lütfen PieceStore’unuzu yapılandırmak için bu `belgeyi` takip edin.

### Ağ Geçidi Yapılandırması

#### 1. https sertifikalarında hem yol tarzı hem de sanal tarz yönlendiricilerin desteklenmesi

SP'nin maruz kalan ağ geçidi hizmeti alan adları ve onun wildcard alt alan adı için sertifikalar gerekir; örneğin, SP’nin ağ geçidi hizmetini `https://my-sp1.mainnet.dummy-sp.io` üzerinde açıyorsanız, `my-sp1.mainnet.dummy-sp.io` ve `*.my-sp1.mainnet.dummy-sp.io` için SSL sertifikalarına ihtiyacınız vardır.
Örneğin, AWS ACM sertifikası talep ederseniz, bunu talep edebilirsiniz:
![SP AWS ACM SERT](../../../images/bnb-chain/bnb-greenfield/static/asset/407-SP-AWS-ACM-Cert.png)

Ayrıca, hem `my-sp1.mainnet.dummy-sp.io` hem de `*.my-sp1.mainnet.dummy-sp.io` adreslerinden tüm trafiği ağ geçidi hizmetine yönlendirin; örneğin, eğer ingress kontrolü için nginx kullanıyorsanız, o halde aşağıdaki gibi kurallar ayarlamalısınız:

```yaml
rules:
  - host: my-sp1.mainnet.dummy-sp.io
    http:
      paths:
        - backend:
            service:
              name: gateway # SP ağ geçidi hizmetinizin dahili olduğu, böyle bir k8s hizmeti.
              port:
                number: 9033
          path: /
          pathType: ImplementationSpecific
  - host: '*.my-sp1.mainnet.dummy-sp.io'
    http:
      paths:
        - backend:
            service:
              name: gateway # yukarıdaki ile aynı.
              port:
                number: 9033
          path: /
          pathType: ImplementationSpecific
```

#### 2. CORS Yapılandırması

Web uygulamalarıyla (örn. DCellar) çalışırken, SP’lerin CORS (Cross-Origin Resource Sharing) isteklerine izin vermesi gerekir.
Bkz: [CORS Hataları](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

Eğer CORS düzgün yapılandırılmazsa, DCellar (veya SP’nizle etkileşimde bulunması planlanan diğer web uygulamaları) CORS hataları bildirir, aşağıdaki gibi:

![CORS HATA](../../../images/bnb-chain/bnb-greenfield/static/asset/405-cors-error.png)

Çoğu kişi SP hizmetlerini nginx veya benzeri ters proxy arkalarında çalıştırmaktadır. Genellikle CORS ayarları bu ters proxy'lerde yapılandırılmalıdır.

Ters proxy ile SP'lerin aşağıdaki başlıkları döndürmesini **öneriyoruz**:

```shell
access-control-allow-headers: *
access-control-allow-methods: *
access-control-allow-origin: *
access-control-expose-headers: *
```

Yapılandırmayı tamamladıktan sonra, bunun DCellar'da çalışıp çalışmadığını doğrulayabilirsiniz.

1. [https://dcellar.io](https://dcellar.io) adresine gidin
2. Web geliştirici araçlarını başlatmak için F12 tuşuna basın ve "Ağ" sekmesine gidin.
3. Cüzdanınızı bağlayın
4. SP’nize giden "OPTIONS" isteğini bulun ve durumunu ve yanıt başlıklarını kontrol edin. Aşağıdaki ekran görüntüsüne benzer bir sonuç görüyorsanız, CORS yapılandırmanız doğrudur.
   ![DOĞRU_CORS](../../../images/bnb-chain/bnb-greenfield/static/asset/406-correct-cors.png)

#### 3. Nginx için Örnek CORS Yapılandırması
Birçok depolama sağlayıcısı (SP), SP'nin ters proxy sunucusu olarak Nginx kullanmayı tercih eder. CORS isteklerini işlemek için de yardımcı olabilir.

Aşağıda, yukarıda `CORS Yapılandırması` kısmında belirtilen beklenen http yanıt başlıklarını döndürebilen bir örnek nginx yapılandırması verilmiştir.
Lütfen nginx sunucularının http **OPTIONS** istekleri için yanıt kodu olarak açıkça 204 döndürmesi gerektiğini unutmayın.

```config

server {
    listen 443;
    server_name example.com;

    # CORS Preflight yöntemleri ek seçenekler ve farklı Dönüş Kodu gerektirir
    location / {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' '*';
            add_header 'Access-Control-Allow-Headers' '*';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Access-Control-Expose-Headers' '*';
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' '*';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Expose-Headers' '*';
        
        # Sunucunuzun diğer yapılandırmaları...
    }
}

```

#### 4. Nginx yapılandırması hakkında diğer SSS
Bazı SP’lerin ters proxy katmanı olarak nginx kullandığını gözlemledik. Bu bölümde, nginx yapılandırması hakkında bilinen en iyi uygulamaları listeleyeceğiz.

- proxy_pass ve proxy_set_header

  Eğer nginx’iniz, bir isteği bir proxy sunucusuna (örn. SP ağ geçidi mikroservisi) geçiş yapmak için proxy_pass direktifini kullanıyorsa, HOST başlığını ayarlamak için de proxy_set_header kullanmalısınız.
  Aksi takdirde, SP ağ geçidine iletilen isteğin başı 127.0.0.1 olarak yorumlanacaktır. Bu durumda, SP ağ geçidi kullanıcı isteklerinin imzasını doğrulayamaz.

  ```config
  location / {
    proxy_pass http://127.0.0.1:9033
    proxy_set_header Host $host;
  }
  
  ```

---

## Depolama Sağlayıcısı Oluştur

### 1. SP’yi Derle

SP ikili dosyasını derlemek için `SP’yi Derle` belgesini takip edin veya ikili dosyayı [Greenfield Depolama Sağlayıcı Sürümü](https://github.com/bnb-chain/greenfield-storage-provider/releases) üzerinden indirebilirsiniz.

### 2. SP Yapılandırması

#### Yapılandırma şablonu oluşturun

```shell
cd greenfield-storage-provider/build

# varsayılan yapılandırmayı dökün
./gnfd-sp config.dump
```

#### Yapılandırmayı yazın

`config.toml` dosyanızı yazmayı öğrenmek için `buraya` göz atabilirsiniz.

Kubernetes kümesini dağıtmanızı **öneririz**, bunu [bu kılavuzu](https://github.com/bnb-chain/greenfield-sp-deployment/blob/main/docs/README.md) izleyerek yapabilirsiniz. Karşılık gelen yapılandırma dosyası [burada](https://github.com/bnb-chain/greenfield-sp-deployment/blob/main/docs/k8s/aws/config.toml) bulunmaktadır.

### 3. SP’yi Çalıştır

```shell
# sp’yi başlat
./gnfd-sp --config ${config_file_path}
```