---
title: "`deno repl`, etkileşimli betik istemcisi"
description: Deno'nun REPL (Read-Eval-Print Loop), interaktif bir ortamda JavaScript kodunu çalıştırmak için güçlü bir araçtır. Kullanıcılar, özel değişkenler ve işlevlerle etkileşimde bulunarak hızlı bir şekilde geri bildirim alabilirler. REPL, kodu kolayca çalıştırmak için çeşitli bayraklar ve kısayollar sunmaktadır.
keywords: [Deno, REPL, JavaScript, etkileşimli, betik istemcisi, programlama, kod çalıştırma]
---

## Özel değişkenler

REPL, her zaman mevcut olan birkaç **özel değişken** sağlar:

| Kimlik    | Açıklama                            |
| ---------- | ------------------------------------ |
| _          | Son değerlendirilmiş ifadeyi verir  |
| _error     | Son atılan hatayı verir              |

```console
Deno 1.14.3
çikişi ctrl+d veya close() ile
> "hello world!"
"hello world!"
> _
"hello world!"
> const foo = "bar";
undefined
> _
undefined
```

## Özel işlevler

REPL, global kapsamda birkaç işlev sağlar:

| İşlev    | Açıklama                       |
| -------- | --------------------------------- |
| clear()  | Tüm terminal ekranını temizler  |
| close()  | Mevcut REPL oturumunu kapatır    |

## `--eval` bayrağı

`--eval` bayrağı, REPL'ye düşmeden önce bazı kodları çalıştırmanıza olanak tanır. **Bu, REPL'de sıkça kullandığınız bazı kodları içe aktarmak veya çalışma zamanını bir şekilde değiştirmek için yararlıdır:**

```console
$ deno repl --allow-net --eval 'import { assert } from "jsr:@std/assert@1"'
Deno 1.45.3
çikişi ctrl+d, ctrl+c veya close() ile
> assert(true)
undefined
> assert(false)
Uncaught AssertionError
    at assert (https://jsr.io/@std/assert/1.0.0/assert.ts:21:11)
    at <anonymous>:1:22
```

## `--eval-file` bayrağı

`--eval-file` bayrağı, REPL'ye düşmeden önce belirli dosyalardan kod çalıştırmanıza olanak tanır. **`--eval` bayrağına benzer şekilde, bu da REPL'de sıkça kullandığınız kodları içe aktarmak veya çalışma zamanını bir şekilde değiştirmek için yararlıdır.**

Dosyalar, yollar veya URL'ler olarak belirtilebilir. URL dosyaları önbelleğe alınır ve `--reload` bayrağı ile yeniden yüklenebilir.

Eğer `--eval` da belirtilmişse, `--eval-file` dosyaları `--eval` kodundan önce çalıştırılır.

```console
$ deno repl --eval-file=https://docs.deno.com/examples/welcome.ts,https://docs.deno.com/examples/local.ts
İndiriliyor https://docs.deno.com/examples/welcome.ts
Deno'ya hoş geldiniz!
İndiriliyor https://docs.deno.com/examples/local.ts
Deno 1.45.3
çikişi ctrl+d veya close() ile
> local // bu değişken local.ts içinde yerel olarak tanımlıdır, ancak dışa aktarılmamıştır
"This is a local variable inside of local.ts"
```

### Göreli İçe Aktarma Yolu Çözümü

Eğer `--eval-file`, göreli içe aktarımlar içeren bir kod dosyasını belirtirse, çalışma zamanı, **içe aktarımları mevcut çalışma dizinine göre çözmeye çalışacaktır.** Kod dosyasının konumuna göre çözmeye çalışmayacaktır. Bu, "Modül bulunamadı" hatalarına neden olabilir:

```console
$ deno repl --eval-file=https://jsr.io/@std/encoding/1.0.0/ascii85.ts
--eval-file dosyasında hata https://jsr.io/@std/encoding/1.0.0/ascii85.ts. Uncaught TypeError: Modül bulunamadı "file:///home/_validate_binary_like.ts".
    at async <anonymous>:2:13
Deno 1.45.3
çikişi ctrl+d veya close() ile
>
```

