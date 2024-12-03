---
title: rippledi Raporlama Modunda Oluşturun ve Çalıştırın
seoTitle: rippled Raporlama Modu Rehberi
sidebar_position: 4
description: Doğrulanan veriler için uzaktan prosedür çağrılarını (RPC) yöneten rippledin özel bir çalışma modunu oluşturun ve çalıştırın. Bu belge, raporlama modunu etkinleştirmek için gereken adımları ve yapılandırmaları içermektedir.
tags: 
  - rippled
  - raporlama modu
  - RPC
  - PostgreSQL
  - Cassandra
keywords: 
  - rippled
  - raporlama modu
  - RPC
  - veritabanı yönetimi
  - CMake
---

# `rippled`'i Raporlama Modunda Oluşturun ve Çalıştırın

`Raporlama modu`, `HTTP ve WebSocket API'leri` hizmeti vermek üzere uzmanlaşmış XRP Ledger çekirdek sunucusunun bir modudur.

:::info
Raporlama modunda, sunucu, eşler arası ağa bağlanmaz. Bunun yerine, P2P ağına bağlı bir veya daha fazla güvenilir sunucudan doğrulanan verileri almak için gRPC kullanır. Bu, API çağrılarını etkili bir şekilde yönetebilmenizi sağlar.
:::



`rippled`'in raporlama modu iki veri deposu kullanır:

* **Birincil kalıcı veri deposu:** İşlem meta verilerini, hesap durumlarını ve defter başlıklarını içerir. NuDB'yi veya [Cassandra](https://cassandra.apache.org/) kullanabilirsiniz.
  
* **PostgreSQL veritabanı:** İlişkisel verileri tutmak için kullanılır ve esasen [tx yöntemi][] ve [account_tx yöntemi][] tarafından kullanılır.

:::warning
Birden fazla raporlama modu sunucusu, aynı ağa erişilebilir veritabanlarına (PostgreSQL ve Cassandra) erişimi paylaşabilir. Ancak her an yalnızca bir raporlama modu sunucusu veritabanlarına yazarken, diğerleri veritabanlarından okuma yapar.
:::

## Raporlama Modunu Çalıştırma

### Ön Koşullar

1. Sisteminizin `sistem gereksinimlerini` karşıladığından emin olun.

    :::tip
    Veritabanı olarak Cassandra kullanmayı seçerseniz, `rippled` için disk gereksinimleri daha düşük olacaktır çünkü veriler yerel diskinizde saklanmayacaktır.
    :::

2. En az bir `rippled` sunucusunu P2P modunda çalıştırmanız gerekmektedir.

3. Uyumlu bir CMake sürümünün yüklü olması gerekir.

4. `rippled`'i raporlama modunda çalıştırmak için gerekli veri depolarını yükleyin ve yapılandırın.

    1. PostgreSQL'i yükleyin.

    2. Birincil kalıcı veri deposu olarak kullanılacak veritabanını yükleyin ve yapılandırın. Cassandra veya NuDB'yi kullanmayı seçebilirsiniz.

    3. macOS'ta, Cassandra cpp sürücüsünü manuel olarak yüklemeniz gerekir. Diğer tüm platformlarda, Cassandra sürücüsü `rippled` derlemesi ile birlikte inşa edilir.
        
        ```
        brew install cassandra-cpp-driver
        ```

#### PostgreSQL'i Yükleyin
    
**Linux'ta PostgreSQL'i Yükleyin**

