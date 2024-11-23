# CRC32 

## Genel Bakış

CRC, döngüsel redundans kontrolü anlamına gelir ve dijital verilerin bütünlüğünü doğrulamak için yaygın olarak kullanılan bir yöntemdir. Bu, dijital verilerin iletim veya depolama sırasında hataların oluşup oluşmadığını kontrol etmek için kullanılan bir hata tespit algoritmasıdır. 

> **Önemli Not:** 
> CRC bir kontrol mekanizmasıdır, ancak verilerin düzeltme yeteneği yoktur. — kullanıcı hataları için dikkatli olunması gerektiğini vurgular.

Bir CRC, iletilen veya depolanan verilerin kısa bir kontrol toplamını veya hash'ini oluşturur ve bu kontrol toplamı verinin sonuna eklenir. Veriler alındığında veya geri çağrıldığında, CRC tekrar hesaplanır ve orijinal kontrol toplamı ile karşılaştırılır. Eğer iki kontrol toplamı eşleşiyorsa, verilerin bozulmadığı varsayılır. Eğer eşleşmiyorsa, bir hata meydana geldiği ve verilerin yeniden gönderilmesi veya tekrar alınması gerektiği gösterilir.

:::info 
**CRC32**, TL-B şemaları için kullanılan IEEE sürümüdür. Bu [NFT op kodu](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) örneğine bakarak, çeşitli mesajlar için TL-B hesabının daha net bir şekilde anlaşılmasını sağlanmaktadır.
:::

## Araçlar

### Çevrimiçi hesaplayıcı

* [Çevrimiçi hesaplayıcı örneği](https://emn178.github.io/online-tools/crc32.html)
* [Tonwhales İçgörü ID Üretici](https://tonwhales.com/tools/introspection-id)

### VS Code eklentisi

* [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

### Python

```python
import zlib
print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF)
```

### Go

```go
func main() {

	var schema = "some"

	schema = strings.ReplaceAll(schema, "(", "")
	schema = strings.ReplaceAll(schema, ")", "")
	data := []byte(schema)
	var crc = crc32.Checksum(data, crc32.MakeTable(crc32.IEEE))

	var b_data = make([]byte, 4)
	binary.BigEndian.PutUint32(b_data, crc)
	var res = hex.EncodeToString(b_data)
	fmt.Println(res)
}
```

### TypeScript

```typescript
import * as crc32 from 'crc-32';

function calculateRequestOpcode_1(str: string): string {
    return (BigInt(crc32.str(str)) & BigInt(0x7fffffff)).toString(16);
}

function calculateResponseOpcode_2(str: string): string {
    const a = BigInt(crc32.str(str));
    const b = BigInt(0x80000000);
    return ((a | b) < 0 ? (a | b) + BigInt('4294967296') : a | b).toString(16);
}
```

--- 

:::tip 
**Geliştirici İpuçları:** Hata ayıklarken CRC hesaplamalarının her adımını kontrol edin. Bu, hatanın sebebini bulmanıza yardımcı olabilir.
:::

:::warning 
**Önemli Uyarı:** Yanlış CRC hesaplamaları, verilerin kaybolmasına veya bozulmasına neden olabilir. 
:::

### Sonuç

CRC32, veri bütünlüğünü sağlamak için etkili bir yöntemdir ve doğru kullanıldığında güçlü bir hata tespit mekanizması sunar.