# Blok düzeni

:::info
Bu sayfadaki anlayışınızı artırmak için, `TL-B dili` ile tanışmanız şiddetle tavsiye edilir.
:::

Blockchain'deki bir blok, tamamlandığında bu merkeziyetsiz defterin kalıcı ve değiştirilemez bir parçası olarak blockchain'e eklenen yeni işlemlerin kaydıdır. Her blok, işlemler verisi, zaman ve bir önceki blok ile ilgili bir referans gibi bilgileri içerir, böylece blokların bir zincirini oluşturur.

TON Blockchain'deki bloklar, sistemin genel karmaşıklığı nedeniyle oldukça karmaşık bir yapıya sahiptir. Bu sayfa, bu blokların yapısını ve düzenini açıklamaktadır.

## Blok

Bir blokun ham TL-B şeması şöyle görünür:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Her bir alanı daha yakından inceleyelim.

## global_id:int32

Bu blokun oluşturulduğu ağın kimliği. Ana ağ için `-239` ve test ağı için `-3`.

## info:^BlockInfo

:::info
Bu alan, blok hakkındaki bilgileri içerir; örneğin, **sürümü**, **sıra numaraları**, **tanımlayıcılar** ve **diğer bayraklar**.
:::

```tlb
block_info#9bc7a987 version:uint32
    not_master:(## 1)
    after_merge:(## 1) before_split:(## 1)
    after_split:(## 1)
    want_split:Bool want_merge:Bool
    key_block:Bool vert_seqno_incr:(## 1)
    flags:(## 8) { flags <= 1 }
    seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr }
    { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no }
    shard:ShardIdent gen_utime:uint32
    start_lt:uint64 end_lt:uint64
    gen_validator_list_hash_short:uint32
    gen_catchain_seqno:uint32
    min_ref_mc_seqno:uint32
    prev_key_block_seqno:uint32
    gen_software:flags . 0?GlobalVersion
    master_ref:not_master?^BlkMasterInfo
    prev_ref:^(BlkPrevInfo after_merge)
    prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
    = BlockInfo;
```

