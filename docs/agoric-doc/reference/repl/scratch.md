# Scratch

`scratch`, anahtar-değer çiftlerini daha sonra kullanmak üzere saklamak için kullanılır. Bu özellik yalnızca ag-solo üzerinde mevcuttur ve zincir üzerinden erişilemez, bu nedenle ag-solo kullanıcısına özeldir. Dağıtım betikleri geçici olduğu için, `scratch`'i dağıtım betiklerinden nesneleri saklamak ve daha sonraki betiklerde kullanmak için kullanın.

REPL'in ana nesnesinden çağrı yaparken, aşağıda gösterildiği gibi `` kullanmalısınız.

Anahtarlar herhangi bir şey olabilir.

## `E(home.scratch).set(id, obj)`

- `id`: `{ any }`
- `obj`: `{ Object }`
  Dönüş: `{ any }`

Anahtar-değer çifti `[id, obj]`'yi Scratchpad'e ekler ve `id`'yi döner.

```js
command[1] E(home.scratch).set("foo", "bar")
history[1] "foo"
```

## `E(home.scratch).get(id)`

- `id`: `{ any }`
- Dönüş: `{ Object }`

Bir ID anahtarını alır ve ag-solo'nun Scratchpad'indeki ilişkili nesneyi döner. Eğer `id` parametresi geçerli bir anahtar değilse, `undefined` döner.

```js
command[2] E(home.scratch).get("foo")
history[2] "bar"
```

## `E(home.scratch).list()`

- Dönüş: `{ Array }`

O anda Scratchpad'de bulunan tüm ID değerlerinin sıralı bir dizisini döner.

```js
command[3] E(home.scratch).list()
history[3] ["faucetTokenIssuer","foo"]
```