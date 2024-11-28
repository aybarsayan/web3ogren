# Fift derin dalış

Yüksek düzeyde yığın tabanlı bir dil olan Fift, hücrelerle ve diğer TVM primitifleriyle yerel manipülasyon için kullanılır, genellikle TVM montaj kodunu sözleşme kodu hücre torbasına dönüştürmek için.

:::caution
Bu bölüm, **çok** düşük düzeyde TON'a özgü özelliklerle etkileşimi tanımlamaktadır. Yığın dilleri temelinin ciddi şekilde anlaşılması gereklidir.
:::

## Basit aritmetik
Fift yorumlayıcısını hesap makinesi olarak kullanabilir, ifadeleri [ters Polonya notasyonu](https://en.wikipedia.org/wiki/Reverse_Polish_notation) ile yazabilirsiniz.

```
6 17 17 * * 289 + .
2023 tamam
```

## Standart çıktı
```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text tamam
```
`emit`, yığının en üstünden bir sayıyı alır ve belirtilen kod ile Unicode karakterini stdout'a yazdırır.  
`."..."` sabit bir dizeyi yazdırır.

---

## Fonksiyon tanımlama (Fift kelimeleri)
Bir kelimeyi tanımlamanın ana yolu etkilerini süslü parantezler içine alıp ardından `:` ve kelime adını yazmaktır.

```
{ minmax drop } : min
{ minmax nip } : max
```
> Fift.fif  
> **Not:** Bu kelimeler, bazıları **aktif** (süslü parantezler içinde çalışır) ve bazıları **prefix** (sonrasında boşluk karakterine ihtiyaç duymaz) olan kelimeleri tanımlama açısından farklıdır.

```
{ bl word 1 2 ' (create) } "::" 1 (create)
{ bl word 0 2 ' (create) } :: :
{ bl word 2 2 ' (create) } :: :_
{ bl word 3 2 ' (create) } :: ::_
{ bl word 0 (create) } : create
```
> Fift.fif

---

## Koşullu yürütme
Süslü parantezler ile sınırlı kod blokları, koşullu veya koşulsuz olarak yürütülebilir.

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true tamam
{ ."hello " } execute ."world"
merhaba dünya tamam
```

---

## Döngüler
```
// ( l c -- l')  listeden ilk c elemanını siler
{ ' safe-cdr swap times } : list-delete-first
```
> GetOpt.fif  
Döngü kelimesi `times` iki argüman alır - onları `cont` ve `n` olarak adlandıralım - ve `cont`'u `n` kez yürütür.  
> **Uyarı:** `list-delete-first`, `safe-cdr`'nin devamını (Lisp tarzı listeden başı silen komut) alır, onu `c` altına koyar ve ardından yığın üzerinde bulunan listeden `c` kez başı kaldırır.

Ayrıca `while` ve `until` kelimeleri de vardır.

---

## Yorumlar
```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```
> Fift.fif  
Yorumlar `Fift.fif` içinde tanımlanmıştır. Tek satırlık yorum `//` ile başlar ve satırın sonuna kadar devam eder; çok satırlı yorum `/*` ile başlar ve `*/` ile biter.

:::note
Bunların neden böyle çalıştığını anlayalım.  
Fift programı, her biri yığını bir şekilde dönüştüren veya yeni kelimeler tanımlayan kelimelerin sırasıdır. `Fift.fif`'in ilk satırı (yukarıda gösterilen kod) yeni bir `//` kelimesinin tanımınıdır. Yorumlar, yeni kelimeler tanımlanırken bile çalışmalıdır, bu nedenle iç içe bir ortamda çalışmak zorundadırlar. Bu yüzden **aktif** kelimeler olarak tanımlanırlar, `::` aracılığıyla. Tanımlanan kelimenin hareketleri süslü parantezler içinde listelenir:
1. `0`: sıfır yığına itilir.
2. `word`: bu komut, yığının en üstüne eşit olan bir karaktere ulaşana kadar karakterleri okur ve okunan veriyi Dize olarak yığına iter. Sıfır özel bir durumdur: burada `word`, önde gelen boşlukları atlar ve ardından mevcut girdi satırının sonuna kadar okur.
3. `drop`: en üstteki öğe (yorum verisi) yığından atılır.
4. `0`: yeniden sıfır yığına itilir - sonuç sayısı, çünkü kelime `::` ile tanımlanmıştır.
5. `'nop` çağrıldığında hiçbir şey yapmayan bir yürütme belirtecini yığına iter. Bu, ` { nop }`'a oldukça benzer.

---

## Fift kullanarak TVM montaj kodları tanımlama
```
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```
> Asm.fif (satır sırası ters)

`@Defop`, opcode için yeterli alan olup olmadığını kontrol etmekle ilgilenir (`@havebitrefs`), eğer yoksa, başka bir yapı oluşturucusuna yazmaya devam eder (`@|`; aynı zamanda örtük atlama olarak da bilinir). Bu nedenle, genellikle `x{A988} s,` olarak bir opcode yazmak istemezsiniz: bu opcode'u yerleştirmek için yeterli alan olmayabilir, bu nedenle derleme başarısız olacaktır; bunun yerine `x{A988} @addop` yazmalısınız.

Fift'i, sözleşmeye büyük hücre torbaları dahil etmek için de kullanabilirsiniz:
```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```
Bu komut, programa dahil edildiğinde `x{88}` (`PUSHREF`) ve sağlanan hücre torbasına bir referans yazan opcode'u tanımlar. Böylece `LDBLOB` talimatı çalıştığında, hücre TVM yığınına itilir.

---

## Özel özellikler

- Ed25519 kriptografisi
  - newkeypair - özel-publik anahtar çiftini oluşturur
  - priv>pub   - özel anahtardan publik anahtar oluşturur
  - ed25519_sign[_uint] - verilen veri ve özel anahtara bağlı olarak imza oluşturur
  - ed25519_chksign     - Ed25519 imzasını kontrol eder
- TVM ile etkileşim
  - runvmcode ve benzeri - yığından alınan kod parçası ile TVM'yi çağırır
- Dosyalara BOC yazma:
  `boc>B ".../contract.boc" B>file`

---

## Öğrenmeye devam edin

- [Fift: Kısa Bir Giriş](https://docs.ton.org/fiftbase.pdf) Nikolai Durov tarafından