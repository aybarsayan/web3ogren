# MyTonCtrl Alert Bot

## Genel Bakış

MyTonCtrl Alert Bot, Telegram Bot aracılığıyla node'unuzun durumu hakkında bildirim almanızı sağlayan bir araçtır. MyTonCtrl araç setinin bir parçasıdır ve hem doğrulayıcılar hem de hafif sunucular için kullanılabilir.

---

## Kurulum

MyTonCtrl Uyarı Botunu kurmak için aşağıdaki adımları izleyin:

### Botu Hazırlayın

1. [BotFather](https://t.me/BotFather) adresine gidin ve `/newbot` komutunu kullanarak bir bot oluşturun. Bunun ardından bir `BotToken` alacaksınız.
2. Botunuza gidin ve **`Start` butonuna basın**. Bu, botun size mesaj göndermesine izin verecektir.
3. Botun gruptan mesaj almasını istiyorsanız, **botu gruba ekleyin** ve gerekli izinleri verin (grup yöneticisi yapın).
4. [getmyid_bot](https://t.me/getmyid_bot) adresine gidin ve **`Start` butonuna basın**. Sizinle birlikte `ChatId`'nizi geri dönecektir, bunu Telegram hesabınıza doğrudan mesaj almak isterseniz kullanın. Eğer grupta mesaj almak istiyorsanız, botu gruba ekleyin ve grup `ChatId`'sini size geri dönecektir.

### Uyarı Botunu Etkinleştirin

1. Aşağıdaki komut ile `alert-bot`'u etkinleştirin

    ```bash
    MyTonCtrl> enable_mode alert-bot
    ```

2. Aşağıdaki komutu çalıştırın

    ```bash
    MyTonCtrl> set BotToken <BotToken>
    ```

3. Aşağıdaki komutu çalıştırın

    ```bash
    MyTonCtrl> set ChatId <ChatId>
    ```

4. Botun mesaj gönderebildiğini kontrol etmek için aşağıdaki komutu çalıştırın

    ```bash
    MyTonCtrl> test_alert
    ```
    **Botunuzu, Telegram hesabınıza veya sohbetinize mesaj göndermesi gerekir.**

---

## Desteklenen Uyarılar

MyTonCtrl Uyarı Botu aşağıdaki uyarıları desteklemektedir:

- Doğrulayıcının cüzdan bakiyesi düşük
- Node'un veritabanı kullanımı %80'den fazla
- Node'un veritabanı kullanımı %95'ten fazla
- Doğrulayıcı, turda düşük verimlilik gösterdi
- Node senkronizasyondan çıktı
- Node çalışmıyor (hizmet kapalı)
- Node ADNL bağlantısına yanıt vermiyor
- Doğrulayıcı son 6 saatte sıfır blok oluşturdu
- Doğrulayıcı önceki doğrulama turunda ceza aldı

---

## Uyarıları (Devre Dışı) Bırakma

Uyarıları etkinleştirmek veya devre dışı bırakmak için aşağıdaki komutları kullanın:

- Bir uyarıyı etkinleştirmek için `enable_alert ` komutunu kullanın.
- Bir uyarıyı devre dışı bırakmak için `disable_alert ` komutunu kullanın.
- Uyarıların durumunu kontrol etmek için `list_alerts` komutunu kullanın.

:::tip
Uyarılarınızı yönetirken **uyarı isimlerinin doğru yazıldığına emin olun.**
:::

:::info
Her bir uyarının etkinleştirilmesi ve devre dışı bırakılması, sistem güvenliğinizi artıracaktır.
:::

:::warning
Bütün ayarlamaları yaptıktan sonra botun çalışıp çalışmadığını kontrol etmek çok önemlidir!
:::

:::note
Daha fazla bilgi için MyTonCtrl belgelerine göz atabilirsiniz.
:::