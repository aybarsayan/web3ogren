# İşlem düzeni

:::info
Bu sayfayı daha iyi anlamanızı sağlamak için `TL-B dili` ile tanışmanız önerilir.
:::

TON Blockchain, üç ana bileşen etrafında çalışır: hesaplar, mesajlar ve işlemler. Bu sayfa, işlemlerin yapısını ve düzenini açıklar.

Bir işlem, belirli bir hesaba ait içeriye ve dışarıya mesajları işleyen bir operasyon olup, hesabın durumunu değiştirebilir ve doğrulayıcılar için ücretler oluşturabilir.

## İşlem

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Alan              | Tür                                                                   | Gerekli | Açıklama                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                | Evet    | İşlemin gerçekleştirildiği adresin hash kısmı. `Adresler hakkında daha fazla bilgi`                                                  |
| `lt`              | uint64                                                                 | Evet    | _Mantıksal zaman_ı temsil eder. `Mantıksal zaman hakkında daha fazla bilgi`                                                      |
| `prev_trans_hash` | bits256                                                                | Evet    | Bu hesap üzerindeki bir önceki işlemin hash'i.                                                                                                                                                                 |
| `prev_trans_lt`   | uint64                                                                 | Evet    | Bu hesap üzerindeki bir önceki işlemin `lt`si.                                                                                                                                                                 |
| `now`             | uint32                                                                 | Evet    | Bu işlemi gerçekleştirirken ayarlanan `now` değeri. Bir Unix zaman damgasıdır, saniye cinsindendir.                                                                                                                       |
| `outmsg_cnt`      | uint15                                                                 | Evet    | Bu işlem gerçekleştirilirken oluşturulan giden mesajların sayısı.                                                                                                                                             |
| `orig_status`     | `AccountStatus`                                        | Evet    | İşlem gerçekleştirilmeden önce bu hesabın durumu.                                                                                                                                                       |
| `end_status`      | `AccountStatus`                                        | Evet    | İşlemi gerçekleştirdikten sonraki bu hesabın durumu.                                                                                                                                                           |
| `in_msg`          | (Message Any)                                                          | Hayır   | İşlemi başlatan gelen mesaj. Bir referansta saklanır.                                                                                                                          |
| `out_msgs`        | HashmapE 15 ^(Message Any)                                             | Evet    | Bu işlem gerçekleştirilirken oluşturulan giden mesajların listesini içeren sözlük.                                                                                                        |
| `total_fees`      | `CurrencyCollection` | Evet    | Bu işlem gerçekleştirilirken toplanan toplam ücretler. Bir _Toncoin_ değeri içerir ve muhtemelen bazı `Extra-currencyler` barındırabilir. |
| `state_update`    | `HASH_UPDATE` Account                                    | Evet    | `HASH_UPDATE` yapısı. Bir referansta saklanır.                                                                                                                                                                   |
| `description`     | `TransactionDescr`                            | Evet    | İşlem yürütme sürecine dair detaylı bir açıklama. Bir referansta saklanır.                                                                                                                                   |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

-   **[00]**: Hesap başlatılmamış
-   **[01]**: Hesap duraklatılmış
-   **[10]**: Hesap aktif
-   **[11]**: Hesap mevcut değil

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Alan       | Tür     | Açıklama                                                     |
| ---------- | ------  | ------------------------------------------------------------ |
| `old_hash` | bits256 | İşlem gerçekleştirilmeden önceki hesap durumunun hash'i. |
| `new_hash` | bits256 | İşlem gerçekleştirildikten sonraki hesap durumunun hash'i.  |

## TransactionDescr Türleri

-   `Sıradan`
-   `Depolama`
-   `Tick-tock`
-   `Bölü hazırlama`
-   `Bölü kurulum`
-   `Birleştirme hazırlama`
-   `Birleştirme kurulum`

## Sıradan

Bu, en yaygın işlem türüdür ve çoğu geliştiricinin ihtiyaçlarını karşılar. Bu tür işlemlerin kesin bir iç mesajı vardır ve birkaç dış mesaj oluşturabilir.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Alan          | Tür           | Gerekli | Açıklama                                                                                                                                                                               |
| -------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Evet      | Gelen bir mesajın `bounce` bayrağı ile ilişkili bir bayrak. `credit_first = !bounce`                                                                                                |
| `storage_ph`   | TrStoragePhase | Hayır     | İşlem yürütme depolama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `credit_ph`    | TrCreditPhase  | Hayır     | İşlem yürütme kredi aşamasına dair bilgileri içerir. `Daha fazla bilgi`                         |
| `compute_ph`   | TrComputePhase | Evet      | İşlem yürütme hesaplama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `action`       | TrActionPhase  | Hayır     | İşlem yürütme eylem aşamasına dair bilgileri içerir. `Daha fazla bilgi`. Bir referansta saklanır. |
| `aborted`      | Bool           | Evet      | İşlem yürütmesinin iptal edilip edilmediğini gösterir.                                                                                                                                  |
| `bounce`       | TrBouncePhase  | Hayır     | İşlem yürütme sırasındaki atlama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                           |
| `destroyed`    | Bool           | Evet      | İşlem sırasında hesabın yok edilip edilmediğini gösterir.                                                                                                                         |

