# Depolama sağlayıcı
*Bir depolama sağlayıcı*, dosyaları bir ücret karşılığında depolayan bir hizmettir.

## Binaries

Linux/Windows/MacOS ikili dosyaları için `storage-daemon` ve `storage-daemon-cli`'yi [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirebilirsiniz.

## Kaynaklardan Derleme

`storage-daemon` ve `storage-daemon-cli`'yi kaynaklardan derlemek için bu `talimatı` kullanabilirsiniz.

## Anahtar kavramlar
Bu, depolama taleplerini kabul eden ve müşterilerden ödemeleri yöneten bir akıllı sözleşmeden ve dosyaları müşterilere yükleyip sunan bir uygulamadan oluşur. İşte nasıl çalışır:

1. Sağlayıcının sahibi, `storage-daemon`'ı başlatır, ana akıllı sözleşmeyi dağıtır ve parametreleri ayarlar. Sözleşmenin adresi potansiyel müşterilerle paylaşılır.
2. Müşteri, `storage-daemon` kullanarak dosyalarından bir Bag oluşturur ve sağlayıcının akıllı sözleşmesine özel bir iç mesaj gönderir.
3. Sağlayıcının akıllı sözleşmesi, bu özel Bag'i işlemek için bir depolama sözleşmesi oluşturur.
4. Sağlayıcı, blockchain'de isteği bulduğunda, Bag'i indirir ve depolama sözleşmesini etkinleştirir.
5. Müşteri, depolama için ödeme yapabilir. Ödeme almak için sağlayıcı, düzenli olarak sözleşmeye, Bag'i hala depoladıklarına dair kanıt sunar.
6. Eğer depolama sözleşmesindeki fonlar tükenirse, sözleşme etkisiz sayılır ve sağlayıcının Bag'i depolamak zorunda değildir. Müşteri ya sözleşmeyi doldurabilir ya da dosyalarını geri alabilir.

:::info
Müşteri, depolama sözleşmesine mülkiyet kanıtı sağlayarak dosyalarını dilediği zaman geri alabilir. Sözleşme, ardından dosyaları müşteriye bırakır ve kendini devre dışı bırakır.
:::

---

## Akıllı sözleşme

[Akıllı Sözleşme Kaynak Kodu](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont).

## Müşteriler Tarafından Bir Sağlayıcının Kullanımı
Bir depolama sağlayıcısını kullanmak için, onun akıllı sözleşmesinin adresini bilmeniz gerekir. Müşteri, `storage-daemon-cli` aracılığıyla sağlayıcının parametrelerini şu komutla alabilir:
```
get-provider-params <address>
```

### Sağlayıcının parametreleri:

* Yeni depolama sözleşmelerinin kabul edilip edilmeyeceği.
* Minimum ve maksimum *Bag* boyutu (bayt cinsinden).
* Oran - depolamanın maliyeti. Megabayt başına günlük nanoTON cinsinden belirtilmiştir.
* Maksimum aralık - sağlayıcının *Bag* depolaması için kanıt sunması gereken sıklık.

### Depolama talebi

Bir *Bag* oluşturmanız ve aşağıdaki komutla bir mesaj üretmeniz gerekir:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Bilgi:

Bu komut büyük *Bags* için biraz zaman alabilir. Mesaj içeriği ``'e kaydedilecektir (tüm iç mesaj değil). Sorgu kimliği 0 ile `2^64-1` arasında herhangi bir sayı olabilir. Mesaj, sağlayıcının parametrelerini (oran ve maksimum aralık) içerir. Bu parametreler, komutun icrası sonrası yazdırılacak, dolayısıyla gönderilmeden önce iki kez kontrol edilmelidir. Sağlayıcının sahibi parametreleri değiştirirse, mesaj reddedilir; bu nedenle yeni depolama sözleşmesinin koşulları, müşterinin beklediği gibi olacaktır.

Müşteri, bu içeriğe sahip mesajı sağlayıcının adresine göndermelidir. Hata durumunda mesaj göndericiye geri döner (geri atılır). Aksi takdirde, yeni bir depolama sözleşmesi oluşturulacak ve müşteri, [`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3) ile birlikte aynı sorgu kimliği ile bir mesaj alacaktır.

> **Not:** Bu aşamada sözleşme henüz aktif değildir. Sağlayıcı *Bag*'i indirdiğinde, depolama sözleşmesini aktif hale getirecek ve müşteri, [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4) (aynı zamanda depolama sözleşmesinden) ile bir mesaj alacaktır.

Depolama sözleşmesinin bir "müşteri bakiyesi" vardır - bunlar, müşteri tarafından sözleşmeye transfer edilen ve henüz sağlayıcıya ödenmemiş fonlardır. Fonlar, bu bakiyeden kademeli olarak tahsil edilir (megabayt başına gün başına oran kadar bir hızla). Başlangıçta bakiye, müşterinin depolama sözleşmesini oluşturma talebiyle transfer ettiği tutardır. Müşteri daha sonra, depolama sözleşmesine basit transferler yaparak bakiyesini artırabilir (bu, herhangi bir adresten yapılabilir). Kalan müşteri bakiyesi, [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) get metodu ile ikinci değer (`balance`) olarak döndürülür.

### Sözleşme aşağıdaki durumlarda kapatılabilir:

:::info
Depolama sözleşmesi kapatıldığında, müşteri kalan bakiyesi ile birlikte [`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6) ile bir mesaj alır. 
:::

