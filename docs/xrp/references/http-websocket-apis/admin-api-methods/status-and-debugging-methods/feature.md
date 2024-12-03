---
title: Özellik
seoTitle: Sunucu Özellikleri ve Değişiklik Süreci
sidebar_position: 4
description: Bu bölüm, sunucunun desteklediği değişiklikler ve oylama süreçleri hakkında bilgi sağlar. Yapılandırma ve istek formatlarını içerir.
tags: 
  - Blockchain
  - Core Server
  - değişiklikler
  - sunucu
  - oylama
  - rippled
  - özellik
keywords: 
  - Blockchain
  - Core Server
  - değişiklikler
  - sunucu
  - oylama
  - rippled
  - özellik
---

[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Feature1.cpp "Kaynak")

`feature` komutu, bu sunucunun bildiği `değişiklikler` hakkında bilgi döner; bu değişikliklerin etkin olup olmadığına ve sunucunun bu değişiklikler için oylama yapıp yapmadığına dair bilgileri içerir `değişiklik süreci`.

:::tip
`feature` komutunu, sunucuya bir değişiklik için karşı oy vermesi veya lehine oy vermesi için yapılandırmak üzere kullanabilirsiniz.
:::

Bu değişiklik sunucu yeniden başlatılsa bile kalıcı olur. badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0Güncellenmiştir: rippled 1.7.0/badge %}

_`feature` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `admin yöntemi` dir._

### İstek Formatı
İstek formatına örnek:



WebSocket - tümünü listele
```json
{
  "id": "list_all_features",
  "command": "feature"
}
```


WebSocket - reddet
```json
{
  "id": "reject_multi_sign",
  "command": "feature",
  "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
  "vetoed": true
}
```


JSON-RPC
```json
{
    "method": "feature",
    "params": [
        {
            "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
            "vetoed": false
        }
    ]
}
```


Komut satırı
```sh
# Sözdizimi: feature [<feature_id> [accept|reject]]
rippled feature 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 accept
```




İstek aşağıdaki parametreleri içerir:

| `Alan`    | Tip     | Açıklama                                            |
|:----------|:--------|:---------------------------------------------------|
| `feature` | String  | _(İsteğe bağlı)_ Bir değişikliğin benzersiz kimliği, onaltılık olarak; veya değişikliğin kısa adı. Sağlandığında, yanıtı bir değişiklikle sınırlar. Aksi takdirde yanıt, tüm değişiklikleri listeler. |
| `vetoed`  | Boolean | _(İsteğe bağlı; yalnızca `feature` belirtilmişse dikkate alınır)_ Eğer `true` ise, sunucuya `feature` ile belirtilen değişiklik aleyhine oy vermesi talimatını verir. Eğer `false` ise, sunucuya değişikliğin lehine oy vermesi talimatını verir. Komut satırında 'accept' veya 'reject' kullanın, 'true' veya 'false' yerine. Sunucunun kaynak kodunda _eski_ olarak işaretlenmiş bir değişikliğin lehine oy veremezsiniz. badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0Güncellenmiştir: rippled 1.11.0/badge %} |

:::info
Sunucunuza, sunucu mevcut değişikliğin nasıl uygulanacağını bilmese bile, `feature` alanında değişiklik kimliğini sağlayarak yeni bir değişiklik lehine oy vermesi için yapılandırabilirsiniz. Örneğin, değişikliği destekleyen yeni bir `rippled` sürümüne geçmeye planlıyorsanız bunu yapmak isteyebilirsiniz.
:::

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket - tümünü listele
```json
{
  "id": "list_all_features",
  "status": "success",
  "type": "response",
  "result": {
    "features": {
      "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE": {
        "enabled": false,
        "name": "Ücret Artışı",
        "supported": true,
        "vetoed": false
      },
      "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
        "enabled": false,
        "name": "Çok İmzalı",
        "supported": true,
        "vetoed": false
      },
      "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC": {
        "enabled": false,
        "name": "Yetki Seti",
        "supported": true,
        "vetoed": false
      },
      "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490": {
        "enabled": false,
        "name": "Biletler",
        "supported": true,
        "vetoed": false
      },
      "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13": {
        "enabled": false,
        "name": "SusPay",
        "supported": true,
        "vetoed": false
      }
    }
  }
}
```


WebSocket - reddet
```json
{
    "id": "reject_multi_sign",
    "status": "success",
    "type": "response",
    "result": {
        "features": {
            "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
                "enabled": false,
                "name": "Çok İmzalı",
                "supported": true,
                "vetoed": true
            }
        }
    }
}
```


JSON-RPC
```json
200 OK

{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "Çok İmzalı",
            "supported": true,
            "vetoed": false
        },
        "status": "success"
    }
}
```


Komut satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005 ile bağlanılıyor

{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "Çok İmzalı",
            "supported": true,
            "vetoed": false
        },
        "status": "success"
    }
}
```




Yanıt, [standart formata](https://github.com/XRPLF/rippled/) uyar, başarılı bir sonuç **değişikliklerin haritasını** bir JSON nesnesi olarak içerir. 

Nesnenin anahtarları değişiklik ID'leridir. Her anahtar için değerler, o ID'ye sahip değişikliğin durumunu tanımlayan _değişiklik nesneleri_ dir. İstek bir `feature` belirtiyorsa, harita yalnızca istenen değişiklik nesnesini içerir, istekten gelen herhangi bir değişiklik uygulandıktan sonra. 

Her değişiklik nesnesinin aşağıdaki alanları vardır:

| `Alan`      | Tip     | Açıklama                                          |
|:------------|:--------|:--------------------------------------------------|
| `enabled`   | Boolean | Bu değişikliğin mevcut defterde şu anda etkin olup olmadığı. |
| `name`      | String  | (Atlanabilir) Bu değişikliğin biliniyorsa insan tarafından okunabilir adı. |
| `supported` | Boolean | Sunucunun bu değişikliği uygulayıp uygulayamayacağını bilip bilmediği. Bu alan `false` (sunucu bu değişikliği uygulamayı bilmiyor) ve `enabled` `true` (bu değişiklik mevcut defterde etkin) olarak ayarlandığında, bu değişiklik sunucunuzu `değişiklik engelli` yapabilir. |
| `vetoed`    | Boolean veya String | Çoğu değişiklik için, bu değişiklik aleyhine oy vermek için sunucunun talimat alıp almadığını gösteren bir boolean değeridir. Kodda eski olarak işaretlenmiş değişiklikler için, bunun yerine `Obsolete` stringi vardır. badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0Güncellenmiştir: rippled 1.11.0/badge %} |

:::warning
`name` bir değişiklik için tam olarak o değişikliğin ne yaptığını göstermez. İsim, sunucular arasında benzersiz veya tutarlı olacağı garanti edilmez.
:::

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `badFeature` - Belirtilen `feature` geçersiz biçimlendirilmiş veya sunucu, o isimde bir değişikliği bilmiyor.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları yalnızca) Bu yöntem Raporlama Modu'nda mevcut değil.

raw-partial file="/docs/_snippets/common-links.md