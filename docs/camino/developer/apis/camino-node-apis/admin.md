---
sidebar_position: 6
---

# Admin API

Bu API, düğüm sağlığını ölçmek ve hata ayıklamak için kullanılabilir.

:::info DEVRE DIŞI BIRAKILMIŞTIR

Admin API'nin varsayılan olarak devre dışı olduğunu unutmayın; bu, güvenlik nedenlerindendir.

Admin API'yi etkinleştirilmiş bir düğüm çalıştırmak için  **`--api-admin-enabled-secret=`** flag'ini kullanın.

:::

## Format

Bu API, `json 2.0` RPC formatını kullanır. Ayrıntılar için  bakın.

## Endpoint

```text
/ext/admin
```

## API Yöntemleri

### admin&#46;alias

Bir API endpoint'ine bir takma ad atar, API için farklı bir endpoint sağlar. Orijinal endpoint çalışmaya devam edecektir. Bu değişiklik yalnızca bu düğümü etkiler; diğer düğümler bu takma addan haberdar olmayacaktır.

**İmza**

```text
admin.alias({endpoint:string, alias:string}) -> {success:bool}
```

- `endpoint`, API'nin orijinal endpoint'idir. `endpoint`, yalnızca `/ext/` kısmından sonraki bölümünü içermelidir.
- Takma ad verilen API artık `ext/alias` adresinden çağrılabilir.
- `alias` en fazla 512 karakter olabilir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.alias",
    "params": {
        "secret": "",
        "alias" :"myAlias",
        "endpoint":"bc/X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

Artık X-Chain için çağrılar, ya `/ext/bc/X` ya da eşdeğer olarak `/ext/myAlias` adresine yapılabilir.

### admin&#46;aliasChain

Bir blockchain'e bir takma ad verir, blockchain'in ID'sinin kullanıldığı her yerde kullanılabilecek farklı bir isim sağlar.

**İmza**

```text
admin.aliasChain(
    {
        chain:string,
        alias:string
    }
) -> {success:bool}
```

- `chain`, blockchain'in ID'sidir.
- `alias`, blockchain'in ID'si yerine (örneğin API endpoint'lerinde) kullanılabilir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.aliasChain",
    "params": {
        "secret": "",
        "chain":"sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
        "alias":"myBlockchainAlias"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

Artık `sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM` ID'sine sahip blockchain ile etkileşime geçmek için API çağrıları `/ext/bc/sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM` yerine `ext/bc/myBlockchainAlias` adresine de yapılabilir.

### admin&#46;getChainAliases

Zincirin takma adlarını döndürür.

**İmza**

```text
admin.getChainAliases(
    {
        chain:string
    }
) -> {aliases:string[]}
```

- `chain`, blockchain'in ID'sidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.getChainAliases",
    "params": {
        "secret": "",
        "chain":"sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "aliases": [
      "X",
      "avm",
      "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
    ]
  },
  "id": 1
}
```

### admin&#46;getLoggerLevel

Log ve görüntü seviyeleri döndürür.

**İmza**

```text
admin.getLoggerLevel(
    {
        loggerName:string // isteğe bağlı
    }
) -> {
        loggerLevels: {
            loggerName: {
                    logLevel: string,
                    displayLevel: string
            }
        }
    }
```

- `loggerName`, geri dönecek loglayıcının adıdır. Bu isteğe bağlı bir argümandır. Belirtilmezse, tüm olası loglayıcıları döndürür.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.getLoggerLevel",
    "params": {
        "secret": "",
        "loggerName": "C"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "loggerLevels": {
      "C": {
        "logLevel": "DEBUG",
        "displayLevel": "INFO"
      }
    }
  },
  "id": 1
}
```

### admin&#46;getNodeSigner

Düğümün özel ve genel anahtarını döndürür.

**İmza**

```text
admin.getNodeSigner() -> {
        privateKey: string,
        publicKey: string
    }
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.getNodeSigner",
    "params": {
        "secret": ""
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "privateKey": "PrivateKey-2ZW6HUePBW2dP7dBGa5stjXe1uvK9LwEgrjebDwXEyL5bDMWWS",
    "publicKey": "D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
  },
  "id": 1
}
```

### admin&#46;loadVMs

Düğüm üzerinde yüklü olan sanal makineleri plugin olarak dinamik olarak yükler.

**İmza**

```text
admin.loadVMs() -> {
    newVMs: map[string][]string,
    failedVMs: map[string]string
}
```

- `failedVMs`, en az bir sanal makinenin yüklenemediği durumlarda yanıtta dahil edilir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.loadVMs",
    "params" :{
        "secret": ""
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "newVMs": {
      "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": ["foovm"]
    },
    "failedVMs": {
      "rXJsCSEYXg2TehWxCEEGj6JU2PWKTkd6cBdNLjoe2SpsKD9cy": "error message"
    }
  },
  "id": 1
}
```

### admin&#46;lockProfile

Mutex istatistiklerinin bir profilini `lock.profile` dosyasına yazar.

**İmza**

```text
admin.lockProfile() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.lockProfile",
    "params" :{
        "secret": ""
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

### admin&#46;memoryProfile

Bellek profilini `mem.profile` dosyasına yazar.

**İmza**

```text
admin.memoryProfile() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.memoryProfile",
    "params" :{
        "secret": ""
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

### admin&#46;setLoggerLevel

Log ve görüntü seviyelerini ayarlar.

**İmza**

```text
admin.setLoggerLevel(
    {
        loggerName: string, // isteğe bağlı
        logLevel: string, // isteğe bağlı
        displayLevel: string, // isteğe bağlı
    }
) -> {success:bool}
```

- `loggerName`, değiştirilecek loglayıcının adıdır. Bu isteğe bağlı bir parametredir. Belirtilmezse, tüm olası loglayıcıları değiştirir.
- `logLevel`, yazılan logların seviyesidir, atlanabilir.
- `displayLevel`, görüntülenen logların seviyesidir, atlanabilir.

`logLevel` ve `displayLevel` aynı anda atlanamaz.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.setLoggerLevel",
    "params": {
        "secret": "",
        "loggerName": "C",
        "logLevel": "DEBUG",
        "displayLevel": "INFO"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

### admin&#46;startCPUProfiler

Düğümün CPU kullanımını profillemeye başlar. Durdurmak için `admin.stopCPUProfiler` çağrılmalıdır. Durdurulduğunda, profil `cpu.profile` dosyasına yazılır.

**İmza**

```text
admin.startCPUProfiler() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.startCPUProfiler",
    "params" :{
        "secret": ""
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

### admin&#46;stopCPUProfiler

Önceden başlatılan CPU profilini durdurur.

**İmza**

```text
admin.stopCPUProfiler() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.stopCPUProfiler"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}