1. [Linux'ta PostgreSQL indirin ve yükleyin](https://www.postgresqltutorial.com/install-postgresql-linux/).
        
2. `psql` kullanarak PostgreSQL Veritabanı Sunucusu'na bağlanın, `newuser` adında bir kullanıcı ve `reporting` adında bir veritabanı oluşturun.

    ```
    psql postgres
        CREATE ROLE newuser WITH LOGIN PASSWORD ‘password’;
        ALTER ROLE newuser CREATEDB;
    \q
    psql postgres -U newuser
    postgres=# create database reporting;
    ```

**macOS'ta PostgreSQL'i Yükleyin**

1. macOS'ta PostgreSQL'i indirin ve yükleyin.  

    ```
    brew install postgres
    brew services start postgres
    ```

2. `psql` kullanarak PostgreSQL Veritabanı Sunucusu'na bağlanın ve `newuser` adında bir kullanıcı ve `reporting` adında bir veritabanı oluşturun.

    ```
    psql postgres
        CREATE ROLE newuser WITH LOGIN PASSWORD ‘password’;
        ALTER ROLE newuser CREATEDB;
    \q
    psql postgres -U newuser
    postgres=# create database reporting;
    ```

#### Birincil Kalıcı Veri Deposunu Yükleyin ve Yapılandırın 

**Cassandra** 

Cassandra'yı yükleyin ve ardından `rippled` için bir anahtar alanı oluşturun, replikasyon ile. 

:::note
Önerilen replikasyon faktörü 3'tür, fakat yerel olarak çalıştırırken replikasyona ihtiyaç yoktur ve `replication_factor`'ı 1 olarak ayarlayabilirsiniz.
:::
        
```
$ cqlsh [host] [port]
> CREATE KEYSPACE `rippled` WITH REPLICATION =
{'class' : 'SimpleStrategy', 'replication_factor' : 1    };
```

**NuDB** 

Eğer yerel ağınızda `rippled`'i raporlama modunda çalıştırıyorsanız, arka uç veritabanı olarak Cassandra yerine NuDB'yi kullanmayı seçebilirsiniz.

NuDB, `rippled` derleme kurulumunuzun bir parçası olarak yüklenir ve ek bir yükleme adımı gerektirmez.

---

### Adımlar

1. [Ubuntu veya macOS](https://github.com/XRPLF/rippled/blob/release/BUILD.md) için raporlama modunda `rippled`'i oluşturun.

    

    ```Linux
    wget https://github.com/Kitware/CMake/releases/download/v3.16.3/cmake-3.16.3-Linux-x86_64.sh
    sudo sh cmake-3.16.3-Linux-x86_64.sh --prefix=/usr/local --exclude-subdir 
    cmake -B build -Dreporting=ON -DCMAKE_BUILD_TYPE=Debug 
    cmake --build build --parallel $(nproc)
    ```

    ```macOS
    cmake -B build -G "Unix Makefiles" -Dreporting=ON -DCMAKE_BUILD_TYPE=Debug
    cmake --build build --parallel $(nproc)
    ```

    

2. `rippled`'i raporlama modunda çalıştırmak için bir yapılandırma dosyası oluşturun. 

    Örnek yapılandırma dosyası olan `rippled-example.cfg` dosyasını kopyalayın ve `rippled-reporting-mode.cfg` olarak, `rippled`'i kök kullanıcı olmadan çalıştırabileceğiniz bir konuma kaydedin. Örneğin:
    
    ```
    mkdir -p $HOME/.config/ripple
    cp <RIPPLED_SOURCE>/cfg/rippled-example.cfg $HOME/.config/ripple/rippled-reporting-mode.cfg
    ```

3. Gerekli dosya yollarını ayarlamak için `rippled-reporting-mode.cfg` dosyasını düzenleyin. `rippled`'i çalıştırmayı planladığınız kullanıcının burada belirttiğiniz tüm yollar üzerinde yazma izinlerinin olması gerekir.

    1. `[node_db]` yolunu, defter veritabanınızı saklamak istediğiniz konuma ayarlayın.

    2. `[database_path]` yolunu, diğer veritabanı verilerini saklamak istediğiniz konuma ayarlayın. (Bu, yapılandırma verilerini içeren bir SQLite veritabanını kapsar ve genellikle `[node_db]` yolu alanının bir seviyesindedir.)
        
    3. `[debug_logfile]` alanını, `rippled`'in kayıt bilgilerini yazabileceği bir yola ayarlayın.

    Bu ayarlar, `rippled`'in başarılı bir şekilde başlatılması için gerekli olan tek yapılandırmalardır. Diğer tüm yapılandırmalar isteğe bağlıdır ve çalışır durumda bir sunucunuz olduğunda ayarlanabilir.

4. Raporlama modunu etkinleştirmek için `rippled-reporting-mode.cfg` dosyasını düzenleyin: 

    1. `[reporting]` bölümünü yorum satırından çıkarın veya yeni bir tane ekleyin:

        ```
        [reporting]
        etl_source
        read_only=0
        ```

    2. Veri almak için `rippled` kaynaklarını (ETL kaynakları) listeleyin. Bu `rippled` sunucularının gRPC'yi etkinleştirmiş olmaları gerekmektedir.
    
        :::note
        Sadece güvenilir sunucuları dahil edin çünkü raporlama modu P2P ağına bağlanmaz ve dolayısıyla verilerin gerçekten ağ konsensüs defterine uyup uymadığını doğrulayamaz.
        :::
        
        ```
        [etl_source]
        source_grpc_port=50051
        source_ws_port=6006
        source_ip=127.0.0.1
        ```

5. Veritabanlarını yapılandırın

    1. `[ledger_tx_tables]` için Postgres DB'yi belirtin:

        ```
        [ledger_tx_tables]
        conninfo = postgres://newuser:password@127.0.0.1/reporting
        use_tx_tables=1
        ```

    2. `[node_db]` için veritabanını belirtin.

        

        ```NuDB
        [node_db]
        type=NuDB
        path=/home/ubuntu/ripple/

        [ledger_history]
        1000000
        ```

        ```Cassandra
        [node_db]
        type=Cassandra

        [ledger_history]
        1000000
        ```

        

6. `rippled` için yapılandırmayı değiştirerek portları açın.

    1. Kamu websocket portunu açın:

        ```
        [port_ws_admin_local]
        port = 6006
        ip = 127.0.0.1
        admin = 127.0.0.1
        protocol = ws
        ```

    2. gRPC portunu açın:

        ```
        [port_grpc]
        port = 60051
        ip = 0.0.0.0
        ```

    3. Raporlama sisteminizin IP'sine güvenli bir geçit ekleyin:

        ```
        secure_gateway = 127.0.0.1
        ```

7. `rippled`'i raporlama modunda çalıştırın:

    ```
    ./rippled --conf /home/ubuntu/.config/ripple/rippled-reporting-example.cfg
    ```

---
description: Bu içerik, Ripple'daki raporlama modunun nasıl çalıştığını ve gereksinimlerini açıklamaktadır. Kullanıcılar için ipuçları ve SSS bölümü de içermektedir.
keywords: [rippled, raporlama modu, PostgreSQL, Cassandra, ETL, sistem gereksinimleri, SQL sorguları]
---

---
title: Beklentiler
seoTitle: Beklentiler - Raporlama Modu
sidebar_position: 1
description: Bu bölümde raporlama modunun beklentileri ve gereksinimlerine dair bilgiler bulunmaktadır. Raporlama modunu etkinleştirmek için gerekli adımlar ve karşılaşılabilecek durumlar açıklanmıştır.
tags:
  - raporlama
  - ripple
  - veritabanı
keywords:
  - raporlama mod
  - rippled
  - PostgreSQL
  - Cassandra
---

### Beklentiler

Terminalinizde göreceğiniz bazı alıntılar burada belirtilmiştir.

```text
Loading: "/home/ubuntu/.config/ripple/rippled-reporting-example.cfg"
2021-Dec-09 21:31:52.245577 UTC JobQueue:NFO 10 iş parçacığı kullanılıyor
2021-Dec-09 21:31:52.255422 UTC LedgerConsensus:NFO Konsensüs motoru başlatıldı (çerez: 17859050541656985684)
2021-Dec-09 21:31:52.256542 UTC ReportingETL::ETLSource:NFO ETL kaynağına bağlanmak için IP kullanılıyor: 127.0.0.1:50051
2021-Dec-09 21:31:52.257784 UTC ReportingETL::ETLSource:NFO Uzaktan için stub oluşturuldu = { validated_ledger :  , ip : 127.0.0.1 , web socket port : 6006, grpc port : 50051 }
2021-Dec-09 21:31:52.258032 UTC ReportingETL::LoadBalancer:NFO ekle : etl kaynağı eklendi - { validated_ledger :  , ip : 127.0.0.1 , web socket port : 6006, grpc port : 50051 }
2021-Dec-09 21:31:52.258327 UTC Application:NFO işlem başlatılıyor: rippled-1.8.1+DEBUG
```

---

## Sıkça Sorulan Sorular


**Raporlama modunu kullanmak için birden fazla `rippled` örneği çalıştırmam gerekiyor mu?**

:::tip
Evet. Raporlama modunda çalışan bir `rippled` sunucusu, eşler arası ağa bağlanmaz, bunun yerine ağa bağlı bir veya daha fazla `rippled` sunucusundan doğrulanan verileri çıkarır, bu yüzden en az bir P2P mod sunucusu çalıştırmanız gerekmektedir.
:::

**Zaten `rippled` yükledim. Raporlama modunu etkinleştirmek için yapılandırma dosyasını güncelleyip `rippled`'i yeniden başlatabilir miyim?** 

:::warning
Hayır. Şu anda, raporlama modunda `rippled`'i yüklemek ve derlemek için kaynak kodunu indirmeniz gerekiyor. Raporlama modu için paketler sağlama girişimleri devam etmektedir.
:::

**Raporlama modunda `rippled` çalıştırmak için aynı zamanda P2P modda çalışan en az bir `rippled` sunucusuna da ihtiyaç var. Bu, disk alanımı iki katına çıkarmak anlamına mı geliyor?** 

Cevap, **ana veri deposu konumunuza** bağlıdır. Eğer Cassandra'yı ana veri deposu olarak kullanıyorsanız, raporlama modundaki sunucu yerel diskinde çok daha az veri depolar. PostgreSQL sunucusu da uzaktan olabilir. Bu şekilde birden fazla raporlama mod sunucusu aynı veriyi paylaşabilir.

Son olarak, P2P mod sunucusu **yalnızca çok yakın tarihleri saklamak zorundadır**, oysa raporlama mod sunucusu uzun vadeli tarihi saklar.

`rippled`'i çalıştırmak için sistem gereksinimleri hakkında daha fazla bilgi için, `rippled` sistem gereksinimleri konusuna bakabilirsiniz.

**PostgreSQL veya Cassandra veritabanından gelen verilerin geçerliliğini nasıl doğrulayabilirim?**

:::info
`rippled` raporlama modunda çalıştığında, yalnızca yapılandırma dosyasında belirtilen ETL kaynağından doğrulanan verileri sunar. Eğer ETL kaynağı olarak başkasının P2P modda çalışan `rippled` sunucusunu kullanıyorsanız, o sunucuya güveniyorsunuz demektir. Eğer güvenmiyorsanız, kendi P2P modunda çalışan `rippled` düğümünüzü çalıştırmalısınız.
:::

**API yerine ilişkisel veritabanına geleneksel SQL sorguları yapmam mümkün mü?**

:::note
Teknik olarak, isterseniz doğrudan veritabanına erişebilirsiniz. Ancak, veriler ikili bloblar olarak saklanır ve bu blobların içindeki verilere erişmek için blobları çözdürmeniz gerekir. Bu nedenle, geleneksel SQL sorguları daha az kullanışlı hale gelir çünkü verilerin bireysel alanlarını bulamaz ve süzemezsiniz.
:::