## Depolama

Bu tür işlemler, doğrulayıcılar tarafından kendi takdirlerine bağlı olarak eklenebilir. Hiçbir gelen mesajı işleme almazlar ve herhangi bir kodu çağırmazlar. Tek etkileri, bir hesaptan depolama ödemelerini toplamaktır; bu da depolama istatistiklerini ve bakiyesini etkiler. Hesabın oluşan _Toncoin_ bakiyesi belirli bir miktarın altına düşerse, hesap duraklatılabilir ve kodu ile verileri birleşik hash'leri ile değiştirilebilir.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Alan        | Tür           | Açıklama                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `storage_ph` | TrStoragePhase | İşlem yürütme depolama aşamasına dair bilgileri içerir. `Daha fazla bilgi` |

## Tick-tock

`Tick` ve `Tock` işlemleri, her blokta otomatik olarak çağrılması gereken özel sistem akıllı sözleşmeleri için ayrılmıştır. `Tick` işlemleri, her ana zincir bloğunun başında, `Tock` işlemleri ise sonunda çağrılır.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Alan        | Tür           | Gerekli | Açıklama                                                                                                                                                                               |
| ------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Evet      | İşlem türünü belirten bir bayrak. `Tick` ve `Tock` işlemlerini ayırmada kullanılır.                                                                                                |
| `storage_ph` | TrStoragePhase | Evet      | İşlem yürütme depolama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `compute_ph` | TrComputePhase | Evet      | İşlem yürütme hesaplama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `action`     | TrActionPhase  | Hayır     | İşlem yürütme eylem aşamasına dair bilgileri içerir. `Daha fazla bilgi`. Bir referansta saklanır. |
| `aborted`    | Bool           | Evet      | İşlem yürütmesinin iptal edilip edilmediğini gösterir.                                                                                                                                  |
| `destroyed`  | Bool           | Evet      | İşlem sırasında hesabın yok edilip edilmediğini gösterir.                                                                                                                         |

## Bölü Hazırlama

:::note
**Bu işlem türü şu anda kullanılmamaktadır.** Bu süreç hakkında bilgi sınırlıdır.
:::

Bölme işlemleri, yüksek yük altında bölünmesi gereken büyük akıllı sözleşmelerde başlatılır. Sözleşme, bu işlem türünü desteklemeli ve yükü dengeleyecek şekilde bölme sürecini yönetmelidir.

Bölü hazırlama işlemleri, bir akıllı sözleşmenin bölünmesi gerektiğinde başlatılır. Akıllı sözleşme, kendisinin yeni bir örneği için dağıtılmak üzere durum oluşturmalıdır.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Alan        | Tür           | Gerekli | Açıklama                                                                                                                                                                               |
| ------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Evet      | Bölme süreci hakkında bilgi.                                                                                                                                                          |
| `storage_ph` | TrStoragePhase | Hayır     | İşlem yürütme depolama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `compute_ph` | TrComputePhase | Evet      | İşlem yürütme hesaplama aşamasına dair bilgileri içerir. `Daha fazla bilgi`                        |
| `action`     | TrActionPhase  | Hayır     | İşlem yürütme eylem aşamasına dair bilgileri içerir. `Daha fazla bilgi`. Bir referansta saklanır. |
| `aborted`    | Bool           | Evet      | İşlem yürütmesinin iptal edilip edilmediğini gösterir.                                                                                                                                  |
| `destroyed`  | Bool           | Evet      | İşlem sırasında hesabın yok edilip edilmediğini gösterir.                                                                                                                         |

## Bölü Kurulum

:::note
**Bu işlem türü şu anda kullanılmamaktadır.** Bu süreç hakkında bilgi sınırlıdır.
:::