* Oluşturulduktan hemen sonra, aktivasyon öncesinde, eğer sağlayıcı sözleşmeyi kabul etmeyi reddederse (sağlayıcının limiti aşıldıysa veya diğer hatalar varsa).
* Müşteri bakiyesi 0'a ulaşırsa.
* Sağlayıcı, sözleşmeyi isteğe bağlı olarak kapatabilir.
* Müşteri, kendi adresinden ve herhangi bir sorgu kimliği ile [`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2) ile bir mesaj göndererek isteğe bağlı olarak sözleşmeyi kapatabilir.

---

## Sağlayıcıyı Çalıştırma ve Yapılandırma
Depolama Sağlayıcı, `storage-daemon`'ın bir parçasıdır ve `storage-daemon-cli` ile yönetilir. `storage-daemon`'ın `-P` bayrağı ile başlatılması gerekir.

### Ana akıllı sözleşmeyi oluşturma

Bunu `storage-daemon-cli` üzerinden yapabilirsiniz:
```
deploy-provider
```

:::info ÖNEMLİ!
Sağlayıcıyı başlatmak için belirtilen adrese 1 TON göndermenizi talep edecek bir geri dönmeyen mesaj göndermeniz gerekecek. Sözleşmenin oluşturulup oluşturulmadığını `get-provider-info` komutunu kullanarak kontrol edebilirsiniz.
:::

Varsayılan olarak, sözleşme yeni depolama sözleşmelerini kabul etmek üzere ayarlanmamıştır. Aktivasyondan önce sağlayıcıyı yapılandırmanız gerekir. Sağlayıcının ayarları, `storage-daemon`'da depolanan bir yapılandırma ve blockchain'de saklanan sözleşme parametrelerinden oluşur.

### Yapılandırma:
* `max contracts` - aynı anda var olabilecek maksimum depolama sözleşmesi sayısı.
* `max total size` - depolama sözleşmelerindeki toplam *Bag* boyutu için maksimum.

Yapılandırma değerlerini `get-provider-info` kullanarak görüntüleyebilir ve bunları aşağıdaki komutla değiştirebilirsiniz:
```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Sözleşme parametreleri:
* `accept` - yeni depolama sözleşmelerini kabul etme durumu.
* `max file size`, `min file size` - bir *Bag* için boyut limitleri.
* `rate` - depolama maliyeti (megabayt başına günlük nanoTON cinsinden belirtilmiştir).
* `max span` - sağlayıcının ne sıklıkta depolama kanıtı sunması gerektiği.

Parametreleri `get-provider-info` ile görebilir ve aşağıdaki komutla değiştirebilirsiniz:
```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

### Dikkat edilmesi gerekenler

:::warning
Not: `set-provider-params` komutunda yalnızca bazı parametreleri belirleyebilirsiniz. Diğerleri mevcut parametrelerden alınacaktır. Blockchain'deki veriler anında güncellenmediğinden, ardışık `set-provider-params` komutları beklenmedik sonuçlar doğurabilir.
:::

Başlangıçta sağlayıcının bakiyesine 1 TON'dan fazla koymak önerilir, böylece depolama sözleşmeleri ile çalışmak için komisyonları karşılayacak yeterli fon bulunur. Ancak, ilk geri dönmeyen mesajla çok fazla TON göndermeyin.

`accept` parametresini `1` olarak ayarladıktan sonra, akıllı sözleşme, müşterilerden talepleri kabul etmeye ve depolama sözleşmeleri oluşturmaya başlayacak; depolama daemon'ı bunları otomatik olarak işleyerek *Bag*'leri indirecek ve dağıtacaktır.

---

## Sağlayıcı ile İlgili Daha Fazla Çalışma

### Mevcut depolama sözleşmeleri listesi

```
get-provider-info --contracts --balances
```

Her depolama sözleşmesinin bir `Client$` ve `Contract$` bakiyesi vardır; bunlar arasındaki fark, `withdraw ` komutuyla ana sağlayıcı sözleşmesine çekilebilir.

`withdraw-all` komutu, en az `1 TON` mevcut olan tüm sözleşmelerden fonları çeker.

Herhangi bir depolama sözleşmesi, `close-contract ` komutuyla kapatılabilir. Bu, aynı zamanda fonları ana sözleşmeye de aktarır. Müşterinin bakiyesi tükendiğinde, aynı şey otomatik olarak gerçekleşir. Bu durumda *Bag* dosyaları silinecektir (eğer aynı *Bag*'i kullanan başka sözleşmeler yoksa).

### Transfer

Fonları ana akıllı sözleşmeden herhangi bir adrese transfer edebilirsiniz (tutar nanoTON cinsinden belirtilmiştir):
```
send-coins <address> <amount>
send-coins <address> <amount> --message "Bir mesaj"
```

:::info
Sağlayıcı tarafından depolanan tüm *Bag*'ler `list` komutu ile mevcut olup, normal şekilde kullanılabilir. Sağlayıcının işlemlerini kesintiye uğratmamak için bunları silmeyin veya bu depolama daemon'ı başka *Bag*'lerle çalışmak için kullanmayın.
:::