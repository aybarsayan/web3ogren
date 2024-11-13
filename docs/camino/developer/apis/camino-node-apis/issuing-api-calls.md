---
sidebar_position: 1
---

# API Çağrılarını Yapma

Bu kılavuz, Camino düğümlerinin sunduğu API'lere nasıl çağrılar yapılacağını açıklamaktadır.

### Uç Nokta {#endpoint}

Bir API çağrısı, bir URL olan bir uç noktaya yapılır. URL'nin temel yapısı her zaman:

`[node-ip]:[http-port]`

şeklindedir. Burada:

- `node-ip`, çağrının yapıldığı düğümün IP adresidir.
- `http-port`, düğümün HTTP çağrılarını dinlediği porttur. Bu,  `http-port` ile tanımlanır (varsayılan değer `9650`).

Örneğin, temel URL şu şekilde görünebilir: `127.0.0.1:9650`.

Her API’nin dokümantasyonu, bir kullanıcının API metodlarına erişmek için hangi uç noktaya çağrı yapması gerektiğini belirtir.

## JSON RPC Biçimlendirilmiş API'ler

Birçok yerleşik API, istek ve yanıtlarını tanımlamak için  formatını kullanır. Bu tür API'ler arasında Platform API ve X-Chain API bulunur.

### JSON RPC İsteği Yapma

Diyelim ki,  `getTxStatus` metodunu çağırmak istiyoruz. X-Chain API dokümantasyonu, bu API için uç noktanın `/ext/bc/X` olduğunu belirtir.

Bu, API çağrımızı göndereceğimiz uç noktanın şu olduğu anlamına gelir:

`[node-ip]:[http-port]/ext/bc/X`

X-Chain API dokümantasyonu, `getTxStatus` metodunun imzasının:

`(txID:bytes) -> (status:string)`

şeklinde olduğunu belirtir. Burada:

- `txID` argümanı, durumunu almak istediğimiz işlemin kimliğidir.
- Döndürülen değer `status`, ilgili işlemin durumudur.

Bu metodu çağırmak için:

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :4,
    "method" :"avm.getTxStatus",
    "params" :{
        "txID":"2QouvFWUbjuySRxeX5xMbNCuAaKWfbk5FeEa2JmoF85RKLk2dD"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/X
```

- `jsonrpc`, JSON RPC protokolünün sürümünü belirtir. (Uygulamada her zaman 2.0'dır)
- `method`, çağırmak istediğimiz hizmeti (`avm`) ve metodu (`getTxStatus`) belirtir.
- `params`, metoda iletilecek argümanları belirtir.
- `id`, bu isteğin kimliğidir. İstek kimliklerinin benzersiz olması gerekir.

Hepsi bu kadar!

### JSON RPC Başarılı Yanıt

Eğer çağrı başarılı olursa, yanıt şu şekilde görünecektir:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "Status": "Success"
  },
  "id": 1
}
```

- `id`, bu yanıta karşılık gelen isteğin kimliğidir.
- `result`, `getTxStatus`'tan dönen değerlerdir.

### JSON RPC Hata Yanıtı

Eğer çağrılan API metodu bir hata dönerse, yanıt `result` yerine `error` adlı bir alan içerecektir. Ayrıca, meydana gelen hata hakkında ek bilgiler içeren `data` adlı bir ek alan bulunmaktadır.

Böyle bir yanıt şu şekilde görünebilir:

```json
{
    "jsonrpc": "2.0",
    "error": {
        "code": -32600,
        "message": "[Buraya bir hata mesajı yazın]",
        "data": [Hata hakkında ek bilgi içeren nesne]
    },
    "id": 1
}
```

## Diğer API Biçimleri

Bazı API'ler, istek ve yanıtlarını biçimlendirmek için JSON RPC 2.0'dan farklı bir standart kullanabilir. Bu tür genişletmeler, çağrı yapılması ve yanıtların nasıl analiz edileceğine dair bilgileri dokümantasyonlarında belirtmelidir.

## Bayt Gönderme ve Alma

Aksi belirtilmedikçe, bir API çağrısında/yanıtında gönderilen baytlar CB58 temsilinde, kontrol toplamı ile birlikte bir base-58 kodlamasıdır.