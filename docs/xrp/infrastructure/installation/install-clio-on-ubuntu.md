---
title: Ubuntu Linux Üzerinde Clio Yükleme
seoTitle: Clio Installation on Ubuntu Linux
sidebar_position: 1
description: Bu sayfa, Ubuntu Linux üzerinde Clio yüklemek için gerekli adımları ve gereksinimleri açıklamaktadır. Ripple tarafından sağlanan talimatlarla en son sürümü yüklemeyi öğrenin.
tags: 
  - Clio
  - Ubuntu
  - yükleme
  - sistem gereksinimleri
  - cassandra
  - rippled
keywords: 
  - Clio
  - Ubuntu
  - yükleme
  - sistem gereksinimleri
  - cassandra
  - rippled
---

# Ubuntu Linux Üzerinde Clio Yükleme

Bu sayfa, **Ubuntu Linux 20.04 veya üstü** üzerinde en son kararlı Clio sürümünü yüklemek için önerilen talimatları açıklamaktadır ve [`apt`](https://ubuntu.com/server/docs) yardımcı uygulamasını kullanmaktadır.

Bu talimatlar, Ripple tarafından derlenmiş ve yayımlanmış bir Ubuntu paketini yükler. Ayrıca:

- Gece ve önizleme sürümleri dahil olmak üzere ikili dosyaları, [Clio sürüm sayfasından GitHub](https://github.com/XRPLF/clio/releases/) üzerinden indirebilirsiniz. (**Assets** bölümünü genişletin ve işletim sisteminiz için uygun sürümü seçin.)
- [Clio'yu kaynak kodundan derleyin](https://github.com/XRPLF/clio/blob/develop/docs/build-clio.md).
- [Clio Docker İmajını](https://hub.docker.com/r/rippleci/clio) kullanın.

## Ön Koşullar

Clio'yu yüklemeden önce aşağıdaki gereksinimleri karşılamanız gerekir.

- Sisteminizin `sistem gereksinimlerini` karşıladığından emin olun.

    :::info
    Clio, `rippled` sunucusuyla aynı sistem gereksinimlerine sahiptir, ancak Clio, aynı miktarda defter geçmişini saklamak için daha az disk alanına ihtiyaç duyar.
    :::

- Yerel veya uzaktan çalışan bir Cassandra kümesine erişiminiz olmalıdır. Cassandra kümesini [Cassandra yükleme talimatlarını](https://cassandra.apache.org/doc/latest/cassandra/getting_started/installing.html) takip ederek manuel olarak yükleyip yapılandırmayı seçebilir veya aşağıdaki komutlardan birini kullanarak Cassandra'yı bir Docker konteynerinde çalıştırabilirsiniz.

    - Clio verilerini kalıcı hale getirmeyi seçerseniz, Cassandra'yı bir Docker konteynerinde çalıştırın ve Clio verilerini depolamak için boş bir dizin belirtin:

        ```
        docker run --rm -it --network=host --name cassandra -v $PWD/cassandra_data:/var/lib/cassandra cassandra:4.0.4
        ```

    - Clio verilerini kalıcı hale getirmek istemiyorsanız, aşağıdaki komutu çalıştırın:

        ```
        docker run --rm -it --network=host --name cassandra cassandra:4.0.4
        ```

- Bir veya daha fazla `rippled` sunucusuna P2P modunda gRPC erişimine ihtiyacınız var. `rippled` sunucuları yerel veya uzaktan olabilir, ancak onlara güvenmeniz gerekmektedir. Bunun en güvenilir yolu, `rippled` yüklemesini kendiniz yapmaktır.

## Kurulum Adımları

1. Depoları güncelleyin:

    ```
    sudo apt -y update
    ```

    :::tip
    Eğer aynı makinede güncel bir `rippled` sürümünü zaten yüklediyseniz, Ripple'ın paket deposunu ve imza anahtarını ekleme adımlarını atlayabilirsiniz; bu adımlar `rippled` yükleme süreci ile aynıdır. 6. adımdan, "Ripple deposunu alın." kısmına devam edin.
    :::

2. Araçları yükleyin:

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Ripple'ın paket imzalama GPG anahtarını güvenilir anahtarlar listenize ekleyin:

    ```
    sudo mkdir /usr/local/share/keyrings/
    wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
    sudo mv ripple-key.gpg /usr/local/share/keyrings
    ```

4. Yeni eklenen anahtarın parmak izini kontrol edin:

    ```
    gpg /usr/local/share/keyrings/ripple-key.gpg
    ```

    Çıktı, Ripple için aşağıdakine benzer bir girişi içermelidir:

    ```
    gpg: WARNING: no command supplied.  Trying to guess what you mean ...
    pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
        C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
    uid           TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]
    ```

    Özellikle, parmak izinin eşleştiğinden emin olun. (Yukarıdaki örnekte, parmak izi üçüncü satırda, `C001` ile başlamaktadır.)

5. İşletim sisteminiz sürümü için uygun Ripple deposunu ekleyin:

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    Yukarıdaki örnek **Ubuntu 20.04 Focal Fossa** için uygundur.

    Geliştirme veya ön sürüm versiyonlarına erişmek istiyorsanız, `stable` yerine aşağıdakilerden birini kullanın:

    - `unstable` - Beta veya sürüm adayları gibi ön sürüm derlemeleri
    - `nightly` - [`develop` dalına](https://github.com/XRPLF/Clio/tree/develop) dayanan gece geliştirme derlemeleri

6. Ripple deposunu alın.

    ```
    sudo apt -y update
    ```

7. Clio yazılım paketini yükleyin.

    ```
    sudo apt -y install clio
    ```

8. Clio'nun `rippled` sunucularınıza bağlanabilmesi için yapılandırma dosyalarınızı düzenleyin.

    1. Clio sunucusunun yapılandırma dosyasını düzenleyin ve `rippled` sunucusuna bağlantı bilgilerini değiştirin. Paket, bu dosyayı `/opt/clio/etc/config.json` dizinine yükler.

        ```
        "etl_sources":
        [
            {
                "ip":"127.0.0.1",
                "ws_port":"6005",
                "grpc_port":"50051"
            }
        ]
        ```

        `etl_sources` JSON dizisindeki her giriş, aşağıdaki alanları içermelidir:

        | Alan        | Tür    | Açıklama |
        |-------------|--------|-------------|
        | `ip`        | String | `rippled` sunucusunun IP adresi. |
        | `ws_port`   | String | `rippled`'in şifrelenmemiş (admin olmayan) WebSocket bağlantılarını kabul ettiği port. Clio sunucusu bu porta bazı API isteklerini yönlendirir. |
        | `grpc_port` | String | `rippled`'in gRPC isteklerini kabul ettiği port. |

        :::info
        Birden fazla `rippled` sunucusunu veri kaynağı olarak kullanabilirsiniz; daha fazla girişi `etl_sources` bölümüne ekleyerek bunu yapabilirsiniz. Eğer yaparsanız, Clio istekleri liste üzerindeki tüm sunuculara yük dengelemesi yapar ve en az bir `rippled` sunucusu senkronize kaldığı sürece ağa ayak uydurabilir.
        :::

        [Örnek yapılandırma dosyası](https://github.com/XRPLF/clio/blob/develop/docs/examples/config/example-config.json), yerel döngü geri ağı üzerinde çalışan `rippled` sunucusuna (127.0.0.1) erişir, WebSocket (WS) portu 6005 ve gRPC portu 50051'dir.

    2. `rippled` sunucusunun yapılandırma dosyasını güncelleyin ve Clio sunucusunun ona bağlanmasına izin verin. Paket, bu dosyayı `/etc/opt/ripple/rippled.cfg` dizinine yükler.

        * Şifrelenmemiş, admin olmayan WebSocket bağlantılarını kabul etmek için bir port açın.

            ```
            [port_ws_public]
            port = 6005
            ip = 0.0.0.0
            protocol = ws
            ```

            :::warning
            Ağ güvenlik duvarınızın bu port üzerindeki dış istekleri `rippled` sunucunuza iletmemek üzere yapılandırıldığından emin olun, aksi takdirde API isteklerini genel halk için sunmayı düşünüyorsanız bu portu açmamaya dikkat edin.
            :::

        * GPRC isteklerini işlemek için bir port açın ve `secure_gateway` girişinde Clio sunucusunun IP(s)ini belirtin.

            ```
            [port_grpc]
            port = 50051
            ip = 0.0.0.0
            secure_gateway = 127.0.0.1
            ```

            :::warning
            Eğer Clio'yu `rippled` ile aynı makinede çalıştırmıyorsanız, örnek kısmındaki `secure_gateway`'i Clio sunucusunun IP adresini kullanacak şekilde değiştirin.
            :::

9. Clio systemd hizmetini etkinleştirin ve başlatın.

    ```
    sudo systemctl enable clio
    ```

10. `rippled` ve Clio sunucularını başlatın.

    ```
    sudo systemctl start rippled
    sudo systemctl start clio
    ```

    Eğer yeni bir veritabanıyla başlıyorsanız, Clio tam defteri indirmek zorundadır. Bu biraz zaman alabilir. Eğer her iki sunucuyu da ilk defa başlatıyorsanız, Clio'nun defterleri çıkarmadan önce `rippled`'in senkronize olmasını bekleyeceğini dikkate alın; bu süreç daha da uzun sürebilir.

---

## Ayrıca Görülmeli

- **Kavramlar:**
    - `Clio Sunucusu`