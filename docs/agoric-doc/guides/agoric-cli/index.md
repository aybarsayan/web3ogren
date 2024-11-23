# Agoric CLI Referansı

## agoric help

Agoric CLI komutlarını ve argümanlarını kısa tanımları ile birlikte gösterir.

**Kullanım**:

```sh
agoric [komut]
```

Varsayılan olarak, tüm komutların listesini gösterir:

```
  cosmos                             Agoric Cosmos zinciri için istemci
  ibc-setup                          Inter Blockchain İletişimi kur
  open [options]                                 Agoric UI'yi başlat
  init [options]                         adında yeni bir Dapp dizini oluştur
  set-defaults [options]     için yapılandırma dosyalarını  içinde güncelle
  ibc-relayer                                    Inter Blockchain İletişim aktarıcısını çalıştır
  install [force-sdk-version]                    Dapp bağımlılıklarını yükle
  follow [options]                 Agoric Casting liderini takip et
  run  [script-args...]                  Tüm kullanıcı ayrıcalıklarınla ve bazı Agoric bağışlarıyla bir script çalıştır
  deploy [options] [script...]                   Tüm kullanıcı ayrıcalıklarınla yerel Agoric VM üzerinde birden fazla script çalıştır
  publish [options] [bundle...]                  Cosmos zincirine bir paket yayınla
  wallet [options]                               Cüzdan komutları
  start [options] [profile] [args...]            Agoric VM'yi başlat
  help [command]                                 Komut hakkında yardım göster
```

## agoric run

Tüm kullanıcı ayrıcalıklarınla ve bazı Agoric bağışlarıyla bir script çalıştır.

**Kullanım**:

```sh
agoric run [options]  [script-args...]
```

Ayrıca bakınız:

-  tartışması  2023-07

## agoric follow

