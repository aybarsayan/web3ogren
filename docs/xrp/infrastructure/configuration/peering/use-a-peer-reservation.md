---
title: Eş Rezervasyonu Kullanma
seoTitle: Eş Rezervasyonu Kullanma | XRP Ledger
sidebar_position: 4
description: Eş rezervasyonları kullanarak sunucular arasında güvenli bağlantılar kurmanın adımlarını öğrenin. Bu rehber, sürecin nasıl gerçekleştirileceğine dair net bilgiler sunar.
tags: 
  - eş rezervasyonu
  - sunucu bağlantısı
  - XRP Ledger
  - hub sunucu
  - teknik yönetim
keywords: 
  - eş rezervasyonu
  - sunucu bağlantısı
  - hub sunucu
  - stok sunucu
  - XRP Ledger
  - güvenlik duvarı
---

## Eş Rezervasyonu Kullanma

Bir [eş rezervasyonu][] , `rippled` sunucusunun rezervasyona uyan bir eşten her zaman bağlantı kabul etmesini sağlayan bir ayardır. Bu sayfa, iki sunucu arasında tutarlı bir eşler arası bağlantı sağlamak için eş rezervasyonlarını nasıl kullanacağınızı, her iki sunucunun yöneticilerinin işbirliği ile açıklar.

Eş rezervasyonları, genellikle iki sunucunun farklı taraflarca işletildiği durumlarda en yararlıdır ve gelen bağlantıyı alan sunucu, birçok eşi bulunan bir `hub sunucu`dur. Açıklık olması açısından, bu talimatlar aşağıdaki terimleri kullanır:

- Giden bağlantıyı yapan sunucu **stok sunucu**dur. Bu sunucu, hub sunucudaki eş rezervasyonunu _kullanır_.
- Gelen bağlantıyı alan sunucu **hub sunucu**dur. Yönetici bu sunucuya _eş rezervasyonu ekler_.

Ancak, bu talimatları kullanarak, biri sunucu veya her ikisi hub, doğrulayıcı veya stok sunucu olup olmadığına bakılmaksızın bir eş rezervasyonu ayarlayabilirsiniz. **Çoğunlukla yoğun olan sunucunun giden bağlantıyı yaptığı durumlarda da bir eş rezervasyonu kullanmak mümkündür, ancak bu süreç o yapılandırmayı açıklamaz.**

---

## Ön Koşullar

Bu adımları tamamlamak için aşağıdaki ön koşulları yerine getirmelisiniz:

- Her iki sunucunun yöneticileri `rippled` `kurulu` ve çalışır durumda olmalıdır.
- Her iki sunucunun yöneticileri işbirliği yapmayı kabul etmelidir ve iletişim kurabilmelidir. Herhangi bir gizli bilgi paylaşmanıza gerek olmadığı için genel bir iletişim kanalı yeterlidir.
- Hub sunucusu, gelen eş bağlantılarını alabilmelidir. Bunun için bir güvenlik duvarını nasıl yapılandıracağınızla ilgili talimatlar için `Portları İleri Yönlendirme` sayfasına bakın.
- **Her iki sunucu da aynı `XRP Ledger ağı` ile senkronize olacak şekilde yapılandırılmalıdır; bu, üretim XRP Ledger, Testnet veya Devnet gibi bir ağa işaret edebilir.**

---

## Adımlar

Bir eş rezervasyonunu kullanmak için aşağıdaki adımları tamamlayın:

### 1. (Stok Sunucu) Kalıcı bir düğüm anahtar çifti ayarlayın

Stok sunucunun yöneticisi bu adımı tamamlar.

Eğer sunucunuzu kalıcı bir düğüm anahtar çifti değeri ile zaten yapılandırdıysanız, `adım 2: Düğüm genel anahtarınızı eşin yöneticisine iletin` kısmına geçebilirsiniz. (Örneğin, her sunucu için kalıcı bir düğüm anahtar çifti ayarlamak, `bir sunucu kümesi oluşturma` sürecinin bir parçasıdır.)

:::tip
**Kalıcı bir düğüm anahtar çifti ayarlamak isteğe bağlıdır, ancak sunucunuzun veritabanlarını silmeniz veya yeni bir makineye geçmeniz gerektiğinde eş rezervasyonunu korumayı kolaylaştırır.** Kalıcı bir düğüm anahtar çifti ayarlamak istemiyorsanız, sunucunuzun `pubkey_node` alanında rapor edilen otomatik olarak oluşturulmuş düğüm genel anahtarını kullanabilirsiniz.
:::

1. [validation_create method][] kullanarak yeni, rastgele bir anahtar çifti oluşturun. (`secret` değerini hariç tutun.)

    Örneğin:

    ```
    rippled validation_create

    Loading: "/etc/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "status" : "success",
          "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
          "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
          "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
       }
    }
    ```

    `validation_seed` (düğüm tohum değeri) ve `validation_public_key` değerini (düğüm genel anahtarı) kaydedin.

