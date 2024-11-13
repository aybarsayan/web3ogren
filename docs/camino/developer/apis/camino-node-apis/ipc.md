---
sidebar_position: 11
description: IPC API, kullanıcıların blockchain'ler için yayın yapacak UNIX domain soketleri oluşturmasına olanak tanır. Daha fazla bilgiye buradan ulaşabilirsiniz.
---

# IPC API

IPC API, kullanıcıların blockchain'ler için yayın yapmak üzere UNIX domain soketleri oluşturmasına olanak tanır. Blockchain bir vertex/block kabul ettiğinde, bunu bir sokete yayınlar ve içindeki kararlar başka bir sokete yayınlanır.

Bir düğüm,  `api-ipcs-enabled=true` ile başlatılmışsa bu API'yi yalnızca açık hale getirir.

## IPC Mesaj Formatı

Soket mesajları, BigEndian formatında 64 bit bir tam sayı ile başlar ve ardından bu kadar byte gelir.

Örnek:

```text
Gönderme:
    [0x41, 0x76, 0x61, 0x78]
Sokete Yazma:
    [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x41, 0x76, 0x61, 0x78]
```

## IPC Soket URL Formatı

Soket adları `--` biçimindedir; burada `` ya `consensus` ya da `decisions` olarak belirlenir. Konsensüs soketi, vertex ve blokları alırken; kararlar soketi bireysel işlemleri alır.

## Format

Bu API, `json 2.0` RPC formatını kullanır.

## Uç Nokta

`/ext/ipcs`

## Yöntemler

### ipcs&#46;publishBlockchain

Bir blockchain kaydetmek, kabul edilen vertex'leri bir Unix domain soketinde yayımlamasını sağlar.

**İmza**

```sh
ipcs.publishBlockchain({blockchainID: string}) -> {consensusURL: string, decisionsURL: string}
```

- `blockchainID`, kabul edilen vertex'leri yayınlayacak blockchain'dir.
- `consensusURL`, vertex'lerin yayınlandığı Unix domain soketinin yoludur.
- `decisionsURL`, işlemlerin yayınlandığı Unix domain soketinin yoludur.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "ipcs.publishBlockchain",
    "params":{
        "blockchainID":"11111111111111111111111111111111LpoYY"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/ipcs
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "decisionsURL": "/tmp/1-11111111111111111111111111111111LpoYY-consensus",
    "consensusURL": "/tmp/1-11111111111111111111111111111111LpoYY-decisions"
  },
  "id": 1
}
```

### ipcs&#46;unpublishBlockchain

Bir blockchain kaydını iptal ederek artık bir Unix domain soketine yayın yapmasını sağlar.

**İmza**

```sh
ipcs.unpublishBlockchain({blockchainID: string}) -> {success: bool}
```

- `blockchainID`, artık bir Unix domain soketine yayın yapmayacak blockchain'dir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "ipcs.unpublishBlockchain",
    "params":{
        "blockchainID":"11111111111111111111111111111111LpoYY"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/ipcs
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true
  },
  "id": 1
}