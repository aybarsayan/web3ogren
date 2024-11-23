# Derleyici yönergeleri
Bunlar, `#` ile başlayan ve derleyiciye bazı eylemleri, kontrolleri gerçekleştirmesi veya parametreleri değiştirmesi talimatı veren anahtar kelimelerdir.

Bu yönergeler yalnızca en dış katmanda (herhangi bir işlev tanımının içinde değil) kullanılabilir.

## #include
`#include` yönergesi, dahil edilen yerde başka bir FunC kaynak kodu dosyasını dahil etmeye olanak tanır.

**Sözdizimi:**  
```plaintext
#include "filename.fc";
```
Dikkat: Dosyalar tekrar dahil edilme için otomatik olarak kontrol edilir ve bir dosyanın birden fazla kez dahil edilme girişimleri varsayılan olarak yok sayılır; 2'den düşük bir ayrıntı seviyesi varsa uyarı verilmez.

Bir dahil edilen dosyanın işlenmesi sırasında bir hata oluşursa, ayrıca dahil edilen dosyaların her birinin yerlerini içeren bir dahil etme yığın dizisi yazdırılır.

---

## #pragma
`#pragma` yönergesi, derleyiciye dilin kendisinin sunduğundan daha fazla bilgi sağlamak için kullanılır.

### #pragma version
Sürüm pragma'sı, dosyayı derlerken belirli bir FunC derleyici sürümünü zorlamak için kullanılır.

**Sürüm formatı:**  
_formatında belirtilir; burada _a_ ana sürüm, _b_ küçük sürüm ve _c_ yaman sürümdür._

Geliştiricinin kullanabileceği birkaç karşılaştırma operatörü vardır:
- _a.b.c_ veya _=a.b.c_—tam olarak _a.b.c_ sürümündeki derleyiciyi gerektirir
- _>a.b.c_—derleyici sürümünün _a.b.c_'den büyük olmasını gerektirir
- _>=a.b.c_—derleyici sürümünün _a.b.c_'ye büyük veya eşit olmasını gerektirir
- _\_, _>=_, _\a.b_ aynı zamanda _>a.b.0_ ile aynı anlamdadır (bu nedenle _a.b.0_ sürümünü EŞLEŞTİRMEZ)
- _\<=a_ aynı zamanda _\<=a.0.0_ ile aynı anlamdadır (bu nedenle _a.0.1_ sürümünü EŞLEŞTİRMEZ)
- _^a.b.0_ **EŞİT DEĞİLDİR** _^a.b_ ile

**Örnek:** _^a.1.2_ _a.1.3_ ile eşleşir fakat _a.2.3_ veya _a.1.0_ ile eşleşmez; ancak _^a.1_ hepsi ile eşleşir.

Bu yönerge birden fazla kez kullanılabilir; derleyici sürümü sağlanan tüm koşulları karşılamalıdır.

### #pragma not-version
Bu pragma'nın sözdizimi sürüm pragma ile aynıdır ancak koşul karşılandığında başarısız olur.

**Kullanım örneği:** Belirli bir sürümü kara listeye almak için kullanılabilir.

### #pragma allow-post-modification
_funC v0.4.1_

Varsayılan olarak, bir değişkeni aynı ifadede değiştirmeden önce kullanmak yasaktır. Diğer bir deyişle, 
```plaintext
(x, y) = (ds, ds~load_uint(8))
```
derlenmeyecek, ancak
```plaintext
(x, y) = (ds~load_uint(8), ds)
```
geçerlidir.

Bu kural, kütük atamaları ve işlev çağrısında kullanılmak üzere değişkeni kullanımdan sonra değiştirmeye izin veren `#pragma allow-post-modification` ile geçersiz kılınabilir; genelde alt ifadeler soldan sağa doğru hesaplanır: 
```plaintext
(x, y) = (ds, ds~load_bits(8))
```
ifadesinde `x`, başlangıçta `ds` içerir; `f(ds, ds~load_bits(8))` işlevinin ilk argümanı `f`'nin başlangıçta `ds` içerecektir ve ikincisi - `ds`nin 8 bitidir.

**Dikkat:** `#pragma allow-post-modification` yalnızca pragma'dan sonraki kodlar için geçerlidir.

### #pragma compute-asm-ltr
_funC v0.4.1_

Asm bildirimleri argümanların sırasını değiştirebilir, örneğin aşağıdaki ifadede 

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

**Ayrıntılanma sırası:** `load_ref()`, `load_uint(256)`, `load_dict()` ve `load_uint(8)` aşağıdaki asm bildirimine göre olacaktır (not: `asm(value index dict key_len)`):

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```

Bu davranış, `#pragma compute-asm-ltr` ile katı soldan sağa hesaplama sırasına değiştirilebilir.

**Sonuç:** 
```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```
ayrıntılama sırası `load_dict()`, `load_uint(8)`, `load_uint(256)`, `load_ref()` olacak ve tüm asm permütasyonları hesaplamadan sonra gerçekleşecektir.

**Dikkat:** `#pragma compute-asm-ltr` yalnızca pragma'dan sonraki kodlar için geçerlidir.