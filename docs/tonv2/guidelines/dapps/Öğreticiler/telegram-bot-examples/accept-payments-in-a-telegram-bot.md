---
description: Bu makalede, bir Telegram botunda ödeme kabul etme sürecini anlatacağız.
---

# TON'da ödemeli vitrin botu

Bu makalede, bir Telegram botunda ödeme kabul etme sürecini anlatacağız.

## 📖 Öğrenecekleriniz

Bu makalede şunları öğreneceksiniz:

- Python + Aiogram kullanarak bir Telegram botu oluşturmak
- Genel TON API'si (TON Center) ile çalışmak
- SQlite veritabanı ile çalışmak

Ve nihayetinde: Önceki adımlardan elde edilen bilgilerle bir Telegram botunda ödeme kabul etme yöntemini.

## 📚 Başlamadan önce

En son Python sürümünü kurduğunuzdan ve aşağıdaki paketleri yüklediğinizden emin olun:

- aiogram
- requests
- sqlite3

## 🚀 Hadi başlayalım!

Aşağıdaki sırayı takip edeceğiz:

1. SQlite veritabanı ile çalışmak
2. Genel TON API'si (TON Center) ile çalışmak
3. Python + Aiogram kullanarak bir Telegram botu oluşturmak
4. Kazanç!

Proje dizinimizde aşağıdaki dört dosyayı oluşturalım:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## Yapılandırma

`config.json` dosyasında bot tokenimizi ve genel TON API anahtarımızı saklayacağız.

```json
{
  "BOT_TOKEN": "Bot tokeniniz",
  "MAINNET_API_TOKEN": "Mainnet API tokeniniz",
  "TESTNET_API_TOKEN": "Testnet API tokeniniz",
  "MAINNET_WALLET": "Mainnet cüzdanınız",
  "TESTNET_WALLET": "Testnet cüzdanınız",
  "WORK_MODE": "testnet"
}
```

`config.json` dosyasında hangi ağı kullanacağımıza karar veriyoruz: `testnet` veya `mainnet`.

## Veritabanı

### Veritabanı oluşturma

Bu örnek yerel bir Sqlite veritabanı kullanmaktadır.

`db.py` dosyasını oluşturun.

Veritabanı ile çalışmaya başlamak için sqlite3 modülünü ve zamanla çalışmak için bazı modülleri içe aktarmamız gerekiyor.

```python
import sqlite3
import datetime
import pytz
```

- `sqlite3`—sqlite veritabanı ile çalışmak için modül
- `datetime`—zamanla çalışmak için modül
- `pytz`—zaman dilimleri ile çalışmak için modül

Sonraki adımda veritabanına bağlanmak ve onunla çalışmak için bir cursor oluşturmamız gerekiyor:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

Eğer veritabanı mevcut değilse, otomatik olarak oluşturulacaktır.

Artık tabloları oluşturabiliriz. İki tane tablomuz var.

#### İşlemler:

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source`—ödeme yapanın cüzdan adresi
- `hash`—işlem hash'i
- `value`—işlem değeri
- `comment`—işlem notu

#### Kullanıcılar:

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id`—Telegram kullanıcı ID'si
- `username`—Telegram kullanıcı adı
- `first_name`—Telegram kullanıcısının adı
- `wallet`—kullanıcı cüzdan adresi

> **Not**: `users` tablosunda kullanıcıları saklarız :) Telegram ID'si, @username, adı ve cüzdanı. Cüzdan, ilk başarılı ödemeyle veritabanına eklenir.

`transactions` tablosu doğrulanmış işlemleri saklar. Bir işlemi doğrulamak için hash, source, value ve comment'e ihtiyacımız var.

Bu tabloları oluşturmak için aşağıdaki fonksiyonu çalıştırmamız gerekiyor:

```python
cur.execute('''CREATE TABLE IF NOT EXISTS transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                        NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
)''')
locCon.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS users (
    id         INTEGER       UNIQUE
                            NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
)''')
locCon.commit()
```

Bu kod tabloları daha önce oluşturulmamışlarsa oluşturacaktır.

### Veritabanı ile çalışma

Durumu analiz edelim:
Kullanıcı bir işlem yaptı. Bunu nasıl doğrularız? Aynı işlemin iki kez onaylanmadığından nasıl emin oluruz?