## Sekme Tamamlama

Sekme tamamlama, **REPL'de hızlı gezinmek için önemli bir özelliktir.** `tab` tuşuna bastıktan sonra, Deno artık tüm olası tamamlamaların bir listesini gösterecektir.

```console
$ deno repl
Deno 1.45.3
çikişi ctrl+d veya close() ile
> Deno.read
readTextFile      readFile          readDirSync       readLinkSync      readAll           read
readTextFileSync  readFileSync      readDir           readLink          readAllSync       readSync
```

## Klavye Kestirmeleri

| Tuş Vuruşu             | Eylem                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Ctrl-A, Home          | İmleci satırın başına taşı                       |
| Ctrl-B, Sol           | İmleci bir karakter sola hareket ettir         |
| Ctrl-C                | Mevcut düzenlemeyi kes ve iptal et             |
| Ctrl-D                | Eğer satır _boşsa_, satır sonunu belirt        |
| Ctrl-D, Del           | Eğer satır _boş değilse_, imlecin altındaki karakteri sil |
| Ctrl-E, Son           | İmleci satırın sonuna taşı                       |
| Ctrl-F, Sağ           | İmleci bir karakter sağa hareket ettir         |
| Ctrl-H, Geri Tuşu    | İmlecin önündeki karakteri sil                |
| Ctrl-I, Tab           | Sonraki tamamlama                              |
| Ctrl-J, Ctrl-M, Enter | Satır girişini bitir                           |
| Ctrl-K                | İmleceden satır sonuna kadar sil                |
| Ctrl-L                | Ekranı temizle                                 |
| Ctrl-N, Aşağı         | Geçmişten sonraki eşleşme                     |
| Ctrl-P, Yukarı        | Geçmişten önceki eşleşme                       |
| Ctrl-R                | Ters Arama geçmişi (Ctrl-S ileri, Ctrl-G iptal)     |
| Ctrl-T                | Önceki karakteri mevcut karakter ile değiştir   |
| Ctrl-U                | İmlece kadar satırın başından sil                 |
| Ctrl-V                | Herhangi bir özel karakteri ekler, ilişkilendirilmiş eylemi gerçekleştirmeden           |
| Ctrl-W                | İmlece kadar kelimeyi sil (boşlukları kelime sınırı olarak kullanarak)                      |
| Ctrl-X Ctrl-U         | Geri al                                         |
| Ctrl-Y                | Yanki tamponundan yapıştır                      |
| Ctrl-Y                | Yanki tamponundan yapıştır (Meta-Y ile sonraki yanka yapıştırabilirsiniz)                      |
| Ctrl-Z                | Askıya alma (Unix sadece)                          |
| Ctrl-_                | Geri al                                         |
| Meta-0, 1, ..., -     | Argüman için sayıyı belirtin. `–` negatif bir argüman başlatır.   |
| Meta &lt;             | Geçmişteki ilk girişe git                         |
| Meta &gt;             | Geçmişteki son girişe git                         |
| Meta-B, Alt-Sol       | İmleci önceki kelimeye taşı                      |
| Meta-Geri Tuşu       | Bu kelimenin başlangıcından ya da kelimeler arasında ise önceki kelimenin başlangıcına kadar sil |
| Meta-C                | Mevcut kelimeyi büyük harfle yazar              |
| Meta-D                | Bir kelimeyi ileri sil                            |
| Meta-F, Alt-Sağ      | İmleci sonraki kelimeye taşı                     |
| Meta-L                | Sonraki kelimeyi küçük harf yap                  |
| Meta-T                | Kelimeleri yer değiştir                          |
| Meta-U                | Sonraki kelimeyi büyük harf yap                  |
| Meta-Y                | Ctrl-Y'yi görün                                  |
| Ctrl-S                | Yeni bir satır ekle                              |

## `DENO_REPL_HISTORY`

`DENO_REPL_HISTORY` ortam değişkenini, **Deno'nun REPL geçmiş dosyasını nerede saklayacağını denetlemek için kullanabilirsiniz.** Boş bir değer olarak ayarlarsanız, Deno geçmiş dosyasını saklamayacaktır.