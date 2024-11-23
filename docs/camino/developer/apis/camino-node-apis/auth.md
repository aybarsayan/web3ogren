---
sidebar_position: 7
---

# Auth API

Bir düğüm çalıştırdığınızda, API çağrılarının bir yetkilendirme token'ı ile birlikte gelmesini talep edebilirsiniz. Bu API, yetkilendirme token'larının oluşturulmasını ve iptal edilmesini yönetir.

Bir yetkilendirme token'ı, bir veya daha fazla API uç noktasına erişim sağlar. Bu, bir düğümün API'lerine erişimi devretmek için faydalıdır. Token'lar 12 saat sonra süresi dolmaktadır.

Yetkilendirme token'ı, bir API çağrısının başlığında sağlanır. Özellikle, `Authorization` başlığı `Bearer TOKEN.GOES.HERE` değerini taşımalıdır (burada `TOKEN.GOES.HERE`, token ile değiştirilmelidir).

Bu API, düğümün `` `--api-auth-required` ile başlatılması durumunda erişilebilir. Düğüm bu CLI olmadan başlatılırsa, API çağrıları yetkilendirme token'larına ihtiyaç duymaz, dolayısıyla bu API erişilemez. Bu API'nın erişilmesi asla bir yetkilendirme token'ı gerektirmez.

Yetkilendirme token'ı oluşturma yetkileri olmalıdır. Düğümünüzü `--api-auth-required` ile çalıştırıyorsanız, Auth API'nin şifresinin okunacağı dosyayı belirlemek için `--api-auth-password-file` argümanını da belirtmelisiniz. Yetkilendirme token'larını oluşturmak/iptal etmek için bu şifreyi sağlamanız gerekmektedir.

Düğümünüzü `--api-auth-required` ile çalıştırdığınızda, MetaMask gibi bazı araçların token'ları olmadığı için düğümünüze API çağrıları yapamayabileceğini unutmayın.

## Format

Bu API, `json 2.0` RPC formatını kullanır. JSON RPC çağrıları hakkında daha fazla bilgi için  bakın.

## Endpoint

```text
/ext/auth
```

## Methods

### auth&#46;newToken

Bir veya daha fazla API uç noktasına erişim sağlayan yeni bir yetkilendirme token'ı oluşturur.

**Signature**

```sh
auth.newToken(
    {
        password: string,
        endpoints: []string
    }
) -> {token: string}
```

- `password`, bu düğümün yetkilendirme token'ı şifresidir.
- `endpoints`, oluşturulan token ile erişilebilecek uç noktaların listesidir. Eğer `endpoints` içinde `"*"` bulunuyorsa, oluşturulan token herhangi bir API uç noktasına erişebilir.
- `token`, yetkilendirme token'ıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "auth.newToken",
    "params":{
        "password":"BURAYA ŞİFRENİZİ YAZIN",
        "endpoints":["/ext/bc/X", "/ext/info"]
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/auth
```

Bu çağrı, API uç noktalarına `/ext/bc/X` (yani X-Chain) ve `/ext/info` (yani ) erişimi sağlayan bir yetkilendirme token'ı oluşturacaktır.

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbmRwb2ludHMiOlsiKiJdLCJleHAiOjE1OTM0NzU4OTR9.Cqo7TraN_CFN13q3ae4GRJCMgd8ZOlQwBzyC29M6Aps"
  },
  "id": 1
}
```

Bu yetkilendirme token'ı, API çağrılarında `Authorization` başlığına `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbmRwb2ludHMiOlsiKiJdLCJleHAiOjE1OTM0NzU4OTR9.Cqo7TraN_CFN13q3ae4GRJCMgd8ZOlQwBzyC29M6Aps` değerini vererek kullanılmalıdır.

Örneğin, bu token ile  çağrısını yapmak için:

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.peers"
}' 127.0.0.1:9650/ext/info \
-H 'content-type:application/json;' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbmRwb2ludHMiOlsiKiJdLCJleHAiOjE1OTM0NzU4OTR9.Cqo7TraN_CFN13q3ae4GRJCMgd8ZOlQwBzyC29M6Aps'
```

### auth&#46;revokeToken

Daha önce oluşturulan bir token'ı iptal eder. Verilen token artık herhangi bir uç noktaya erişim sağlamayacaktır. Eğer token geçersizse, hiçbir şey yapmaz.

**Signature**

```sh
auth.revokeToken(
    {
        password: string,
        token: string
    }
) -> {success: bool}
```

- `password`, bu düğümün yetkilendirme token'ı şifresidir.
- `token`, iptal edilen yetkilendirme token'ıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "auth.revokeToken",
    "params":{
        "password":"123",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTMxNzIzMjh9.qZVNhH6AMQ_LpbXnPbTFEL6Vm5EM5FLU-VEKpYBH3k4"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/auth
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
```

### auth&#46;changePassword

Bu düğümün yetkilendirme token'ı şifresini değiştirir. Eski bir şifre altında oluşturulan herhangi bir yetkilendirme token'ı geçersiz hale gelir.

**Signature**

```sh
auth.changePassword(
    {
        oldPassword: string,
        newPassword: string
    }
) -> {success: bool}
```

- `oldPassword`, bu düğümün mevcut yetkilendirme token'ı şifresidir.
- `newPassword`, bu API çağrısından sonra düğümün yeni yetkilendirme token'ı şifresidir. 1 ile 1024 karakter arasında olmalıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "auth.changePassword",
    "params":{
        "oldPassword":"BURADA ESKİ ŞİFRENİZİ YAZIN",
        "newPassword":"BURADA YENİ ŞİFRENİZİ YAZIN"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/auth
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