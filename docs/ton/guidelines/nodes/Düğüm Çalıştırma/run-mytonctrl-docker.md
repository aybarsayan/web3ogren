# MyTonCtrl'ü Docker'da Çalıştırma

## Donanım gereksinimleri:

* 16 çekirdekli CPU
* 128 GB RAM
* 1TB NVME SSD veya Sağlanan 64+k IOPS depolama
* 1 Gbit/s ağ bağlantısı
* Genel IP adresi (sabit IP adresi)
* Zirve yükte 16 TB/ay trafik

**_Önerilmez!_** **_Sadece test amaçlı!_**

:::tip
Değişken **IGNORE_MINIMAL_REQS=true** CPU/RAM gereksinimlerinin doğrulamasını kapatır.
:::

## Yazılım gereksinimleri:

* docker-ce
* docker-ce-cli
* containerd.io
* docker-buildx-plugin
* docker-compose-plugin

  _Kurulum kılavuzu resmi [Docker](https://docs.docker.com/engine/install/)_

## Test edilen işletim sistemleri:

* Ubuntu 20.04
* Ubuntu 22.04
* Ubuntu 24.04
* Debian 11
* Debian 12

## MyTonCtrl v2 resmi docker imajını kullanarak çalıştırın:
1. İmajı çekin ve MyTonCtrl ile nodu çalıştırın:
   ```bash
   docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-community/ton-docker-ctrl:latest
   ```

## Kaynaklardan MyTonCtrl'u kurun ve başlatın:

1. Depoların en son versiyonunu klonlayın:
   ```bash
   git clone https://github.com/ton-community/ton-docker-ctrl.git
   ```
2. Dizinine gidin:
   ```bash
   cd ./ton-docker-ctrl
   ```
3. .env dosyasında gerekli değerleri belirtin:
   ```bash
   vi .env
   ```
4. Docker imajının derlenmesini başlatın. Bu adım fift, validator-engine, lite-client vb. en son sürümlerinin derlenmesini ve MyTonCtrl'un kurulumunu ve ilk ayarını içerir:
   ```bash
   docker compose build ton-node
   ```
5. MyTonCtrl'un başlatılması:
   ```bash
   docker compose up -d
   ```

## Docker dışı tam düğüm veya doğrulayıcıyı dockerize edilmiş MyTonCtrl v2'ye taşıyın

:::info
TON ikili dosyalarına ve kaynaklarına olduğu gibi TON çalışma dizinine, ama en önemlisi MyTonCtrl ayarlarına ve cüzdanlarına olan yolları belirtin.
:::

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-community/ton-docker-ctrl:latest
```

## Değişken ayarı:

.env dosyasında belirtilen değişkenler:
* **GLOBAL_CONFIG_URL** - TON Blockchain ağ ayarları (varsayılan: [Testnet](https://ton.org/testnet-global.config.json))
* **MYTONCTRL_VERSION** - MyTonCtrl'un derlendiği Git dalı
* **TELEMETRY** - Telemetriyi açma/kapatma
* **MODE** - MyTonCtrl'u belirtilen modda ayarlama (doğrulayıcı veya liteserver)
* **IGNORE_MINIMAL_REQS** - Donanım gereksinimlerini yok sayma

## MyTonCtrl'u durdurun ve silin:

1. Konteyneri durdurun:
   ```bash
   docker compose stop
   ```
2. Konteyneri silin:
   ```bash
   docker compose down
   ```
3. Verilerle birlikte konteyneri silin:
   ```bash
   docker compose down --volumes
   ```

## MyTonCtrl'a bağlantı:
```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```
Bağlandığınızda `status` komutunu kullanarak durumu kontrol edebilirsiniz:
```bash
MyTonCtrl> status
```
> ![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)  
> **Erişilebilir komutların listesini yansıtır** `help`:
```bash
MyTonCtrl> help
```

## MyTonCtrl loglarını gözden geçirme:
```bash
docker compose logs
```

## MyTonCtrl ve TON güncellemeleri:

:::warning
TON doğrulayıcısı ve MyTonCtrl'ün en son sürümlerini almak için docker-compose.yml ile katalog'una gidin ve derleme yapın.
:::

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

Tamamlandığında, Docker Compose'u tekrar başlatın:
```bash
docker compose up -d
```

MyTonCtrl'a bağlandığınızda, güncellemeler için otomatik bir doğrulama yapılır. Herhangi bir güncelleme tespit edilirse, "_MyTonCtrl güncellemesi mevcut. Lütfen `update` komutuyla güncelleyin._" mesajı görünür.

Güncelleme, gerekli dalı belirterek güncelleme komutuyla yapılır:
```bash
MyTonCtrl> update mytonctrl2
```

## Veri depolama yolunun değiştirilmesi:

Varsayılan olarak TON ve Mytoncore çalışmaları **/var/lib/docker/volumes/** dizininde saklanır.

Bunu docker-compose.yml dosyasında, **volumes** bölümünde gereken yolu belirterek değiştirebilirsiniz.