Bölü kurulum işlemleri, yeni büyük akıllı sözleşme örnekleri oluşturmak için kullanılır. Yeni akıllı sözleşmenin durumu, bir `Bölü Hazırlama` işlemi tarafından üretilir.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Alan                 | Tür                        | Açıklama                                                                                                  |
| --------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo            | Bölme süreci hakkında bilgi.                                                                               |
| `prepare_transaction` | `Transaction` | Bölme işlemi için hazırlanan `işlem hakkında bilgi`. Bir referansta saklanır. |
| `installed`           | Bool                      | İşlemin kurulup kurulmadığını gösterir.                                                                   |

## Birleştirme Hazırlama

:::note
**Bu işlem türü şu anda kullanılmamaktadır.** Bu süreç hakkında bilgi sınırlıdır.
:::

Birleştirme işlemleri, yüksek yük nedeniyle bölünen büyük akıllı sözleşmelerin yeniden birleştirilmesi gerektiğinde başlatılır. Sözleşme, bu işlem türünü desteklemeli ve yükü dengelemek için birleştirme sürecini yönetmelidir.

Birleştirme hazırlama işlemleri, iki akıllı sözleşmenin birleştirilmesi gerektiğinde başlatılır. Akıllı sözleşme, birleştirmeyi kolaylaştırmak için kendisinin başka bir örneği için bir mesaj üretmelidir.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Alan        | Tür           | Açıklama                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | Birleştirme süreci hakkında bilgi.                                                                                                                                   |
| `storage_ph` | TrStoragePhase | İşlem yürütme depolama aşamasına dair bilgileri içerir. `Daha fazla bilgi` |
| `aborted`    | Bool           | İşlem yürütmesinin iptal edilip edilmediğini gösterir.                                                                                                           |

## Merge yükle

:::note
Bu tür bir işlem şu anda kullanılmamaktadır. Bu süreç hakkında bilgi sınırlıdır.
:::

Merge Yükleme işlemleri, büyük akıllı sözleşmelerin örneklerini birleştirmek için kullanılır. Birleştirmeyi kolaylaştıran özel mesaj, bir `Merge Prepare` işlemi tarafından üretilir.

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Alan                  | Tür                         | Gereken  | Açıklama                                                                                                                                                                               |
| --------------------- | --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Evet     | Birleştirme süreci hakkında bilgi.                                                                                                                                                          |
| `prepare_transaction` | `Transaction` | Evet     | Birleştirme işlemi için `hazırlanan işlem` hakkında bilgi. Referansta saklanır.                                                                              |

| `storage_ph`          | TrStoragePhase              | Hayır    | Bir işlem yürütmenin depolama aşaması hakkında bilgi içerir. `Daha Fazla Bilgi`                        | 
| `credit_ph`           | TrCreditPhase               | Hayır    | Bir işlem yürütmenin kredi aşaması hakkında bilgi içerir. `Daha Fazla Bilgi`                         |
| `compute_ph`          | TrComputePhase              | Evet     | Bir işlem yürütmenin hesaplama aşaması hakkında bilgi içerir. `Daha Fazla Bilgi`                        |
| `action`              | TrActionPhase               | Hayır    | Bir işlem yürütmenin eylem aşaması hakkında bilgi içerir. `Daha Fazla Bilgi`. Referansta saklanır. |
| `aborted`             | Bool                        | Evet     | İşlem yürütmenin iptal edilip edilmediğini belirtir.                                                                                                                                  |
| `destroyed`           | Bool                        | Evet     | İşlem sırasında hesabın yok edilip edilmediğini belirtir.                                                                                                                         |

## Ayrıca bakınız

-   Orijinal `İşlem düzeni` tarifine dair açıklama beyaz kitapta bulunabilir.

:::tip
Birleştirme işlemleri sırasında dikkat edilmesi gereken en önemli noktalardan biri, işlemlerin başarılı bir şekilde tamamlandığından emin olmaktır.
:::

:::info
Bu işlemler, akıllı sözleşmelere olan güvenliği artırmak için kritik öneme sahiptir.
:::

:::warning
Eğer birleştirme süreci sırasında bir hata oluşursa, bu yanıtı etkileyebilir. Lütfen süreci dikkatlice izleyin.
:::

:::quote
"Her bir işlem, akıllı sözleşme ağı içinde ayrı bir kriterle değerlendirilmelidir."  
— Akıllı Sözleşme Uzmanı
:::


Daha Fazla Bilgi için tıklayın

### İşlem ve Aşamaları

Bir süreç hakkında daha fazla bilgi edinmek için, yukarıda belirtilen bağlantılara göz atabilirsiniz. Bu kaynaklar, işlemlerin nasıl yürütüldüğü hakkında derinlemesine ipuçları sunmaktadır.

