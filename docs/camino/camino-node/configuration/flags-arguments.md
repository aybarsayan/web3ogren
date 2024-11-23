---
sidebar_position: 5
title: Bayraklar & Argümanlar
description: Camino Node CLI & Konfigürasyon Dosyası Bayrakları
---

# Camino Node Bayrakları & Argümanlar

### --add-primary-network-delegator-fee [uint]

Yeni birincil ağ delegeleri eklemek için yapılan işlemler için nAVAX cinsinden işleme ücreti.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--add-primary-network-delegator-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"add-primary-network-delegator-fee": ""
```

### --add-primary-network-validator-fee [uint]

Yeni birincil ağ doğrulayıcıları eklemek için yapılan işlemler için nAVAX cinsinden işleme ücreti.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--add-primary-network-validator-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"add-primary-network-validator-fee": ""
```

### --add-subnet-delegator-fee [uint]

Yeni alt ağ delegeleri eklemek için yapılan işlemler için nAVAX cinsinden işleme ücreti (varsayılan 1000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--add-subnet-delegator-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"add-subnet-delegator-fee": ""
```

### --add-subnet-validator-fee [uint]

Yeni alt ağ doğrulayıcıları eklemek için yapılan işlemler için nAVAX cinsinden işleme ücreti (varsayılan 1000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--add-subnet-validator-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"add-subnet-validator-fee": ""
```

### --api-admin-enabled-secret [string]

Eğer boş değilse, bu düğüm Admin API’yi açar. Her çağrı için sır geçmelidir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--api-admin-enabled-secret [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-admin-enabled-secret": ""
```

### --api-auth-password [string]

API yetkilendirme tokenleri için şifreyi belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--api-auth-password [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-auth-password": ""
```

### --api-auth-password-file [string]

API yetkilendirme tokenlerini başta oluşturmak/ doğrulamak için kullanılan şifre dosyası. api-auth-password belirtilirse göz ardı edilir. Şifrenin başındaki ve sonundaki boşluk kaldırılır. API çağrısı ile değiştirilebilir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--api-auth-password-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-auth-password-file": ""
```

### --api-auth-required

HTTP API'lerini çağırmak için yetkilendirme tokeni gerektirir.

**Komut Satırı Bayrağı:**

```
--api-auth-required
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-auth-required": "true" or "false"
```

### --api-health-enabled

Eğer true ise, bu düğüm Health API'yi açar (varsayılan true).

**Komut Satırı Bayrağı:**

```
--api-health-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-health-enabled": "true" or "false"
```

### --api-info-enabled

Eğer true ise, bu düğüm Info API'yi açar (varsayılan true).

**Komut Satırı Bayrağı:**

```
--api-info-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-info-enabled": "true" or "false"
```

### --api-ipcs-enabled

Eğer true ise, IPC'ler açılabilir.

**Komut Satırı Bayrağı:**

```
--api-ipcs-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-ipcs-enabled": "true" or "false"
```

### --api-keystore-enabled

Eğer true ise, bu düğüm Keystore API'yi açar.

**Komut Satırı Bayrağı:**

```
--api-keystore-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-keystore-enabled": "true" or "false"
```

### --api-metrics-enabled

Eğer true ise, bu düğüm Metrics API'yi açar (varsayılan true).

**Komut Satırı Bayrağı:**

```
--api-metrics-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"api-metrics-enabled": "true" or "false"
```

### --benchlist-duration [duration]

Bir peeri benchlistelemek için maksimum süre, eşiği aştıktan sonra (varsayılan 15m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--benchlist-duration [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"benchlist-duration": ""
```

### --benchlist-fail-threshold [int]

Bir düğümü benchlistelemek için ardışık başarısız sorgu sayısı (varsayılan 10).

**Argüman:** `int`

**Komut Satırı Bayrağı:**

```
--benchlist-fail-threshold [int]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"benchlist-fail-threshold": ""
```

### --benchlist-min-failing-duration [duration]

Bir peere gönderilen mesajların başarısız olması için ihtiyaç duyulan minimum süre (varsayılan 2m30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--benchlist-min-failing-duration [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"benchlist-min-failing-duration": ""
```

### --bootstrap-ancestors-max-containers-received [uint]

Bu düğüm, gelen Ancestors mesajından en fazla bu kadar konteyner okur (varsayılan 2000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--bootstrap-ancestors-max-containers-received [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-ancestors-max-containers-received": ""
```

### --bootstrap-ancestors-max-containers-sent [uint]

Bu düğüm tarafından gönderilen Ancestors mesajındaki maksimum konteyner sayısı (varsayılan 2000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--bootstrap-ancestors-max-containers-sent [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-ancestors-max-containers-sent": ""
```

### --bootstrap-beacon-connection-timeout [duration]

Başlangıç beacons'a bağlanırken uyarı log'u yaymadan önceki zaman aşımı (varsayılan 1m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--bootstrap-beacon-connection-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-beacon-connection-timeout": ""
```

### --bootstrap-ids [string]

Bağlanılması gereken bootstrap peer kimliklerinin virgülle ayrılmış listesi. Örnek: NodeID-JR4dVmy6ffUGAKCBDkyCbeZbyHQBeDsET,NodeID-8CrVPQZ4VSqgL8zTdvL14G8HqAfrBr4z

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--bootstrap-ids [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-ids": ""
```

### --bootstrap-ips [string]

Bağlanılması gereken bootstrap peer IP'lerinin virgülle ayrılmış listesi. Örnek: 127.0.0.1:9630,127.0.0.1:9631

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--bootstrap-ips [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-ips": ""
```

### --bootstrap-max-time-get-ancestors [duration]

GetAncestors isteğini yanıtlayıp bir konteyner ve onun atalarını almak için harcanacak maksimum süre (varsayılan 50ms).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--bootstrap-max-time-get-ancestors [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-max-time-get-ancestors": ""
```

### --bootstrap-retry-enabled

Bootstrap'un tekrar denemesi gerektiğini belirtir (varsayılan true).

**Komut Satırı Bayrağı:**

```
--bootstrap-retry-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-retry-enabled": "true" or "false"
```

### --bootstrap-retry-warn-frequency [int]

Operator'u uyarmadan önce bootstrap'un kaç kez denenmesi gerektiğini belirtir (varsayılan 50).

**Argüman:** `int`

**Komut Satırı Bayrağı:**

```
--bootstrap-retry-warn-frequency [int]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"bootstrap-retry-warn-frequency": ""
```

### --chain-aliases-file [string]

Özel takma adlarla blockchainID'lerini eşleyen bir JSON dosyasını belirtir. chain-config-content belirtilirse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/configs/chains/aliases.json").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--chain-aliases-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"chain-aliases-file": ""
```

### --chain-aliases-file-content [string]

BlockchainID'den özel takma adlara kodlanmış base64 mapsini belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--chain-aliases-file-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"chain-aliases-file-content": ""
```

### --chain-config-content [string]

Kodlanmış base64 zincir yapılandırmalarını belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--chain-config-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"chain-config-content": ""
```

### --chain-config-dir [string]

Zincir spesifik yapılandırmaların ana dizini. chain-config-content belirtilirse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/configs/chains").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--chain-config-dir [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"chain-config-dir": ""
```

### --chain-data-dir [string]

Zincir spesifik veri dizini (varsayılan "$AVALANCHEGO_DATA_DIR/chainData").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--chain-data-dir [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"chain-data-dir": ""
```

### --config-file [string]

Bir konfigürasyon dosyasını belirtir. config-file-content belirtilirse göz ardı edilir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--config-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"config-file": ""
```

### --config-file-content [string]

Kodlanmış base64 konfigürasyon içeriğini belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--config-file-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"config-file-content": ""
```

### --config-file-content-type [string]

Kodlanmış base64 konfigürasyon içeriğinin formatını belirtir. Mevcut değerler: 'json', 'yaml', 'toml' (varsayılan "json").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--config-file-content-type [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"config-file-content-type": ""
```

### --consensus-accepted-frontier-gossip-non-validator-size [uint]

Kabul edilmiş sınırda gossip yapılacak non-validator sayısı.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-accepted-frontier-gossip-non-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-accepted-frontier-gossip-non-validator-size": ""
```

### --consensus-accepted-frontier-gossip-peer-size [uint]

Kabul edilmiş sınırda gossip yapılacak peer sayısı (varsayılan 15).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-accepted-frontier-gossip-peer-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-accepted-frontier-gossip-peer-size": ""
```

### --consensus-accepted-frontier-gossip-validator-size [uint]

Kabul edilmiş sınırda gossip yapılacak validator sayısı.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-accepted-frontier-gossip-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-accepted-frontier-gossip-validator-size": ""
```

### --consensus-app-gossip-non-validator-size [uint]

Bir AppGossip mesajını gossip yapılacak non-validator sayısı.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-app-gossip-non-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-app-gossip-non-validator-size": ""
```

### --consensus-app-gossip-peer-size [uint]

Bir AppGossip mesajını gossip yapılacak peer sayısı (validator veya non-validator olabilir).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-app-gossip-peer-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-app-gossip-peer-size": ""
```

### --consensus-app-gossip-validator-size [uint]

Bir AppGossip mesajını gossip yapılacak validator sayısı (varsayılan 10).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-app-gossip-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-app-gossip-validator-size": ""
```

### --consensus-gossip-frequency [duration]

Kabul edilmiş sınırları gossip yapma sıklığı (varsayılan 10s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--consensus-gossip-frequency [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-gossip-frequency": ""
```

### --consensus-on-accept-gossip-non-validator-size [uint]

Her kabul edilen konteyner için gossip yapılacak non-validator sayısı.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-on-accept-gossip-non-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-on-accept-gossip-non-validator-size": ""
```

### --consensus-on-accept-gossip-peer-size [uint]

Her kabul edilen konteyner için gossip yapılacak peer sayısı (varsayılan 10).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-on-accept-gossip-peer-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-on-accept-gossip-peer-size": ""
```

### --consensus-on-accept-gossip-validator-size [uint]

Her kabul edilen konteyner için gossip yapılacak validator sayısı.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--consensus-on-accept-gossip-validator-size [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-on-accept-gossip-validator-size": ""
```

### --consensus-shutdown-timeout [duration]

Yanıt vermeyen bir zinciri sonlandırmadan önceki zaman aşımı (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--consensus-shutdown-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"consensus-shutdown-timeout": ""
```

### --create-asset-tx-fee [uint]

Yeni varlıklar oluşturma işlemi için nAVAX cinsinden işleme ücreti (varsayılan 1000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--create-asset-tx-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"create-asset-tx-fee": ""
```

### --create-blockchain-tx-fee [uint]

Yeni blok zincirleri oluşturma işlemi için nAVAX cinsinden işleme ücreti (varsayılan 100000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--create-blockchain-tx-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"create-blockchain-tx-fee": ""
```

### --create-subnet-tx-fee [uint]

Yeni alt ağlar oluşturma işlemi için nAVAX cinsinden işleme ücreti (varsayılan 100000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--create-subnet-tx-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"create-subnet-tx-fee": ""
```

### --dao-proposal-bond-amount [uint]

Bir DAO önerisi vermek için gereken miktar (varsayılan 100000000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--dao-proposal-bond-amount [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"dao-proposal-bond-amount": ""
```

### --data-dir [string]

Varsayılan alt dizinlerin yerleştirileceği temel veri dizinini ayarlar (varsayılan "$HOME/.caminogo").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--data-dir [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"data-dir": ""
```

### --db-config-file [string]

Veritabanı konfigürasyon dosyasının yolu. db-config-file-content belirtilirse göz ardı edilir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--db-config-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"db-config-file": ""
```

### --db-config-file-content [string]

Kodlanmış base64 veritabanı konfigürasyon içeriğini belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--db-config-file-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"db-config-file-content": ""
```

### --db-dir [string]

Veritabanı dizininin yolu (varsayılan "$AVALANCHEGO_DATA_DIR/db").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--db-dir [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"db-dir": ""
```

### --db-type [string]

Kullanılacak veritabanı türü. `{leveldb, memdb}`'den biri olmalıdır (varsayılan "leveldb").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--db-type [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"db-type": ""
```

### --fd-limit [uint]

Süreç dosya tanımlayıcı limitini en az bu değere yükseltmeye çalışır ve değer sistemin maksimumunun üzerinde ise hata verir (varsayılan 32768).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--fd-limit [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"fd-limit": ""
```

### --genesis [string]

Bir genesis konfigürasyon dosyasını belirtir (standart ağlar çalıştırıldığında veya genesis-content belirtilirse göz ardı edilir).

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--genesis [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"genesis": ""
```

### --genesis-content [string]

Kodlanmış base64 genesis içeriğini belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--genesis-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"genesis-content": ""
```

### --health-check-averager-halflife [duration]

Bir sağlık kontrolü sırasında koşullu ortalamayı hesaplamak için ortalama yarı ömrü (varsayılan 10s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--health-check-averager-halflife [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"health-check-averager-halflife": ""
```

### --health-check-frequency [duration]

Sağlık kontrolleri arasındaki süre (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--health-check-frequency [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"health-check-frequency": ""
```

### --http-allowed-origins [string]

HTTP portunda izin verilecek kökenler. Tüm kökenlere izin verilir, varsayılan olarak \* belirlenmiştir. Örnek: https://_.avax.network (varsayılan "\*").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-allowed-origins [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-allowed-origins": ""
```

### --http-host [string]

HTTP sunucusunun adresi (varsayılan "127.0.0.1").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-host [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-host": ""
```

### --http-idle-timeout [duration]

Keep-alives aktif olduğunda bir sonraki isteği beklemek için maksimum süre. Eğer http-idle-timeout sıfırsa, http-read-timeout'un değeri kullanılır. Eğer ikisi de sıfırsa, zaman aşımı yoktur (varsayılan 2m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-idle-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-idle-timeout": ""
```

### --http-port [uint]

HTTP sunucusunun portu (varsayılan 9650).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--http-port [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-port": ""
```

### --http-read-header-timeout [duration]

İstek başlıklarını okumak için maksimum süre. Bağlantının okuma son tarihi başlıklar okunduktan sonra sıfırlanır. http-read-header-timeout sıfırsa, http-read-timeout'un değeri kullanılır. Eğer ikisi de sıfırsa, zaman aşımı yoktur (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-read-header-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-read-header-timeout": ""
```

### --http-read-timeout [duration]

Tüm isteği, gövde dahil, okuma için maksimum süre. Sıfır veya negatif bir değer zaman aşımı olmadığı anlamına gelir (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-read-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-read-timeout": ""
```

### --http-shutdown-timeout [duration]

Düğüm kapandığında mevcut bağlantıların tamamlanmasını beklemek için maksimum süre (varsayılan 10s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-shutdown-timeout [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-shutdown-timeout": ""
```

### --http-shutdown-wait [duration]

Zaman aşımı başladıktan sonra kapalı hale geçmeden önce beklenilecek süre. Bu süre zarfında /health uç noktası sağlıklı değil dönecek (varsayılan 0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-shutdown-wait [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-shutdown-wait": ""
```

### --http-tls-cert-file [string]

HTTPs sunucusu için TLS sertifika dosyası. http-tls-cert-file-content belirtilirse göz ardı edilir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-tls-cert-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-tls-cert-file": ""
```

### --http-tls-cert-file-content [string]

HTTPs sunucusu için kodlanmış base64 TLS sertifikasını belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-tls-cert-file-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-tls-cert-file-content": ""
```

### --http-tls-enabled

HTTP sunucusunu HTTPs'ye yükseltir.

**Komut Satırı Bayrağı:**

```
--http-tls-enabled
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-tls-enabled": "true" or "false"
```

### --http-tls-key-file [string]

HTTPs sunucusu için TLS özel anahtar dosyası. http-tls-key-file-content belirtilirse göz ardı edilir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-tls-key-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"http-tls-key-file": ""

### --http-tls-key-file-content [string]

HTTPs sunucusu için base64 kodlu TLS özel anahtarını tanımlar.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--http-tls-key-file-content [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"http-tls-key-file-content": ""
```

### --http-write-timeout [duration]

Cevap yazımlarının zaman aşımına uğramadan önceki maksimum süresi. Yeni bir isteğin başlığı okunduğunda sıfırlanır. Sıfır veya negatif bir değer, zaman aşımının olmayacağı anlamına gelir. (varsayılan 30s)

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--http-write-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"http-write-timeout": ""
```

### --inbound-connection-throttling-cooldown [duration]

Belirli bir IP'den gelen bir bağlantının bu süre içinde en fazla bir kez yükseltilmesine izin verir. Eğer 0 ise, gelen bağlantı yükseltmelerinde hız sınırlaması uygulanmaz. (varsayılan 10s)

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--inbound-connection-throttling-cooldown [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"inbound-connection-throttling-cooldown": ""
```

### --inbound-connection-throttling-max-conns-per-sec [float]

Her saniyede kabul edilecek maksimum gelen bağlantı sayısı (tüm eşler için) (varsayılan 256).

**Argüman:** `float`

**Komut Satırı Bayrağı:**

```
--inbound-connection-throttling-max-conns-per-sec [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"inbound-connection-throttling-max-conns-per-sec": ""
```

### --index-allow-incomplete

Eğer doğru ise, düğümün işlemleri kaçırabilecek şekilde çalışmasına izin verir. İndeks devre dışı bırakıldıysa dikkate alınmaz.

**Komut Satırı Bayrağı:**

```
--index-allow-incomplete
```

**Yapılandırma Dosyası Bayrağı:**

```json
"index-allow-incomplete": "true" or "false"
```

### --index-enabled

Eğer doğru ise, tüm kabul edilen konteynerleri ve işlemleri indeksleyip bunları bir API üzerinden erişilebilir hale getirir.

**Komut Satırı Bayrağı:**

```
--index-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"index-enabled": "true" or "false"
```

### --ipcs-chain-ids [string]

IPC motoruna eklemek için virgülle ayrılmış zincir kimlikleri listesi. Örnek: 11111111111111111111111111111111LpoYY,4R5p2RXDGLqaifZE4hHWH9owe34pfoBULn1DrQTWivjg8o4aH

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--ipcs-chain-ids [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"ipcs-chain-ids": ""
```

### --ipcs-path [string]

IPC soketleri için dizin (Unix) veya adlandırılmış kanal adı öneki (Windows).

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--ipcs-path [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"ipcs-path": ""
```

### --log-dir [string]

Avalanche için günlüklerin kaydedileceği dizin (varsayılan "$AVALANCHEGO_DATA_DIR/logs").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--log-dir [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-dir": ""
```

### --log-disable-display-plugin-logs

Eklenti günlüklerinin stdout'da görüntülenmesini devre dışı bırakır.

**Komut Satırı Bayrağı:**

```
--log-disable-display-plugin-logs
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-disable-display-plugin-logs": "true" or "false"
```

### --log-display-level [string]

Günlük görüntüleme seviyesi. Boş bırakılırsa, log-level değerini alır. Aksi takdirde, şu değerlerden biri olmalıdır: `{verbo, debug, trace, info, warn, error, fatal, off}`

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--log-display-level [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-display-level": ""
```

### --log-format [string]

Günlük formatının yapısı. Varsayılan 'auto' olup, terminal benzeri günlükleri formatlar, eğer çıktı bir terminalse. Aksi takdirde, şu değerlerden biri olmalıdır: `{auto, plain, colors, json}` (varsayılan "auto").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--log-format [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-format": ""
```

### --log-level [string]

Günlük seviyesi. Şu değerlerden biri olmalıdır: `{verbo, debug, trace, info, warn, error, fatal, off}` (varsayılan "info").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--log-level [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-level": ""
```

### --log-rotater-compress-enabled

Dönüştürülen günlük dosyalarının gzip ile sıkıştırılmasını etkinleştirir.

**Komut Satırı Bayrağı:**

```
--log-rotater-compress-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-rotater-compress-enabled": "true" or "false"
```

### --log-rotater-max-age [uint]

Eski günlük dosyalarının dosya adında kodlu zaman damgasına göre saklanacak maksimum gün sayısı. 0, tüm eski günlük dosyalarını saklamak anlamına gelir.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--log-rotater-max-age [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-rotater-max-age": ""
```

### --log-rotater-max-files [uint]

Saklanacak maksimum eski günlük dosyası sayısı. 0, tüm eski günlük dosyalarını saklamak anlamına gelir. (varsayılan 7).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--log-rotater-max-files [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-rotater-max-files": ""
```

### --log-rotater-max-size [uint]

Günlük dosyasının döndürülmeden önceki maksimum dosya boyutu (megabayt cinsinden). (varsayılan 8).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--log-rotater-max-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"log-rotater-max-size": ""
```

### --max-stake-duration [duration]

Maksimum staking süresi (varsayılan 8760h0m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--max-stake-duration [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"max-stake-duration": ""
```

### --max-validator-stake [uint]

Ana ağ üzerinde bir doğrulayıcıya yerleştirilebilecek maksimum stake, nAVAX cinsinden (varsayılan 3000000000000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--max-validator-stake [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"max-validator-stake": ""
```

### --meter-vms-enabled

VM performansını daha ayrıntılı takip etmek için Meter VM'lerini etkinleştirir (varsayılan doğru).

**Komut Satırı Bayrağı:**

```
--meter-vms-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"meter-vms-enabled": "true" or "false"
```

### --min-delegation-fee [uint]

Ana ağ üzerinde delegasyon için uygulanabilecek minimum delegasyon ücreti, aralık [0, 1000000] (varsayılan 20000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--min-delegation-fee [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"min-delegation-fee": ""
```

### --min-delegator-stake [uint]

Ana ağ üzerinde delege edilebilecek minimum stake, nAVAX cinsinden (varsayılan 25000000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--min-delegator-stake [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"min-delegator-stake": ""
```

### --min-stake-duration [duration]

Minimum staking süresi (varsayılan 24h0m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--min-stake-duration [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"min-stake-duration": ""
```

### --min-validator-stake [uint]

Ana ağ üzerinde doğrulamak için gereken minimum stake, nAVAX cinsinden (varsayılan 2000000000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--min-validator-stake [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"min-validator-stake": ""
```

### --network-allow-private-ips

Düğümün özel IP'leri olan eşlere dışa bağlantı girişiminde bulunmasına izin verir (varsayılan doğru).

**Komut Satırı Bayrağı:**

```
--network-allow-private-ips
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-allow-private-ips": "true" or "false"
```

### --network-compression-enabled

Eğer doğru ise, belirli dışa mesajları sıkıştırır. Bu düğüm, bu bayrağın değeri ne olursa olsun, sıkıştırılmış gelen mesajları çözümleyebilecektir (varsayılan doğru).

**Komut Satırı Bayrağı:**

```
--network-compression-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-compression-enabled": "true" or "false"
```

### --network-health-max-outstanding-request-duration [duration]

Düğüm, bu süre içinde dışarıda bir isteğin olması durumunda sağlıksız olarak rapor edilir (varsayılan 5m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-health-max-outstanding-request-duration [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-max-outstanding-request-duration": ""
```

### --network-health-max-portion-send-queue-full [float]

Ağ katmanı, bekleyen gönderim kuyruğunun bu kısmının dolu olması durumunda sağlıksız olarak döner (varsayılan 0.9).

**Argüman:** `float`

**Komut Satırı Bayrağı:**

```
--network-health-max-portion-send-queue-full [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-max-portion-send-queue-full": ""
```

### --network-health-max-send-fail-rate [float]

Ağ katmanı, denenen mesaj gönderimlerinin bu kısmının hata alması durumunda sağlıksız olarak rapor edilir (varsayılan 0.9).

**Argüman:** `float`

**Komut Satırı Bayrağı:**

```
--network-health-max-send-fail-rate [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-max-send-fail-rate": ""
```

### --network-health-max-time-since-msg-received [duration]

Ağ katmanı, en az bu kadar süre içinde bir mesaj alınmadığında sağlıksız olarak döner (varsayılan 1m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-health-max-time-since-msg-received [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-max-time-since-msg-received": ""
```

### --network-health-max-time-since-msg-sent [duration]

Ağ katmanı, en az bu kadar süre içinde bir mesaj gönderilmediğinde sağlıksız olarak döner (varsayılan 1m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-health-max-time-since-msg-sent [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-max-time-since-msg-sent": ""
```

### --network-health-min-conn-peers [uint]

Ağ katmanı, bu kadar az eşe bağlı olduğunda sağlıksız olarak döner (varsayılan 1).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-health-min-conn-peers [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-health-min-conn-peers": ""
```

### --network-id [string]

Bu düğümün bağlanacağı ağ kimliği (varsayılan "camino").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--network-id [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-id": ""
```

### --network-initial-reconnect-delay [duration]

Bir eşe yeniden bağlanma girişiminde bulunmadan önce beklenmesi gereken ilk gecikme süresi (varsayılan 1s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-initial-reconnect-delay [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-initial-reconnect-delay": ""
```

### --network-initial-timeout [duration]

Uyumlu zaman aşımı yöneticisinin ilk zaman aşımı değeri (varsayılan 5s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-initial-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-initial-timeout": ""
```

### --network-max-clock-difference [duration]

Bu düğüm ve eşler arasındaki maksimum izin verilen saat farkı (varsayılan 1m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-max-clock-difference [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-max-clock-difference": ""
```

### --network-max-reconnect-delay [duration]

Bir eşe yeniden bağlanma girişiminde bulunmadan önce beklenmesi gereken maksimum gecikme süresi (varsayılan 1m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-max-reconnect-delay [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-max-reconnect-delay": ""
```

### --network-maximum-inbound-timeout [duration]

Gelen bir mesajın maksimum zaman aşımı değeri. Gelen bir mesajın bu süre içinde yerine getirilmiş olması gerekir. Bu değerden daha yüksek bir son tarih içeren gelen mesajlar, bu değerle geçersiz kılınacaktır. (varsayılan 10s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-maximum-inbound-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-maximum-inbound-timeout": ""
```

### --network-maximum-timeout [duration]

Uyumlu zaman aşımı yöneticisinin maksimum zaman aşımı değeri (varsayılan 10s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-maximum-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-maximum-timeout": ""
```

### --network-minimum-timeout [duration]

Uyumlu zaman aşımı yöneticisinin minimum zaman aşımı değeri (varsayılan 2s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-minimum-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-minimum-timeout": ""
```

### --network-peer-list-gossip-frequency [duration]

Gossip [network-peer-list-num-validator-ips] doğrulayıcı IP'lerini, [network-peer-list-validator-gossip-size] doğrulayıcılar, [network-peer-list-non-validator-gossip-size] doğrulayıcı olmayanlar ve [network-peer-list-peers-gossip-size] doğrulayıcı veya doğrulayıcı olmayan eşler arasında her [network-peer-list-gossip-frequency] (varsayılan 1m0s) süresinde dağıtır.

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-peer-list-gossip-frequency [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-list-gossip-frequency": ""
```

### --network-peer-list-non-validator-gossip-size [uint]

Gossip [network-peer-list-num-validator-ips] doğrulayıcı IP'lerini, [network-peer-list-validator-gossip-size] doğrulayıcılar, [network-peer-list-non-validator-gossip-size] doğrulayıcı olmayanlar ve [network-peer-list-peers-gossip-size] doğrulayıcı veya doğrulayıcı olmayan eşler arasında her [network-peer-list-gossip-frequency] süresinde dağıtır.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-list-non-validator-gossip-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-list-non-validator-gossip-size": ""
```

### --network-peer-list-num-validator-ips [uint]

Gossip [network-peer-list-num-validator-ips] doğrulayıcı IP'lerini, [network-peer-list-validator-gossip-size] doğrulayıcılar, [network-peer-list-non-validator-gossip-size] doğrulayıcı olmayanlar ve [network-peer-list-peers-gossip-size] doğrulayıcı veya doğrulayıcı olmayan eşler arasında her [network-peer-list-gossip-frequency] (varsayılan 15) süresinde dağıtır.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-list-num-validator-ips [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-list-num-validator-ips": ""
```

### --network-peer-list-peers-gossip-size [uint]

Gossip [network-peer-list-num-validator-ips] doğrulayıcı IP'lerini, [network-peer-list-validator-gossip-size] doğrulayıcılar, [network-peer-list-non-validator-gossip-size] doğrulayıcı olmayanlar ve [network-peer-list-peers-gossip-size] doğrulayıcı veya doğrulayıcı olmayan eşler arasında her [network-peer-list-gossip-frequency] (varsayılan 10) süresinde dağıtır.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-list-peers-gossip-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-list-peers-gossip-size": ""
```

### --network-peer-list-validator-gossip-size [uint]

Gossip [network-peer-list-num-validator-ips] doğrulayıcı IP'lerini, [network-peer-list-validator-gossip-size] doğrulayıcılar, [network-peer-list-non-validator-gossip-size] doğrulayıcı olmayanlar ve [network-peer-list-peers-gossip-size] doğrulayıcı veya doğrulayıcı olmayan eşler arasında her [network-peer-list-gossip-frequency] (varsayılan 20) süresinde dağıtır.

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-list-validator-gossip-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-list-validator-gossip-size": ""
```

### --network-peer-read-buffer-size [uint]

Eş mesajlarını okuduğumuz tamponun boyutu (her eş için bir tampon vardır) (varsayılan 8192).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-read-buffer-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-read-buffer-size": ""
```

### --network-peer-write-buffer-size [uint]

Eş mesajlarını yazdığımız tamponun boyutu (her eş için bir tampon vardır) (varsayılan 8192).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--network-peer-write-buffer-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-peer-write-buffer-size": ""
```

### --network-ping-frequency [duration]

Diğer eşlere ping atma sıklığı (varsayılan 22.5s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-ping-frequency [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-ping-frequency": ""
```

### --network-ping-timeout [duration]

Bir eşle Ping-Pong için zaman aşımı değeri (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-ping-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-ping-timeout": ""
```

### --network-read-handshake-timeout [duration]

Elden okuma mesajları için zaman aşımı değeri (varsayılan 15s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-read-handshake-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-read-handshake-timeout": ""
```

### --network-require-validator-to-connect

Eğer doğru ise, bu düğüm yalnızca diğer bir düğümle bağlantıyı sürdürürse bu düğüm bir doğrulayıcı, diğer düğümde bir doğrulayıcıdır veya diğer düğüm bir beacon'dır.

**Komut Satırı Bayrağı:**

```
--network-require-validator-to-connect
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-require-validator-to-connect": "true" or "false"
```

### --network-tcp-proxy-enabled

Tüm P2P bağlantılarının bir TCP proxy başlığı ile başlatılmasını gerektirir.

**Komut Satırı Bayrağı:**

```
--network-tcp-proxy-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-tcp-proxy-enabled": "true" or "false"
```

### --network-tcp-proxy-read-timeout [duration]

TCP proxy başlığını beklemek için maksimum süre (varsayılan 3s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-tcp-proxy-read-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-tcp-proxy-read-timeout": ""
```

### --network-timeout-coefficient [float]

Ağ yanıt süresinin ortalaması ile çarpılarak ağ zaman aşımını oluşturur. En az 1 olmalıdır (varsayılan 2).

**Argüman:** `float`

**Komut Satırı Bayrağı:**

```
--network-timeout-coefficient [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-timeout-coefficient": ""
```

### --network-timeout-halflife [duration]

Ağ yanıt süresinin yarı ömrü. Daha yüksek değer --> ağ zaman aşımı daha az değişkendir. 0 olamaz (varsayılan 5m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--network-timeout-halflife [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-timeout-halflife": ""
```

### --network-tls-key-log-file-unsafe [string]

TLS anahtar günlüğü dosyası yolu. Sadece hata ayıklama için belirtilmelidir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--network-tls-key-log-file-unsafe [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"network-tls-key-log-file-unsafe": ""
```

### --outbound-connection-throttling-rps [uint]

Saniyede bu sayıda dışa giden eş bağlantı girişiminde bulunur (varsayılan 50).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--outbound-connection-throttling-rps [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"outbound-connection-throttling-rps": ""
```

### --outbound-connection-timeout [duration]

Bir eşe arama yaparken zaman aşımı (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--outbound-connection-timeout [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"outbound-connection-timeout": ""
```

### --plugin-dir [string]

Eklenti dizin yolunu belirtir (varsayılan "$AVALANCHEGO_DATA_DIR/plugins").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--plugin-dir [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"plugin-dir": ""
```

### --profile-continuous-enabled

Uygulamanın sürekli performans profilleri üretip üretmeyeceğini belirtir.

**Komut Satırı Bayrağı:**

```
--profile-continuous-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"profile-continuous-enabled": "true" or "false"
```

### --profile-continuous-freq [duration]

Performans profillerinin ne sıklıkla döndürülmesi gerektiğini belirtir (varsayılan 15m0s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--profile-continuous-freq [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"profile-continuous-freq": ""
```

### --profile-continuous-max-files [int]

Saklanacak maksimum tarih profili sayısı (varsayılan 5).

**Argüman:** `int`

**Komut Satırı Bayrağı:**

```
--profile-continuous-max-files [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"profile-continuous-max-files": ""
```

### --profile-dir [string]

Profil dizin yolunu belirtir (varsayılan "$AVALANCHEGO_DATA_DIR/profiles").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--profile-dir [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"profile-dir": ""
```

### --proposervm-use-current-height

ProposerVM'nin her zaman en son kabul edilen P-chain blok yüksekliğini bildirmesini sağlar.

**Komut Satırı Bayrağı:**

```
--proposervm-use-current-height
```

**Yapılandırma Dosyası Bayrağı:**

```json
"proposervm-use-current-height": "true" veya "false"
```

### --public-ip [string]

Bu düğüm için P2P iletişimi için genel IP adresidir. Boşsa, NAT ile keşfetmeye çalışılır.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--public-ip [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"public-ip": ""
```

### --public-ip-resolution-frequency [duration]

Bu düğümün genel IP'sini çözdüğü/güncellediği ve NAT eşlemelerini yenilediği frekans (varsayılan 5m0s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--public-ip-resolution-frequency [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"public-ip-resolution-frequency": ""
```

### --public-ip-resolution-service [string]

Sadece 'ifconfigco', 'opendns' veya 'ifconfigme' geçerli değerlerdir. Sağlandığında, düğüm bu servisi kullanarak genel IP'sini periyodik olarak çözecek/güncelleyecektir. Eğer public-ip ayarlanmışsa göz ardı edilir.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--public-ip-resolution-service [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"public-ip-resolution-service": ""
```

### --router-health-max-drop-rate [float]

Yönlendirici, bu mesajların bu kısmından fazlasını kaybederse düğüm sağlıksız olarak raporlanır (varsayılan 1).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--router-health-max-drop-rate [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"router-health-max-drop-rate": ""
```

### --router-health-max-outstanding-requests [uint]

Tüm zincirler üzerinde, bu kadar fazla bekleyen konsensüs isteği (Get, PullQuery, vb.) varsa düğüm sağlıksız olarak raporlanır (varsayılan 1024).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--router-health-max-outstanding-requests [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"router-health-max-outstanding-requests": ""
```

### --snow-avalanche-batch-size [int]

Her yeni vertexte toplamak için işlenecek işlem sayısı (varsayılan 30).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-avalanche-batch-size [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-avalanche-batch-size": ""
```

### --snow-avalanche-num-parents [int]

Her yeni vertexten referans alınacak vertex sayısı (varsayılan 5).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-avalanche-num-parents [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-avalanche-num-parents": ""
```

### --snow-concurrent-repolls [int]

Konsensüsü finalize etmek için gereken minimum eşzamanlı anket sayısı (varsayılan 4).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-concurrent-repolls [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-concurrent-repolls": ""
```

### --snow-max-processing [int]

Sağlıklı kabul edilen maksimum işlem öğesi sayısı (varsayılan 256).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-max-processing [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-max-processing": ""
```

### --snow-max-time-processing [duration]

Bir öğenin işlenmesi gereken maksimum süre (varsayılan 30s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--snow-max-time-processing [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-max-time-processing": ""
```

### --snow-mixed-query-num-push-non-vdr [uint]

Eğer bu düğüm bir doğrulayıcı değilse, bir konteyner konsensusa eklendiğinde, snow-mixed-query-num-push-non-vdr doğrulayıcılarına bir Push Query gönderilir ve diğerlerine bir Pull Query gönderilir. `"
```

### --snow-mixed-query-num-push-vdr [uint]

Eğer bu düğüm bir doğrulayıcıysa, bir konteyner konsensusa eklendiğinde, snow-mixed-query-num-push-vdr doğrulayıcılarına bir Push Query gönderilir ve diğerlerine bir Pull Query gönderilir. `"
```

### --snow-optimal-processing [int]

Konsensustaki işleme konteynerlerinin optimal sayısı (varsayılan 10).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-optimal-processing [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-optimal-processing": ""
```

### --snow-quorum-size [int]

Gerekli pozitif sonuç sayısı için kullanılacak alfa değeri (varsayılan 15).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-quorum-size [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-quorum-size": ""
```

### --snow-rogue-commit-threshold [int]

Sahte işlemler için kullanılacak beta değeri (varsayılan 20).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-rogue-commit-threshold [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-rogue-commit-threshold": ""
```

### --snow-sample-size [int]

Ağ anketi için sorgulanacak düğüm sayısı (varsayılan 20).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-sample-size [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-sample-size": ""
```

### --snow-virtuous-commit-threshold [int]

Erdemli işlemler için kullanılacak beta değeri (varsayılan 15).

Argüman: `int`

**Komut Satırı Bayrağı:**

```
--snow-virtuous-commit-threshold [int]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"snow-virtuous-commit-threshold": ""
```

### --stake-max-consumption-rate [uint]

Stake işlevinde basılacak kalan tokenlerin maksimum tüketim oranı (varsayılan 120000).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--stake-max-consumption-rate [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"stake-max-consumption-rate": ""
```

### --stake-min-consumption-rate [uint]

Stake işlevinde basılacak kalan tokenlerin minimum tüketim oranı (varsayılan 100000).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--stake-min-consumption-rate [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"stake-min-consumption-rate": ""
```

### --stake-minting-period [duration]

Stake işlevinin tüketim süresi (varsayılan 8760h0m0s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--stake-minting-period [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"stake-minting-period": ""
```

### --stake-supply-cap [uint]

Stake işlevi için arz sınırı (varsayılan 720000000000000000).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--stake-supply-cap [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"stake-supply-cap": ""
```

### --staking-disabled-weight [uint]

Stake devre dışı olduğunda her bir eşe verilecek ağırlık (varsayılan 100).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--staking-disabled-weight [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-disabled-weight": ""
```

### --staking-enabled

Stake'i etkinleştirir. Etkinleştirildiğinde, Ağ TLS gereklidir (varsayılan true).

**Komut Satırı Bayrağı:**

```
--staking-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-enabled": "true" veya "false"
```

### --staking-ephemeral-cert-enabled

Eğer true ise, düğüm geçici bir stake TLS anahtarı ve sertifikası kullanır ve geçici bir düğüm kimliğine sahiptir.

**Komut Satırı Bayrağı:**

```
--staking-ephemeral-cert-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-ephemeral-cert-enabled": "true" veya "false"
```

### --staking-ephemeral-signer-enabled

Eğer true ise, düğüm geçici bir stake imzalayıcı anahtarı kullanır.

**Komut Satırı Bayrağı:**

```
--staking-ephemeral-signer-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-ephemeral-signer-enabled": "true" veya "false"
```

### --staking-port [uint]

Konsensüs sunucusunun portu (varsayılan 9651).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--staking-port [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-port": ""
```

### --staking-signer-key-file [string]

Staking için imzalayıcı özel anahtarının yolu. Eğer staking-signer-key-file-content belirtilmişse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/staking/signer.key").

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-signer-key-file [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-signer-key-file": ""
```

### --staking-signer-key-file-content [string]

Staking için base64 kodlu imzalayıcı özel anahtarı belirler.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-signer-key-file-content [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-signer-key-file-content": ""
```

### --staking-tls-cert-file [string]

Staking için TLS sertifikasının yolu. Eğer staking-tls-cert-file-content belirtilmişse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/staking/staker.crt").

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-tls-cert-file [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-tls-cert-file": ""
```

### --staking-tls-cert-file-content [string]

Staking için base64 kodlu TLS sertifikasını belirtir.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-tls-cert-file-content [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-tls-cert-file-content": ""
```

### --staking-tls-key-file [string]

Staking için TLS özel anahtarının yolu. Eğer staking-tls-key-file-content belirtilmişse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/staking/staker.key").

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-tls-key-file [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-tls-key-file": ""
```

### --staking-tls-key-file-content [string]

Staking için base64 kodlu TLS özel anahtarını belirtir.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--staking-tls-key-file-content [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"staking-tls-key-file-content": ""
```

### --state-sync-ids [string]

Bağlanmak için virgülle ayrılmış durum senkronizasyonu eş kimlikleri listesi. Örnek: NodeID-JR4dVmy6ffUGAKCBDkyCbeZbyHQBeDsET,NodeID-8CrVPQZ4VSqgL8zTdvL14G8HqAfrBr4z.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--state-sync-ids [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"state-sync-ids": ""
```

### --state-sync-ips [string]

Bağlanmak için virgülle ayrılmış durum senkronizasyonu eş IP'leri listesi. Örnek: 127.0.0.1:9630,127.0.0.1:9631.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--state-sync-ips [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"state-sync-ips": ""
```

### --subnet-config-content [string]

Base64 kodlu subnetwork yapılandırmalarını belirtir.

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--subnet-config-content [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"subnet-config-content": ""
```

### --subnet-config-dir [string]

Subnet'e özgü yapılandırmaların ana dizini. Eğer subnet-config-content belirtilmişse göz ardı edilir (varsayılan "$AVALANCHEGO_DATA_DIR/configs/subnets").

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--subnet-config-dir [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"subnet-config-dir": ""
```

### --system-tracker-cpu-halflife [duration]

CPU izleyici için kullanılacak yarı ömür. Daha büyük yarı ömür --> CPU kullanım metriği daha yavaş değişir (varsayılan 15s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--system-tracker-cpu-halflife [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-cpu-halflife": ""
```

### --system-tracker-disk-halflife [duration]

Disk izleyici için kullanılacak yarı ömür. Daha büyük yarı ömür --> disk kullanım metriği daha yavaş değişir (varsayılan 1m0s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--system-tracker-disk-halflife [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-disk-halflife": ""
```

### --system-tracker-disk-required-available-space [uint]

Düğümün kapatılacağı minimum mevcut byte sayısı (varsayılan 536870912).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--system-tracker-disk-required-available-space [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-disk-required-available-space": ""
```

### --system-tracker-disk-warning-threshold-available-space [uint]

Düğümün sağlıksız olarak kabul edileceği, mevcut byte sayısı için uyarı eşiği. [system-tracker-disk-required-available-space] 'den büyük olmalıdır (varsayılan 1073741824).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--system-tracker-disk-warning-threshold-available-space [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-disk-warning-threshold-available-space": ""
```

### --system-tracker-frequency [duration]

İzlenilen süreçlerin gerçek sistem kullanımını kontrol etmek için frekans. Daha sık kontroller --> kullanım metrikleri daha doğru ancak takip etmesi daha maliyetlidir (varsayılan 500ms).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--system-tracker-frequency [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-frequency": ""
```

### --system-tracker-processing-halflife [duration]

İşleme talepleri izleyici için kullanılacak yarı ömür. Daha büyük yarı ömür --> kullanım metrikleri daha yavaş değişir (varsayılan 15s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--system-tracker-processing-halflife [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"system-tracker-processing-halflife": ""
```

### --throttler-inbound-at-large-alloc-size [uint]

Gelen mesaj throttler'ında büyük tahsis boyutu (bytes) (varsayılan 6291456).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-at-large-alloc-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-at-large-alloc-size": ""
```

### --throttler-inbound-bandwidth-max-burst-size [uint]

Bir düğüm tarafından aynı anda kullanılabilecek maksimum gelen bant genişliği. En azından maksimum mesaj boyutu kadar olmalıdır. BandwidthThrottler'a bakın (varsayılan 2097152).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-bandwidth-max-burst-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-bandwidth-max-burst-size": ""
```

### --throttler-inbound-bandwidth-refill-rate [uint]

Bir eşin maksimum ortalama gelen bant genişliği kullanımı, saniyede byte cinsinden. BandwidthThrottler'a bakın (varsayılan 524288).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-bandwidth-refill-rate [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-bandwidth-refill-rate": ""
```

### --throttler-inbound-cpu-max-non-validator-node-usage [float]

Bir doğrulayıcının kullanabileceği maksimum CPU sayısı. Değer [0, toplam çekirdek sayısı] aralığında olmalıdır (varsayılan 1).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-cpu-max-non-validator-node-usage [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-cpu-max-non-validator-node-usage": ""
```

### --throttler-inbound-cpu-max-non-validator-usage [float]

Tamamen kullanıldığında tüm doğrulayıcıları sınırlayacak CPU sayısı. Değer [0, toplam çekirdek sayısı] aralığında olmalıdır (varsayılan 6.4).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-cpu-max-non-validator-usage [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-cpu-max-non-validator-usage": ""
```

### --throttler-inbound-cpu-max-recheck-delay [duration]

CPU tabanlı ağ throttler'ında, düğümün CPU kullanımının kabul edilebilir bir seviyeye düştüğünü kontrol etmek için en azından bu kadar sık kontrol edin (varsayılan 5s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-cpu-max-recheck-delay [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-cpu-max-recheck-delay": ""
```

### --throttler-inbound-cpu-validator-alloc [float]

Doğrulayıcılar tarafından kullanılmak üzere tahsis edilecek maksimum CPU sayısı. Değer [0, toplam çekirdek sayısı] aralığında olmalıdır (varsayılan 8).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-cpu-validator-alloc [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-cpu-validator-alloc": ""
```

### --throttler-inbound-disk-max-non-validator-node-usage [float]

Bir doğrulayıcının kullanabileceği maksimum disk okuma/yazma sayısı (varsayılan 1.073741824e+12).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-disk-max-non-validator-node-usage [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-disk-max-non-validator-node-usage": ""
```

### --throttler-inbound-disk-max-non-validator-usage [float]

Tamamen kullanıldığında tüm doğrulayıcıları sınırlayacak disk okuma/yazma sayısı (varsayılan 1.073741824e+12).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-disk-max-non-validator-usage [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-disk-max-non-validator-usage": ""
```

### --throttler-inbound-disk-max-recheck-delay [duration]

Disk tabanlı ağ throttler'ında, düğümün disk kullanımının kabul edilebilir bir seviyeye düştüğünü kontrol etmek için en azından bu kadar sık kontrol edin (varsayılan 5s).

Argüman: `duration`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-disk-max-recheck-delay [duration]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-disk-max-recheck-delay": ""
```

### --throttler-inbound-disk-validator-alloc [float]

Doğrulayıcılar tarafından kullanmak üzere tahsis edilen maksimum disk okuma/yazma sayısı. 0'dan büyük olmalıdır (varsayılan 1.073741824e+12).

Argüman: `float`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-disk-validator-alloc [float]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-disk-validator-alloc": ""
```

### --throttler-inbound-node-max-at-large-bytes [uint]

Gelen mesaj throttler'ın büyük tahsisinden alabileceği maksimum byte sayısı. En azından maksimum mesaj boyutu kadar olmalıdır (varsayılan 2097152).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-node-max-at-large-bytes [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-node-max-at-large-bytes": ""
```

### --throttler-inbound-node-max-processing-msgs [uint]

Verilen düğümden şu anda işlenmekte olan maksimum mesaj sayısı (varsayılan 1024).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-node-max-processing-msgs [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-node-max-processing-msgs": ""
```

### --throttler-inbound-validator-alloc-size [uint]

Gelen mesaj throttler'ında doğrulayıcı byte tahsis büyüklüğü (varsayılan 33554432).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-inbound-validator-alloc-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-inbound-validator-alloc-size": ""
```

### --throttler-outbound-at-large-alloc-size [uint]

Giden mesaj throttler'ında büyük tahsis boyutu (varsayılan 33554432).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-outbound-at-large-alloc-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-outbound-at-large-alloc-size": ""
```

### --throttler-outbound-node-max-at-large-bytes [uint]

Giden mesaj throttler'ın büyük tahsisinden alabileceği maksimum byte sayısı. En azından maksimum mesaj boyutu kadar olmalıdır (varsayılan 2097152).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-outbound-node-max-at-large-bytes [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-outbound-node-max-at-large-bytes": ""
```

### --throttler-outbound-validator-alloc-size [uint]

Giden mesaj throttler'ında doğrulayıcı byte tahsis büyüklüğü (varsayılan 33554432).

Argüman: `uint`

**Komut Satırı Bayrağı:**

```
--throttler-outbound-validator-alloc-size [uint]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"throttler-outbound-validator-alloc-size": ""
```

### --tracing-enabled

Eğer true ise, opentelemetry izlemeyi etkinleştirir.

**Komut Satırı Bayrağı:**

```
--tracing-enabled
```

**Yapılandırma Dosyası Bayrağı:**

```json
"tracing-enabled": "true" veya "false"
```

### --tracing-endpoint [string]

İz verilerini göndereceğiniz uç nokta (varsayılan "localhost:4317").

Argüman: `string`

**Komut Satırı Bayrağı:**

```
--tracing-endpoint [string]
```

**Yapılandırma Dosyası Bayrağı:**

```json
"tracing-endpoint": ""
```

### --tracing-exporter-type [string]

İzleme için kullanılacak dışa aktarıcı tipi. Seçenekler [grpc, http] (varsayılan "grpc")

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--tracing-exporter-type [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"tracing-exporter-type": ""
```

### --tracing-insecure

Eğer true ise, izleme verilerini gönderirken TLS kullanma (varsayılan true).

**Komut Satırı Bayrağı:**

```
--tracing-insecure
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"tracing-insecure": "true" or "false"
```

### --tracing-sample-rate [float]

Örneklemek için izlerin oranı. Eğer >= 1 ise, her zaman örnekle. Eğer `"
```

### --track-subnets [string]

Düğümün izleyeceği alt ağların listesi. Bir alt ağı izleyen bir düğüm, alt ağ doğrulayıcılarının çalışma sürelerini izler ve alt ağdaki tüm zincirleri senkronize etmeye çalışır. Bir alt ağı doğrulamadan önce, düğümün alt ağı izlemesi gerekir, böylece alt ağ doğrulama sürelerinin etkilenmesini önler.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--track-subnets [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"track-subnets": ""
```

### --transform-subnet-tx-fee [uint]

Alt ağları dönüştüren işlemler için işlem ücreti, nAVAX cinsinden (varsayılan 100000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--transform-subnet-tx-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"transform-subnet-tx-fee": ""
```

### --tx-fee [uint]

İşlem ücreti, nAVAX cinsinden (varsayılan 1000000).

**Argüman:** `uint`

**Komut Satırı Bayrağı:**

```
--tx-fee [uint]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"tx-fee": ""
```

### --uptime-metric-freq [duration]

Bu düğümün ortalama çalışma sürelerini yenileme frekansı (varsayılan 30s).

**Argüman:** `duration`

**Komut Satırı Bayrağı:**

```
--uptime-metric-freq [duration]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"uptime-metric-freq": ""
```

### --uptime-requirement [float]

Bir doğrulayıcının ödül almak için çevrimiçi olması gereken süre oranı (varsayılan 0.8).

**Argüman:** `float`

**Komut Satırı Bayrağı:**

```
--uptime-requirement [float]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"uptime-requirement": ""
```

### --version

Eğer true ise, sürümü yazdır ve çık.

**Komut Satırı Bayrağı:**

```
--version
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"version": "true" or "false"
```

### --vm-aliases-file [string]

vmIDs'nin özel takma adlarla eşlendiği bir JSON dosyasını belirtir. Eğer vm-aliases-file-content belirtilirse görmezden gelinir (varsayılan "$AVALANCHEGO_DATA_DIR/configs/vms/aliases.json").

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--vm-aliases-file [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"vm-aliases-file": ""
```

### --vm-aliases-file-content [string]

Base64 kodlu, vmIDs'yi özel takma adlarla eşleyen bir dosya belirtir.

**Argüman:** `string`

**Komut Satırı Bayrağı:**

```
--vm-aliases-file-content [string]
```

**Konfigürasyon Dosyası Bayrağı:**

```json
"vm-aliases-file-content": ""
```