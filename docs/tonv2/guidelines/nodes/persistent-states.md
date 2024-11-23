# Kalıcı Durumlar

Düğümler, blok zincirinin durumlarının anlık görüntülerini periyodik olarak saklar. Her durum, belirli bir ana zincir bloğunda oluşturulur ve belirli bir TTL'ye sahiptir. Blok ve TTL, aşağıdaki algoritma kullanılarak seçilir:

:::tip
**Sadece anahtar bloklar** seçilebilir. 
:::

Bir bloğun bazı zaman damgası `ts` vardır. `2^17` saniye uzunluğunda (yaklaşık 1.5 gün) zaman dilimleri vardır. Zaman damgası `ts` olan bir bloğun periyodu, şu şekilde hesaplanır:

```
x = floor(ts / 2^17)
```

Her periyottan ilk anahtar blok, kalıcı bir durumu oluşturmak için seçilir.

Bir durumun TTL'si şöyle belirlenir:

```
TTL = 2^(18 + ctz(x))
```
Burada `ctz(x)`, `x`'in ikili temsilindeki son sıfırların sayısını ifade eder (yani `x`'in `2^y` ile tam bölünebildiği en büyük `y`).

:::info
Bu, kalıcı durumların her 1.5 günde bir oluşturulduğu anlamına gelir; bunların yarısı `2^18` saniye (3 gün), geri kalan durumların yarısı ise `2^19` saniye (6 gün) TTL'ye sahiptir ve bu şekilde devam eder.
:::

2024 yılında aşağıdaki uzun vadeli (en az 3 ay) kalıcı durumlar bulunmaktadır:

| Blok seqno | Blok zamanı | TTL | Süresi Doluyor |
|--:|--:|--:|--:|
| [8930706](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=8930706) | 2021-01-14 15:08:40 | 12427 gün | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=27747086) | 2023-03-02 05:08:11 | 1553 gün | 2027-06-02 19:50:19 |
| [32638387](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=32638387) | 2023-09-12 09:27:36 | 388 gün | 2024-10-04 18:08:08 |
| [34835953](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=34835953) | 2023-12-18 11:37:48 | 194 gün | 2024-06-29 15:58:04 |
| [35893070](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=35893070) | 2024-02-05 00:42:50 | 97 gün | 2024-05-12 02:52:58 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=36907647) | 2024-03-24 13:47:57 | 776 gün | 2026-05-10 07:09:01 |

:::warning
Düğüm ilk kez başladığında, bir kalıcı durumu indirmesi gerekir. 
:::

Bu, [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp) dosyasında uygulanmıştır.

:::note
Başlangıç bloğundan itibaren, düğüm tüm daha yeni anahtar blokları indirir. 
:::

Mevcut olan en son kalıcı duruma sahip anahtar bloğu seçer (yukarıdaki formülü kullanarak) ve ardından ilgili ana zincir durumunu ve tüm parçalar için durumları (veya sadece bu düğüm için gerekli olan parçaları) indirir.