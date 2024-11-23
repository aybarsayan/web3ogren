---
sidebar_position: 4
title: Konfigürasyon
description: Camino Node için kullanılan yaygın yapılandırma seçenekleri.
---

# Camino Node Konfigürasyonu

Aşağıdaki argümanlarla bir düğümün yapılandırmasını belirtebilirsiniz.

:::tip FLAKLAR & ARGÜMANLAR

Mevcut seçeneklerin kapsamlı bir listesi için lütfen  sayfasına bakın.

:::

## Konfigürasyon Dosyası

#### `--config-file` (string):

Bu düğümün yapılandırmasını belirten bir JSON dosyasına olan yol. Komut satırı argümanları, konfigürasyon dosyasındaki argümanların üzerini yazar. Eğer `--config-file-content` belirtilmişse bu bayrak göz ardı edilir.

Örnek JSON konfigürasyon dosyası:

```json
{
  "public-ip": "111.112.113.114",
  "http-host": "127.0.0.1",
  "network-id": "columbus",
  "log-level": "debug",
  "log-display-level": "info",
  "log-rotater-compress-enabled": "true",
  "log-rotater-max-size": 32,
  "log-rotater-max-files": 20,
  "log-rotater-max-age": "60",
  "api-keystore-enabled": "false"
}
```

:::note KONFİGÜRASYON BAYRAĞI VE CLI BAYRAĞI

Aynı seçeneklerin hem komut satırı hem de konfigürasyon dosyası kullanılarak yapılandırılabileceğini belirtmek önemlidir. Ayrım, kullanım sözdiziminde yatıyor: CLI bayrağı olarak seçeneği kullanırken, önüne `--` (çift tire) eklemeniz gerekir.

:::

#### `--config-file-content` (string):

`--config-file` alternatif olarak, base64 kodlu konfigürasyon içeriğini belirtmeye olanak tanır. `--config-file-content-type` ile birlikte kullanılmalıdır.

#### `--config-file-content-type` (string):

Base64 kodlu konfigürasyon içeriğinin formatını belirtir. JSON, TOML, YAML mevcut olarak desteklenen dosya formatlarındandır (tam liste için  bakabilirsiniz). `--config-file-content` ayarlandığında gereklidir.

## API'ler

#### `--api-admin-enabled-secret` (string):

Boş olmayan bir değer ile bu düğüm Admin API'sini açar. Her çağrıda gizli anahtar iletilmelidir. Daha fazla bilgi için  bakın.

#### `--api-auth-required` (boolean):

`true` olarak ayarlandığında, API çağrıları bir yetkilendirme token'ı gerektirir. Varsayılan olarak `false`'dur. Daha fazla bilgi için  bakın.

#### `--api-auth-password` (string):

Yetkilendirme token'larını oluşturmak/iade etmek için gereken şifre. Eğer `--api-auth-required=true` ise belirtilmelidir; aksi takdirde göz ardı edilir. Daha fazla bilgi için  bakın.

#### `--api-health-enabled` (boolean):

`true` olarak ayarlandığında, bu düğüm Sağlık API'sini açar. Varsayılan olarak `true`'dur. Daha fazla bilgi için  bakın.

#### `--index-enabled` (boolean): {#index-enabled}

Eğer `false` ise, bu düğüm indeksleyici etkinleştirilmeyecek ve İndex API'si kullanılamayacaktır. Varsayılan olarak `false`'dur. Daha fazla bilgi için  bakın.

#### `--api-info-enabled` (boolean):

`true` olarak ayarlandığında, bu düğüm Bilgi API'sini açar. Varsayılan olarak `true`'dur. Daha fazla bilgi için  bakın.

#### `--api-ipcs-enabled` (boolean):

`true` olarak ayarlandığında, bu düğüm IPC'leri API'sini açar. Varsayılan olarak `false`'dır. Daha fazla bilgi için  bakın.

#### `--api-keystore-enabled` (boolean):

`false` olarak ayarlandığında, bu düğüm Keystore API'sini açmayacaktır. Varsayılan olarak `true`'dur. Daha fazla bilgi için  bakın.

#### `--api-metrics-enabled` (boolean):

`false` olarak ayarlandığında, bu düğüm Metrics API'sini açmayacaktır. Varsayılan olarak `true`'dur. Daha fazla bilgi için  bakın.

#### `--http-shutdown-wait` (duration):

