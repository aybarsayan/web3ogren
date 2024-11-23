# Yerel token: Toncoin

TON Blockchain'ın yerel kripto parası **Toncoin**'dir. 

:::info
İşlem ücretleri, gaz ödemeleri (yani akıllı sözleşme mesaj işleme ücretleri) ve kalıcı depolama ödemeleri Toncoin cinsinden toplanmaktadır.
:::

Toncoin, bir blok zinciri doğrulayıcısı olmak için gereken depozitoları yapmak için kullanılır. Toncoin ödemeleri yapma süreci `ilgili bölümde` açıklanmaktadır.

Toncoin'i nereden satın alabileceğinizi veya değiştirebileceğinizi [web sitesinde](https://ton.org/coin) bulabilirsiniz.

## Ek para birimleri

TON Blockchain, 2^32 kadar yerleşik ek para birimini destekler.

Ek para birimi bakiyeleri her blok zinciri hesabında saklanabilir ve diğer hesaplara yerel olarak transfer edilebilir. 
- **Dikkat:** Bir akıllı sözleşmeden diğerine olan dahili bir mesajda, Toncoin miktarına ek olarak ek para birimi miktarlarının bir hashmap'ini belirtebilirsiniz.

TLB: 
```plaintext
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
```
— para birimi kimliği ve miktarı için hashmap.

Ancak, ek para birimleri yalnızca saklanabilir ve transfer edilebilir (Toncoin gibi) ve kendi keyfi kodları veya işlevsellikleri yoktur. 

:::warning
Eğer çok sayıda ek para birimi oluşturulursa, hesapların "şişeceği" unutulmamalıdır çünkü bunları saklamak zorundadırlar.
:::

Bu nedenle, ek para birimleri en iyi bilinen merkeziyetsiz para birimleri için kullanılmalıdır (örneğin, Wrapped Bitcoin veya Ether) ve böyle bir ek para birimi oluşturmak oldukça maliyetli olmalıdır.

`Jettonlar` diğer görevler için uygundur.

:::note
Şu anda, TON Blockchain üzerinde hiçbir ek para birimi oluşturulmamıştır. TON Blockchain, hesaplar ve mesajlar aracılığıyla ek paralar için tam destek sağlamaktadır. Ancak bunların oluşturulması için minter sistem sözleşmesi henüz oluşturulmamıştır.
:::