transactions da body_hash var; bu sayede veritabanında bir işlemin olup olmadığını kolayca anlayabiliriz.

Kesin olduğumuz işlemleri veritabanına ekleriz. `check_transaction` fonksiyonu, bulunan işlemin veritabanında olup olmadığını kontrol eder.

`add_v_transaction` işlemi transactions tablosuna ekler.

```python
def add_v_transaction(source, hash, value, comment):
    cur.execute("INSERT INTO transactions (source, hash, value, comment) VALUES (?, ?, ?, ?)",
                (source, hash, value, comment))
    locCon.commit()
```

```python
def check_transaction(hash):
    cur.execute(f"SELECT hash FROM transactions WHERE hash = '{hash}'")
    result = cur.fetchone()
    if result:
        return True
    return False
```

`check_user`, kullanıcının veritabanında olup olmadığını kontrol eder ve değilse ekler.

```python
def check_user(user_id, username, first_name):
    cur.execute(f"SELECT id FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()

    if not result:
        cur.execute("INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)",
                    (user_id, username, first_name))
        locCon.commit()
        return False
    return True
```

Kullanıcı, tablodaki bir cüzdanı saklayabilir. İlk başarılı alışverişle eklenir. `v_wallet` fonksiyonu, kullanıcının ilişkili bir cüzdanı olup olmadığını kontrol eder. Eğer varsa, onu döner. Yoksa ekler.

```python
def v_wallet(user_id, wallet):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    if result[0] == "none":
        cur.execute(
            f"UPDATE users SET wallet = '{wallet}' WHERE id = '{user_id}'")
        locCon.commit()
        return True
    else:
        return result[0]
```

`get_user_wallet` basitçe kullanıcının cüzdanını döndürür.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` kullanıcının ödeme listesini döndürür. Bu fonksiyon, kullanıcının bir cüzdanı olup olmadığını kontrol eder. Eğer varsa, ödeme listesini döndürür.

```python
def get_user_payments(user_id):
    wallet = get_user_wallet(user_id)

    if wallet == "none":
        return "Cüzdanınız yok"
    else:
        cur.execute(f"SELECT * FROM transactions WHERE source = '{wallet}'")
        result = cur.fetchall()
        tdict = {}
        tlist = []
        try:
            for transaction in result:
                tdict = {
                    "value": transaction[2],
                    "comment": transaction[3],
                }
                tlist.append(tdict)
            return tlist

        except:
            return False
```

## API

_Üçüncü taraf API'leri aracılığıyla blok zinciri ile etkileşim kurma yeteneğine sahibiz. Bu hizmetler sayesinde geliştiriciler kendi düğümlerini çalıştırma ve API'lerini özelleştirme adımını atlayabilir._

### Gereken İstekler

Aslında, kullanıcının bize gerekli miktarı transfer ettiğini doğrulamak için neye ihtiyacımız var?

Sadece cüzdanımıza yapılmış en son gelen transferlere bakmamız ve aralarında doğru adresle doğru miktarda (ve belki de benzersiz bir notla) bir işlem bulmamız gerekiyor.
Bunun için TON Center'da bir `getTransactions` yöntemi var.

### getTransactions

Varsayılan olarak, bunu uygularsak son 10 işlemi alırız. Ancak, daha fazlasını da belirtebiliriz, ancak bu bir yanıtın süresini biraz uzatır. Ve büyük olasılıkla o kadarına ihtiyacınız yoktur.

> **Önemli:** Daha fazla istiyorsanız, her işlemin `lt` ve `hash`'i vardır. Örneğin, 30 işlemi gözlemleyebilirsiniz; eğer aralarındaki doğru işlem bulunamazsa, son işlemden `lt` ve `hash`'i alıp isteğe ekleyebilirsiniz.

Böylece bir sonraki 30 işlemi alıyorsunuz, devam edebilirsiniz.

Örneğin, test ağında `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5` cüzdanı var, bazı işlemleri mevcut:

Aşağıdaki [sorgu](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&to_lt=0&archival=true) ile bu adresten gelen iki işlemi alacağız (şu anda ihtiyaç duyulmayan bazı bilgiler gizlenmiştir, yukarıdaki bağlantıda tam yanıtı görebilirsiniz).

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1944556000003",
        // highlight-next-line
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "message": "Deniz esintisi 🌊"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1943166000003",
        // highlight-next-line
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Bahar ormanı 🌲"
      },
      "out_msgs": []
    }
  ]
}
```

