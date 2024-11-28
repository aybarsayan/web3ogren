---
title: Paymaster-API - BSC Paymaster
description: Paymaster API özelliği, cüzdan uygulamaları arasında birlikte çalışabilirliği sağlamak için standart bir arayüz spesifikasyonu seti sunar. Bu API'ler, gaz sponsorluğu entegrasyonunu kolaylaştırarak geliştiricilere etkin bir çözüm sunmaktadır.
keywords: [Paymaster, API, BSC, cüzdan uygulamaları, gaz sponsorluğu, JSON-RPC, Ethereum]
---

# Paymaster API Özelliği

Geniş çapta benimsemeyi kolaylaştırmak ve çeşitli cüzdan uygulamaları arasında birlikte çalışabilirliği sağlamak için, paymasterlar için standart bir arayüz spesifikasyonu seti oluşturmak kritik öneme sahiptir. Bu standartlaştırma, cüzdan geliştiricilerinin, kullandıkları belirli paymaster servisine bakılmaksızın, gaz sponsorluğu özelliklerini verimli ve tutarlı bir şekilde entegre etmelerini sağlayacaktır.

## API Özelliği

Paymaster, cüzdanlara sponsor ve politika bilgilerini dönebilmesi için `pm_isSponsorable` adlı bir JSON-RPC API'si uygulamak zorundadır. Ayrıca, `eth_sendRawTransaction` JSON-RPC API'sini de uygulaması gerekmektedir. Detaylı API Özellikleri aşağıda belirtilmiştir:

### pm\_isSponsorable

**İstek Parametreleri**

*   `jsonrpc`: JSON-RPC protokol versiyonu ("2.0").
*   `id`: İstek için benzersiz bir tanımlayıcı (bu örnekte 1).
*   `method`: Çağrılacak yöntem adı ("pm\_isSponsorable").
*   `params`: Aşağıdaki alanları içeren tek bir nesne içeren bir dizi:
    *   `to`: İşlemin alıcı adresi.
    *   `from`: İşlemin gönderici adresi.
    *   `value`: İşlemin onaltılık değeri.
    *   `data`: İşlem için ek veriler (onaltılık).
    *   `gas`: İşlemin gaz limiti (onaltılık).

**Örnek:**

```plain
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "pm_isSponsorable",
  "params": [
    {
      "to": "0x...", // bir adres
      "from": "0x...", // bir adres
      "value": "0xa1",
      "data": "0x",
      "value": "0x1b4",
      "gas" : "0x101b4"
    }
  ]
}
```

**Yanıt Alanları**

*   `jsonrpc`: JSON-RPC protokol versiyonu ("2.0").
*   `id`: İstek için benzersiz tanımlayıcı (bu örnekte 1).
*   `result`: Sponsorluk politikası detaylarını içeren bir nesne:
    *   (Gerekli) `Sponsorable`: İşlemin sponsor edilebilir olup olmadığını belirten bir boolean (doğru veya yanlış).
    *   (Gerekli) `SponsorPolicy`: Sponsor politikası adı.

**Örnek:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "Sponsorable": true,
    "SponsorPolicy": "örnek bir politika adı"
  }
}
```

### eth\_sendrawtransaction

:::tip
Paymaster tarafından uygulanmış olan `eth_sendRawTransaction` API'si, Ethereum API özelliklerine uyumlu olmalıdır.
:::

İstemci, `eth_sendRawTransaction` API'si aracılığıyla imzalı işlemler için yeni bir mesaj çağrısı işlemi veya sözleşme oluşturabilir.

**İstek Parametreleri**

`params`, imzalı işlem verilerini içermelidir.

**Örnek:**

```plain
{
   "jsonrpc": "2.0",
   "id": 1,
   "method": "eth_sendRawTransaction",
   "params": [
 "0x02f86a6102850df8475800850df84758000a94cd9c02358c223a3e788c0b9d94b98d434c7aa0f18080c080a0bcb0e8ffa344e4b855c6e13ee9e4e5d22cff6ad8bd1145a93b93c5d332100c2ca03765236eba5fbb357e35014fd19ba4b3c6b87f3793bd14dddf7913fc8dcc88bf"
   ]
}
```

**Yanıt Alanları**

VERİ, 32 Bayt - işlem hash'i.

**Örnek:**

```json
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```