SIGTERM veya SIGINT aldıktan sonra kapanış başlatmadan önce beklenmesi gereken süre. Bu süre zarfında `/health` uç noktası sağlıksız dönecektir (eğer Sağlık API'si etkinse). Varsayılan olarak 0'dır.

#### `--http-shutdown-timeout` (duration):

Düğüm kapanırken mevcut bağlantıların tamamlanması için maksium bekleme süresi. Varsayılan olarak 10 saniyedir.

## Doğrulamalar

#### `--assertions-enabled` (boolean):

`true` olarak ayarlandığında, doğrulamalar kod tabanı boyunca çalışma zamanında yürütülecektir. Bu, hata ayıklama amacıyla kullanılır, çünkü daha spesifik bir hata mesajı alabiliriz. Varsayılan olarak `true`'dur.

## Başlatma

#### `--bootstrap-beacon-connection-timeout` (duration):

Başlatma işaretçilerine bağlanmaya çalışırken zaman aşımı süresi. Varsayılan olarak `1m`'dir.

#### `--bootstrap-ids` (string):

Başlatma kimlikleri, bir dizi doğrulayıcı kimliğidir. Bu kimlikler başlatma eşlerini kimlik doğrulamak için kullanılacaktır. Bu alanın örnek ayarı şöyle olabilir: `--bootstrap-ids="NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL,NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"`. Varsayılan değer ağ kimliğine bağlıdır.

#### `--bootstrap-ips` (string):

Başlatma IP'leri, bir dizi IPv4:port çifti şeklindedir. Bu IP adresleri, mevcut Camino durumunu başlatmak için kullanılacaktır. Bu alanın örnek ayarı şöyle olabilir: `--bootstrap-ips="127.0.0.1:12345,1.2.3.4:5678"`. Varsayılan değer ağ kimliğine bağlıdır.

#### `--bootstrap-retry-enabled` (boolean):

Eğer true ise, başarısız olursa başlatma işlemini tekrar deneyecektir.

#### `--bootstrap-retry-max-attempts` (uint):

Bir başarısızlıktan sonra başlatma işlemini yeniden denemek için kullanılacak maksimum deneme sayısı.

#### `--bootstrap-ancestors-max-containers-sent` (uint)

Bu düğüm tarafından gönderilen bir Atalar mesajındaki maksimum konteyner sayısı. Varsayılan olarak `2000`'dir.

#### `--bootstrap-ancestors-max-containers-received` (uint)

Bu düğüm, gelen bir Atalar mesajından en fazla bu kadar konteyner okuyacaktır. Varsayılan olarak `2000`'dir.

## Zincir Yapılandırmaları

Bazı zincirler, düğüm operatörünün özel bir yapılandırma sağlamasına olanak tanır. Camino-Node, zincir yapılandırmalarını dosyalardan okuyabilir ve başlatma sırasında ilgili zincirlere iletebilir.

Camino-Node, bu dosyaları `--chain-config-dir` ile belirtilen dizinde arar. Bu dizin, zincir ID'leri veya zincir takma adları olan alt dizinler içerebilir. Her alt dizin, dizin adında belirtilen zincir için yapılandırmayı içerir. Her alt dizin, karşılık gelen zincir başlatıldığında iletilen değeri içeren `config` adlı bir dosya içermelidir (aşağıda genişletme için bakınız). Örneğin, C-Chain için konfigürasyon: `{chain-config-dir}/C/config.json` olmalıdır.

Bu dosyaların hangi dosya uzantısına sahip olması gerektiği ve bu dosyaların içeriği VM'ye bağlıdır. Örneğin, bazı zincirler `config.txt` beklerken diğerleri `config.json` bekleyebilir. Aynı alt dizinde aynı adı taşıyan ancak farklı uzantılara sahip birden fazla dosya sağlanırsa, Camino-Node bir hata ile çıkacaktır.

Belirli bir zincir için, Camino-Node ilk önce zincir ID'sinin adını taşıyan bir config alt dizini arar. Bulamazsa, zincirin birincil takma adının adını taşıyan bir config alt dizini arar. Bulamazsa, zincir için başka bir takma adın adını taşıyan bir config alt dizini arar. Tüm klasör ve dosya adları büyük/küçük harf duyarlıdır.

Bu özel yapılandırmaları sağlamak zorunlu değildir. Sağlanmazsa, VM'ye özgü varsayılan bir yapılandırma kullanılacaktır.

#### `--chain-config-dir` (string):

Yukarıda açıklandığı gibi zincir yapılandırmalarını içeren dizini belirtir. Varsayılan olarak `$HOME/.caminogo/configs/chains`'dir. Bu bayrak belirtilmezse ve varsayılan dizin mevcut değilse, Camino-Node çıkmaz çünkü özel yapılandırmalar isteğe bağlıdır. Ancak, bayrak ayarlanmışsa, belirtilen klasör mevcut olmalıdır, aksi halde Camino-Node hata vererek çıkacaktır. Bu bayrak `--chain-config-content` belirtilmişse göz ardı edilir.

#### `--chain-config-content` (string):

`--chain-config-dir` alternatif olarak, zincir özel yapılandırmaları komut satırından `--chain-config-content` bayrağı aracılığıyla yüklenebilir. İçerik base64 kodlu olmalıdır.

### C-Chain Yapılandırmaları

C-Chain için bir yapılandırma belirtmek için, `{chain-config-dir}/C/config.json` konumuna bir JSON yapılandırma dosyası yerleştirilmelidir.

Örneğin, `chain-config-dir` varsayılan değere sahipse, yani `$HOME/.caminogo/configs/chains`, o zaman `config.json` dosyası `$HOME/.caminogo/configs/chains/C/config.json` konumunda yer alabilir.

Aşağıda, C-Chain konfigürasyon seçenekleri açıklanmaktadır.

Varsayılan C-Chain konfigürasyonu:

```json
{
  "snowman-api-enabled": false,
  "coreth-admin-api-enabled": false,
  "coreth-admin-api-dir": "",
  "eth-apis": [
    "public-eth",
    "public-eth-filter",
    "net",
    "web3",
    "internal-public-eth",
    "internal-public-blockchain",
    "internal-public-transaction-pool",
    "internal-public-account"
  ],
  "continuous-profiler-dir": "",
  "continuous-profiler-frequency": 900000000000,
  "continuous-profiler-max-files": 5,
  "rpc-gas-cap": 50000000,
  "rpc-tx-fee-cap": 100,
  "preimages-enabled": false,
  "pruning-enabled": true,
  "snapshot-async": true,
  "snapshot-verification-enabled": false,
  "metrics-enabled": false,
  "metrics-expensive-enabled": false,
  "local-txs-enabled": false,
  "api-max-duration": 0, // Varsayılan olarak maksimum yok
  "ws-cpu-refill-rate": 0,
  "ws-cpu-max-stored": 0,
  "api-max-blocks-per-request": 0, // Varsayılan olarak maksimum yok
  "allow-unfinalized-queries": false,
  "allow-unprotected-txs": false,
  "keystore-directory": "",
  "keystore-external-signer": "",
  "keystore-insecure-unlock-allowed": false,
  "remote-tx-gossip-only-enabled": false,
  "tx-regossip-frequency": 60000000000,
  "tx-regossip-max-size": 15,
  "log-level": "debug",
  "offline-pruning-enabled": false,
  "offline-pruning-bloom-filter-size": 512, // MB
  "offline-pruning-data-directory": ""
}
```

Varsayılan değerler yalnızca verilen yapılandırmada belirtilmişse geçersiz kılınır.

#### Sürekli Profiling

##### `continuous-profiler-dir` (string):

Sürekli profillemeyi etkinleştirir (belirtilen aralıkla bir CPU / Bellek / Kilit profili yakalar). Varsayılan olarak ""'dır. Eğer boş olmayan bir dize sağlanırsa, sürekli profillemeyi etkinleştirir ve profilleri koymak için belirtilen dizini ayarlar.

##### `continuous-profiler-frequency` (duration):

Sürekli profilleme frekansını belirler. Varsayılan olarak 15 dakikadır.

##### `continuous-profiler-max-files` (int):

En eski olanı kaldırmadan önce saklanacak maksimum profil sayısını belirler.

#### Camino Spesifik API'lerin Etkinleştirilmesi

##### `snowman-api-enabled` (boolean):

Snowman API'sini etkinleştirir. Varsayılan olarak `false`'dır.

##### `coreth-admin-api-enabled` (boolean):

Admin API'sini etkinleştirir. Varsayılan olarak `false`'dır.

##### `coreth-admin-api-dir` (string):

Admin API'sinin CPU/Bellek/Kilit Profillerini saklamak için kullanacağı dizini belirtir. Varsayılan olarak ""'dır.

#### EVM API'lerini Etkinleştirme

##### `eth-apis` ([]string):

Düğümünüzde etkinleştirmek istediğiniz aşağıdaki hizmetlerin kesin kümesini belirtmek için `eth-apis` alanını kullanın. Bu alan ayarlanmazsa, varsayılan liste: `["public-eth","public-eth-filter","net","web3","internal-public-eth","internal-public-blockchain","internal-public-transaction-pool"]` olacaktır.

Not: bu alanı doldurursanız, varsayılanları geçersiz kılacaktır, bu nedenle etkinleştirmek istediğiniz her hizmeti eklemelisiniz.

##### `public-eth`:

`eth_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

`eth_coinbase`
`eth_etherbase`

##### `public-eth-filter`:

`eth_*` ad alanı için kamu filtresi API'sini etkinleştirir. Varsayılan olarak `true`'dır.

Aşağıdaki RPC çağrılarını ekler (tam belgeler için https://eth.wiki/json-rpc/API adresine bakın):

- `eth_newPendingTransactionFilter`
- `eth_newPendingTransactions`
- `eth_newAcceptedTransactions`
- `eth_newBlockFilter`
- `eth_newHeads`
- `eth_logs`
- `eth_newFilter`
- `eth_getLogs`
- `eth_uninstallFilter`
- `eth_getFilterLogs`
- `eth_getFilterChanges`

##### `private-admin`:

`admin_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `admin_importChain`
- `admin_exportChain`

##### `public-debug`:

`debug_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `debug_dumpBlock`
- `debug_accountRange`

##### `private-debug`:

`debug_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `debug_preimage`
- `debug_getBadBlocks`
- `debug_storageRangeAt`
- `debug_getModifiedAccountsByNumber`
- `debug_getModifiedAccountsByHash`
- `debug_getAccessibleState`

##### `net`:

`net_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `net_listening`
- `net_peerCount`
- `net_version`

Not: Coreth sanal bir makinedir ve ağ katmanına doğrudan erişimi yoktur, bu nedenle `net_listening` her zaman true döner ve `net_peerCount` her zaman 0 döner. Ağ katmanındaki doğru ölçümler için kullanıcıların Camino-Node API'lerini kullanmaları gerekir.

##### `debug-tracer`:

`debug_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `debug_traceChain`
- `debug_traceBlockByNumber`
- `debug_traceBlockByHash`
- `debug_traceBlock`
- `debug_traceBadBlock`
- `debug_intermediateRoots`
- `debug_traceTransaction`
- `debug_traceCall`

##### `web3`:

`web3_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `web3_clientVersion`
- `web3_sha3`

##### `internal-public-eth`:

`eth_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `eth_gasPrice`
- `eth_baseFee`
- `eth_maxPriorityFeePerGas`
- `eth_feeHistory`

##### `internal-public-blockchain`:

`eth_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `eth_chainId`
- `eth_blockNumber`
- `eth_getBalance`
- `eth_getAssetBalance`
- `eth_getProof`
- `eth_getHeaderByNumber`
- `eth_getHeaderByHash`
- `eth_getBlockByNumber`
- `eth_getBlockByHash`
- `eth_getUncleBlockByNumberAndIndex`
- `eth_getUncleBlockByBlockHashAndIndex`
- `eth_getUncleCountByBlockNumber`
- `eth_getUncleCountByBlockHash`
- `eth_getCode`
- `eth_getStorageAt`
- `eth_call`
- `eth_estimateGas`
- `eth_createAccessList`

##### `internal-public-transaction-pool`:

`eth_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `eth_getBlockTransactionCountByNumber`
- `eth_getBlockTransactionCountByHash`
- `eth_getTransactionByBlockNumberAndIndex`
- `eth_getTransactionByBlockHashAndIndex`
- `eth_getRawTransactionByBlockNumberAndIndex`
- `eth_getRawTransactionByBlockHashAndIndex`
- `eth_getTransactionCount`
- `eth_getTransactionByHash`
- `eth_getRawTransactionByHash`
- `eth_getTransactionReceipt`
- `eth_sendTransaction`
- `eth_fillTransaction`
- `eth_sendRawTransaction`
- `eth_sign`
- `eth_signTransaction`
- `eth_pendingTransactions`
- `eth_resend`

##### `internal-public-tx-pool`:

`txpool_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `txpool_content`
- `txpool_contentFrom`
- `txpool_status`
- `txpool_inspect`

##### `internal-public-debug`:

`debug_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `debug_getHeaderRlp`
- `debug_getBlockRlp`
- `debug_printBlock`

##### `internal-private-debug`:

`debug_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `debug_chaindbProperty`
- `debug_chaindbCompact`

##### `internal-public-account`:

`eth_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `true`'dır.

- `eth_accounts`

##### `internal-private-personal`:

`personal_*` ad alanına aşağıdaki RPC çağrılarını ekler. Varsayılan olarak `false`'dır.

- `personal_listAccounts`
- `personal_listWallets`
- `personal_openWallet`
- `personal_deriveAccount`
- `personal_newAccount`
- `personal_importRawKey`
- `personal_unlockAccount`
- `personal_lockAccount`
- `personal_sendTransaction`
- `personal_signTransaction`
- `personal_sign`
- `personal_ecRecover`
- `personal_signAndSendTransaction`
- `personal_initializeWallet`
- `personal_unpair`

#### API Yapılandırması

##### `rpc-gas-cap` (int):

Bir RPC Çağrısı tarafından tüketilecek maksimum gaz miktarı (kullanıldığı `eth_estimateGas` ve `eth_call` için). Varsayılan olarak 50,000,000'dur.

##### `rpc-tx-fee-cap` (int):

Gönderim-işlem çeşitleri için global işlem ücreti (fiyat * gaz limiti) tavanıdır. Varsayılan olarak 100'dür.

##### `api-max-duration` (duration):

Maksimum API çağrı süresi. API çağrıları bu süreyi aşarsa zaman aşımına uğrar. Varsayılan olarak 0 (maksimum yok) olarak ayarlanmıştır.

##### `api-max-blocks-per-request` (int):

`getLogs` isteği başına sunabilecek maksimum blok sayısı. Varsayılan olarak 0 (maksimum yok) olarak ayarlanmıştır.

##### `ws-cpu-refill-rate` (duration):

Yenileme oranı, bir bağlantıya her saniyede ayrılacak maksimum CPU zamanını belirler. Varsayılan olarak maksimum yoktur (0).

##### `ws-cpu-max-stored` (duration):

Tek WS bağlantısı için saklanabilecek maksimum CPU zamanını belirtir. Varsayılan olarak maksimum yoktur (0).

##### `allow-unfinalized-queries` (boolean):

Tamamlanmamış (henüz kabul edilmemiş) bloklar/işlemler için sorgulara izin verir. Varsayılan olarak `false`'dur.

#### İşlem Havuzu

##### `local-txs-enabled` (boolean):

Yerel işlem yönetimini etkinleştirir (bu düğüm aracılığıyla gönderilen işlemleri önceliklendirir). Varsayılan olarak `false`'dur.

##### `allow-unprotected-txs` (boolean):

Eğer true ise, API'ler replay koruması (EIP-155) olmayan işlemlerin bu düğüm aracılığıyla verilmesine izin verecektir. Varsayılan olarak `false`'dır.

##### `remote-tx-gossip-only-enabled` (boolean):

Eğer true ise, düğüm yalnızca uzaktaki işlemleri yayacak ve bu düğüm aracılığıyla yayınlanan işlemlerin ağa yayılmasını engelleyecektir. Varsayılan olarak `false`'dır.

##### `tx-regossip-frequency` (duration):

Artık bir kez yayılmış olan bir işlemi yeniden yaymak için ne kadar süre geçmesi gerektiğini belirtir. Varsayılan olarak 1 dakikadır.

##### `tx-regossip-max-size` (int):

Bir seferde yeniden yayılacak maksimum işlem sayısı. Varsayılan olarak 15'tir.

#### Ölçümler

##### `metrics-enabled` (boolean):

Ölçümleri etkinleştirir. Varsayılan olarak `false`'dır.

##### `metrics-expensive-enabled` (boolean):

Pahalı ölçümleri etkinleştirir. Varsayılan olarak `false`'dır.

#### Veritabanı

##### `pruning-enabled` (boolean):

Eğer true ise, eski tarihi verilerin veritabanı temizlemesi etkinleştirilecektir. Tüm verilere ihtiyaç duyan düğümler için devre dışı bırakılmalıdır. Temizleme yalnızca yeni veriler için yapılacaktır. v1.4.9'da varsayılan olarak `false` ve sonraki sürümlerde `true` olarak ayarlanmıştır.

##### `preimages-enabled` (boolean):

Eğer true ise, ön görüntüleri etkinleştirir. Varsayılan olarak `false`'dır.

##### `offline-pruning-enabled` (boolean):

Eğer true ise, çevrimdışı temizleme başlangıçta çalıştırılacak ve tamamlanana kadar engellenmeyecektir (ana ağda yaklaşık bir saat sürer). Bu, veri tabanının eski ağaç düğümlerini silerek boyutunu azaltır. **Çevrimdışı temizleme yapılırken, düğüm blokları işleme alamaz ve çevrimdışı olarak kabul edilir.**
Devam ederken, temizleme işlemi küçük bir ek disk alanı (silme işaretçeleri ve bloom filtresi için) tüketmektedir.

Eski durum verilerini sildiği için, çevrimdışı temizleme, arşiv API taleplerini desteklemesi gereken düğümler üzerinde çalıştırılmamalıdır.

Bu manuel olarak çalıştırılmak için tasarlanmıştır, dolayısıyla bu bayrakla bir kez çalıştırdığınızda, tekrar çalıştırmadan önce bayrağı false'a ayarlamalısınız. Bu nedenle, bu bayrak ile true ayarlayıp, sonrasında false yapmak için ardışık bir çalıştırma yapmalısınız.

##### `offline-pruning-bloom-filter-size` (int):

Bu bayrak çevrimdışı temizleme sırasında kullanılacak bloom filtresinin boyutunu (MB cinsinden ve varsayılan olarak 512 MB) ayarlamaktadır. Bloom filtresi, temizleme sırasında verimli kontroller için bellekte tutulur ve temizlemenin yeniden başlatılabilmesi için diske de yazılır.

Aktif durum, silinebilecek ağaç düğümlerini bulmak için DB'yi yineleme yapmadan önce bloom filtresine eklenir, bloom filtresinde olmayan hiçbir ağaç düğümü silinmek için güvenli olarak kabul edilir. Bloom filtresinin boyutu, yanlış pozitif oranını etkileyebilir ve bu da çevrimdışı temizleme sonuçlarını etkileyebilir. Bu, 512 MB olarak ayarlandığı için düşünceli bir şekilde değiştirilmesi gereken bir gelişmiş parametredir.

##### `offline-pruning-data-directory` (string):

Bu bayrak, çevrimdışı temizleme etkinleştirildiğinde ayarlanmalıdır ve çevrimdışı temizlemenin bloom filtresini diske yazmak için kullanacağı dizini tanımlar. Bu dizin, çevrimdışı temizleme tamamlanana kadar çalıştırmalar arasında değiştirilmemelidir.

#### Anlık Görüntüler

##### `snapshot-async` (boolean):

Eğer true ise, anlık görüntü oluşturma işleminin asenkron olarak yürütülmesine izin verir. Varsayılan olarak `true`'dır.

##### `snapshot-verification-enabled` (boolean):

Eğer doğruysa, oluşturulduktan sonra tam anlık görüntüyü doğrular. Varsayılan olarak yanlıştır.

#### Günlük Seviyesi

##### `log-level` (string):

Günlük seviyesini tanımlar. `"trace"`, `"debug"`, `"info"`, `"warn"`, `"error"`, `"crit"` değerlerinden biri olmalıdır. Varsayılan olarak `"debug"` olarak ayarlanmıştır.

#### Anahtar Deposu Ayarları

##### `keystore-directory` (string):

Özel anahtarların bulunduğu dizin. Göreli bir yol olarak verilebilir. Eğer boş bırakılırsa, `coreth-keystore` dizininde geçici bir dizin kullanılır. Varsayılan olarak boş bir dizedir.

##### `keystore-external-signer` (string):

Clef türü bir imzalayıcı için dış URI'yi belirtir. Varsayılan olarak boş bir dizedir (etkin değil).

##### `keystore-insecure-unlock-allowed` (bool):

Eğer doğruysa, kullanıcıların güvensiz HTTP ortamında hesapları kilidini açmasına izin verir. Varsayılan olarak yanlıştır.

### X-Chain Ayarları

X-Chain için bir yapılandırma belirtmek amacıyla, bir JSON yapılandırma dosyası `{chain-config-dir}/X/config.json` konumuna yerleştirilmelidir.

Örneğin, eğer `chain-config-dir` varsayılan değere sahip ise, yani `$HOME/.caminogo/configs/chains` dizinine sahipse, `config.json` dosyası `$HOME/.caminogo/configs/chains/X/config.json` konumuna yerleştirilebilir.

Bu, X-Chain'e gönderilecek bir yapılandırma belirtmenizi sağlar. Bu yapılandırmanın varsayılan değerleri aşağıdaki gibidir:

```json
{
  "index-transactions": false,
  "index-allow-incomplete": false
}
```

Varsayılan değerler yalnızca yapılandırmada açıkça belirtilmişse geçersiz kılınır.

Parametreler şunlardır:

**Transaction Indexing**

#### `index-transactions` (boolean):

`true` olarak ayarlanırsa, AVM işlem indekslemesini etkinleştirir. Varsayılan değeri `false`'dır. `true` olarak ayarlandığında, AVM işlemleri ilgili `address` ve `assetID` ile indekslenir. Bu veriler `avm.getAddressTxs`  aracılığıyla erişilebilir.

Lütfen şunu unutmayın: `index-transactions` `true` olarak ayarlandığında, düğümün ömrü boyunca daima `true` olarak ayarlanması gerekir. `true` olan bir ayardan sonra `false` olarak ayarlanırsa, düğüm başlamakta direnç gösterir yalnızca `index-allow-incomplete` değeri de `true` olarak ayarlanmışsa başlatılabilir (aşağıya bakınız).

#### `index-allow-incomplete` (boolean):

Tam olmayan dizinlere izin verir. Varsayılan değeri `false`'dır.

Bu yapılandırma değeri, veri tabanında X-Chain indeksli verisinin olmadığı durumda yok sayılır ve `index-transactions` `false` olarak ayarlanmışsa geçerli değildir.

## Veri Tabanı

##### `--db-dir` (string, dosya yolu):

Veri tabanının kalıcı olarak kaydedileceği dizini belirtir. Varsayılan değeri `"$HOME/.caminogo/db"`'dir.

##### `--db-type` (string):

Hangi veri tabanı türünün kullanılacağını belirtir. `leveldb`, `rocksdb`, `memdb` değerlerinden biri olmalıdır. `memdb`, bellekte çalışan, kalıcı olmayan bir veri tabanıdır.

`leveldb` ile çalışırken, düğüm `rocksdb` ile çalıştığında kalıcı hale getirilen verileri okuyamaz ve tersine geçerlidir.

**RocksDB hakkında iki önemli not**: İlk olarak, RocksDB tüm bilgisayarlarda çalışmaz. İkinci olarak, RocksDB varsayılan olarak yapılandırılmaz ve halka açık olarak yayınlanan ikili dosyalara dahil edilmez. RocksDB ile Camino-Node oluşturmak için terminalde `export ROCKSDBALLOWED=1` komutunu çalıştırın ve ardından `scripts/build.sh` komutunu kullanın. Bunu yapmadan `--db-type=rocksdb` kullanamazsınız.

### Veri Tabanı Yapılandırması

#### `--db-config-file` (string):

Veri tabanı yapılandırma dosyasının yolu. Eğer `--config-file-content` belirtilmişse yok sayılır.

#### `--db-config-file-content` (string):

Alternatif olarak `--db-config-file`'a karşılık olarak, base64 ile kodlanmış veri tabanı yapılandırma içeriği belirtmeye izin verir.

#### LevelDB Yapılandırması

LevelDB yapılandırma dosyası JSON formatında olmalı ve bu anahtarları içerebilir. Verilmeyen anahtarlar varsayılan değeri alacaktır.

```go
{
	// BlockSize, her 'sıralı tablo' bloğunun minimum sıkıştırılmamış boyutudur.
	"blockCacheCapacity": int
	// BlockSize, her 'sıralı tablo' bloğunun minimum sıkıştırılmamış boyutudur.
	"blockSize": int
	// CompactionExpandLimitFactor, genişletildikten sonraki sıkıştırma boyutunu sınırlar. Bu, hedef seviye sıkıştırma boyut limitine çarpılacaktır.
	"compactionExpandLimitFactor": int
	// CompactionGPOverlapsFactor, bir 'sıralı tablo'nun tek bir 'sıralı tablo' ürettiği büyük ebeveyn (Seviye + 2)'deki örtüşmeleri sınırlar. Bu, büyük ebeveyn seviye tablosu boyut limitine çarpılacaktır.
	"compactionGPOverlapsFactor": int
	// CompactionL0Trigger, sıfırıncı seviyedeki 'sıralı tablo' sayısını tanımlar ve bu sıkıştırmayı tetikler.
	"compactionL0Trigger": int
	// CompactionSourceLimitFactor, sıkıştırma kaynak boyutunu sınırlar. Bu, seviyelerin sıfır eşiklerine uygulanmaz. Bu, hedef seviye sıkıştırma tablosu limitine çarpılacaktır.
	"compactionSourceLimitFactor": int
	// CompactionTableSize, sıkıştırma tarafından oluşturulan 'sıralı tablo'nun boyutunu sınırlar. Her seviye için limitler şu şekilde hesaplanır:
	// CompactionTableSize * (CompactionTableSizeMultiplier ^ Level)
	// Her seviyenin çarpanını ayrıca CompactionTableSizeMultiplierPerLevel ile ince ayar yapabilirsiniz.
	"compactionTableSize": int
	// CompactionTableSizeMultiplier, CompactionTableSize için çarpanı tanımlar.
	"compactionTableSizeMultiplier": float
	"compactionTableSizeMultiplierPerLevel": []float
	// CompactionTotalSizeMultiplier, CompactionTotalSize için çarpanı tanımlar.
	"compactionTotalSizeMultiplier": float64
	// OpenFilesCacheCapacity, açık dosyaların önbellek kapasitesini tanımlar.
	"openFilesCacheCapacity": int
	// İki tane WriteBuffer boyutunda tampon vardır.
	"writeBuffer": int
	"filterBitsPerKey": int
}
```

#### RocksDB Yapılandırma Dosyası

Özel yapılandırma henüz RocksDB için desteklenmemektedir.

## Genesis

#### `--genesis` (string):

Kullanılacak genesis verilerini içeren bir JSON dosyasının yolu. Standart ağlarda (Camino, Columbus veya Testnet) veya `--genesis-content` belirtilmişse yok sayılır. Belirtilmezse varsayılan genesis verileri kullanılır.
Genesis verilerinin JSON temsiline bir örnek için  bakınız.

#### `--genesis-content` (string):

Alternatif olarak `--genesis` yerine kullanılmak üzere, kullanılacak base64 kodlu genesis verilerini belirtmeye izin verir.

## HTTP Sunucusu

#### `--http-allowed-origins` (string):

HTTP portunda izin verilen kökenleri belirtir. Varsayılan olarak \*'dır, bu da tüm kökenlere izin verir.

#### `--http-host` (string):

HTTP API'lerinin dinleyeceği adres. Varsayılan değeri `127.0.0.1`'dir. Bu, varsayılan olarak düğümünüzün yalnızca aynı makineden yapılan API çağrılarını işleyebileceği anlamına gelir. Başka makinalardan API çağrılarına izin vermek için `--http-host=` kullanabilirsiniz. Parametre olarak alan adı da girebilirsiniz.

#### `--http-port` (int):

Her düğüm, düğüm ve Camino ağı ile etkileşimde bulunmak için API'leri sağlayan bir HTTP sunucusu çalıştırır. Bu argüman, HTTP sunucusunun dinleyeceği portu belirtir. Varsayılan değer `9650`'dir.

#### `--http-tls-cert-file` (string, dosya yolu):

Bu argüman, düğümün HTTPS sunucusu için kullandığı TLS sertifikasının konumunu belirtir. Bu, `--http-tls-enabled=true` olduğunda belirtilmelidir. Varsayılan bir değeri yoktur. Eğer `--http-tls-cert-file-content` belirtilmişse bu bayrak yok sayılır.

#### `--http-tls-cert-file-content` (string):

Alternatif olarak `--http-tls-cert-file` yerine kullanılmak üzere, düğüm tarafından HTTPS sunucusu için kullanılan TLS sertifikasının base64 kodlanmış içeriğini belirtmeye izin verir. Tam sertifika içeriği, başlık ve son başlık dahil olmak üzere base64 olarak kodlanmalıdır. Bu, `--http-tls-enabled=true` olduğunda belirtilmelidir.

#### `--http-tls-enabled` (boolean):

Eğer `true` olarak ayarlanırsa, bu bayrak sunucunun HTTPS'ye yükseltilmesini deneyecektir. Varsayılan değeri `false`'dır.

#### `--http-tls-key-file` (string, dosya yolu):

Bu argüman, düğüm tarafından HTTPS sunucusu için kullanılan TLS özel anahtarının konumunu belirtir. Bu, `--http-tls-enabled=true` olduğunda belirtilmelidir. Varsayılan bir değeri yoktur. Eğer `--http-tls-key-file-content` belirtilmişse bu bayrak yok sayılır.

#### `--http-tls-key-file-content` (string):

Alternatif olarak `--http-tls-key-file`'a karşılık gelen, düğüm tarafından HTTPS sunucusu için kullanılan TLS özel anahtarının base64 kodlanmış içeriğini belirtmeye izin verir. Tam özel anahtar içeriği, başlık ve son başlık dahil olmak üzere base64 olarak kodlanmalıdır. Bu, `--http-tls-enabled=true` olduğunda belirtilmelidir.

## IPCS

#### `--ipcs-chain-ids` (string)

Bağlanılacak zincir id'lerinin virgülle ayrılmış listesi (örn. `11111111111111111111111111111111LpoYY,4R5p2RXDGLqaifZE4hHWH9owe34pfoBULn1DrQTWivjg8o4aH`). Varsayılan değeri yoktur.

#### `--ipcs-path` (string)

IPC soketleri için dizin (Unix) veya isimli boru ön eki (Windows). Varsayılan değeri `/tmp`'dir.

## Dosya Tanıtıcısı Limiti

#### `--fd-limit` (int)

Bir işlemin dosya tanıtıcı limitini en az bu değere yükseltmeye çalışır. Varsayılan değeri `32768`'dir.

## Günlükleme

#### `--log-level` (string, `{Off, Fatal, Error, Warn, Info, Debug, Verbo}`):

Günlük seviyesi, hangi olayların kaydedileceğini belirler. Yüksek öncelikten en düşüğe kadar 7 farklı seviye vardır.

- `Off`: Bu seviyede günlük yoktur.
- `Fatal`: Kurtarılamayan kritik hatalar.
- `Error`: Düğümün karşılaştığı hatalar, bu hatalar geri kazanılabilir.
- `Warn`: Spurious bir Byzantine düğümü veya potansiyel bir gelecekteki hatayı gösterebilecek bir uyarı.
- `Info`: Düğüm Durum güncellemelerini açıklayan yararlı bilgiler.
- `Debug`: Hataları anlamaya çalışırken yararlı olan debug günlüğü. Normal kullanım için genellikle istenenden daha fazla bilgi gösterilecektir.
- `Verbo`: Düğümün işlediği geniş miktarda bilgiyi izler. Bu, mesaj içeriklerini ve düşük seviyeli protokol analizi için veri ikili dökümünü içerir.

Günlük seviyesi belirtildiğinde, belirtildiği gibi öncelik seviyesine veya daha yüksek olan tüm güncellemeler izlenecektir. Varsayılan değeri `Info`'dur.

#### `--log-display-level` (string, `{Off, Fatal, Error, Warn, Info, Debug, Verbo}`):

Günlük seviyesi, ekranda hangi olayların görüntüleneceğini belirler. Boş bırakılırsa, `--log-level`'da sağlanan değeri varsayılan alır.

#### `--log-display-highlight` (string, `{auto, plain, colors}`):

Görüntülemeyi renklendirme/öne çıkarma. Varsayılan, çıktı bir terminal olduğunda öne çıkarır. Aksi halde, `{auto, plain, colors}` değerlerinden biri olmalıdır.

#### `--log-dir` (string, dosya yolu):

Sistem günlüklerinin tutulduğu dizini belirtir. Varsayılan değeri `"$HOME/.caminogo/logs"`'dir.

## Ağ Kimliği

#### `--network-id` (string):

Düğümün bağlanacağı ağın kimliği. Aşağıdaki değerlerden biri olabilir:

- `--network-id=camino` -&gt; Camino Mainnet ağına bağlanır (varsayılan).
- `--network-id=columbus` -&gt; Columbus test ağına bağlanır.
- `--network-id=testnet` -&gt; Mevcut test ağına bağlanır. (Columbus.)
- `--network-id=local` -&gt; Yerel bir test ağına bağlanır.
- `--network-id=network-{id}` -&gt; Verilen ID ile ağa bağlanır. `id` `[0, 2^32)` aralığında olmalıdır.

## Genel IP

#### `--public-ip` (string):

Doğrulayıcıların, diğer düğümlere nasıl bağlanacaklarını bildirebilmesi için genel IP adreslerini bilmeleri gerekir. Bu argüman sağlanmazsa, düğüm genel IP'yi almak için NAT geçişi yapmaya çalışacaktır. Yerel bir ağ oluşturmak için `127.0.0.1` olarak ayarlanmalıdır. Ayarlanmamışsa, IP'yi NAT geçişi kullanarak öğrenmeye çalışır.

## İmza Doğrulama

#### `--signature-verification-enabled` (boolean):

İmza doğrulamayı etkinleştirir. `false` olarak ayarlandığında, imzalar, imzaların devre dışı bırakılabildiği VM'lerde kontrol edilmeyecektir. Varsayılan olarak `true`'dur.

## Stake Etme

#### `--staking-port` (int):

Ağa dışarıdan bağlanacak olan peer'lerin bu düğüme bağlanacağı port. Bu portun internetten erişilebilir olması, düğümün doğru çalışması için gereklidir. Varsayılan değeri `9651`'dir.

#### `--staking-enabled` (boolean):

Camino, Ağı kötü niyetli saldırılara karşı korumak için Proof of Stake (PoS) kullanır. Eğer `false` ise, Sybil direnci devre dışıdır ve tüm peer'ler konsensüs sırasında örneklenecektir. Varsayılan değeri `true`'dur. Bunun, kamu ağlarında (`Camino` ve `Columbus`) belirtilmemesi gerektiğini unutmayın.

Bu bayrağı `false` olarak ayarlamak, bu düğümün bir doğrulayıcı olmadığı anlamına gelmez.
Bu, düğümün yalnızca doğrulayıcıları değil, tüm düğümleri örnekleyeceği anlamına gelir.
**Bu bayrağı kapatmayı asla denememelisiniz, ancak ne yaptığınızı anladığınızdan emin olmalısınız.**

#### `--staking-tls-cert-file` (string, dosya yolu):

Camino, düğümleri güvenli bir şekilde bağlamak için iki yönlü kimlik doğrulama TLS bağlantıları kullanır. Bu argüman, düğüm tarafından kullanılan TLS sertifikasının konumunu belirtir. Varsayılan olarak, düğüm TLS sertifikasını `$HOME/.caminogo/staking/staker.crt` dizininde bekler. Eğer `--staking-tls-cert-file-content` belirtilmişse bu bayrak yok sayılır.

#### `--staking-tls-cert-file-content` (string):

Alternatif olarak `--staking-tls-cert-file`'a karşılık, düğüm tarafından kullanılan TLS sertifikasının base64 kodlanmış içeriğini belirtmeye izin verir. Tam sertifika içeriği, başlık ve son başlık dahil olmak üzere base64 olarak kodlanmalıdır.

#### `--staking-tls-key-file` (string, dosya yolu):

Camino, düğümleri güvenli bir şekilde bağlamak için iki yönlü kimlik doğrulama TLS bağlantıları kullanır. Bu argüman, düğüm tarafından kullanılan TLS özel anahtarının konumunu belirtir. Varsayılan olarak, düğüm TLS özel anahtarını `$HOME/.caminogo/staking/staker.key` dizininde bekler. Eğer `--staking-tls-key-file-content` belirtilmişse bu bayrak yok sayılır.

#### `--staking-tls-key-file-content` (string):

Alternatif olarak `--staking-tls-key-file`'a karşılık, düğüm tarafından kullanılan TLS özel anahtarının base64 kodlanmış içeriğini belirtmeye izin verir. Tam özel anahtar içeriği, başlık ve son başlık dahil olmak üzere base64 olarak kodlanmalıdır.

#### `--staking-disabled-weight` (int):

Stake verme devre dışı olduğunda her peer'e sağlanacak ağırlık. Varsayılan değeri `1`'dir.

## Alt Ağlar

### Beyaz Liste

#### `--whitelisted-subnets` (string):

Bu düğümün doğrulayacağı alt ağ ID'lerinin virgülle ayrılmış listesi. Varsayılan olarak boştur (sadece Ana Ağ'ı doğrulayacaktır).

