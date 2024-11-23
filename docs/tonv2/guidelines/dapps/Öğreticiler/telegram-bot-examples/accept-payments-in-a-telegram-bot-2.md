---
description: Bu makalede, TON'da ödemeleri kabul eden basit bir Telegram botu oluşturacağız.
---

# Kendi bakiyesi olan bot

Bu makalede, TON'da ödemeleri kabul eden basit bir Telegram botu oluşturacağız.

## 🦄 Görünümü

Bot şöyle görünecek:

![](../../../../../images/ton/static/img/tutorials/bot1.png)

### Kaynak Kodu

:::info Kaynaklar GitHub'da mevcuttur:
* [https://github.com/Gusarich/ton-bot-example](https://github.com/Gusarich/ton-bot-example)
:::

## 📖 Ne Öğreneceksiniz
Şunları öğrenmiş olacaksınız:
- Aiogram kullanarak Python3'te bir Telegram botu oluşturmayı
- SQLITE veritabanlarıyla çalışmayı
- Kamu TON API'si ile çalışmayı

## ✍️ Başlamak için Gerekenler
Eğer henüz yüklemediyseniz, [Python](https://www.python.org/) yükleyin.

Ayrıca bu PyPi kütüphanelerine ihtiyacınız var:
- aiogram
- requests

Terminalde tek bir komutla bunları yükleyebilirsiniz.
```bash
pip install aiogram==2.21 requests
```

## 🚀 Hadi Başlayalım!
Botumuz için içinde dört dosyanın bulunduğu bir dizin oluşturun:
- `bot.py`—Telegram botunu çalıştırmak için program
- `config.py`—ayar dosyası
- `db.py`—sqlite3 veritabanı ile etkileşim sağlayacak modül
- `ton.py`—TON'da ödemeleri işlemek için modül

Dizin görünümü şöyle olmalıdır:
```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

Şimdi kod yazmaya başlayalım!

## Ayar
`config.py` ile başlayalım çünkü en küçüğü. İçinde birkaç parametre ayarlamamız yeterli.

**config.py**
```python
BOT_TOKEN = 'BOT TOKENİNİZİ BURAYA YERLEŞTİRİN'
DEPOSIT_ADDRESS = 'DEPOZİT ADRESİNİ BURAYA YERLEŞTİRİN'
API_KEY = 'API ANAHTARINIZI BURAYA YERLEŞTİRİN'
RUN_IN_MAINNET = True  # Ana ağı test ağına değiştirmek için True/False değiştirin

if RUN_IN_MAINNET:
    API_BASE_URL = 'https://toncenter.com'
else:
    API_BASE_URL = 'https://testnet.toncenter.com'
```

Burada ilk üç satırda değerleri doldurmanız gerekiyor:
- `BOT_TOKEN` sizin Telegram Bot token'ınızdır, bunu [bot oluşturduktan](https://t.me/BotFather) sonra alabilirsiniz.
- `DEPOSIT_ADDRESS` tüm ödemeleri kabul edecek projenizin cüzdan adresidir. Yeni bir TON Cüzdanı oluşturup adresini kopyalayabilirsiniz.
- `API_KEY` TON Center'dan alacağınız API anahtarıdır, bunu [bu bot](https://t.me/tonapibot) ile edinebilirsiniz.

Botunuzun testnet veya mainnet üzerinde çalışıp çalışmayacağını (4. satır) da seçebilirsiniz.

Bu, Config dosyası için her şey, öyleyse ilerleyebiliriz!

## Veritabanı
Şimdi botumuzun veritabanıyla çalışacak `db.py` dosyasını düzenleyelim.

sqlite3 kütüphanesini içe aktaralım.
```python
import sqlite3
```

Veritabanı bağlantısını ve kursörü başlatalım (siz `db.sqlite` yerine başka bir dosya adı seçebilirsiniz).
```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

Kullanıcılar hakkında bilgi (bizim durumumuzda bakiyeleri) depolamak için "Users" adında bir tablo oluşturalım ve User ID ile bakiye satırları ekleyelim.
```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

Şimdi veritabanı ile çalışmak için birkaç fonksiyon tanımlamamız gerekiyor.

`add_user` fonksiyonu, veritabanına yeni kullanıcılar eklemek için kullanılacaktır.
```python
def add_user(uid):
    # yeni kullanıcının bakiyesi her zaman 0'dır
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

`check_user` fonksiyonu, kullanıcının veritabanında olup olmadığını kontrol etmek için kullanılacaktır.
```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

`add_balance` fonksiyonu, kullanıcının bakiyesini artırmak için kullanılacaktır.
```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

`get_balance` fonksiyonu, kullanıcının bakiyesini alır.
```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

Ve `db.py` dosyası için her şey bu kadar!

Artık bu dört fonksiyonu botun diğer bileşenlerinde veritabanıyla etkileşimde kullanabiliriz.

## TON Center API
`ton.py` dosyasında, yeni depozitoları işleyen, kullanıcı bakiyelerini artıran ve kullanıcıları bilgilendiren bir fonksiyon tanımlayacağız.

### getTransactions Yöntemi

TON Center API'sini kullanacağız. Dokümanları [burada mevcuttur](https://toncenter.com/api/v2/).

Verilen bir hesabın en son işlemleri hakkında bilgi almak için [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) yöntemine ihtiyacımız var.

:::tip Bu yöntemin alacağı giriş parametrelerine ve ne döndürdüğüne bakalım.
:::

Bir tane zorunlu giriş alanı `address` vardır, ancak dönen işlemler için kaç tane almak istediğimizi belirtmek için `limit` alanına da ihtiyacımız var.

Şimdi, bu yöntemi [TON Center web sitesinde](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) herhangi bir mevcut cüzdan adresiyle çalıştırmaya çalışalım ve çıktıda ne alacağımızı anlamaya çalışalım.

```json
{
  "ok": true,
  "result": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

Güzel, `ok` alanı her şey yolundaysa `true` olarak ayarlanır ve `limit` en son işlemlerin listesini içeren bir dizi `result` oluşturur. Şimdi tek bir işleme bakalım:

```json
{
    "@type": "raw.transaction",
    "utime": 1666648337,
    "data": "...",
    "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32294193000003",
        "hash": "ez3LKZq4KCNNLRU/G4YbUweM74D9xg/tWK0NyfuNcxA="
    },
    "fee": "105608",
    "storage_fee": "5608",
    "other_fee": "100000",
    "in_msg": {
        "@type": "raw.message",
        "source": "EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL",
        "destination": "EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN",
        "value": "100000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32294193000002",
        "body_hash": "tDJM2A4YFee5edKRfQWLML5XIJtb5FLq0jFvDXpv0xI=",
        "msg_data": {
            "@type": "msg.dataText",
            "text": "SGVsbG8sIHdvcmxkIQ=="
        },
        "message": "Merhaba, dünya!"
    },
    "out_msgs": []
}
```

İşlemi tam olarak tanımlamamıza yardımcı olacak bilgiler `transaction_id` alanında saklanır. Hangi işlemin önce hangi işlemin sonra olduğunu anlamak için `lt` alanına ihtiyacımız var.

Para transferi hakkında bilgi `in_msg` alanındadır. Biz `value` ve `message` alanlarına ihtiyacımız olacak.

Artık bir ödeme işleyici oluşturmak için hazırız.

### Koddaki API İsteklerini Göndermek

Gerekli kütüphaneleri ve önceki iki dosyamızı: `config.py` ve `db.py`'yi içe aktararak başlayalım.
```python
import requests
import asyncio

# Aiogram
from aiogram import Bot
from aiogram.types import ParseMode

# Burada ayrıca config ve veritabanına ihtiyacımız var
import config
import db
```

Ödeme işleminin nasıl gerçekleştirilebileceğini düşünelim.

Her birkaç saniyede API'yi çağırabilir ve cüzdan adresimize gelen yeni işlemlerin olup olmadığını kontrol edebiliriz.

Bunun için son işlemimizi bilmemiz gerekiyor. En basit yaklaşım, o işlemin bilgisini bir dosyada saklamak ve her yeni işlem işlediğimizde güncellemektir.

Dosyada hangi işlem bilgilerini saklayacağız? Aslında, yalnızca `lt` değerini saklamamız yeterli. Bu değerle hangi işlemlerin işleneceğini anlayabileceğiz.

Yeni bir async fonksiyonu tanımlamamız gerekiyor; buna `start` diyelim. Bu fonksiyonun neden asenkron olması gerektiğini biliyor musunuz? Çünkü Telegram botları için Aiogram kütüphanesi de asenkron, bu nedenle daha sonra asenkron fonksiyonlarla çalışmak daha kolay olacaktır.

:::note `start` fonksiyonumuz şöyle görünmelidir:
:::
```python
async def start():
    try:
        # last_lt dosyasını yüklemeyi deneyin
        with open('last_lt.txt', 'r') as f:
            last_lt = int(f.read())
    except FileNotFoundError:
        # Dosya bulunamazsa last_lt'yi 0 olarak ayarlayın
        last_lt = 0

    # Kullanıcılara depozit bildirimlerini göndermek için Bot örneğine ihtiyacımız var
    bot = Bot(token=config.BOT_TOKEN)

    while True:
        # Burada her birkaç saniyede API'yi arayacağız ve yeni işlemleri alacağız.
        ...
```

Şimdi while döngüsünün gövdesini yazalım. Burada her birkaç saniyede TON Center API'sini aramamız gerekiyor.
```python
while True:
    # Kontroller arasında 2 saniye bekleyin
    await asyncio.sleep(2)

    # Cüzdanımızın en son 100 işlemini döndüren TON Center API'sine istek
    resp = requests.get(f'{config.API_BASE_URL}/api/v2/getTransactions?'
                        f'address={config.DEPOSIT_ADDRESS}&limit=100&'
                        f'archival=true&api_key={config.API_KEY}').json()

    # Eğer istek başarılı olmadıysa, tekrar deneyin
    if not resp['ok']:
        continue
    
    ...
```

`requests.get` ile çağrımızdan sonra `resp` adında bir değişkenimiz var ve bu değişken API'den dönen yanıtı içeriyor. `resp` bir nesnedir ve `resp['result']` cüzdan adresimiz için son 100 işlemi içeren bir liste oluşturmaktadır.

Şimdi bu işlemler üzerinde döngü başlatalım ve yeni olanları bulalım.
```python
while True:
    ...

    # İşlemleri döngü ile inceleyin
    for tx in resp['result']:
        # LT, mantıksal zamanı ifade eder ve Hash işlemimizin hash'idir
        lt, hash = int(tx['transaction_id']['lt']), tx['transaction_id']['hash']

        # Eğer bu işlem mantıksal zamanı last_lt'den küçük ise,
        # zaten işlem gördük, bu yüzden atlayalım

        if lt <= last_lt:
            continue
        
        # Bu noktada, `tx` henüz işlem yapılmamış yeni bir işlemdir
        ...
```

Yeni bir işlemi nasıl işleyebiliriz? Şunları yapmamız gerekiyor:
- kullanıcının kim olduğunu anlamak
- kullanıcının bakiyesini artırmak
- kullanıcının depozitosunun onaylandığını bildirmek

Bunu yapacak olan kod şöyle:
```python
while True:
    ...

    for tx in resp['result']:
        ...
        # Bu noktada, `tx` henüz işlem yapılmamış yeni bir işlemdir

        value = int(tx['in_msg']['value'])
        if value > 0:
            uid = tx['in_msg']['message']

            if not uid.isdigit():
                continue

            uid = int(uid)

            if not db.check_user(uid):
                continue

            db.add_balance(uid, value)

            await bot.send_message(uid, 'Depozito onaylandı!\n'
                                    f'*+{value / 1e9:.2f} TON*',
                                    parse_mode=ParseMode.MARKDOWN)
```

Buna bir göz atalım ve ne yaptığını anlayalım.

Para transferi hakkında olan tüm bilgi `tx['in_msg']` içindedir. Sadece 'value' ve 'message' alanlarına ihtiyacımız var.

Öncelikle, değerin sıfırdan fazla olup olmadığını kontrol ediyoruz ve eğer öyleyse devam ediyoruz.

Ardından, transferin bir yorumunun olması gerektiğini ( `tx['in_msg']['message']`) varsayıyoruz, kullanıcının botumuzdan aldığımız UID'si olması için bunu bir sayı olup olmadığını kontrol ediyoruz ve UID'nin veritabanımızda mevcut olup olmadığını kontrol ediyoruz.

Bu basit kontrollerden sonra, artık bir `value` değişkenimiz var, bu depozito tutarıdır ve `uid` değişkenimiz de bu depozito işlemini yapan kullanıcının UID'sidir. Böylece hesaplarına para ekleyebilir ve bir bildirim mesajı gönderebiliriz.

Ayrıca unutmayın ki değer varsayılan olarak nanotondur, bu nedenle bunu 1 milyona bölmemiz gerekiyor. Bunu bildirimde şöyle yapıyoruz:
`{value / 1e9:.2f}`
Burada değeri `1e9` (1 milyar) ile bölüyoruz ve kullanıcılara dostça bir formatta göstermek için ondan sonra iki ondalık basamak bırakıyoruz.

Harika! Program artık yeni işlemleri işleyebilir ve kullanıcılara depozitolar hakkında bildirim gönderebilir. Ancak daha önce kullandığımız `lt` değerini saklamayı unutmamalıyız. En son `lt`'yi güncelleyerek daha yeni bir işlemin işlendiğini kaydedeceğiz.

Bu basit:
```python
while True:
    ...
    for tx in resp['result']:
        ...
        # Bu işlemi işlemden geçirdik

        # Buradaki lt değişkeni son işlenen işlemin LT'sini içeriyor
        last_lt = lt
        with open('last_lt.txt', 'w') as f:
            f.write(str(last_lt))
```

Ve `ton.py` dosyası için her şey bu kadar!
Botumuz artık üçte dördü hazır; sadece botun kendisinde birkaç butonla bir kullanıcı arayüzü oluşturmalıyız.

## Telegram Botu

### Başlatma

`bot.py` dosyasını açın ve ihtiyaç duyduğumuz tüm modülleri içe aktarın.
```python
# Günlükleme modülü
import logging

# Aiogram içe aktarımları
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types import ParseMode, ReplyKeyboardMarkup, KeyboardButton, \
                          InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

# Veritabanı ve TON Ağı ile çalışmak için yerel modüller
import config
import ton
import db
```

Programımıza günlüğü ayarlayalım, böylece daha sonra hata ayıklamak için neler olduğunu görebiliriz.
```python
logging.basicConfig(level=logging.INFO)
```

Artık bot nesnesini ve Aiogram ile onun dispatcher'ını başlatmamız gerekiyor.
```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

Burada, eğitimin başında oluşturduğumuz `BOT_TOKEN`'ı kullanıyoruz.

Botu başlatıyoruz ama hala boş. Kullanıcı ile etkileşim için bazı fonksiyonlar eklemeliyiz.

### Mesaj İşleyicileri

#### /start Komutu

`/start` ve `/help` komut işleyicisi ile başlayalım. Bu fonksiyon, kullanıcı botu ilk kez başlattığında, yeniden başlattığında veya `/help` komutunu kullandığında çağrılacak.

```python
@dp.message_handler(commands=['start', 'help'])
async def welcome_handler(message: types.Message):
    uid = message.from_user.id  # Gerekli değil, kodu kısaltmak için sadece

    # Kullanıcı veritabanında yoksa, ekleyin
    if not db.check_user(uid):
        db.add_user(uid)

    # İki ana buton içeren klavye: Deposit ve Balance
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.row(KeyboardButton('Deposit'))
    keyboard.row(KeyboardButton('Balance'))

    // Hoş geldiniz metnini gönderin ve klavyeyi ekleyin
    await message.answer('Merhaba!\nBen bir örnek botum '
                         'made for `bu makale`.\n'
                         'Amacım, Python ile Toncoin almak ne kadar basit olduğunu göstermektir.\n\n'
                         'Fonksiyonelliğimi denemek için klavyeyi kullanın.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

Hoş geldin mesajı istediğiniz gibi olabilir. Klavye butonları herhangi bir metinle etiketlenebilir, ancak bu örnekte en net şekilde şu şekilde etiketlenmişlerdir: `Deposit` ve `Balance`.

#### Bakiye Butonu

Artık kullanıcı botu başlatabilir ve iki butonun olduğu klavyeyi görebilir. Ancak bunlardan birine çağrıldığında, kullanıcı herhangi bir yanıt almayacaktır çünkü bunlar için herhangi bir fonksiyon oluşturmadık.

O halde, bakiye istemek için bir fonksiyon ekleyelim.

```python
@dp.message_handler(commands='balance')
@dp.message_handler(Text(equals='balance', ignore_case=True))
async def balance_handler(message: types.Message):
    uid = message.from_user.id

    # Kullanıcı bakiyesini veritabanından al
    # Ayrıca unutmayın ki 1 TON = 1e9 (milyar) Nanoton
    user_balance = db.get_balance(uid) / 1e9

    # Bakiyeyi formatla ve kullanıcıya gönder
    await message.answer(f'Bakiyeniz: *{user_balance:.2f} TON*',
                         parse_mode=ParseMode.MARKDOWN)
```

Bu oldukça basit. Veritabanından bakiyeyi alıyoruz ve kullanıcıya mesaj gönderiyoruz.

#### Deposit Butonu

Peki ya ikinci `Deposit` butonu? İşte bunun için fonksiyon:

```python
@dp.message_handler(commands='deposit')
@dp.message_handler(Text(equals='deposit', ignore_case=True))
async def deposit_handler(message: types.Message):
    uid = message.from_user.id

    # Depozit URL'si ile klavye
    keyboard = InlineKeyboardMarkup()
    button = InlineKeyboardButton('Deposit',
                                  url=f'ton://transfer/{config.DEPOSIT_ADDRESS}&text={uid}')
    keyboard.add(button)

    # Kullanıcıya botun içine nasıl para yatıracağını açıklayan metni gönder
    await message.answer('Bakiyenizi buradan doldurmak çok kolay.\n'
                         'Sadece bu adrese herhangi bir miktar TON gönderin:\n\n'
                         f'`{config.DEPOSIT_ADDRESS}`\n\n'
                         f'Aşağıdaki düğmeyi tıklayarak da yatırabilirsiniz.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

Burada yaptığımız da anlaması kolay.

`ton.py` dosyasında bir kullanıcı tarafından yapılan bir yatırımı yorum ile nasıl tanımladığımızı hatırlıyor musunuz? Şimdi burada kullanıcıdan UID'sini içeren bir işlem göndermesini istememiz gerekiyor.

### Botu Başlatma

`bot.py` dosyasında şimdi yapmamız gereken tek şey, botu başlatmak ve ayrıca `ton.py` dosyasından `start` fonksiyonunu çalıştırmaktır.

```python
if __name__ == '__main__':
    # Botumuz için Aiogram yürütücüsü oluştur
    ex = executor.Executor(dp)

    # Yürütücümüzle depozito bekleyicisini başlat
    ex.loop.create_task(ton.start())

    # Botu başlat
    ex.start_polling()
```

Şu anda, botumuz için gerekli tüm kodu yazdık. Her şeyi doğru yaptıysanız, terminalde `python my-bot/bot.py` komutunu çalıştırarak çalışmalıdır.

Eğer botunuz doğru çalışmıyorsa, kodunuzu [bu depodan](https://github.com/Gusarich/ton-bot-example) kod ile karşılaştırın.

## Referanslar

- TON için [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8) kapsamında yapılmıştır
- Gusarich tarafından ([Telegram @Gusarich](https://t.me/Gusarich), [Gusarich GitHub'da](https://github.com/Gusarich))