# Depolama daemonu

*Bir depolama daemonu, TON ağında dosya indirmek ve paylaşmak için kullanılan bir programdır. `storage-daemon-cli` konsol programı, çalışan bir depolama daemonunu yönetmek için kullanılır.*

Depolama daemonunun mevcut versiyonu [Testnet](https://github.com/ton-blockchain/ton/tree/testnet) dalında bulunabilir.

---

## Donanım gereksinimleri

* en az 1GHz ve 2 çekirdekli CPU
* en az 2 GB RAM
* en az 2 GB SSD (torrentler için alan hariç)
* 10 Mb/s sabit IP ile ağ bant genişliği

---

## İkilikler

`storage-daemon` ve `storage-daemon-cli`'yi Linux/Windows/MacOS ikilikleri için [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) üzerinden indirebilirsiniz.

---

## Kaynaklardan derleme

`storage-daemon` ve `storage-damon-cli`'yi kaynaklardan derlemek için bu `talimatı` kullanabilirsiniz.

---

## Temel kavramlar

* *Dosya torbası* veya *Torba* - TON Storage üzerinden dağıtılan dosyaların bir koleksiyonu
* TON Storage'ın ağ kısmı, torrentlere benzer bir teknolojiye dayanmaktadır. Bu nedenle *Torrent*, *Dosya torbası* ve *Torba* terimleri birbirinin yerine kullanılacaktır. Ancak bazı farklar vardır: 

  - TON Storage, verileri `ADNL` üzerinden `RLDP` protokolü ile iletir; 
  - Her *Torba* kendi ağ üst yapısı üzerinden dağıtılır; 
  - Merkle yapısı, verimli indirme için büyük parçalar ve mülkiyet kanıtı için küçük parçalar içerebilir; ayrıca, akranları bulmak için `TON DHT` ağı kullanılır.

* Bir *Dosya torbası*, *torrent bilgisi* ve bir veri bloğundan oluşur.
* Veri bloğu, dosya isimleri ve boyutlarının listesi ile birlikte bir *torrent başlığı* ile başlar. Dosyalar, veri bloğunda devam eder.
* Veri bloğu, parçalara (varsayılan olarak 128 KB) bölünür ve bu parçaların SHA256 hash'leri üzerinde bir *merkle ağacı* (TVM hücrelerinden yapılmış) inşa edilir. Bu, bireysel parçaların *merkle kanıtlarını* oluşturmayı ve doğrulamayı, ayrıca yalnızca değiştirilen parçanın kanıtını değiştirerek *Torba*'yı verimli bir şekilde yeniden oluşturmayı sağlar.
* *Torrent bilgisi*, 
    * Parça boyutu (veri bloğu)
    * parçaların boyutları listesi
    * Hash *merkle ağacı*
    * Açıklama - torrentin yaratıcısı tarafından belirtilen herhangi bir metin
* *Torrent bilgisi*, bir TVM hücresine serileştirilir. Bu hücrenin hash'i *BagID* olarak adlandırılır ve *Torba*'yı benzersiz bir şekilde tanımlar.
* *Torba meta* bir dosyadır ve *torrent bilgisi* ile *torrent başlığı* içerir. Bu, bir `.torrent` dosyasının karşılığıdır.

---

## Depolama daemonunu ve storage-daemon-cli'yi başlatma

### Depolama daemonunu başlatmak için bir örnek komut:

```bash
storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db
```

* `-v` - ayrıntı seviyesi (INFO)
* `-C` - global ağ yapılandırması (`global yapılandırmayı indir`)
* `-I` - adnl için IP adresi ve port
* `-p` - konsol arayüzü için TCP portu
* `-D` - depolama daemonu veritabanası için dizin

### storage-daemon-cli yönetimi

Şu şekilde başlatılır:

```bash
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

* `-I` - bu daemonun IP adresi ve portudur (port, yukarıda belirtilen `-p` parametresinde aynı olmalıdır)
* `-k` ve `-p` - bunlar, istemcinin özel anahtarı ve sunucunun genel anahtarıdır (benzer şekilde `validator-engine-console`). Bu anahtarlar daemonun ilk çalıştırılmasında oluşturulur ve `/cli-keys/` dizinine yerleştirilir.

### Komutlar listesi

`storage-daemon-cli` komutlarının listesi `help` komutu ile alınabilir.

Komutların pozisyonel parametreleri ve bayrakları vardır. Boşluk içeren parametreler, tırnak işaretleri (`'` veya `"` ile) içine alınmalıdır; ayrıca boşluklar kaçırılabilir. Diğer kaçırma işlemleri de mevcuttur, örneğin:

```bash
create filename\ with\ spaces.txt -d "Açıklama\nİkinci satır \"açıklama\"\nTers eğik çizgi: \\"
```

Bayrak `--` sonrası tüm parametreler pozisyonel parametrelerdir. Bu, bir eksi ile başlayan dosya adlarını belirtmek için kullanılabilir:

```bash
create -d "Açıklama" -- -filename.txt
```

`storage-daemon-cli`, çalıştırılacak komutları geçirerek etkileşimli olmayan modda çalıştırılabilir:

```bash
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

---

## Dosya Torbası Ekleme

Bir *Dosya Torbası* indirmek için, onun `BagID`'sini bilmeniz veya bir meta-dosyanız olması gerekir. Aşağıdaki komutlar, bir *Torba* eklemek için kullanılabilir:

```bash
add-by-hash <hash> -d dizin
add-by-meta <meta-dosya> -d dizin
```

*Torba*, belirtilen dizine indirilecektir. Bunu atlayabilirsiniz, ardından depolama daemonu dizinine kaydedilecektir.

:::info
Hash, onaltılık biçimde belirtilir (uzunluk - 64 karakter).
:::

Bir *Torba* eklerken, yükleme bilgileri hemen mevcut olacaktır: boyut, açıklama, dosyaların listesi. Hash ile eklerken, bu bilginin yüklenmesini beklemelisiniz.

---

## Eklenen Torbaların Yönetimi

* `list` komutu, *Torbaların* bir listesini çıktı verir. 
* `list --hashes`, tam hash'ler ile bir liste çıktısı verir. 

Tüm sonraki komutlarda, `` ya bir hash (onaltılık) ya da oturum içindeki *Torba*'nın sıralı numarasıdır (bu numara, `list` komutu ile görülebilir). *Torba*'ların sıralı numaraları, storage-daemon-cli'nin yeniden başlatılmasında kaydedilmez ve etkileşimli olmayan modda mevcut değildir.

### Yöntemler

* `get ` - *Torba* hakkında ayrıntılı bilgi verir: açıklama, boyut, indirme hızı, dosyaların listesi.
* `get-peers ` - akranların listesini verir.
* `download-pause `, `download-resume ` - indirmeyi duraklatır veya devam ettirir.
* `upload-pause `, `upload-resume ` - yüklemeyi duraklatır veya devam ettirir.
* `remove ` - *Torba*'yı siler. `remove --remove-files` ayrıca tüm dosyaları siler. *Torba*, depolama daemonunun dahili dizininde kaydediliyorsa, dosyalar her durumda silinecektir.

---

## Kısmi İndirme, Öncelikler

:::info
Bir *Torba* eklediğinizde, içinden hangi dosyaları indirmek istediğinizi belirtebilirsiniz:
:::

```bash
add-by-hash <hash> -d dizin --partial dosya1 dosya2 dosya3
add-by-meta <meta-dosya> -d dizin --partial dosya1 dosya2 dosya3
```

### Öncelikler

*Dosya Torbası* içindeki her dosyanın bir önceliği vardır, bu da 0 ile 255 arasında bir sayıdadır. Öncelik 0, dosyanın indirilmeyeceği anlamına gelir. `--partial` bayrağı, belirlenen dosyaları öncelik 1, diğerlerini 0 olarak ayarlar.

Daha önce eklenmiş bir *Torba*nın önceliklerini aşağıdaki komutlarla değiştirebilirsiniz:

* `priority-all  ` - tüm dosyalar için.
* `priority-idx   ` - bir dosya için numara bazında (get komutu ile görün).
* `priority-name   ` - bir dosya için isim bazında.

Öncelikler, dosyaların listesi indirilmeden bile ayarlanabilir.

---

## Dosya Torbası Oluşturma

Bir *Torba* oluşturmak ve dağıtmaya başlamak için `create` komutunu kullanın:

```bash
create <yol>
```

``, ya tek bir dosyayı ya da bir dizini işaret edebilir. Bir *Torba* oluştururken, bir açıklama belirtebilirsiniz:

```bash
create <yol> -d "Dosya Torbası açıklaması"
```

*Torba* oluşturulduktan sonra, konsol, onun hakkında ayrıntılı bilgi verecek (hash dahil, bu `BagID` olacak ve *Torba* bu ID ile tanımlanacaktır) ve daemon torrent dağıtmaya başlayacaktır. 

### Ek seçenekler

`create` için ek seçenekler:

* `--no-upload` - daemon, akranlara dosyaları dağıtmayacak. Yükleme `upload-resume` ile başlatılabilir.
* `--copy` - dosyalar, depolama daemonunun dahili dizinine kopyalanır.

*Torba*yı indirmek için, diğer kullanıcıların yalnızca hash'ini bilmeleri yeterlidir. Torrent meta dosyasını da kaydedebilirsiniz:

```bash
get-meta <BagID> <meta-dosya>