### Alt Ağ Yapılandırmaları

Alt ağlar için parametreler sağlamak mümkündür. Burada belirtilen parametreler, belirlenen alt ağlardaki tüm zincirlere uygulanır. Parametreler, `--subnet-config-dir` altında `{subnetID}.json` yapılandırma dosyası ile belirtilmelidir. Camino-Node, `--whitelisted-subnet` parametresinde belirtilen alt ağlar için yapılandırmaları yükler.

#### `--subnet-config-dir` (string):

Yukarıda açıklanan alt ağ yapılandırmalarını içeren dizini belirtir. Varsayılan olarak `$HOME/.caminogo/configs/subnets`'dir. Eğer bayrak açıkça ayarlanmışsa, belirtilen klasör mevcut olmalıdır, aksi halde Camino-Node bir hata ile çıkış yapacaktır. Bu bayrak `--subnet-config-content` belirtilmişse yok sayılır.

Örnek: Diyelim ki `p4jUwqZsA2LuSftroCd3zb4ytH8W99oXKuKVZdsty7eQ3rXD6` ID'sine sahip bir alt ağımız var. Varsayılan `subnet-config-dir` altında `$HOME/.caminogo/configs/subnets/p4jUwqZsA2LuSftroCd3zb4ytH8W99oXKuKVZdsty7eQ3rXD6.json` konumunda bir yapılandırma dosyası oluşturabiliriz. Bir örnek yapılandırma dosyası şu şekildedir:

```json
{
  "validatorOnly": false,
  "consensusParameters": {
    "k": 25,
    "alpha": 18
  },
  "appGossipNonValidatorSize": 10
}
```

#### `--subnet-config-content` (string):

Alternatif olarak `--subnet-config-dir` yerine kullanılmak üzere, base64 kodlanmış alt ağ parametrelerini belirtmeye izin verir.

#### Parametreler

##### `validatorOnly` (bool):

Eğer `true`'ysa, bu düğüm P2P mesajlar aracılığıyla alt ağ blok zinciri içeriklerini doğrulayıcılara açmaz. Varsayılan olarak `false`'dır.

##### Konsensüs Parametreleri

Alt ağ yapılandırmaları, yeni konsensüs parametrelerinin yüklenmesini destekler. JSON anahtarları, eşleşen `CLI` anahtarlarından farklıdır. Bu parametreler `consensusParameters` anahtarı altında gruplanmalıdır. Bir alt ağın konsensüs parametreleri, Ana Ağ'ı için kullanılan aynı değerleri varsayılan olarak alır, bunlar 'dir.

| CLI Anahtarı                          | JSON Anahtarı              |
| :------------------------------- | :-------------------- |
| --snow-sample-size               | k                     |
| --snow-quorum-size               | alpha                 |
| --snow-virtuous-commit-threshold | betaVirtuous          |
| --snow-rogue-commit-threshold    | betaRogue             |
| --snow-concurrent-repolls        | concurrentRepolls     |
| --snow-optimal-processing        | optimalProcessing     |
| --snow-max-processing            | maxOutstandingItems   |
| --snow-max-time-processing       | maxItemProcessingTime |
| --snow-avalanche-batch-size      | batchSize             |
| --snow-avalanche-num-parents     | parentSize            |