| Alan                            | Tür                     | Açıklama                                                                                                           |
| ------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `version`                       | uint32                 | Blok yapısının sürümü.                                                                                             |
| `not_master`                    | (## 1)                 | Bu bloğun bir ana zincir bloğu olup olmadığını belirten bir bayrak.                                               |
| `after_merge`                   | (## 1)                 | Bu bloğun iki shardchain'in birleşiminden hemen sonra oluşturulup oluşturulmadığını belirten bir bayrak.          |
| `before_split`                  | (## 1)                 | Bu bloğun shardchain'inin bölünmesinden hemen önce oluşturulup oluşturulmadığını belirten bir bayrak.            |
| `after_split`                   | (## 1)                 | Bu bloğun shardchain'inin bölünmesinden hemen sonra oluşturulup oluşturulmadığını belirten bir bayrak.           |
| `want_split`                    | Bool                   | Bir shardchain bölünmesinin isteyip istenmediğini belirten bir bayrak.                                           |
| `want_merge`                    | Bool                   | Bir shardchain birleşmesinin isteyip istenmediğini belirten bir bayrak.                                           |
| `key_block`                     | Bool                   | Bu bloğun bir anahtar bloğu olup olmadığını belirten bir bayrak.                                                  |
| `vert_seqno_incr`               | (## 1)                 | Dikey sıra numarasının artışı.                                                                                     |
| `flags`                         | (## 8)                 | Bloğa ait ek bayraklar.                                                                                           |
| `seq_no`                        | #                      | Bloğa ait sıra numarası.                                                                                          |
| `vert_seq_no`                   | #                      | Bloğa ait dikey sıra numarası.                                                                                     |
| `shard`                         | ShardIdent             | Bu bloğun ait olduğu shard'ın tanımlayıcısı.                                                                     |
| `gen_utime`                     | uint32                 | Bloğun üretim zamanı.                                                                                            |
| `start_lt`                      | uint64                 | Bloğa ait başlangıç mantıksal zamanı.                                                                             |
| `end_lt`                        | uint64                 | Bloğa ait bitiş mantıksal zamanı.                                                                                 |
| `gen_validator_list_hash_short` | uint32                 | Bu bloğun üretimi sırasında doğrulayıcılar listesinin kısa hash'i.                                               |
| `gen_catchain_seqno`            | uint32                 | Bu blok ile ilişkili `Catchain` sıra numarası.                                                    |
| `min_ref_mc_seqno`              | uint32                 | Referans verilen ana zincir bloğunun minimum sıra numarası.                                                      |
| `prev_key_block_seqno`          | uint32                 | Önceki anahtar bloğun sıra numarası.                                                                             |
| `gen_software`                  | GlobalVersion          | Bloğu üreten yazılımın versiyonu. Sadece `version`'ın ilk biti `1` olarak ayarlandığında sunulur.              |
| `master_ref`                    | BlkMasterInfo          | Bloğun ana olmadığında ana bloğa referans. Referans olarak saklanmıştır.                                         |
| `prev_ref`                      | BlkPrevInfo after_merge | Önceki bloğa referans. Referans olarak saklanmıştır.                                                              |
| `prev_vert_ref`                 | BlkPrevInfo 0         | Dikey sıradaki önceki bloğa referans, varsa. Referans olarak saklanmıştır.                                       |

### value_flow:^ValueFlow

Bu alan, blok içindeki para akışını, toplanan ücretler ve para içeren diğer işlemleri temsil eder.

```tlb
value_flow#b8e48dfb ^[ from_prev_blk:CurrencyCollection
    to_next_blk:CurrencyCollection
    imported:CurrencyCollection
    exported:CurrencyCollection ]
    fees_collected:CurrencyCollection
    ^[
    fees_imported:CurrencyCollection
    recovered:CurrencyCollection
    created:CurrencyCollection
    minted:CurrencyCollection
    ] = ValueFlow;
```

| Alan             | Tür                                                                   | Açıklama                                                                      |
| ---------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `from_prev_blk`  | `CurrencyCollection` | Önceki bloktan para akışını temsil eder.                                       |
| `to_next_blk`    | `CurrencyCollection` | Bir sonraki bloka para akışını temsil eder.                                     |
| `imported`       | `CurrencyCollection` | Bloka ithal edilen para akışını temsil eder.                                   |
| `exported`       | `CurrencyCollection` | Bloktan ihraç edilen para akışını temsil eder.                                 |
| `fees_collected` | `CurrencyCollection` | Blokta toplanan toplam ücret miktarı.                                          |
| `fees_imported`  | `CurrencyCollection` | Bloka ithal edilen ücret miktarı. Sadece ana zincirde sıfırdan farklıdır.      |
| `recovered`      | `CurrencyCollection` | Blokta kurtarılan para miktarı. Sadece ana zincirde sıfırdan farklıdır.         |
| `created`        | `CurrencyCollection` | Blokta oluşturulan yeni paranın miktarı. Sadece ana zincirde sıfırdan farklıdır. |
| `minted`         | `CurrencyCollection` | Blokta madencilik yapılan para miktarı. Sadece ana zincirde sıfırdan farklıdır.  |

## state_update:^(MERKLE_UPDATE ShardState)

Bu alan, shard durumunun güncellemelerini temsil eder.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Alan      | Tür                      | Açıklama                                        |
| ---------- | ------------------------- | -------------------------------------------------- |
| `old_hash` | bits256                   | Shard durumunun eski hash'i.                   |
| `new_hash` | bits256                   | Shard durumunun yeni hash'i.                   |
| `old`      | `ShardState` | Shard'ın eski durumu. Referans olarak saklanmıştır. |
| `new`      | `ShardState` | Shard'ın yeni durumu. Referans olarak saklanmıştır. |

### ShardState

`ShardState`, ya shard hakkında bilgi içerebilir ya da bu shard bölündüğünde, sol ve sağ bölünmüş parçalar hakkında bilgi içerebilir.

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState Bölünmemiş 

```tlb
shard_state#9023afe2 global_id:int32
    shard_id:ShardIdent
    seq_no:uint32 vert_seq_no:#
    gen_utime:uint32 gen_lt:uint64
    min_ref_mc_seqno:uint32
    out_msg_queue_info:^OutMsgQueueInfo
    before_split:(## 1)
    accounts:^ShardAccounts
    ^[ overload_history:uint64 underload_history:uint64
    total_balance:CurrencyCollection
    total_validator_fees:CurrencyCollection
    libraries:(HashmapE 256 LibDescr)
    master_ref:(Maybe BlkMasterInfo) ]
    custom:(Maybe ^McStateExtra)
    = ShardStateUnsplit;
```

| Alan                  | Tür                                                                   | Gerekli | Açıklama                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global_id`            | int32                                                                  | Evet     | Bu shard'ın ait olduğu ağın kimliği. Ana ağ için `-239` ve test ağı için `-3`.                                                                          |
| `shard_id`             | ShardIdent                                                             | Evet     | Shard'ın tanımlayıcısı.                                                                                                                               |
| `seq_no`               | uint32                                                                 | Evet     | Bu shardchain ile ilişkili en son sıra numarası.                                                                                                        |
| `vert_seq_no`          | #                                                                      | Evet     | Bu shardchain ile ilişkili en son dikey sıra numarası.                                                                                                  |
| `gen_utime`            | uint32                                                                 | Evet     | Shard'ın oluşturulmasıyla ilgili zamanı.                                                                                                              |
| `gen_lt`               | uint64                                                                 | Evet     | Shard'ın oluşturulmasıyla ilgili mantıksal zaman.                                                                                                     |
| `min_ref_mc_seqno`     | uint32                                                                 | Evet     | Referans verilen en son ana zincir bloğunun sıra numarası.                                                                                             |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                        | Evet     | Bu shard'ın dış mesaj kuyruğuna ilişkin bilgi. Referans olarak saklanmıştır.                                                                            |
| `before_split`         | ## 1                                                                   | Evet     | Bu shardchain'in bir sonraki blokta bölünüp bölünmeyeceğini belirten bir bayrak.                                                                       |
| `accounts`             | ShardAccounts                                                          | Evet     | Shard'daki hesapların durumu. Referans olarak saklanmıştır.                                                                                            |
| `overload_history`     | uint64                                                                 | Evet     | Shard için aşırı yük olaylarının geçmişi. Sharding ile yük dengeleme amacıyla kullanılır.                                                               |
| `underload_history`    | uint64                                                                 | Evet     | Shard için düşük yük olaylarının geçmişi. Sharding ile yük dengeleme amacıyla kullanılır.                                                                |
| `total_balance`        | `CurrencyCollection` | Evet     | Shard için toplam bakiye.                                                                                                                                 |
| `total_validator_fees` | `CurrencyCollection` | Evet     | Shard için toplam doğrulayıcı ücretleri.                                                                                                               |
| `libraries`            | HashmapE 256 LibDescr                                                  | Evet     | Bu shard'ın kütüphane tanımlarının hashmap'i. Şu anda, yalnızca ana zincirde boş olmayan bir alan.                                                     |
| `master_ref`           | BlkMasterInfo                                                          | Hayır     | Ana blok bilgisine bir referans.                                                                                                                       |
| `custom`               | McStateExtra                                                           | Hayır     | Shard durumu için özel ek veri. Bu alan yalnızca ana zincirde mevcuttur ve tüm ana zincir ile ilgili verileri içerir. Referans olarak saklanmıştır.          |

### ShardState Bölünmüş

| Alan   | Tür                                        | Açıklama                                                |
| ------- | ------------------------------------------- | ------------------------------------------------------- |
| `left`  | `ShardStateUnsplit` | Sol bölünmüş shard'ın durumu. Referans olarak saklanmıştır. |
| `right` | `ShardStateUnsplit` | Sağ bölünmüş shard'ın durumu. Referans olarak saklanmıştır. |

## extra:^BlockExtra

Bu alan, blok hakkında ek bilgi içerir.

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Alan            | Tür                          | Gerekli | Açıklama                                                                                                                                                  |
| ---------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `in_msg_descr`   | InMsgDescr                    | Evet     | Bloktaki gelen mesajların tanımlayıcısı. Referans olarak saklanmıştır.                                                                                   |
| `out_msg_descr`  | OutMsgDescr                   | Evet     | Bloktaki giden mesajların tanımlayıcısı. Referans olarak saklanmıştır.                                                                                   |
| `account_blocks` | ShardAccountBlocks            | Evet     | Blokta işlenen tüm işlemler ve shard'a atanan hesapların durum güncellemeleri. Referans olarak saklanmıştır.                                               |
| `rand_seed`      | bits256                       | Evet     | Blok için rastgele tohum.                                                                                                                                 |
| `created_by`     | bits256                       | Evet     | Bloğu oluşturan varlık (genellikle bir doğrulayıcının kamu anahtarı).                                                                                      |
| `custom`         | `McBlockExtra` | Hayır      | Bu alan yalnızca ana zincirde mevcut olup, tüm ana zincir ile ilgili verileri içerir. Blok için özel ek veri. Referans olarak saklanmıştır.                 |

### McBlockExtra

Bu alan, ana zincir bloğu hakkında ek bilgi içerir.

```tlb
masterchain_block_extra#cca5
    key_block:(## 1)
    shard_hashes:ShardHashes
    shard_fees:ShardFees
    ^[ prev_blk_signatures:(HashmapE 16 CryptoSignaturePair)
    recover_create_msg:(Maybe ^InMsg)
    mint_msg:(Maybe ^InMsg) ]
    config:key_block?ConfigParams
    = McBlockExtra;
```

| Alan                  | Tür                             | Gereklidir | Açıklama                                                                                             |
| --------------------- | ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `key_block`           | ## 1                            | Evet       | Bloğun bir anahtar bloğu olup olmadığını belirten bayrak.                                           |
| `shard_hashes`        | ShardHashes                     | Evet       | İlgili shard zincirlerinin en son bloklarının hash'leri.                                            |
| `shard_fees`          | ShardFees                       | Evet       | Bu blokta tüm shard'lardan toplanan toplam ücretler.                                                |

| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Evet       | Önceki blok imzaları.                                                                                |
| `recover_create_msg`  | InMsg                           | Hayır      | Varsa, ek para birimlerinin kurtarılmasına ilişkin mesaj. Bir referansta saklanır.                  |
| `mint_msg`            | InMsg                           | Hayır      | Varsa, ek para birimlerinin basımına ilişkin mesaj. Bir referansta saklanır.                        |
| `config`              | ConfigParams                    | Hayır      | Bu blok için geçerli yapılandırma parametreleri. Bu alan yalnızca `key_block` ayarlandığında bulunur. |

## Ayrıca bakınız

- :::info **Beyaz kitapta** [Blok düzeni](https://docs.ton.org/tblkch.pdf#page=96&zoom=100,148,172) ile ilgili orijinal açıklama.  
  
---  

### Önemli Notlar

- :::tip **Anahtar Blok**: `key_block` alanının varlığının, blok zinciri mimarisi için önemli olduğunu unutmayın.
- :::warning **Şard Ücretleri**: `shard_fees` toplamının doğru hesaplanmasına dikkat edin; bu, ağ işlerken kaynak yönetimi için kritik öneme sahiptir.
  
--- 

> **Hatırlatıcı:** `config` alanı yalnızca `key_block` ayarlandığında mevcuttur.  
> — Dikkatli olun, bu durum yapılandırmanızı etkileyebilir.