---
sidebar_position: 12
---

# Anahtar Deposu API'si

Her düğüm, yerleşik bir anahtar deposuna sahiptir. İstemciler, blok zincirleriyle etkileşimde bulunurken kimlik olarak kullanılacak kullanıcıları anahtar deposunda oluştururlar. Anahtar deposu düğüm seviyesinde bulunur, bu nedenle bir düğümde bir kullanıcı oluşturursanız, bu kullanıcı _yalnızca_ o düğümde mevcut olacaktır. Ancak, kullanıcılar bu API aracılığıyla içe ve dışa aktarılabilir.

_**Yalnızca sahip olduğunuz bir düğümde bir anahtar deposu kullanıcısı oluşturmalısınız, çünkü düğüm operatörünün düz metin şifrenize erişimi vardır.**_

Ana ağda doğrulama ve yetkilendirme için, işlemleri  üzerinden yapmalısınız. Bu şekilde, fonlarınızın kontrol anahtarları düğümde saklanmayacak ve bu da bir düğüm çalıştıran bilgisayarın tehlikeye girmesi durumunda riski önemli ölçüde azaltacaktır.

## Format

Bu API, `json 2.0` API formatını kullanır. JSON RPC çağrıları yapma hakkında daha fazla bilgi için  bakabilirsiniz.

## Uç Nokta

```text
/ext/keystore
```

## Yöntemler

### keystore&#46;createUser

Belirtilen kullanıcı adı ve şifre ile yeni bir kullanıcı oluşturur.

**İmza**

```sh
keystore.createUser(
    {
        username:string,
        password:string
    }
) -> {success:bool}
```

- `username` ve `password` en fazla 1024 karakter olabilir.
- `password` çok zayıfsa isteğiniz reddedilecektir. `password`, en az 8 karakter olmalı ve büyük ve küçük harfler ile birlikte rakamlar ve semboller içermelidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.createUser",
    "params" :{
        "username":"myUsername",
        "password":"myPassword"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
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

### keystore&#46;deleteUser

Bir kullanıcıyı siler.

**İmza**

```sh
keystore.deleteUser({username: string, password:string}) -> {success: bool}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.deleteUser",
    "params" : {
        "username":"myUsername",
        "password":"myPassword"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "success": true }
}
```

### keystore&#46;exportUser

Bir kullanıcıyı dışa aktarır. Kullanıcı,  ile başka bir düğüme içe aktarılabilir. Kullanıcının şifresi şifrelenmiş olarak kalır.

**İmza**

```sh
keystore.exportUser(
    {
        username:string,
        password:string,
        encoding:string //opsiyonel
    }
) -> {
    user:string,
    encoding:string
}
```

`encoding`, kullanıcı verilerinin string kodlamasının formatını belirtir. "cb58" veya "hex" olabilir. Varsayılan "cb58"dir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.exportUser",
    "params" :{
        "username":"myUsername",
        "password":"myPassword"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "user": "4CsUh5sfVwz2jNrJXBVpoPtDsb4tZksWykqmxC5CXoDEERyhoRryq62jYTETYh53y13v7NzeReisi",
    "encoding": "cb58"
  }
}
```

### keystore&#46;importUser

Bir kullanıcıyı içe aktarır. `password`, kullanıcının şifresiyle eşleşmelidir. `username`in, dışa aktarıldığı zaman kullanıcının sahip olduğu kullanıcı adıyla eşleşmesi gerekmez.

**İmza**

```sh
keystore.importUser(
    {
        username:string,
        password:string,
        user:string,
        encoding:string //opsiyonel
    }
) -> {success:bool}
```

`encoding`, kullanıcı verilerinin string kodlamasının formatını belirtir. "cb58" veya "hex" olabilir. Varsayılan "cb58"dir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.importUser",
    "params" :{
        "username":"myUsername",
        "password":"myPassword",
        "user"    :"4CsUh5sfVwz2jNrJXBVpoPtDsb4tZksWykqmxC5CXoDEERyhoRryq62jYTETYh53y13v7NzeReisi"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
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

### keystore&#46;listUsers

Bu anahtar deposundaki kullanıcıları listeler.

**İmza**

```sh
keystore.ListUsers() -> {users:[]string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.listUsers"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "users": ["myUsername"]
  }
}