##### Gossip Yapılandırmaları

Ana Ağ için parametrelerin değerlerini değiştirmeden her alt ağ için farklı Gossip yapılandırmaları tanımlamak mümkündür. Örneğin Ana Ağ'da işlem mempool'ları, doğrulayıcı olmayanlara iletilmez (`--consensus-app-gossip-validator-size` değeri `0`'dır). Bunun için alt ağınızda bunu değiştirebilir ve doğrulayıcı olmayanlarla da mempool paylaşabilirsiniz. Bu parametrelerin JSON anahtarları, eşleşen `CLI` anahtarlarından farklıdır. Bu parametreler varsayılan olarak Ana Ağ'da kullanılan aynı değerleri alır. Daha fazla bilgi için  bölümüne bakınız.

| CLI Anahtarı                                   | JSON Anahtarı                   |
| :---------------------------------------- | :------------------------- |
| --consensus-accepted-frontier-gossip-size | gossipAcceptedFrontierSize |
| --consensus-on-accept-gossip-size         | gossipOnAcceptSize         |
| --consensus-app-gossip-non-validator-size | appGossipNonValidatorSize  |
| --consensus-app-gossip-validator-size     | appGossipValidatorSize     |

## Sürüm

#### `--version` (boolean)

Eğer `true`'ysa, sürüm bilgisini yazdırır ve programı kapatır. Varsayılan değeri `false`'dır.

## Gelişmiş Seçenekler

Aşağıdaki seçenekler bir düğümün doğruluğunu etkileyebilir. Bu ayarları yalnızca uzman kullanıcılar değiştirmelidir.

### Gossiping

#### `--consensus-app-gossip-non-validator-size` (uint):

Bir AppGossip mesajını sohbet edecek kadar doğrulayıcı olmayan peer sayısı. Varsayılan değeri `0`'dır.

#### `--consensus-app-gossip-validator-size` (uint):

Bir AppGossip mesajını sohbet edecek doğrulayıcı sayısı. Varsayılan değeri `10`'dur.

#### `--consensus-accepted-frontier-gossip-size` (uint):

Kabul edilen ön kırılımı gönderirken sohbet edilecek peer sayısı. Varsayılan değeri `35`'tir.

#### `--consensus-on-accept-gossip-size` (uint):

Kabul edilen her konteyner için sohbet edilecek peer sayısı. Varsayılan değeri `20`'dir.

### Benchlist

#### `--benchlist-duration` (duration):

Bir peer'in `--benchlist-fail-threshold` değerini aşmasından sonra benchlist'te kalacağı maksimum süre. Varsayılan değeri `15m`'dir.

#### `--benchlist-fail-threshold` (int):

Bir düğüme karşı yapılan ardışık başarısız sorguların sayısı, benchlist'e eklenmeden önce (tüm sorguların başarısız olacağı varsayımında). Varsayılan değeri `10`'dur.

#### `--benchlist-min-failing-duration` (duration):

Bir peer'e yapılan sorguların, peer'in benchlist'e alınmadan önce en az başarısızlık gösterdiği süre. Varsayılan değeri `150s`'dir.

### Yapılandırma Dizini

#### `--build-dir` (string):

Camino-Node ve eklenti ikili dosyalarını bulmak için hangi dizinin kullanılacağını belirtir. Varsayılan değeri, yürütülen Camino-Node ikili dosyasının yoludur. Bu dizinin yapısı aşağıdaki gibi olmalıdır:

```text
build-dir
|_camino-node
    |_plugins
```

### Konsensüs Parametreleri

#### `--consensus-gossip-frequency` (duration):

Kabul edilen ön kırılımı sohbet etme süresi. Varsayılan değeri `10s`'dir.

#### `--consensus-shutdown-timeout` (duration):

Yanıt vermeyen bir zinciri kapatmadan önce beklenen süre. Varsayılan değeri `5s`'dir.

#### `--creation-tx-fee` (int):

Yeni bir durum oluşturan işlemler için nCAM cinsinden işlem ücreti. Varsayılan değeri `1000000` nCAM (0.001 CAM) her işlem için geçerlidir.

#### `--min-delegator-stake` (int):

Ana Ağ'daki bir doğrulayıcıya delege edilebilecek en düşük stake miktarı, nCAM cinsinden. 

Ana Ağa'da varsayılan değer `25000000000` (25 CAM)'dır. Test Ağı'nda varsayılan değer `5000000` (0.005 CAM)'dır.

#### `--min-delegation-fee` (int):

Ana Ağ'da delegasyon için alınabilecek en düşük delegasyon ücreti, `10,000` çarpanı ile çarpılmıştır. `[0, 1000000]` aralığında olmalıdır. Ana Ağ'daki varsayılan değer `20000` (2%)'dir.

#### `--min-stake-duration` (duration):

Minimum stake süresi. Ana Ağ'daki varsayılan değer `336h` (iki hafta)'dir.

#### `--min-validator-stake` (int):

Ana Ağ'ı doğrulamak için gerekli minimum stake, nCAM cinsinden.

Ana Ağa'da varsayılan değer `2000000000000` (2000 CAM)'dır. Test Ağı'nda varsayılan değer `5000000` (0.005 CAM)'dır.

#### `--max-stake-duration` (duration):

Maksimum stake süresi, saat cinsinden. Ana Ağ'daki varsayılan değer `8760h` (365 gün)'dür.

#### `--max-validator-stake` (int):

Ana ağda bir doğrulayıcıya konulabilecek maksimum hisse, nCAM cinsinden. Mainnet'te varsayılan olarak `3000000000000000` (3,000,000 CAM) olarak ayarlanmıştır. Bu, hem doğrulayıcı tarafından sağlanan hem de doğrulayıcıya delegeler tarafından sağlanan hisseleri içerir.

#### `--stake-minting-period` (duration):

Hisse işlevinin tüketim süresi, saat cinsindendir. Mainnet'teki varsayılan değer `8760h` (365 gün).

#### `--stake-max-consumption-rate` (uint):

Minting dönemindeki kalan token arzı için maksimum tüketim oranı yüzdesi, bu süre Mainnet'te 1 yıldır. Varsayılan olarak `120,000` (yılda %12) ayarlanmıştır.

#### `--stake-min-consumption-rate` (uint):

Minting dönemindeki kalan token arzı için minimum tüketim oranı yüzdesi, bu süre Mainnet'te 1 yıldır. Varsayılan olarak `100,000` (yılda %10) ayarlanmıştır.

#### `--stake-supply-cap` (uint):

Bir doğrulayıcıya konulabilecek maksimum hisse arzı, nCAM cinsindendir. Varsayılan olarak `720,000,000,000,000,000` nCAM olarak ayarlanmıştır.

#### `--tx-fee` (int):

X-Chain üzerinde bir işlemin geçerli olabilmesi için yakılması gereken nCAM miktarı ve P-Chain üzerindeki import/export işlemleri için gereken miktar. Bu parametre mevcut şekliyle ağ onayını gerektirir. Varsayılan değeri değiştirmek, yalnızca özel ağlarda yapılmalıdır. Varsayılan olarak `1,000,000` nCAM işlem başına ayarlanmıştır.

#### `--uptime-requirement` (float):

Bir doğrulayıcının ödül alabilmesi için çevrimiçi kalması gereken zaman oranı. Varsayılan olarak `0.8` olarak ayarlanmıştır.

### Kar Temel Ayarları

#### `--snow-avalanche-batch-size` (int):

DAG uygulamaları için Snow konsensüsü, bir vertex'in dahil etmesi gereken işlem sayısını `b` olarak tanımlar. `b` değerinin artırılması teorik olarak verimliliği artıracak, ancak gecikmeyi de artıracaktır. Düğüm, bir grup oluşturmak için en fazla 1 saniye bekleyecek ve ardından tüm grubu aynı anda verecektir. Değer en az `1` olmalıdır. Varsayılan olarak `30`'dur.

#### `--snow-avalanche-num-parents` (int):

DAG uygulamaları için Snow konsensüsü, bir vertex'in dahil etmesi gereken ana sayısını `p` olarak tanımlar. `p` değerinin artırılması, ağ sorgularının amortismanını iyileştirecektir. Ancak, grafiğin bağlantılılığını artırarak, grafik geçişlerinin karmaşıklığını da artırır. Değer en az `2` olmalıdır. Varsayılan olarak `5`'tir.

#### `--snow-concurrent-repolls` (int):

Snow konsensüsü, ağ kullanımı düşkenlığında belirli işlemlerin yeniden anketlenmesini gerektirir. Bu parametre, istemcinin bekleyen bu işlemleri tamamlamakta ne kadar agresif olacağını tanımlar. Bu, Snow konsensüsünün trade-off'ları dikkatlice değerlendirildikten sonra değiştirilmelidir. Değer en az `1` ve en çok `--snow-rogue-commit-threshold` olmalıdır. Varsayılan olarak `4` şeklindedir.

#### `--snow-sample-size` (int):

Snow konsensüsü, her ağ anketi sırasında örneklenen doğrulayıcı sayısını `k` olarak tanımlar. Bu parametre, konsensüs için kullanılan `k` değerini tanımlar. Bu, Snow konsensüsünün trade-off'ları dikkatlice değerlendirildikten sonra değiştirilmelidir. Değer en az `1` olmalıdır. Varsayılan olarak `20`'dir.

#### `--snow-quorum-size` (int):

Snow konsensüsü, her ağ anketi sırasında bir işlemin güvenini artırmak için tercih eden doğrulayıcı sayısını `alpha` olarak tanımlar. Bu parametre, konsensüs için kullanılan `alpha` değerini tanımlar. Bu, Snow konsensüsünün trade-off'ları dikkatlice değerlendirildikten sonra değiştirilmelidir. Değer `k/2`'den büyük olmalıdır. Varsayılan olarak `14` tür.

#### `--snow-virtuous-commit-threshold` (int):

Snow konsensüsü, erdemli bir işlemin kabul edilmesi için güvenini artırması gereken kesintisiz anket sayısını `beta1` olarak tanımlar. Bu parametre, konsensüs için kullanılan `beta1` değerini tanımlar. Bu, Snow konsensüsünün trade-off'ları dikkatlice değerlendirildikten sonra değiştirilmelidir. Değer en az `1` olmalıdır. Varsayılan olarak `15`'dir.

#### `--snow-rogue-commit-threshold` (int):

Snow konsensüsü, bir kötü niyetli işlemin kabul edilmesi için güvenini artırması gereken kesintisiz anket sayısını `beta2` olarak tanımlar. Bu parametre, konsensüs için kullanılan `beta2` değerini tanımlar. Bu, Snow konsensüsünün trade-off'ları dikkatlice değerlendirildikten sonra değiştirilmelidir. Değer en az `beta1` olmalıdır. Varsayılan olarak `30`'dur.

### Sürekli Profil Oluşturma

Düğümünüzü sürekli olarak bellek/CPU profilleri oluşturacak şekilde yapılandırabilirsiniz ve en son profilleri kaydedebilirsiniz. Sürekli bellek/CPU profil oluşturma, `--profile-continuous-enabled` ayarlandığında etkinleşir.

#### `--profile-continuous-enabled` (boolean):

Uygulamanın sürekli performans profilleri üretip üretmeyeceği. Varsayılan olarak false (etkin değil) ayarlanmıştır.

#### `--profile-dir` (string):

Profil oluşturma etkinleştirildiğinde, düğüm sürekli bellek/CPU profilleri çalıştırır ve bunları bu dizine koyar. Varsayılan olarak `$HOME/.caminogo/profiles/` olarak ayarlanmıştır.

#### `--profile-continuous-freq` (duration):

Yeni bir CPU/bellek profili ne sıklıkla oluşturulur. Varsayılan olarak `15m` olarak ayarlanmıştır.

#### `--profile-continuous-max-files` (int):

Saklanacak maksimum CPU/bellek profili dosya sayısı. Varsayılan olarak `5` olarak ayarlanmıştır.

### Sağlık

#### `--health-check-frequency` (duration):

Sağlık kontrolü bu sıklıkta çalışır. Varsayılan olarak `30s` olarak ayarlanmıştır.

#### `--health-check-averager-halflife` (duration):

Sağlık kontrollerinde kullanılan ortalama hesaplayıcıların yarı ömrü (örneğin, mesaj hatalarının oranını ölçmek için). Daha büyük değer → ortalamaların daha az değişken hesabı. Varsayılan olarak `10s` olarak ayarlanmıştır.

### Ağ

#### `--network-allow-private-ips` (bool):

Düğümün özel IP'lere sahip akranlarla bağlantı kurmasına izin verir. Varsayılan olarak `true`'dur.

#### `--network-compression-enabled` (bool):

Eğer true ise, akranlara gönderilen belirli mesajları sıkıştırarak bant genişliği kullanımını azaltır.

#### `--network-initial-timeout` (duration):

Uyarlamalı zaman aşımı yöneticisinin başlangıç zaman aşımı değeridir, nanonit cinsindendir. Varsayılan olarak `5s` olarak ayarlanmıştır.

#### `--network-initial-reconnect-delay` (duration):

Bir akrana yeniden bağlanma girişiminden önce beklenmesi gereken başlangıç gecikmesi süresi. Varsayılan olarak `1s` olarak ayarlanmıştır.

#### `--network-max-reconnect-delay` (duration):

Bir akrana yeniden bağlanma girişiminden önce beklenmesi gereken maksimum gecikme süresi. Varsayılan olarak `1h` olarak ayarlanmıştır.

#### `--network-minimum-timeout` (duration):

Uyarlamalı zaman aşımı yöneticisinin minimum zaman aşımı değeri, nanonit cinsindendir. Varsayılan olarak `2s`'dir.

#### `--network-maximum-timeout` (duration):

Uyarlamalı zaman aşımı yöneticisinin maksimum zaman aşımı değeri, nanonit cinsindendir. Varsayılan olarak `10s`'dir.

#### `--network-maximum-inbound-timeout` (duration):

Bir gelen mesaj için maksimum zaman aşımı değeri. Gelen mesajların, bu değerin üstünde bir son tarihe sahip olması durumunda, bu değerle geçersiz kılınır. Varsayılan olarak `10s`'dir.

#### `--network-timeout-halflife` (duration):

Ağ gecikmesini hesaplarken kullanılan yarı ömür. Daha büyük değer → daha az değişken ağ gecikmesi hesabı. Varsayılan olarak `5m`'dir.

#### `--network-timeout-coefficient` (duration):

Akranlara yapılacak isteklerin zaman aşımı, `network-timeout-coefficient * ortalama istek gecikmesi` değerine ulaşır. Varsayılan olarak `2`'dir.

#### `--network-read-handshake-timeout` (duration):

Elde okuma zaman aşımı değeri. Varsayılan olarak `15s`'dir.

#### `--network-ping-timeout` (duration):

Bir akrana Ping-Pong için zaman aşımı değeri. Varsayılan olarak `30s`'dir.

#### `--network-ping-frequency` (duration):

Diğer akranlara ping gönderme sıklığı. Varsayılan olarak `22.5s`'dir.

#### `--network-health-min-conn-peers` (uint):

Bağlı olduğu akran sayısı bu değerden azsa düğüm sağlıksız olarak rapor edilir. Varsayılan olarak `1`'dir.

#### `--network-health-max-time-since-msg-received` (duration):

Düğümün bu kadar zaman geçtikten sonra bir mesaj almadığı takdirde sağlıksız olarak rapor edilecektir. Varsayılan olarak `1m`'dir.

#### `--network-health-max-time-since-no-requests` (duration):

Düğümün bu kadar zaman geçtikten sonra herhangi bir istek almadığı takdirde sağlıksız olarak rapor edilecektir. Varsayılan olarak `1m`'dir.

#### `--network-health-max-portion-send-queue-full` (float):

Düğüm, gönderme kuyruğu bu orandan daha fazla doluysa sağlıksız olarak rapor edilir. [0,1] aralığında olmalıdır. Varsayılan olarak `0.9`'dır.

#### `--network-health-max-send-fail-rate` (float):

Düğüm, mesaj gönderimlerinin % bu orandan fazlasının başarısız olması durumunda sağlıksız olarak rapor edilir. [0,1] aralığında olmalıdır. Varsayılan olarak `0.25`'dir.

#### `--network-max-clock-difference` (duration):

Bu düğüm ile akranlar arasındaki maksimum saat farkı. Varsayılan olarak `1m`'dir.

#### `--network-require-validator-to-connect` (bool):

Eğer true ise, bu düğüm yalnızca diğer düğüm bir doğrulayıcıysa, diğer düğüm bir doğrulayıcıysa veya diğer düğüm bir işaretçi ise bağlantısını sürdürecektir.

#### `--outbound-connection-timeout` (duration):

Bir akranla arama yaparken zaman aşımı.

### Mesaj Hız Sınırlaması

Bu bayraklar, gelen ve giden mesajların hız sınırlamasını yönetir. Hız sınırlaması ve aşağıdaki bayraklarla ilgili daha fazla bilgi için Camino-Node'deki `throttling` paketine bakın.

#### `--throttler-inbound-bandwidth-refill-rate` (uint):

Bir akranda maksimum ortalama gelen bant genişliği kullanımı, saniyede byte cinsindendir. `throttling.BandwidthThrottler` arayüzüne bakın. Varsayılan olarak `512`'dir.

#### `--throttler-inbound-bandwidth-max-burst-size` (uint):

Bir düğümün bir seferde kullanabileceği maksimum gelen bant genişliği. `throttling.BandwidthThrottler` arayüzüne bakın. Varsayılan olarak `2 MiB`'dir.

#### `--throttler-inbound-at-large-alloc-size` (uint):

Gelen mesaj sınırlayıcıda büyük tahsis boyutu, byte cinsindendir. Varsayılan olarak `6291456` (6 MiB) olarak ayarlanmıştır.

#### `--throttler-inbound-validator-alloc-size` (uint):

Gelen mesaj sınırlayıcıda doğrulayıcı tahsis boyutu, byte cinsindendir. Varsayılan olarak `33554432` (32 MiB) olarak ayarlanmıştır.

#### `--throttler-inbound-node-max-at-large-bytes` (uint):

Bir düğümün gelen mesaj sınırlayıcısının büyük tahsisinden alabileceği maksimum byte sayısı. Varsayılan olarak `2097152` (2 MiB) olarak ayarlanmıştır.

#### `--throttler-inbound-node-max-processing-msgs` (uint):

Bir düğüm, bu kadar mesajı işlediğinde bir akrandan gelen mesajları okumayı durduracaktır. İşlediği mesaj sayısı bu değerden az olduğunda okumaya geri dönecektir. Varsayılan olarak `1024`'tür.

#### `--throttler-outbound-at-large-alloc-size` (uint):

Giden mesaj sınırlayıcısında büyük tahsis boyutu, byte cinsindendir. Varsayılan olarak `6291456` (6 MiB) olarak ayarlanmıştır.

#### `--throttler-outbound-validator-alloc-size` (uint):

Giden mesaj sınırlayıcısında doğrulayıcı tahsis boyutu, byte cinsindendir. Varsayılan olarak `33554432` (32 MiB) olarak ayarlanmıştır.

#### `--throttler-outbound-node-max-at-large-bytes` (uint):

Bir düğümün giden mesaj sınırlayıcısının büyük tahsisinden alabileceği maksimum byte sayısı. Varsayılan olarak `2097152` (2 MiB) olarak ayarlanmıştır.

### Bağlantı Hız Sınırlaması

#### `--inbound-connection-throttling-cooldown` (duration):

Düğüm, bir IP'den gelen bir bağlantıyı en fazla bu süre içerisinde bir kez yükseltecektir. Varsayılan olarak `10s`'dir. Eğer 0 veya negatif ise, yükseltmenin son durumunu dikkate almayacaktır.

#### `--inbound-connection-throttling-max-conns-per-sec` (uint):

Düğüm, saniyede en fazla bu kadar gelen bağlantı kabul edecektir. Varsayılan olarak `512`'dir.

#### `--outbound-connection-throttling-rps` (uint):

Düğüm, saniyede en fazla bu kadar giden akran bağlantı girişiminde bulunur. Varsayılan olarak `50`'dir.

### Akran Listesi Gossip'i

Düğümler, her bir düğümün güncel bir akran listesine sahip olabilmesi için akranları birbirine bildirimde bulunur. Bir düğüm, `--network-peer-list-num-validator-ips` kadar akranı, `--network-peer-list-validator-gossip-size` kadar doğrulayıcıya ve `--network-peer-list-non-validator-gossip-size` kadar doğrulayıcı olmayan akranlara her `--network-peer-list-gossip-frequency` süresinde bildirir.

#### `--network-peer-list-gossip-frequency` (duration):

Varsayılan olarak `1m`'dir.

#### `--network-peer-list-num-validator-ips` (int):

Varsayılan olarak `20`'dir.

#### `--network-peer-list-validator-gossip-size` (int):

Varsayılan olarak `25`'tir.

#### `--network-peer-list-non-validator-gossip-size` (int):

Varsayılan olarak `25`'tir.

#### `--network-peer-read-buffer-size` (int):

Akran mesajlarının okunduğu buffer'ın boyutu (her akran için bir buffer vardır), varsayılan olarak `8` KiB (8192 Byte) olarak ayarlanmıştır.

#### `--network-peer-write-buffer-size` (int):

Akran mesajlarının yazıldığı buffer'ın boyutu (her akran için bir buffer vardır), varsayılan olarak `8` KiB (8192 Byte) olarak ayarlanmıştır.

### Eklenti Modu

#### `--plugin-mode-enabled` (bool):

Eğer true ise, düğümü bir  olarak çalıştırır. Varsayılan olarak `false`'dır.

### Sanal Makine (VM) Yapılandırmaları {#vm-configs}

#### `--vm-aliases-file` (string):

Sanal Makine ID'leri için takma adları tanımlayan JSON dosyasının yolu. Varsayılan olarak `~/.caminogo/configs/vms/aliases.json` olarak belirlenmiştir. Bu bayrak, `--vm-aliases-file-content` belirtildiğinde göz ardı edilir. Örnek içerik:

```json
{
  "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": [
    "timestampvm",
    "timerpc"
  ]
}
```

Yukarıdaki örnek, `"tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH"` kimliğine sahip sanal makinenin `"timestampvm"` ve `"timerpc"` takma adlarıyla ilişkilendirilmesini sağlar.

`--vm-aliases-file-content` (string):

`--vm-aliases-file` yerine, Sanal Makine ID'leri için base64 kodlu takma adlar belirtmeye sağlar.