---
title: Küme Rippled Sunucuları
seoTitle: Rippled Server Clustering Guide
sidebar_position: 4
description: Bu kılavuz, birden fazla rippled sunucusunu verimli bir şekilde yapılandırmayı ele alıyor. Aynı veri merkezinde birden fazla sunucu çalıştıranlar için pratik öneriler içerir.
tags: 
  - rippled sunucuları
  - küme yapılandırma
  - verimlilik
  - validation_create
  - peers method
keywords: 
  - rippled sunucuları
  - küme yapılandırma
  - verimlilik
  - validation_create
  - peers method
---

## Küme Rippled Sunucuları

Aynı veri merkezinde birden fazla `rippled` sunucusu çalıştırıyorsanız, verimliliği maksimize etmek için bunları bir `küme` olarak yapılandırabilirsiniz. Küme yapılandırmak için:

1. Her bir sunucunuzun IP adresini not edin.

2. Her bir sunucunuz için [validation_create method][] kullanarak benzersiz bir seed oluşturun.

    > **Örnek:** Komut satırı arayüzünü kullanarak:
    >
    > ```
    > $ rippled validation_create
    >
    > Loading: "/etc/rippled.cfg"
    > Connecting to 127.0.0.1:5005
    > {
    >    "result" : {
    >       "status" : "success",
    >       "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
    >       "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
    >       "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
    >    }
    > }
    > ```
    >
    > **Not:** Her yanıtın `validation_seed` ve `validation_public_key` parametrelerini güvenli bir yerde saklayın.

---

3. Her sunucuda, [config dosyasını](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg) düzenleyerek aşağıdaki bölümleri değiştirme:

    1. `[ips_fixed]` bölümünde, kümenin _diğer_ üyelerinin IP adreslerini ve bağlantı noktalarını listeleyin. Bu sunucuların her biri için port numarası, o sunucunun `rippled.cfg` dosyasındaki `protocol = peer` bağlantı noktasıyla (genellikle 51235) eşleşmelidir. Örneğin:

        ```
        [ips_fixed]
        192.168.0.1 51235
        192.168.0.2 51235
        ```

        Bu, bu sunucunun her zaman doğrudan bir eşler arası bağlantı kurmaya çalışacağı belirli eş sunucuları tanımlar.

        :::info
        Port numarasını atlarsanız, sunucu 2459 numaralı bağlantı noktasını, XRP Ledger protokolü için IANA tarafından atanmış olan bağlantı noktasını kullanır.
        :::

    2. `[node_seed]` bölümünde, sunucunun node seed'ini adım 2'de [validation_create method][] kullanarak oluşturduğunuz `validation_seed` değerlerinden birine ayarlayın. Her sunucu benzersiz bir node seed kullanmalıdır. Örneğin:

        ```
        [node_seed]
        ssZkdwURFMBXenJPbrpE14b6noJSu
        ```

        Bu, sunucunun eşler arası iletişimleri imzalamak için kullandığı anahtar çiftini tanımlar, validasyon mesajları hariçtir.

    3. `[cluster_nodes]` bölümünde, sunucunun kümesinin üyelerini `validation_public_key` değerleri ile tanımlayın. Her sunucu burada tüm _diğer_ küme üyelerinin genel anahtarlarını listelemelidir. İsteğe bağlı olarak, her sunucu için özel bir ad ekleyebilirsiniz. Örneğin:

        ```
        [cluster_nodes]
        n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar keynes
        n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa friedman
        ```

        Bu, sunucunun küme üyelerini tanımak için kullandığı anahtar çiftlerini tanımlar.

---

4. Config dosyasını kaydettikten sonra, her sunucuda `rippled`'i yeniden başlatın.

    ```
    # systemctl restart rippled
    ```

5. Her sunucunun artık kümenin bir üyesi olduğunu doğrulamak için [peers method][]. `cluster` alanı, her sunucu için genel anahtarları ve (eğer yapılandırılmışsa) özel adları listelemelidir.

    > **Örnek:** Komut satırı arayüzünü kullanarak:
    >
    > ```
    > $ rippled peers
    >
    > Loading: "/etc/rippled.cfg"
    > Connecting to 127.0.0.1:5005
    > {
    >   "result" : {
    >     "cluster" : {
    >         "n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar": {
    >           "tag": "keynes",
    >           "age": 1
    >         },
    >         "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa": {
    >           "tag": "friedman",
    >           "age": 1
    >         }
    >     },
    >     "peers" : [
    >       ... (omitted) ...
    >     ],
    >     "status" : "success"
    >   }
    > }
    > ```

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Peer Protokolü`
- **Eğitimler:**
    - `rippled'ı kurun`
- **Referanslar:**
    - [validation_create method][]
    - [peers method][]

