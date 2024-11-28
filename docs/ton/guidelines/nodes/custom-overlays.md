# Özel üst katmanlar

TON düğümleri, _Üst Katmanlar_ olarak adlandırılan alt ağlar oluşturarak birbirleriyle iletişim kurar. Düğümlerin katıldığı bazı ortak üst katmanlar arasında:

- Her shard için kamu üst katmanları
- Doğrulayıcıların genel doğrulayıcı üst katmanında yer alması
- Belirli doğrulayıcı setleri için üst katmanlar bulunmaktadır.

:::tip
Düğümler ayrıca özel üst katmanlara katılacak şekilde yapılandırılabilir.
:::

Şu anda bu üst katmanlar iki amaç için kullanılabilir:

- Dış mesajların yayınlanması
- Blok adaylarının yayınlanması.

Özel üst katmanlara katılım, kamu üst katmanlarının belirsizliğinden kaçınmaya ve teslimat güvenilirliğini ile gecikmeleri iyileştirmeye yardımcı olur.

> **Dikkat:** Her özel üst katmanın önceden belirlenmiş izinlere sahip katılımcılardan oluşan kesin bir listesi vardır; özellikle dış mesajlar ve bloklar gönderme izni. Üst katmanın yapılandırması, katılan tüm düğümlerde aynı olmalıdır.  
> — Özel Üst Katmanlar Hakkında

Kontrolünüz altında birden fazla düğüm varsa, bunları tüm doğrulayıcıların blok adayları gönderebileceği ve tüm LS'lerin dış mesajlar gönderebileceği özel bir üst katmana birleştirmek akıllıca olacaktır. Böylece LS'ler daha hızlı senkronize olurken, aynı zamanda dış mesaj teslimat hızı daha yüksek (ve genel olarak daha sağlam) olacaktır. **Ek üst katmanın ek ağ trafiğine neden olduğunu unutmayın.**

---

## Varsayılan özel üst katmanlar

Mytonctrl, [https://ton-blockchain.github.io/fallback_custom_overlays.json](https://ton-blockchain.github.io/fallback_custom_overlays.json) adresinde bulunan varsayılan özel üst katmanları kullanır. Bu üst katman genellikle kullanılmaz ve kamu üst katmanı bağlantısında sorun olması durumunda acil durumlar için tasarlanmıştır.

:::warning
Varsayılan özel üst katmanlara katılımı durdurmak için şu komutları çalıştırın:
```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```
:::

---

## Özel üst katman oluşturma

### adnl adreslerini toplayın

Özel bir üst katmana doğrulayıcı eklemek için ya `validator-console -c getconfig` ile elde edilen `fullnode adnl id` kullanabilir ya da mytonctrl durumunda bulunan `validator adnl id` kullanabilirsiniz.  
Özel bir üst katmana liteserver eklemek için `fullnode adnl id`lerini kullanmalısınız.

### Bir yapılandırma dosyası oluşturun

Aşağıdaki formatta bir yapılandırma dosyası oluşturun:

```json
{
    "adnl_address_hex_1": {
        "msg_sender": true,
        "msg_sender_priority": 1
    },
    "adnl_address_hex_2": {
        "msg_sender": false
    },
    "adnl_address_hex_3": {
        "block_sender": true
    },
  ...
}
```

`msg_sender_priority`, bloklara dış mesaj eklenme sırasını belirler: öncelikle daha yüksek öncelikli kaynaktan işlenen mesajlar. Kamu üst katmanından ve yerel LS'lerden gelen mesajlar 0 önceliğine sahiptir.

:::note
**Not:** Yapılandırmada listelenen tüm düğümlerin üst katmana katılması gerekir (başka bir deyişle, tam olarak bu yapılandırmayı üst katmana eklemeleri gerekir), aksi takdirde bağlantı kalitesi düşük olacak ve yayınlar başarısız olacaktır.
:::

Mytonctrl'un otomatik olarak her turda mevcut tüm doğrulayıcıları ekleyeceği dinamik bir özel üst katman oluşturmak için özel bir kelime `@validators` vardır.

### Özel üst katman ekleyin

Özel üst katman eklemek için mytonctrl komutunu kullanın:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

**Not:** Ad ve yapılandırma dosyası **tüm üst katman üyelerinde** aynı olmalıdır. Üst katmanın oluşturulduğundan emin olmak için mytonctrl `list_custom_overlays` komutunu kullanın.

### Hata Ayıklama

Düğümün ayrıntı seviyesi 4 olarak ayarlanabilir ve logları "CustomOverlay" kelimesi ile filtreleyebilirsiniz.

---

## Özel üst katmanı sil

Bir düğümden özel üst katmanı kaldırmak için mytonctrl komutunu kullanın: `delete_custom_overlay `.  
Eğer üst katman dinamikse (yani yapılandırmada `@validators` kelimesi varsa), bir dakika içinde silinecektir, aksi takdirde hemen kaldırılacaktır. Düğümün özel üst katmanı sildiğinden emin olmak için mytonctrl'dan `list_custom_overlays` ve `showcustomoverlays` doğrulayıcı konsolu komutlarını kontrol edin.

---

## Düşük seviye

Özel üst katmanlarla çalışmak için doğrulayıcı konsolu komutlarının listesi:

* `addcustomoverlay ` - Yerel düğüme özel üst katman ekle. Not: Bu yapılandırma, mytonctrl için yapılandırmadan farklı bir formatta olmalıdır:
```json
{
  "name": "OverlayName",
  "nodes": [
    {
      "adnl_id": "adnl_address_b64_1",
      "msg_sender": true,
      "msg_sender_priority": 1
    },
    {
      "adnl_id": "adnl_address_b64_2",
      "msg_sender": false
    }, ...
  ]
}
```
* `delcustomoverlay ` - Düğümden özel üst katmanı sil.
* `showcustomoverlays` - Düğümün bildiği özel üst katmanların listesini göster.