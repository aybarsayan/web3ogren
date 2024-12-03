---
title: Rippledinizi Paralel Ağa Bağlayın
seoTitle: Rippled Sunucunuzu Test Ağına Bağlama Rehberi
sidebar_position: 1
description: Rippled sunucunuzu test ağına bağlayarak yeni özellikleri denemek veya sahte para ile işlevselliği test etmek için bağlayın. Bu kılavuz, test ağlarına bağlantı adımlarını detaylandırmaktadır.
tags: 
  - Rippled
  - Testnet
  - Devnet
  - Blockchain
  - Geliştirme
  - XRP
keywords: 
  - Rippled
  - Testnet
  - Devnet
  - Blockchain
  - Geliştirme
  - XRP
---

# Rippled'inizi Paralel Ağa Bağlayın

Geliştiricilerin uygulamalarını test etmeleri veya gerçek para riski olmadan özellikleri denemeleri için çeşitli `alternatif test ve geliştirme ağları` bulunmaktadır. **Bu ağlarda kullanılan fonlar gerçek fonlar değildir ve yalnızca test amaçlıdır.** `rippled` sunucunuzu bu test ağlarından birine bağlayabilirsiniz.

:::warning
**Dikkat:** Yeni ve deneysel özelliklere sahip test ağlarında, sunucunun ağı senkronize etmesi için bir ön üretim sürümü çalıştırmanız gerekebilir. Hangi kod sürümünün her ağ için gerekli olduğu hakkında bilgi için `Paralel Ağlar Sayfası`na bakın.
:::

## Adımlar

`rippled` sunucunuzu XRP Testnet veya Devnet'e bağlamak için şu adımları tamamlayın. Testnet veya Devnet'te kaldıktan sonra üretim Mainnet'a geri dönmek için bu adımları da kullanabilirsiniz.

## 1. Sunucunuzu doğru merkezi bağlayacak şekilde yapılandırın.

`rippled.cfg` dosyanızı düzenleyin.

partial file="/docs/_snippets/conf-file-location.md" /%}

1. Bağlanmak istediğiniz ağ için bir `[ips]` bölümü ayarlayın:

    

    ```Testnet
    [ips]
    s.altnet.rippletest.net 51235
    ```

    ```Devnet
    [ips]
    s.devnet.rippletest.net 51235
    ```

    ```Mainnet
    # [ips] bölümü yok. Mainnet'a bağlanmak için varsayılan merkezleri kullanın.
    ```

    ```Sidechain-Devnet
    [ips]
    sidechain-net2.devnet.rippletest.net 51235
    ```

    

2. Önceki `[ips]` bölümünü, varsa, yorum dışı bırakın:

    ```
    # [ips]
    # r.ripple.com 51235
    # sahyadri.isrdc.in 51235
    ```

3. Uygun bir değerle `[network_id]` bölümünü ekleyin:

    

    ```Testnet
    [network_id]
    testnet
    ```

    ```Devnet
    [network_id]
    devnet
    ```

    ```Mainnet
    [network_id]
    main
    ```

    ```Sidechain-Devnet
    [network_id]
    262
    ```

    

    Özel ağlar için, ağa bağlanan herkes, o ağa özgü bir değeri kullanmalıdır. Yeni bir ağ oluştururken, 11 ile 4,294,967,295 arasındaki tam sayılardan rastgele bir ağ kimliği seçin.

    :::info
    **Not:** Bu ayar, sunucunuzun aynı ağda bulunan akranlarını bulmasına yardımcı olur, ancak sunucunuzun hangi ağa bağlı olduğunu sıkı bir kontrol olarak tanımlamaz. UNL / güvenilir doğrulayıcı ayarları (bir sonraki adımda) sunucunun takip ettiği ağı tanımlar.
    :::

## 2. Güvenilir doğrulayıcı listenizi ayarlayın.

`validators.txt` dosyanızı düzenleyin. Bu dosya, `rippled.cfg` dosyanızla aynı klasörde bulunur ve sunucunuzun güvenmediği doğrulayıcıları tanımlar.

1. Bağlanmak istediğiniz ağ için `[validator_list_sites]` ve `[validator_list_keys]` bölümlerini açın veya ekleyin:

    

    ```Testnet
    [validator_list_sites]
    https://vl.altnet.rippletest.net

    [validator_list_keys]
    ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860
    ```

    ```Devnet
    [validator_list_sites]
    https://vl.devnet.rippletest.net

    [validator_list_keys]
    EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12
    ```

    ```Mainnet
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```

    ```Sidechain-Devnet
    [validator_list_sites]
    https://vlsidechain-net2.devnet.rippletest.net

    [validator_list_keys]
    EDA5504C7133743FADA46342229B4E9CBBE1CF9BCA19D16633574F7CBB72F79569
    ```

    

    :::tip
    **İpucu:** Önizleme paketleri, gerekli bölümleri önceden yapılandırılmış olarak içerebilir, ancak yine de kontrol edin.
    :::