2. `rippled`'in yapılandırma dosyasını düzenleyin.

    ```
    vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

3. Önceki adımda oluşturduğunuz `validation_seed` değerini kullanarak bir `[node_seed]` bölümü ekleyin.

    Örneğin:

    ```
    [node_seed]
    ssZkdwURFMBXenJPbrpE14b6noJSu
    ```

    :::warning
    **Tüm sunucuların benzersiz `[node_seed]` değerlerine sahip olması gerekir.** Yapılandırma dosyanızı başka bir sunucuya kopyalarsanız, `[node_seed]` değerini kaldırdığınızdan veya değiştirdiğinizden emin olun. `[node_seed]`'inizi gizli tutun; kötü niyetli bir kişi bu değere erişirse, XRP Ledger eşler arası iletişimde sunucunuzu taklit etmek için bunu kullanabilir.
    :::

4. `rippled` sunucunuzu yeniden başlatın:

    ```
    systemctl restart rippled
    ```

### 2. Stok sunucunun düğüm genel anahtarını iletin

Stok sunucunun yöneticisi, stok sunucunun genel anahtarının ne olduğunu hub sunucunun yöneticisine iletir. (Adım 1'deki `validation_public_key` değerini kullanın.) Hub sunucu yöneticisi, bir sonraki adımlar için bu değere ihtiyaç duyar.

### 3. (Hub Sunucu) Eş rezervasyonunu ekleyin

Hub sunucunun yöneticisi bu adımı tamamlar.

Önceki adımda aldığınız düğüm genel anahtarını kullanarak bir rezervasyon eklemek için [peer_reservations_add method][] kullanın. Örneğin:

```sh
$ rippled peer_reservations_add n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG "Açıklama burada"

Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "status": "success"
  }
}
```

:::tip
**Açıklama isteğe bağlı bir alandır ve bu rezervasyonun kim için olduğunu belirten insanın anlayabileceği bir not eklemenize olanak tanır.**
:::

### 4. Hub sunucunun mevcut IP adresini ve eş portunu iletin

Hub sunucunun yöneticisi, sunucusunun mevcut IP adresini ve eş portunu stok sunucunun yöneticisine bildirmelidir. Hub sunucu bir güvenlik duvarının arkasındaysa ve ağ adresi çevirisi (NAT) yapıyorsa, sunucunun _harici_ IP adresini kullanın. Varsayılan yapılandırma dosyası, eş protokolü için 51235 portunu kullanır.

### 5. (Stok Sunucu) Eş sunucuya bağlanın

Stok sunucunun yöneticisi bu adımı tamamlar.

Sunucunuzu hub sunucusuna bağlamak için [connect method][] kullanın. Örneğin:



WebSocket
```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```


JSON-RPC
```
{
    "method": "connect",
    "params": [
        {
            "ip": "169.54.2.151",
            "port": 51235
        }
    ]
}
```


Commandline
```
rippled connect 169.54.2.151 51235
```




Eğer hub sunucu yöneticisi, önceki adımlarda açıklandığı gibi eş rezervasyonunu ayarladıysa, **bu otomatik olarak bağlanmalı ve mümkün olduğunca bağlı kalmalıdır.**

---

## Sonraki Adımlar

Bir sunucu yöneticisi olarak, sunucunuzun diğer eşler için sahip olduğu rezervasyonları yönetebilirsiniz. (Başka hangi sunucuların sizin için rezervasyonları olduğu kontrol edilemez.) Şunları yapabilirsiniz:

- Daha fazla eş rezervasyonu ekleyebilir veya açıklamalarını güncelleyebilirsiniz; bunu [peer_reservations_add method][] kullanarak yapabilirsiniz.
- Hangi sunucular için rezervasyonlar yapılandırdığınızı kontrol edebilirsiniz; bunu [peer_reservations_list method][] kullanarak yapabilirsiniz.
- Rezervasyonlarınızdan birini [peer_reservations_del method][] kullanarak kaldırabilirsiniz.
- Hangi eşlerin şu anda bağlı olduğunu ve ne kadar bant genişliği kullandıklarını kontrol edebilirsiniz; bunu [peers method][] kullanarak yapabilirsiniz.

:::tip
**İstenmeyen bir eşten hemen çıkmak için bir API yöntemi bulunmamakla birlikte, istemeyen bir eşin sunucunuza bağlanmasını engellemek için `firewalld` gibi bir yazılım güvenlik duvarı kullanabilirsiniz.** Örnekler için, topluluk katkılı [rbh script](https://github.com/gnanderson/rbh) sayfasına bakın.
:::

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Eş Protokolü`
    - `Konsensüs`
    - `Paralel Ağlar`
- **Kılavuzlar:**
    - `Kapacity Planlama`
    - `rippled` Hata Ayıklama`
- **Referanslar:**
    - [peers method][]
    - [peer_reservations_add method][]
    - [peer_reservations_del method][]
    - [peer_reservations_list method][]
    - [connect method][]
    - [fetch_info method][]
    - `Eş Tarayıcı`

