---
description: Eğitimin sonunda, TON Blockchain üzerinde çok imzalı bir sözleşme dağıtmış olacaksınız.
---

# Fift ile basit bir çok imzalı sözleşme oluşturun

:::caution advanced level
Bu bilgi **çok düşük seviyeli**. Yeni başlayanlar için anlaşılması zor olabilir ve `fift` anlamak isteyen ileri düzey kişiler için tasarlanmıştır. Fift'in kullanımı günlük görevlerde zorunlu değildir.
:::

## 💡 Genel Bakış

Bu eğitim, çok imzalı sözleşmenizi nasıl dağıtacağınızı öğrenmenize yardımcı olacaktır.  
(n, k)-çok imzalı sözleşmesi, n özel anahtar sahibine sahip bir çok imzalı cüzdandır; istek (yani emir, sorgu) en az k imza toplandığında mesaj göndermeyi kabul eder.

Orijinal çok imzalı sözleşme kodu ve akifoq tarafından yapılan güncellemeler temel alınarak:
- [orijinal TON Blockchain çok imzalı-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) çok imzalı ile çalışmak için fift kütüphaneleri.

:::tip starter tip
Çok imzalıyla yeni tanışanlar için: [Çok İmzalı Teknoloji Nedir? (video)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 Neler öğreneceksiniz

- Basit bir çok imzalı cüzdan nasıl oluşturulur ve özelleştirilir.
- Çok imzalı cüzdan nasıl dağıtılır lite-client kullanılarak.
- İstek nasıl imzalanır ve blockchain'e mesaj olarak gönderilir.

## ⚙ Ortamınızı ayarlayın

Yolculuğumuza başlamadan önce, ortamınızı kontrol edin ve hazırlayın.

- `func`, `fift`, `lite-client` ikili dosyalarını ve `fiftlib`yi `Kurulum` bölümünden indirin.
- [repo](https://github.com/akifoq/multisig) klonlayın ve CLI'da dizinini açın.

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 Hadi başlayalım!

1. Kodu fift'e derleyin.
2. Çok imzalı sahiplerin anahtarlarını hazırlayın.
3. Sözleşmenizi dağıtın.
4. Blockchain'deki dağıtılan çok imzalı cüzdan ile etkileşimde bulunun.

### Sözleşmeyi derleyin

Sözleşmeyi Fift ile derlemek için:

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### Çok imzalı sahiplerin anahtarlarını hazırlayın

#### Katılımcı anahtarlarını oluşturun

Bir anahtar oluşturmak için şunu çalıştırmanız gerekir:

```cpp
fift -s new-key.fif $KEY_NAME$
```

* Burada `KEY_NAME`, özel anahtarın yazılacağı dosyanın adıdır.

Örneğin:

```cpp
fift -s new-key.fif multisig_key
```

Özel anahtar içeren bir `multisig_key.pk` dosyası alacağız.

#### Genel anahtarları toplayın

Ayrıca, script genel anahtarı aşağıdaki formatta verecektir:

```
Genel anahtar = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

`"Genel anahtar = "` ifadesinden sonrasını bir yere kaydetmelisiniz!

Bunu `keys.txt` dosyasına kaydedelim. Her satırda bir Genel Anahtar olacak şekilde, bu önemlidir.

### Sözleşmenizi dağıtın

#### Lite-client aracılığıyla dağıtın

Tüm anahtarları oluşturduktan sonra, genel anahtarları bir metin dosyası olan `keys.txt` içinde toplamanız gerekir.

Örneğin:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

Bundan sonra, şunu çalıştırmanız gerekir:

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

* `$WALLET_ID$` - mevcut anahtara atanan cüzdan numarası. Aynı anahtar ile her yeni cüzdan için benzersiz bir `$WALLET_ID$` kullanılması önerilir.
* `$KEYS_COUNT$` - onay için gereken anahtar sayısı, genellikle genel anahtar sayısına eşittir.

:::info wallet_id explained
Aynı anahtarlarla birçok cüzdan oluşturmak mümkündür (Alice anahtarı, Bob anahtarı). Eğer Alice ve Bob'un zaten bir hazineyi varsa ne olacak? Bu nedenle `$WALLET_ID$` burada çok önemlidir.
:::

Script aşağıdakine benzer bir çıktı verecektir:

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Adres wallet.addr dosyasına kaydediliyor)

Atlamaya kapalı adres (ilk kurulum için): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Atlamaya açık adres (ilerideki erişim için): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Cüzdan oluşturma sorgusu wallet-create.boc dosyasına kaydedildi)
```

:::info 
Eğer "genel anahtar 48 karakter uzunluğunda olmalıdır" hatası alıyorsanız, lütfen `keys.txt` dosyasının unix tipi kelime sarılması - LF ile olduğundan emin olun. Örneğin, kelime sarımını Sublime metin düzenleyici üzerinden değiştirebilirsiniz.
:::

:::tip
Atlamaya açık adresin korunması daha iyidir - bu cüzdanın adresidir.
:::

#### Sözleşmenizi etkinleştirin

Yeni oluşturduğumuz _hazinemize_ bazı TON göndermelisiniz. Örneğin 0.5 TON. Test ağı jetonlarını [@testgiver_ton_bot](https://t.me/testgiver_ton_bot) aracılığıyla gönderebilirsiniz.

Bundan sonra, lite-client'ı çalıştırmalısınız:

```bash
lite-client -C global.config.json
```

:::info global.config.json nereden alınır?
Ana ağ için taze bir yapılandırma dosyası `global.config.json` veya test ağı için [testnet](https://ton.org/testnet-global.config.json) alabilirsiniz.
:::

Lite-client'ı başlattıktan sonra, bağlantının başarılı olduğunu kontrol etmek için lite-client konsolunda `time` komutunu çalıştırmalısınız:

```bash
time
```

Tamam, lite-client çalışıyor!

Sonrasında cüzdanı dağıtmak için şu komutu çalıştırmalısınız:

```
sendfile ./wallet-create.boc
```

Bundan sonra cüzdan bir dakika içinde çalışmaya hazır olacaktır.

---

### Çok imzalı cüzdan ile etkileşime geçin

#### Bir istek oluşturun

Öncelikle bir mesaj isteği oluşturmalısınız:

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

* `$ADDRESS$` - paraların gönderileceği adres
* `$AMOUNT$` - paraların miktarı
* `$MESSAGE$` - derlenmiş mesaj için dosya adı.

Örneğin:

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
İşleminiz için yorum eklemek istiyorsanız `-C comment` parametresini kullanın. Daha fazla bilgi almak için _create-msg.fif_ dosyasını parametresiz çalıştırın.
:::

#### Bir cüzdan seçin

Daha sonra parayı göndereceğiniz bir cüzdan seçmeniz gerekir:

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```
Burada
* `$WALLET_ID$` — bu çok imzalı sözleşme ile teminat altına alınmış cüzdanın kimliğidir.
* `$AWAIT_TIME$` — akıllı sözleşmenin çok imzalı cüzdan sahiplerinden istek için imza alacağı süredir.
* `$MESSAGE$` — önceki aşamada oluşturulan mesaj boc-dosyasının adıdır.

:::info
Eğer `$AWAIT_TIME$` süresi geçmeden önce istek imzalanmazsa, istek geçersiz hale gelir. Genellikle, `$AWAIT_TIME$` birkaç saat (7200 saniye) kadar sürer.
:::

Örneğin:
```
fift -s create-order.fif 0 message -t 7200
```

Hazır dosya `order.boc` içinde kaydedilecektir.

:::info
`order.boc`, anahtar sahipleriyle paylaşılmalıdır; onların bunu imzalaması gerekmektedir.
:::

#### Kendi imzanızı ekleyin

İmzalamak için şunları yapmalısınız:

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

* `$KEY$` - imza atacağınız özel anahtarı içeren dosyanın adı, uzantısı olmadan.
* `$KEY_INDEX$` - `keys.txt` dosyasındaki belirli anahtarın indeksidir (sıfır tabanlı).

Örneğin, `multisig_key.pk` dosyamız için:

```
fift -s add-signature.fif multisig_key 0
```

#### Bir mesaj oluşturun

Herkes siparişi imzaladıktan sonra, bunun cüzdan için bir mesaja dönüşmesi ve şu komut ile tekrar imzalanması gerekir:

```bash
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

Bu durumda, cüzdan sahibinin sadece bir imzası yeterli olacaktır. Amaç, geçersiz imzalarla bir sözleşme saldırısı yapılamamasıdır.

Örneğin:

```bash
fift -s create-external-message.fif wallet multisig_key 0
```

#### İmzanızı TON Blockchain'e gönderin

Bundan sonra, light client'ı tekrar başlatmalısınız:

```bash
lite-client -C global.config.json
```

Ve son olarak, imzamızı göndermek istiyoruz! Sadece şu komutu çalıştırın:

```bash
sendfile wallet-query.boc
```

Eğer diğer herkes isteği imzaladıysa, bu tamamlanacaktır!

Başardınız, ha-ha! 🚀🚀🚀

## Sırada ne var?

- [TON'daki çok imzalı cüzdanlar hakkında daha fazla bilgi okuyun](https://github.com/akifoq/multisig) akifoq'tan