2. Önceki `[validator_list_sites]`, `[validator_list_keys]` veya `[validators]` bölümlerini yorum dışı bırakın.

    Örneğin:

    ```
    # [validator_list_sites]
    # https://vl.ripple.com
    #
    # [validator_list_keys]
    # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

    # Eski kodlanmış Devnet Doğrulayıcı Listesi
    # [validators]
    # n9Mo4QVGnMrRN9jhAxdUFxwvyM4aeE1RvCuEGvMYt31hPspb1E2c
    # n9MEwP4LSSikUnhZJNQVQxoMCgoRrGm6GGbG46AumH2KrRrdmr6B
    # n9M1pogKUmueZ2r3E3JnZyM3g6AxkxWPr8Vr3zWtuRLqB7bHETFD
    # n9MX7LbfHvPkFYgGrJmCyLh8Reu38wsnnxA4TKhxGTZBuxRz3w1U
    # n94aw2fof4xxd8g3swN2qJCmooHdGv1ajY8Ae42T77nAQhZeYGdd
    # n9LiE1gpUGws1kFGKCM9rVFNYPVS4QziwkQn281EFXX7TViCp2RC
    # n9Jq9w1R8UrvV1u2SQqGhSXLroeWNmPNc3AVszRXhpUr1fmbLyhS
    ```

## 3. Özellikleri Etkinleştir (veya Devre Dışı Bırak)

Deneysel özellikleri kullanan bazı test ağlarında, yapılandırma dosyasında uygun özelliği zorla etkinleştirmeniz gerekir. Diğer ağlar için, `[features]` bölümünü kullanmamalısınız. Yapılandırma dosyanızın `[features]` bölümünü aşağıdaki gibi ekleyin veya değiştirin:



Testnet
```
# [features]
# Silin veya yorum dışı bırakın. Testnet'te özellikleri zorla etkinleştirmeyin.
```


Devnet
```
# [features]
# Silin veya yorum dışı bırakın. Devnet'te özellikleri zorla etkinleştirmeyin.
```


Mainnet
```
# [features]
# Silin veya yorum dışı bırakın. Mainnet'te özellikleri zorla etkinleştirmeyin.
```


Sidechain-Devnet
```
[features]
XChainBridge
```




:::danger
**Uyarı:** Mainnet veya Testnet'e bağlanırken `[features]` bölümünü kullanmayın. Ağın geri kalanından farklı özellikleri zorla etkinleştirmek, sunucunuzun ağı terk etmesine neden olabilir.
:::

## 4. Sunucuyu Yeniden Başlatın.

```sh
$ sudo systemctl restart rippled
```

## 5. Sunucunuzun senkronize olduğunu doğrulayın.

Bir yeniden başlatmadan sonra ağa senkronize olmak yaklaşık 5 ila 15 dakika sürer. Sunucunuz senkronize olduktan sonra, [server_info method][] ağa bağlandığınız ağa göre bir `validated_ledger` nesnesi gösterir.

> `rippled`'in doğru ağa bağlı olduğunu doğrulamak için sunucunuzdan gelen sonuçları Testnet veya Devnet üzerinde [bir kamu sunucuyla][public servers] karşılaştırın. `validated_ledger` nesnesinin `seq` alanı her iki sunucuda da aynı olmalıdır (kontrol ederken değiştiyse bir veya iki birim farklı olabilir). 
> — Kullanıcı Rehberi

Aşağıdaki örnek, komut satırından sunucunuzun en son doğrulanmış defterini nasıl kontrol edeceğinizi göstermektedir:

```sh
rippled server_info | grep seq
```

İstenilen ağda en son defter indeksini (`seq`) bulmak için `WebSocket Aracı'ndaki server_info` kullanabilirsiniz.

## Ayrıca Bakın

- **Araçlar:**
    - `XRP Muslukları`
    - `WebSocket API Aracı` - Bağlantı seçeneklerinde 'Testnet Kamu Sunucusu' veya 'Devnet Kamu Sunucusu'nu seçin.
- **Kavramlar:**
    - `Paralel Ağlar`
    - `Konsensüs`
- **Eğitimler:**
    - `rippled'i Doğrulayıcı Olarak Çalıştırma`
    - `rippled`'i Bağımsız Modda Çalıştırarak Test Etme`
    - `rippled` için Sorun Giderme`
- **Referanslar:**
    - [server_info method][]

