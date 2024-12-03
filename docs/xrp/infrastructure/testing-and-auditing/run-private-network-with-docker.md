---
title: Docker ile Özel Bir Ağ Çalıştırma
seoTitle: Docker ile Özel XRP Ağının Kurulumu
sidebar_position: 1
description: Docker ve Docker Compose kullanarak özel bir XRP defter ağı kurmayı öğrenin. Adım adım talimatlar ve gereksinimler ile süreci ayrıntılı olarak keşfedin.
tags: 
  - Docker
  - XRP
  - özel ağ
  - ripple
  - Docker Compose
  - validator
keywords: 
  - Docker
  - XRP
  - özel ağ
  - ripple
  - Docker Compose
  - validator
---
## Docker ile Özel Bir Ağ Çalıştırma

Bu öğretici, bilgisayarınızda [Docker](https://docs.docker.com/get-docker/) ve en son [rippled](https://hub.docker.com/r/xrpllabsofficial/xrpld) sürümü ile özel bir XRP Defter ağı nasıl çalıştırılacağını açıklar.

Genel XRP Testnet sunucularını kolaylıkla kullanabilirsiniz, ancak bir özel ağ çalıştırmak, XRP Defterinin nasıl çalıştığını anlamaya çalışırken ya da yeni özellikleri izole bir şekilde test ederken faydalı olabilir.

:::warning
Bu öğretici yalnızca geliştirme veya test amaçları için uygundur ve gerçek para kullanmayı içermez. Bu yapılandırmayı bir üretim ağı için **kullanmayın**.
:::

## Öğrenme Hedefleri

Bu öğreticide şunları öğreneceksiniz:

- Üç `rippled` doğrulayıcı düğüm ile _küçük_ bir ağın nasıl kurulacağı ve yapılandırılacağı; her düğüm için anahtarların nasıl oluşturulacağı.
- Ağın [Docker Compose](https://docs.docker.com/compose/) ile nasıl çalıştırılacağı.
- Ağın çalıştığını doğrulamanın yolları.

Aşağıdaki diyagram, kuracağınız konteynerleştirilmiş özel ağı yüksek seviyede bir genel görünümde göstermektedir.



---

## Gereksinimler

Bu öğreticiyi takip etmek için, tercih ettiğiniz platformda en son **Docker** sürümünün yüklü olduğundan emin olun.

## Doğrulayıcı Anahtarlarını Üretme

`rippled` ile sağlanan `validator-keys` aracını kullanarak **her** bir doğrulayıcı düğüm için anahtarları oluşturun. Üretilen anahtarlar bilgisayarınızdaki bir metin dosyasına kaydedilmeli ve daha sonra kullanılmalıdır.

1. Terminalinizde, `rippled` Docker konteyneri kabuğu içinde komutları çalıştırmak için aşağıdakini çalıştırın:

    ```
    docker run -it --entrypoint /bin/bash xrpllabsofficial/xrpld:latest
    ```

    :::info
    Apple M1 veya M2 işlemcileri için bunun yerine `docker run -it --platform linux/amd64 --entrypoint /bin/bash xrpllabsofficial/xrpld:latest` çalıştırın.
    :::

    Örnek çıktı:

    ```
    root@7732bd585b14:/#
    ```

2. `create_keys` komutunu kullanarak bir doğrulayıcı anahtar çifti oluşturun.

    ```
    cd /opt/ripple/bin &&
        ./validator-keys create_keys --keyfile /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    Örnek çıktı:

    ```
    Validator keys stored in /PATH/TO/YOUR/validator-<NUMBER>-keys.json

    This file should be stored securely and not shared.
    ```

    :::danger
    Üretim veya test ortamında her zaman en iyi uygulamaları izlemeli ve üretilen anahtarları şifrelenmiş bir USB bellek gibi güvenli, çevrimdışı ve erişilebilir bir yerde saklamalısınız. Ancak, bu öğretici yerel bir geliştirme ortamı örneği olduğu için anahtarları bilgisayarınıza saklamak yeterlidir.
    :::

3. JSON çıktısından **public_key** değerini kopyalayın ve bilgisayarınızdaki bir metin dosyasına kaydedin.

    ```
    cat /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    Örnek çıktı:

    ```
    {
       "key_type" : "ed25519",
       "public_key" : "nHD9jtA9y1nWC2Fs1HeRkEisqV3iFpk12wHmHi3mQxQwUP1ywUKs",
       "revoked" : false,
       "secret_key" : "paLsUUm9bRrvNBPpvJQ4nF7vdRTZyDNofGMMYs9EDeEKeNJa99q",
       "token_sequence" : 0
    }
    ```

4. `create_token` komutunu kullanarak bir doğrulayıcı tokenı oluşturun.

    ```
    ./validator-keys create_token --keyfile /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    Çıktıdan token değerini kopyalayın ve bilgisayarınızdaki bir metin dosyasına kaydedin. Örneğin:

    ```
    [validator_token]
    eyJ2YWxpZGF0aW9uX3NlY3J|dF9rZXkiOiI5ZWQ0NWY4NjYyNDFjYzE4YTI3NDdiNT
    QzODdjMDYyNTkwNzk3MmY0ZTcxOTAyMzFmYWE5Mzc0NTdmYT|kYWY2IiwibWFuaWZl
    c3QiOiJKQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeE
    hYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tG
    bjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2
    hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1
    NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdj
    VUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==
    ```

5. Kalan doğrulayıcı düğümleri için **2-4** adımlarını tekrarlayın. Tüm doğrulayıcılar için anahtarları ve tokenları oluşturduktan sonra terminalinizde `exit` yazıp Docker konteynerinden çıkın.

---

## Ağı Yapılandırma

Bu bölüm, ağınızdaki doğrulayıcı düğümleri nasıl yapılandıracağınızı açıklar.

:::info
Bu öğreticideki yapılandırma, ağın _bazı_ defter geçmişini saklamasını sağlar, ancak saklanan işlem geçmişinin miktarı ağın ne kadar süre çevrimiçi kaldığına bağlı olacaktır.
:::

### Düğüm dizinlerini oluşturun

Bilgisayarınızda, özel ağdaki tüm düğümlerin ve bunların ilgili yapılandırma klasörlerinin dizinlerini oluşturun.

```
xrpl-private-network/
    ├── validator_1/
    │   └── config
    ├── validator_2/
    │   └── config
    └── validator_3/
        └── config
```

Terminalinizde dizinleri oluşturmak için aşağıdaki komutu çalıştırın:

```
mkdir -p xrpl-private-network/{validator_1/config,validator_2/config,validator_3/config}
```

### Doğrulayıcı yapılandırma dosyalarını oluşturun

Her doğrulayıcı düğümü için bu adımları izleyin:

1. Doğrulayıcıların `config` dizininde bir `rippled.cfg` dosyası oluşturun.

2. Aşağıdaki `rippled.cfg` şablonundan bilgileri dosyaya kopyalayın.

    ```
    [server]
    port_rpc_admin_local
    port_rpc
    port_ws_admin_local
    port_ws_public
    port_peer
    # ssl_key = /etc/ssl/private/server.key
    # ssl_cert = /etc/ssl/certs/server.crt

    [port_rpc_admin_local]
    port = 5005
    ip = 127.0.0.1
    admin = 127.0.0.1
    protocol = http

    [port_ws_admin_local]
    port = 6006
    ip = 127.0.0.1
    admin = 127.0.0.1
    protocol = ws

    [port_ws_public]
    port = 80
    ip = 0.0.0.0
    protocol = ws

    [port_peer]
    port = 51235
    ip = 0.0.0.0
    protocol = peer

    [port_rpc]
    port = 51234
    ip = 0.0.0.0
    admin = 127.0.0.1
    protocol = https, http

    [node_size]
    small
    # tiny
    # small
    # medium
    # large
    # huge

    [node_db]
    type=NuDB
    path=/var/lib/rippled/db/nudb
    advisory_delete=0

    # Ne kadar defteri saklamak istiyoruz (geçmiş)?
    # Çevrimiçi silme olayları arasında saklanacak defter sayısını tanımlayan tam sayı değeri
    online_delete=256

    [ledger_history]
    # Ne kadar defteri saklamak istiyoruz (geçmiş)?
    # Tam sayı değeri (defter sayısı)
    # veya (eğer çok TB SSD depolama alanınız varsa): 'full'
    256

    [database_path]
    /var/lib/rippled/db

    [debug_logfile]
    /var/log/rippled/debug.log

    [sntp_servers]
    time.windows.com
    time.apple.com
    time.nist.gov
    pool.ntp.org

    [ips_fixed]
    validator_1 51235
    validator_2 51235
    validator_3 51235

    [validators_file]
    validators.txt

    [rpc_startup]
    { "command": "log_level", "severity": "warning" }
    # severity (sırası: çok fazla bilgi .. sadece hatalar)
    # debug
    # info
    # warn
    # error
    # fatal

    [ssl_verify]
    0

    [validator_token]
    <Validator tokenınızı buraya ekleyin>
    ```

3. Öğreticinin `başında` oluşturduğunuz doğrulayıcı tokenını ekleyin. Örneğin:

    ```
    [validator_token]
    eyJtYW5pZmVzdCI6IkpBQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeE
    hYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tG
    bjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2
    hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1
    NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdj
    VUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==
    ```

    Her doğrulayıcı düğümün kendine özgü bir tokenı olmalıdır.

### validators.txt dosyalarını oluşturun

Artık doğrulayıcılarınız için yapılandırma dosyalarını oluşturduğunuza göre, bir `validators.txt` dosyası eklemeniz gerekmektedir. Bu dosya, ağınızdaki hangi doğrulayıcıların güvenilir olduğunu tanımlar.

Her düğüm için bu adımları izleyin:

1. Yapılandırma dizininde bir `validators.txt` dosyası oluşturun.
2. Öğreticinin `başında` oluşturduğunuz `validator-keys.json` dosyalarından kamu anahtarlarını kopyalayın.
3. _Tüm_ doğrulayıcıların kamu anahtarlarını ekleyin. Örneğin:

    ```
    [validators]
        nHBgaEDL8buUECuk4Rck4QBYtmUgbAoeYJLpWLzG9iXsznTRYrQu
        nHBCHX7iLDTyap3LumqBNuKgG7JLA5tc6MSJxpLs3gjkwpu836mY
        nHU5STUKTgWdreVqJDx6TopLUymzRUZshTSGcWNtjfByJkYdiiRc
    ```

---

## Ağı Başlatma

Docker Compose, bilgisayarınızdaki birden fazla konteyneri basit bir `yaml` dosyası yapılandırması ile yönetmenizi sağlar. Bu bölüm, ağı Docker Compose ile nasıl çalıştıracağınızı ve ağın başarılı bir şekilde çalıştığını nasıl doğrulayacağınızı açıklar.

:::info
Docker Compose, konteynerlerin varsayılan olarak aynı Docker sanal ağına dahil olmasını sağladığından, `rippled` konteynerlerinin birbirleriyle iletişim kurması için ek bir adım atmanıza gerek yoktur.
:::

Özel ağınızı çalıştırmaya başlamak için bu adımları takip edin:

1. Özel ağ dizininizin kökünde, `xrpl-private-network` içinde bir `docker-compose.yml` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

    ```
    version: "3.9"
    services:
      validator_1:
        platform: linux/amd64
        container_name: validator_1
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8001:80"
          - "5006:5005"
          - "4001:6006"
          - "9001:51235"
        volumes:
          - ./validator_1/config:/config/
      validator_2:
        platform: linux/amd64
        container_name: validator_2
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8002:80"
          - "5007:5005"
          - "4002:6006"
          - "9002:51235"
        volumes:
          - ./validator_2/config:/config/
      validator_3:
        platform: linux/amd64
        container_name: validator_3
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8003:80"
          - "5008:5005"
          - "4003:6006"
          - "9003:51235"
        volumes:
          - ./validator_3/config:/config/
    ```

    Her `service` içindeki `volumes` anahtarı, yapılandırma dosyalarınızın saklandığı yeri temsil eder. Örneğin, `./validator_1/config:/config/` ana bilgisayarınızdaki `/validator_1/config` dizinini Docker konteynerindeki `/config/` ile eşleştirir. Ana bilgisayardaki dizinde yapılan değişiklikler otomatik olarak konteynerde yansıyacaktır.

2. Terminalinizde, `docker-compose.yml` dosyasını oluşturduğunuz yerde `docker-compose up -d` komutunu çalıştırın. Aşağıdakine benzer bir çıktı görmelisiniz:

    ```
    [+] Running 4/4
     ✔ Network xrpl-private-network_default    Created                             0.0s
     ✔ Container validator_3                   Started                             0.5s
     ✔ Container validator_1                   Started                             0.5s
     ✔ Container validator_2                   Started                             0.5s
    ```

---

## Ağı Doğrulama

Artık özel defter ağı kurulduğuna göre, **her** doğrulayıcı düğümün beklenildiği gibi çalıştığını doğrulamanız gerekiyor:

1. Terminalinizde, doğrulayıcı Docker konteynerinde komutları çalıştırmak için `docker exec -it  /bin/bash` komutunu çalıştırın. `` ile kontenerin adını (örneğin, `validator_1`) değiştirin.

2. Doğrulayıcının durumunu kontrol etmek için `rippled server_info` komutunu çalıştırın:

    ```
    rippled server_info | grep server_state
    ```

    Örnek Çıktı:

    ```
    "server_state" : "proposing"
    ```

    :::info
    Eğer durum **proposing** olarak güncellenmemişse, defterin güncellenmesi birkaç dakika alabileceğinden **2**. adımı birkaç dakika sonra tekrarlayın.
    :::

3. Doğrulayıcıya bağlı olan peer sayısını doğrulayın.

    ```
    rippled server_info | grep peers
    ```

    Örnek Çıktı:

    ```
    "peers" : 2
    ```

4. Genesis hesap bilgilerini kontrol etmek için aşağıdaki komutu çalıştırın:

    ```
    rippled account_info rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh validated strict
    ```

    Örnek Çıktı:

    ```
     {
       "result" : {
           "account_data" : {
             "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
             "Balance" : "100000000000000000",
             "Flags" : 0,
             "LedgerEntryType" : "AccountRoot",
             "OwnerCount" : 0,
             "PreviousTxnID" : "0000000000000000000000000000000000000000000000000000000000000000",
             "PreviousTxnLgrSeq" : 0,
             "Sequence" : 1,
             "index" : "2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8"
           },
           "ledger_hash" : "CFCEFB049A71E26DE812529ABB212F330FAF583A98FE073F14713B0644D7CEE9",
           "ledger_index" : 10181,
           "status" : "success",
           "validated" : true
       }
    }
    ```

5. Docker konteyneri kabuğunun dışına çıkmak için terminalde `exit` girin.

---

### Test İşlemi Gerçekleştirin

Bir hesaba para gönderebildiğinizden emin olmak için bir **test** işlemi gerçekleştirin.

1. Terminalinizde, aşağıdaki komutu çalıştırarak bir işlem gönderin:

    ```
    docker exec -it validator_1 \
        rippled submit 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb' '{ "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "Amount": "1000000000", "Destination": "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs", "TransactionType": "Payment", "Fee": "10" }'
    ```

    Örnek Çıktı:

    ```
    {
      "result" : {
          "engine_result" : "tesSUCCESS",
          "engine_result_code" : 0,
          "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
          "status" : "success",
          "tx_blob" :   "1200002280000000240000000161400000003B9ACA0068400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074463044022057CCEED351A4278F35C13FD104A55338DC8F48C1F9902D58045A4CD0CE89C92A0220184026BD3B1E2C21239017CAF1BBF683 35EDC57F6F98D952E263763DE449561B8114B5F762798A53D543A014CAF8B297CFF8F2F937E883145988EBB744055F4E8BDC7F67FD53EB9FCF961DC0",
          "tx_json" : {
            "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "Amount" : "1000000000",
            "Destination" : "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs",
            "Fee" : "10",
            "Flags" : 2147483648,
            "Sequence" : 1,
            "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType" : "Payment",
            "TxnSignature" : "3044022057CCEED351A4278F35C13FD104A55338DC8F48C1F9902D58045A4CD0CE89C92A0220184026BD3B1E2C21239017CAF1BBF68335EDC57F6F98D952E263763DE449561B",
            "hash" : "EB516738841794B24819C68273E0F853A3D234350E6534F7F2841F620CE99437"
          }
      }
    }
    ```

2. Her doğrulayıcı için, hedef hesabın `r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs` 1000000000 XRP aldığını doğrulayın. Örneğin:

    ```
    docker exec -it validator_1 \
        rippled account_info r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs validated strict
    ```

    Örnek Çıktı:

    ```
    {
       "result" : {
           "account_data" : {
             "Account" : "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs",
             "Balance" : "1000000000",
             "Flags" : 0,
             "LedgerEntryType" : "AccountRoot",
             "OwnerCount" : 0,
             "PreviousTxnID" : "EB516738841794B24819C68273E0F853A3D234350E6534F7F2841F620CE99437",
             "PreviousTxnLgrSeq" : 36,
             "Sequence" : 1,
             "index" : "0F2E4615AE24EEF58EE82BD1E67D237234ED41BFC8B7885630B7AC05082E97AA"
           },
           "ledger_hash" : "6F9F54903CC4546F7A426CD78AFD68D907F5DC40B1780DF31A662CF65920E49C",
           "ledger_index" : 51,
           "status" : "success",
           "validated" : true
       }
    }
    ```

    Tüm doğrulayıcı düğümleri, `r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs` hesabı için 1000000000 XRP bakiyesi ile aynı yanıtı vermelidir.

---

## Ağı Durdurma

Özel ağı çalıştırmayı durdurmak isterseniz:

1. Terminalinizde `xrpl-private-network` dizinine gidin.
2. Ağı kapatmak için aşağıdaki komutu çalıştırın:

    ```
    docker-compose down
    ```

    Örnek Çıktı:

    ```
    [+] Running 4/4
     ✔ Container validator_3                 Removed                                                       1.7s
     ✔ Container validator_1                 Removed                                                       1.6s
     ✔ Container validator_2                 Removed                                                       1.6s
     ✔ Network xrpl-private-network_default  Removed                                                       0.0s
    ```

## Ayrıca Bakınız

- **Ağlar ve Sunucular:**
    - `Peer Protokolü`
    
- **Kaynaklar:**
    - [Docker için XRPL Testnet Kurulum Betikleri](https://github.com/UNIC-IFF/xrpl-docker-testnet)