Bu adresten en son iki işlemi aldık. `lt` ve `hash` ekleyerek tekrar sorguladığımızda iki işlem daha alacağız. Ancak ikinci işlem bir sonraki işlem olacak. Yani bu adrese ait ikinci ve üçüncü işlemleri alacağız.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        "lt": "1944556000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Bahar ormanı 🌲"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "message": "İkinci"
      },
      "out_msgs": []
    }
  ]
}
```

İstek şu şekilde olacak [bu.](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&lt=1943166000003&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D&to_lt=0&archival=true)

Ayrıca `detectAddress` yöntemine de ihtiyacımız var.

Test ağındaki bir Tonkeeper cüzdan adresinin örneği: `kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`. Explorer'da işlemi ararsak, yukarıdaki adres yerine: `EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R` görünüyor.

Bu yöntem bize “doğru” adresi döndürüyor.

```json
{
  "ok": true,
  "result": {
    "raw_form": "0:b3409241010f85ac415cbf13b9b0dc6157d09a39d2bd0827eadb20819f067868",
    "bounceable": {
      "b64": "EQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
      // highlight-next-line
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    }
  }
}
```

`b64url`'ye ihtiyacımız var.

Bu yöntem, kullanıcının adresini doğrulamamızı sağlar.

Genel olarak, ihtiyacımız olan her şey bu.

### API istekleri ve onlarla ne yapılacağı

IDE'ye geri dönelim. `api.py` dosyasını oluşturun.

Gerekli kütüphaneleri içe aktarın.

```python
import requests
import json
# Veritabanına buradan işlemleri eklemek uygun olduğu için db modülümüzü içe aktaracağız
import db
```

- `requests`—API'ye istek yapmak için
- `json`—json ile çalışmak için
- `db`—sqlite veritabanımızla çalışmak için

İsteklerin başlangıcı için iki değişken oluşturuyoruz.

```python
# Bu, isteklerimizin başlangıcı
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

config.json dosyasından tüm API tokenlerini ve cüzdanları alın.

```python
# Hangi ağda çalıştığımızı öğren
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']
```

Ağa göre gerekli verileri alıyoruz.

```python
if WORK_MODE == "mainnet":
    API_BASE = MAINNET_API_BASE
    API_TOKEN = MAINNET_API_TOKEN
    WALLET = MAINNET_WALLET
else:
    API_BASE = TESTNET_API_BASE
    API_TOKEN = TESTNET_API_TOKEN
    WALLET = TESTNET_WALLET
```

İlk istek fonksiyonumuz `detectAddress`.

```python
def detect_address(address):
    url = f"{API_BASE}detectAddress?address={address}&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    try:
        return response['result']['bounceable']['b64url']
    except:
        return False
```

Girişte tahmini bir adresimiz var ve çıktıda ya bizim için gerekli olan “doğru” adresi ya da False döndürüyoruz.

Bir istek sonunda bir API anahtarının eklenmiş olduğunu fark edebilirsiniz. Bu, API'ye yapılan istek sayısını sınırlamak için gereklidir. Bunun olmaması durumunda, sınırlama ile bir istek yapabiliriz.

Sonraki `getTransactions` fonksiyonu:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

Bu fonksiyon, `WALLET`'ımıza yönelik son 30 işlemi döndürmektedir.

Burada `archival=true` ifadesi, yalnızca blok zincirinin tam geçmişine sahip bir düğümden işlem almak için gereklidir.

Çıktıda [0], [1], ..., [29] biçiminde işlemler listesi—kısaca bir sözlükler listesi alıyoruz.

Ve nihayet, son fonksiyon:

```python
def find_transaction(user_wallet, value, comment):
		# Son 30 işlemi al
    transactions = get_address_transactions()
    for transaction in transactions:
				# Gelen "mesaj" - işlemi seç
        msg = transaction['in_msg']
        if msg['source'] == user_wallet and msg['value'] == value and msg['message'] == comment:
						# Eğer tüm veriler eşleşiyorsa, bu işlemin daha önce doğrulanmadığını kontrol ediyoruz
            t = db.check_transaction(msg['body_hash'])
            if t == False:
								# Eğer değilse, doğrulanmış olanlar tablosuna yazıyoruz
								# ve True döndürüyoruz
                db.add_v_transaction(
                    msg['source'], msg['body_hash'], msg['value'], msg['message'])
                print("işlem bulundu")
                print(
                    f"işlem kaynağı: {msg['source']} \nDeğer: {msg['value']} \nNot: {msg['message']}")
                return True
						# Eğer bu işlem zaten doğrulanmışsa, diğerlerini kontrol ediyoruz, belki doğru olanı bulabiliriz
            else:
                pass
		# Son 30 işlemde gerekli olanı bulamazsak, False döndür
		# Buraya, sonraki 29 işlemi görme kodu ekleyebilirsiniz
		# Ancak, Örnek kapsamı içinde bu gereksiz olur.
    return False
```

Girişte "doğru" cüzdan adresi, miktar ve not bulunmaktadır. Niyet edilen gelen işlem bulunursa, çıktı True; aksi takdirde False olacaktır.

## Telegram botu

Öncelikle, bir bot için temeli oluşturalım.

### İçe aktarmalar

Bu bölümde gerekli kütüphaneleri içe aktaracağız.

`aiogram`'dan `Bot`, `Dispatcher`, `types` ve `executor` ihtiyaç duyacağız.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage`, bilgi geçici olarak saklamak için gereklidir.

`FSMContext`, `State` ve `StatesGroup`, durum makinesi ile çalışmak için gereklidir.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json`, json dosyaları ile çalışmak için gereklidir. `logging`, hataları kaydetmek için gereklidir.

```python
import json
import logging
```

`api` ve `db`, daha sonra dolduracağımız kendi dosyalarımızdır.

```python
import db
import api
```

### Yapılandırma ayarları

`BOT_TOKEN` gibi verileri ayrı bir `config.json` dosyasında saklamanız önerilir. Böylece ödemeleri almak için cüzdanlarınızı daha rahat kurabilirsiniz.

```json
{
  "BOT_TOKEN": "Bot tokeniniz",
  "MAINNET_API_TOKEN": "Mainnet API tokeniniz",
  "TESTNET_API_TOKEN": "Testnet API tokeniniz",
  "MAINNET_WALLET": "Mainnet cüzdanınız",
  "TESTNET_WALLET": "Testnet cüzdanınız",
  "WORK_MODE": "testnet"
}
```

#### Bot tokeni

`BOT_TOKEN`, [@BotFather](https://t.me/BotFather) ile aldığınız Telegram bot tokenidir.

#### Çalışma modu

`WORK_MODE` anahtarında, botun çalışma modunu tanımlayacağız—test veya ana ağda; sırasıyla `testnet` veya `mainnet` seçeneklerinden biri.

#### API tokenleri

`*_API_TOKEN` için API tokenleri [TON Center](https://toncenter.com/) botlarından elde edilebilir:

- mainnet için — [@tonapibot](https://t.me/tonapibot)
- testnet için — [@tontestnetapibot](https://t.me/tontestnetapibot)

#### Yapılandırmayı botumuza bağlama

Sonraki adımda botun ayarlarını tamamlayalım.

`config.json` dosyasından botun çalışması için gerekli tokeni alalım:

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
    # highlight-next-line
    BOT_TOKEN = config_json['BOT_TOKEN']
		# Ödemeleri almak için buraya cüzdanlarınızı yerleştirin
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
		# Varsayılan olarak bot testnette çalışacak
    WALLET = TESTNET_WALLET
```

### Kayıt ve bot ayarı

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### Durumlar

Durumları, bot iş akışını aşamalara ayırmak için kullanabiliriz. Her aşamanın belirli bir görev için özel olmasını sağlayabiliriz.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

