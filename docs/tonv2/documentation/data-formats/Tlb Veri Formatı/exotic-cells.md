# Ekzotik Hücreler

Her Hücrenin -1 ile 255 arasında kodlanmış kendi türü vardır. -1 türündeki Hücre `olağan` Hücre olarak adlandırılır ve diğer tüm Hücreler `ekzotik` veya `özel` olarak adlandırılır. Bir ekzotik hücrenin türü, verilerinin ilk sekiz bitinde saklanır. Eğer bir ekzotik hücre sekizden az veri bitine sahipse, geçersiz kabul edilir. Şu anda 4 ekzotik Hücre türü vardır:

```json
{
  "Pruned Branch": 1,
  "Library Reference": 2,
  "Merkle Proof": 3,
  "Merkle Update": 4
}
```

### Budanmış Dal

Budanmış dallar, silinmiş Hücre alt ağaçlarını temsil eden Hücrelerdir.

`1  {
    32[0000000F] -> {
        1[80] -> {
            32[0000000E]
        },
        1[00] -> {
            32[0000000C]
        }
    },
    16[000B] -> {
        4[80] -> {
            267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
            512[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064]
        }
    }
}
```

Ancak yalnızca hash'ini `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977` bildiğimiz için, hücre `a` `267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]`’nın gerçekten `c`'nin bir parçası olduğunu kanıtlamak istiyoruz; tüm `c`'yi almak istemiyoruz. Bu yüzden kanıtlayıcıdan, ilgilenmediğimiz tüm dalları Budanmış dal hücreleri ile değiştiren bir Merkle Kanıtı oluşturmasını isteriz.

:::info
`a`'ya ulaşmanın mümkün olmadığı ilk `c` alt nesnesi `ref1`'dir:
```json
32[0000000F] -> {
    1[80] -> {
        32[0000000E]
    },
    1[00] -> {
        32[0000000C]
    }
}
```
Bu yüzden kanıtlayıcı, hash'ini (`ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc`) hesaplar, bir Budanmış Dal oluşturur `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]` ve `ref1`'i bu Budanmış Dal ile değiştirir.
:::

İkincisi `512[0000000...00000000064]` olduğundan, kanıtlayıcı bu Hücreyi de değiştirmek için Budanmış dal oluşturur:
```json
24[000078] -> {
    288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
    16[000B] -> {
        4[80] -> {
            267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
            288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
        }
    }
}
```

Kanıtlayıcının doğrulayıcıya (bu örnekte bize) gönderdiği sonuç Merkle Kanıtı şu şekildedir:

```json
280[0344EFD0FDFFFA8F152339A0191DE1E1C5901FDCFE13798AF443640AF99616B9770003] -> {
    24[000078] -> {
        288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
        16[000B] -> {
            4[80] -> {
                267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
                288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
            }
        }
    }
}
```

Biz (doğrulayıcı), Kanıt Hücresini aldığımızda verilerinin `c` hash'ini içerdiğinden emin oluyoruz ve ardından tek Kanıt referansından `Hash_1` hesaplıyoruz: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977` ve bunun `c` hash'i ile karşılaştırıyoruz.

Artık hash'lerin eşleştiğini kontrol ettikten sonra, hücreye derinlemesine inmemiz ve ilgilendiğimiz bir Hücre `a` olup olmadığını doğrulamamız gerekiyor.

Böyle kanıtlar, hesaplama yükünü ve doğrulayıcıya gönderilmesi veya saklanması gereken veri miktarını tekrar tekrar azaltır.

---

## Ayrıca Bakınız

* `Gelişmiş Kanıt Doğrulama Örnekleri`