Agoric (Casting)[https://www.npmjs.com/package/@agoric/casting] liderini (veya doğrulayıcıyı) takip ederek vstorage sorgusunu destekler ve bazı marshalling konvansiyonlarını uygular.

**Kullanım**:

```sh
agoric follow [options] 
```

**Opsiyonel argümanlar**:

- **--proof &lt;strict | optimistic | none>**: kanıt modunu ayarla (varsayılan: "optimistic")
- **--sleep &lt;seconds>**: polling arasına `seconds>` kadar uyku ver (kesirli olabilir) (varsayılan: 5)
- **--jitter &lt;max-seconds>**: `` kadar jitter (kesirli olabilir) (varsayılan: 5)
- **-F, --first-value-only**: her `` için yalnızca ilk değeri göster
- **-o, --output &lt;format>**: değer çıktı formatı (varsayılan: "justin")
- **-l, --lossy**: her örnek aralığı için yalnızca en son değeri göster
- **-b, --block-height**: her değerin saklandığı ilk blok yüksekliğini göster
- **-c, --current-block-height**: her değerin rapor edildiği anda geçerli blok yüksekliğini göster
- **-B, --bootstrap &lt;config>**: ağ bootstrap yapılandırması
- **-h, --help**: komut hakkında yardım göster

**Örnekler**:

```sh
$ agoric follow -lF :published.agoricNames.brand
[
  [
    "BLD",
    slotToVal("board0566","Alleged: BLD markası"),
  ],
  [
    "IST",
    slotToVal("board0257","Alleged: IST markası"),
  ],
...
]
```

## ~~agoric init~~

_ nedeniyle kullanılmaktan kaldırılmıştır._

`dapp-template` argümanından içerikleri kopyalayarak `` adında yeni bir dapp dizini oluşturur.

**Kullanım**:

```
agoric init [options] 
```

- **projectName**: Başlatılacak yeni projenin adı.

**Opsiyonel argümanlar**:

- **--dapp-template &lt;name>**: `` ile belirtilen şablonu kullan. Bu argüman geçilmezse, varsayılan dapp `dapp-fungible-faucet` kullanılır.
- **--dapp-base &lt;base-url>**: Dapp şablonunun bulunabileceği yer. Bu argüman geçilmezse, varsayılan değer `git://github.com/Agoric/` kullanılır.
- **-V**, **--version**: Sürüm numarasını yazdırır.
- **--docker-tag &lt;tag>**: Başlatılan Docker konteynerlerinin belirtilen etiketini kullanır. Varsayılan olarak `latest` kullanılır.
- **--sdk**: Bu programı içeren Agoric SDK'sını kullanır.
- **-v**, **--verbose**: Komutu ayrıntılı modda çalıştırır.
- **-h**, **--help**: Komut hakkında yardım gösterir.

**Örnekler**:

```
agoric init demo
```

"demo" adında bir dizin oluşturur ve varsayılan dapp-template _dapp-fungible-faucet_ içeriğini kopyalar.

```
agoric init my-first-contract --dapp-template dapp-simple-exchange
```

_dapp-simple-exchange_ dapp-template içeriğini kopyalayarak _my-first-contract_ adında bir dizin oluşturur.

```
agoric init my-contract --dapp-template dapp-skeleton --dapp-base file:///home/contracts
```

_file:///home/contracts_ URL'sinde bulunan _dapp-skeleton_ adında bir dapp-template içeriğini kopyalayarak _my-contract_ adında bir dizin oluşturur.

## ~~agoric install~~

_Kullanılmaktan kaldırılmıştır._

Dapp JavaScript bağımlılıklarını yükler. Bu işlem biraz zaman alabilir. Bunun yerine yerleşik npm yükleme araçları yerine bunu kullanıyorsunuz. Bunun nedeni, hem bir SDK (`--sdk`) hem de NPM modunun bulunmasıdır. Şu anda yalnızca SDK modunu destekliyoruz; bu da dapp’inizi SDK bağımlılıklarına bağlamanıza izin verir. Bu, SDK bağımlılıkları ile paketinizi değiştirmenize (ve değişiklikleri görmenize) olanak tanır ve bu paketleri Yarn veya NPM ile kaydetme ihtiyacını ortadan kaldırır.

**Sözdizimi**:

```
agoric install 
```

**Opsiyonel argümanlar**:

- **-V**, **--version**: Sürüm numarasını yazdırır.
- **--docker-tag &lt;tag>**: Başlatılan Docker konteynerlerinin belirtilen etiketini kullanır. Varsayılan olarak `latest` kullanılır.
- **--sdk**: Bu programı içeren Agoric SDK'sını kullanır.
- **-v**, **--verbose**: Komutu ayrıntılı modda çalıştırır.
- **-h**, **--help**: Komut hakkında yardım gösterir.

## agoric start local-chain

**Kullanım**:

```
agoric start local-chain [portNum] -- [initArgs] - yerel zincir
```

Seçenekler:
  --reset                      VM durumunu başlatmadan önce temizle
  --no-restart                 VM'yi gerçekten başlatma
  --pull                       Docker tabanlı VM için, çalıştırmadan önce görüntüyü çek
  --rebuild                    Çalıştırmadan önce VM bağımlılıklarını yeniden yapılandır
  -h, --help                   komut hakkında yardım göster

## ~~agoric start~~

_Beta Özellik: Kullanımdan kaldırılmıştır._

Sözleşmelerin çalışabileceği bir Agoric VM çalıştırır.

**Sözdizimi**:

```
agoric start 
```

**Opsiyonel argümanlar**:

- **profil**: VM için ortamı belirtir. Bu argümanı `testnet` olarak ayarlamak, VM'yi mevcut testnetimize bağlar. Bu argüman geçilmezse, varsayılan değer `dev` (geliştirme modu) kullanılır.
- **--reset**: Başlatmadan önce tüm VM durumunu temizler.
- **--pull**: Docker tabanlı VMs için, çalıştırmadan önce görüntüleri çek.
- **--delay [seconds]**: Simüle edilmiş zincirdeki işlem süresini hesaba katarak her gidiş-dönüşü belirtilen saniye kadar geciktirir. Varsayılan değer `1`dir; bu, dönüş sayısını hesaplamanızı kolaylaştırır. Bu argüman geçilmezse, gecikme süresi FAKE_CHAIN_DELAY ortam değişkeninin sayısal değerine (varsa sıfır) ayarlanır.
- **--inspect [host[:port]]**: host:port üzerinde denetleyiciyi etkinleştirir. Varsayılan değer "127.0.0.1:9229"dur.
- **--inspect-brk [host[:port]]**: host:port üzerinde denetleyiciyi etkinleştirir ve script başlangıcında durur. Varsayılan değer "127.0.0.1:9229"dur.
- **-V**, **--version**: Sürüm numarasını yazdırır.
- **--docker-tag &lt;tag>**: Başlatılan Docker konteynerlerinin belirtilen etiketini kullanır. Varsayılan olarak `latest` kullanılır.
- **--sdk**: Bu programı içeren Agoric SDK'sını kullanır.
- **-v**, **--verbose**: Komutu ayrıntılı modda çalıştırır.
- **-h**, **--help**: Komut hakkında yardım gösterir.

**Örnekler**:

```
agoric start --reset
```

Agoric VM'yi yeniden başlatır ve bunu yapmadan önce tüm mevcut durumu temizler.

```
agoric start --pull
```

Docker tabanlı VMs'yi çalıştırmadan önce görüntüyü çeker.

```
agoric start --delay 5
```

Simüle edilmiş zincire her gidiş-dönüş için 5 saniyelik işlem süresi yapılandırır.

## ~~agoric deploy~~

_Beta Özellik: Kullanımdan kaldırılmıştır._

Yerel Agoric VM üzerinde bir veya daha fazla dağıtım scriptini çalıştırır. İsteğe bağlı olarak, VM'ye bağlanmak için istediğiniz host ve portu belirtebilirsiniz.

**Sözdizimi**:

```
agoric deploy 
```

**Opsiyonel argümanlar**:

- **Pozisyonel Argümanlar**:
  - ``: Yerel Agoric örneği üzerinde çalıştırılacak dağıtım script(i) /leri. En az bir tane belirtmek zorundasınız; daha fazlasını da belirtebilirsiniz.
- **Seçenekler**:
  - `--hostport `: VM'ye bağlanacağınız host ve port.
  - `-h`, `--help`: `deploy` komutu için yardım gösterir.

**Örnekler**:

```
agoric deploy ./contract/deploy.js ./api/deploy.js
```

Yerel Agoric VM üzerinde belirtilen `deploy.js` scriptlerini çalıştırır.

```
agoric deploy --hostport 128.7.3.139:99 ./contract/deploy.js
```

Belirtilen VM host 128.7.3.139 ve port 99 üzerinde `deploy.js` scriptini çalıştırır.

## ~~agoric open~~

_Beta Özellik: Kullanımdan kaldırılmıştır._

Agoric UI'yi başlatır. Varsayılan olarak yalnızca UI gösterilir, REPL (Okuma-Değerlendirme-Yazdırma-Döngüsü) değil. Hem UI hem de REPL'yi göstermek veya yalnızca REPL'yi göstermek için aşağıdaki `--repl` opsiyonel argümanına bakın.

**Sözdizimi**:

```
agoric open 
```

**Opsiyonel argümanlar**:

- **Pozisyonel Argümanlar**: Yok
- **Seçenekler**:
  - `--hostport `: VM'ye bağlanacağınız host ve port (varsayılan: "127.0.0.1:8000").
  - `--no-browser`: UI'nin URL'sini göster, ancak bir tarayıcı açma.
  - `--repl [yes | only | no]`: Read-Eval-Print döngüsünü gösterme. Varsayılan olarak `yes` olarak ayarlanır (aşağıdaki Örnekler bölümüne bakın).
  - `-h`, `--help`: `open` komutu hakkında yardım gösterir.

**Örnekler**:

```
agoric open
```

Tarayıcıda yalnızca Agoric UI'yi başlatır.

```
agoric open --no-browser
```

Agoric UI'nin URL'sini gösterir, ancak bir tarayıcıda açmaz.

```
agoric open --repl only
```

Tarayıcıda yalnızca Agoric UI için REPL'yi gösterir.

```
agoric open --repl
```

Tarayıcıda hem Agoric UI'yi hem de REPL'yi gösterir (`--repl` varsayılan olarak `yes`dir).