Detaylar ve örnekler için [Aiogram belgelerine](https://docs.aiogram.dev/en/latest/) bakabilirsiniz.

### Mesaj işleyicileri

Bu bölümde bot etkileşim mantığını yazacağız.

İki tür işleyici kullanacağız:

- `message_handler`, kullanıcıdan gelen mesajları işlemek için kullanılır.
- `callback_query_handler`, inline klavyeden yapılan geri çağrıları işlemek için kullanılır.

Kullanıcıdan gelen bir mesajı işlemek istiyorsak, `message_handler` kullanacağız ve fonksiyonun üzerine `@dp.message_handler` dekoratörünü yerleştireceğiz. Bu durumda, kullanıcı botun bir mesaj göndermesi durumunda fonksiyon çağrılacaktır.

Dekoratörde, fonksiyonun çağrılacağı koşulları belirtebiliriz. Örneğin, fonksiyonun yalnızca kullanıcının `/start` metniyle bir mesaj göndermesi durumunda çağrılmasını istiyorsak, şu şekilde yazmalıyız:

```python
@dp.message_handler(commands=['start'])
```

İşleyicilere bir asenkron fonksiyona atanması gerekir. Bu durumda `async def` sözdizimini kullanacağız. `async def` söz dizimi, asenkron bir şekilde çağrılacak fonksiyonu tanımlamak için kullanılır.


#### /start

`/start` komutunu başlatan handler ile başlayalım.

```python
@dp.message_handler(commands=['start'], state='*')
async def cmd_start(message: types.Message):
    await message.answer(f"WORKMODE: {WORK_MODE}")

    # kullanıcı veritabanında mı? değilse ekle    
    isOld = db.check_user(message.from_user.id, message.from_user.username, message.from_user.first_name)
    
   :::tip
    Kullanıcı veritabanında mevcutsa, ona farklı bir şekilde hitap edebiliriz.
    :::
    
    if isOld == False:
        await message.answer(f"Burada yenisin, {message.from_user.first_name}!")
        await message.answer(f"Hava almak için /buy gönder")
    else:
        await message.answer(f"Bir kez daha hoş geldin, {message.from_user.first_name}!")
        await message.answer(f"Daha fazla hava almak için /buy gönder")
        
    await DataInput.firstState.set()
```

Bu handler'ın dekoratöründe `state='*'` görüyoruz. Bu, bu handler'ın botun durumuna bakılmaksızın çağrılacağı anlamına gelir. Handler'ın yalnızca bot belirli bir durumda olduğunda çağrılmasını istiyorsak, `state=DataInput.firstState` yazmamız gerekir. Bu durumda, handler yalnızca bot `firstState` durumundayken çağrılacaktır.

Kullanıcı `/start` komutunu gönderdikten sonra, bot `db.check_user` fonksiyonu kullanarak kullanıcının veritabanında olup olmadığını kontrol eder. Eğer yoksa, onu ekleyecektir. Bu fonksiyon ayrıca bir bool değer de döndürür ve bunu kullanıcıya farklı bir şekilde hitap etmek için kullanabiliriz. Daha sonra bot durumu `firstState` olarak ayarlayacaktır.

---

#### /cancel

Sonraki `/cancel` komutunu yöneten handler. Bu, `firstState` durumuna geri dönmek için gereklidir.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("İptal edildi")
    await message.answer("/start ile yeniden başla")
    await DataInput.firstState.set()
```

---

#### /buy

Ve elbette `/buy` komutunu yöneten handler. Bu örnekte farklı hava türlerini satacağız. Hava türünü seçmek için cevap tuş takımını kullanacağız.

```python
# /buy komutunu yöneten handler
@dp.message_handler(commands=['buy'], state=DataInput.firstState)
async def cmd_buy(message: types.Message):
    # hava türleri ile cevap tuş takımı
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    keyboard.add(types.KeyboardButton('Tamamen saf 🔥'))
    keyboard.add(types.KeyboardButton('Bahar ormanı 🌲'))
    keyboard.add(types.KeyboardButton('Deniz esintisi 🌊'))
    keyboard.add(types.KeyboardButton('Taze asfalt 🛣'))
    await message.answer(f"Seçtiğin hava: (veya /cancel)", reply_markup=keyboard)
    await DataInput.secondState.set()
```

Yani, kullanıcı `/buy` komutunu gönderdiğinde, bot ona hava türleriyle bir cevap tuş takımı gönderir. Kullanıcı hava türünü seçtikten sonra, bot durumu `secondState` olarak ayarlayacaktır.

Bu handler, yalnızca `secondState` ayarlandığında çalışır ve kullanıcının hava türü ile bir mesaj bekler. Bu durumda, kullanıcının seçtiği hava türünü saklamamız gerekiyor; bu yüzden fonksiyona FSMContext'i argüman olarak geçiriyoruz.

FSMContext, botun belleğinde veri saklamak için kullanılır. İçinde herhangi bir veriyi saklayabiliriz ama bu bellek kalıcı değildir, bu yüzden bot yeniden başlatıldığında veriler kaybolur. Ama geçici verileri saklamak için kullanmak iyidir.

```python
# hava türünü yönet
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Tamamen saf 🔥":
        await state.update_data(air_type="Tamamen saf 🔥")
    elif message.text == "Taze asfalt 🛣":
        await state.update_data(air_type="Taze asfalt 🛣")
    elif message.text == "Bahar ormanı 🌲":
        await state.update_data(air_type="Bahar ormanı 🌲")
    elif message.text == "Deniz esintisi 🌊":
        await state.update_data(air_type="Deniz esintisi 🌊")
    else:
        await message.answer("Yanlış hava türü")
        await DataInput.secondState.set()
        return
        
    await DataInput.WalletState.set()
    await message.answer(f"Cüzdan adresini gönder")
```

Kullan...

```python
await state.update_data(air_type="Tamamen saf 🔥")
```

... hava türünü FSMContext'te saklamak için. Daha sonra, durumu `WalletState` olarak ayarlıyoruz ve kullanıcıdan cüzdan adresini göndermesini istiyoruz.

Bu handler, yalnızca `WalletState` ayarlandığında çalışacak ve kullanıcının cüzdan adresiyle bir mesaj bekleyecektir.

Sonraki handler oldukça karmaşık görünüyor ama öyle değil. Öncelikle, mesajın geçerli bir cüzdan adresi olup olmadığını kontrol ediyoruz; `len(message.text) == 48` çünkü cüzdan adresi 48 karakter uzunluğundadır. Daha sonra, adresin geçerli olup olmadığını kontrol etmek için `api.detect_address` fonksiyonunu kullanıyoruz. API bölümünden bildiğiniz gibi, bu fonksiyon aynı zamanda veritabanında saklanacak "Doğru" adresi döndürür.

:::warning
Geçerli bir adres olmasına dikkat edin, aksi halde işlem başarısız olabilir.
:::

Daha sonra, FSMContext'ten hava türünü alıyoruz ve bunu `user_data` değişkenine kaydediyoruz.

Artık ödeme işlemi için gereken tüm verilere sahibiz. Tek yapmamız gereken bir ödeme bağlantısı oluşturmak ve bunu kullanıcıya göndermek. Hadi inline tuş takımını kullanalım.

Bu örnekte ödeme için üç tuş oluşturulacaktır:

- resmi TON Cüzdanı için
- Tonhub için
- Tonkeeper için

Cüzdanlar için özel tuşların avantajı, eğer kullanıcı henüz bir cüzdana sahip değilse, sitenin ona bir tane kurması için yardım etmesidir.

İstediğinizi kullanmakta özgürsünüz.

Ve işlemin başarılı olup olmadığını kontrol edebilmemiz için kullanıcının işlemden sonra basacağı bir tuşa ihtiyacımız var.

```python
@dp.message_handler(state=DataInput.WalletState)
async def user_wallet(message: types.Message, state: FSMContext):
    if len(message.text) == 48:
        res = api.detect_address(message.text)
        
        if res == False:
            await message.answer("Yanlış cüzdan adresi")
            await DataInput.WalletState.set()
            return
        else:
            user_data = await state.get_data()
            air_type = user_data['air_type']
            
            # inline buton "işlemi kontrol et"
            keyboard2 = types.InlineKeyboardMarkup(row_width=1)
            keyboard2.add(types.InlineKeyboardButton(text="İşlemi kontrol et", callback_data="check"))
            
            keyboard1 = types.InlineKeyboardMarkup(row_width=1)
            keyboard1.add(types.InlineKeyboardButton(text="Ton Cüzdanı", url=f"ton://transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(text="Tonkeeper", url=f"https://app.tonkeeper.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(text="Tonhub", url=f"https://tonhub.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            
            await message.answer(f"{air_type} seçtiniz")
            await message.answer(f"<code>1</code> toncoin'i adresine gönder \n<code>{WALLET}</code> \nşu yorum ile \n<code>{air_type}</code> \nsenin cüzdanından ({message.text})", reply_markup=keyboard1)
            await message.answer(f"Ödeme sonrası butona tıklayın", reply_markup=keyboard2)
            
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Yanlış cüzdan adresi")
        await DataInput.WalletState.set()
```

---

#### /me

Gerekli son bir mesaj yöneticisi `/me` komutu içindir. Bu, kullanıcının ödemelerini gösterir.

```python
# /me komutunu yöneten handler
@dp.message_handler(commands=['me'], state="*")
async def cmd_me(message: types.Message):
    await message.answer(f"İşlemleriniz")
    
    # db.get_user_payments kullanıcı için işlemler listesini döndürür
    transactions = db.get_user_payments(message.from_user.id)
    
    if transactions == False:
        await message.answer(f"Hiç işlemin yok")
    else:
        for transaction in transactions:
            # blockchain değerleri nanotonda saklar. 1 toncoin = 1000000000 blockchain'de
            await message.answer(f"{int(transaction['value'])/1000000000} - {transaction['comment']}")
```

---

### Callback Yöneticileri

Butonlarda callback verilerini ayarlayabiliriz; bu veriler, kullanıcı butona bastığında bot'a gönderilecektir. Kullanıcının işlemden sonra basacağı butonda, callback verilerini "check" olarak ayarlıyoruz. Sonuç olarak, bu callback'i yönetmemiz gerekiyor.

Callback yöneticileri, mesaj yöneticilerine oldukça benzer ama `message` yerine `types.CallbackQuery` argümanı alırlar. Fonksiyon dekoratörü de farklıdır.

```python
@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # bildirim gönder
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    
    result = api.find_transaction(source, value, comment)
    
    if result == False:
        await call.answer("Biraz bekle, 10 saniye içinde tekrar dene. İşlemin durumunu explorer'dan (tonscan.org/) de kontrol edebilirsin.", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("İşlem onaylandı \n/start ile yeniden başla")
        await state.finish()
        await DataInput.firstState.set()
```

Bu handler'da FSMContext'ten kullanıcı verilerini alıyoruz ve işlemin başarılı olup olmadığını kontrol etmek için `api.find_transaction` fonksiyonunu kullanıyoruz. Başarılı ise, cüzdan adresini veritabanında saklıyoruz ve kullanıcıya bir bildirim gönderiyoruz. Daha sonra kullanıcı, `/me` komutu ile işlemlerini bulabilir.

---

### main.py'nin Son Kısmı

Son olarak, unutmayın:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

Bu kısım botu başlatmak için gereklidir. `skip_updates=True` ile eski mesajları işlemek istemediğimizi belirtiyoruz. Ama tüm mesajları işlemek isterseniz, bunu `False` olarak ayarlayabilirsiniz.

:::info
`main.py` dosyasının tüm kodu [burada](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py) bulunabilir.
:::

---

## Botu Çalıştırma

Sonunda başardık! Artık çalışır bir botunuz olmalı. Bunu test edebilirsiniz!

Botu çalıştırma adımları:

1. `config.json` dosyasını doldurun.
2. `main.py` dosyasını çalıştırın.

Tüm dosyaların aynı klasörde olması gerekmektedir. Botu başlatmak için `main.py` dosyasını çalıştırmanız gerekiyor. Bunu IDE'nizde veya terminalde şu şekilde yapabilirsiniz:

```
python main.py
```

Herhangi bir hata alırsanız, bunları terminalde kontrol edebilirsiniz. Belki kodda bir şeyi atladınız.

Çalışan bir bot örneği [@AirDealerBot](https://t.me/AirDealerBot)

![bot](../../../../../images/ton/static/img/tutorials/apiatb-bot.png)

---

## Referanslar

- TON için [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8) parçası olarak yapıldı
- Lev ([Telegram @Revuza](https://t.me/revuza), [LevZed GitHub'da](https://github.com/LevZed))