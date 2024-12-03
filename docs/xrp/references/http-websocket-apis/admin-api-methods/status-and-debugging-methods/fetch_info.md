---
title: Fetch Info
seoTitle: Fetch Info Command Overview
sidebar_position: 4
description: Sunucunun ağ ile senkronizasyonu hakkında bilgi almak için kullanılan fetch_info komutu, mevcut gönderimleri sıfırlamak amacıyla da kullanılabilir. Detaylı istek ve yanıt formatları aşağıda bulunmaktadır.
tags: 
  - fetch_info
  - ağ
  - senkronizasyon
  - RPC
  - yönetici yöntemi
keywords: 
  - fetch_info
  - ağ
  - senkronizasyon
  - RPC
  - yönetici yöntemi
---

# fetch_info
[[Kaynak]](https://github.com/XRPLF/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/FetchInfo.cpp "Kaynak")

`fetch_info` komutu, bu sunucunun şu anda ağdan almakta olduğu nesneler hakkında bilgi döndürür ve bu bilgilere sahip olan kaç tane eş (peer) olduğunu belirtir. Aynı zamanda mevcut gönderimleri sıfırlamak için de kullanılabilir.

:::info
_`fetch_info` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayacak bir `yönetici yöntemi` dir._
:::

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 91,
    "command": "fetch_info",
    "clear": false
}
```


JSON-RPC
```json
{
    "method": "fetch_info",
    "params": [
        {
            "clear": false
        }
    ]
}
```


Komut Satırı
```sh
#Syntax: fetch_info [clear]
rippled fetch_info
```




İstek aşağıdaki parametreleri içerir:

| `Alan` | Tür      | Açıklama                                              |
|:-------|:---------|:------------------------------------------------------|
| `clear` | Boolean  | Eğer `true` ise, mevcut gönderimleri sıfırlar. Aksi takdirde yalnızca devam eden gönderimlerin durumunu alır. |

### Yanıt Formatı

Başarılı bir yanıt için bir örnek:



JSON-RPC
```json
{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}
```




Yanıt, [standart formata][] uygundur ve başarılı bir sonuç, aşağıdaki alanları içerir:

| `Alan` | Tür   | Açıklama                                               |
|:-------|:------|:-------------------------------------------------------|
| `info`  | Nesne | Alınan nesnelerin haritası ve bu nesnelerin durumunu. Bir defterin alınması [defter indeksi][] ile tanımlanabilir; alınan defterler ve diğer nesneler de hash'leri ile tanımlanabilir. |

:::tip
Devam eden bir gönderimi tanımlayan alanlar, önceden haber vermeden değiştirilebilir. Aşağıdaki alanlar dahil edilebilir:
:::

| `Alan`               | Tür                    | Açıklama                |
|:---------------------|:----------------------|:------------------------|
| `hash`                | String                 | Alınan öğenin hash değeri. |
| `have_header`         | Boolean                | Bir defter için, bu sunucunun defterin başlık bölümünü zaten alıp almadığını gösterir. |
| `have_transactions`   | Boolean                | Bir defter için, bu sunucunun defterin işlem bölümünü zaten alıp almadığını gösterir. |
| `needed_state_hashes` | Dizi (Hash) String     | Bu öğeden hala gerekli olan durum nesnelerinin hash değerleri. Eğer 16'dan fazla gerekiyorsa, yanıt yalnızca ilk 16'sını içerir. |
| `peers`               | Sayı                  | Bu öğe için mevcut olan eş (peer) sayısı. |
| `timeouts`            | Sayı                  | Bu öğenin alınmasının zaman aşımına uğradığı sayısı (2.5 saniye). |

### Olası Hatalar

- Herhangi bir [evrensel hata tipi][].
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları için) Bu yöntem Raporlama Modunda mevcut değildir.

