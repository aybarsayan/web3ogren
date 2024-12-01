---
description: Metin hizalaması, sarmalama, yazı tipi ayarları ve daha fazlasını kontrol etmek için kullanılabilecek çeşitli yardımcı programlar hakkında bilgi sağlar.
keywords: [metin, hizalama, sarmalama, yazı tipi, CSS]
---

# Metin

## Metin hizalaması

Metni, metin hizalama sınıflarıyla bileşenlere kolayca hizalayın. Başlangıç, bitiş ve merkez hizalaması için, ızgara sisteminin aynı görünüm genişliği kırılma noktalarını kullanan duyarlı sınıflar mevcuttur.


Tüm görünüm boyutlarında başlangıç ile hizalı metin.
Tüm görünüm boyutlarında merkez ile hizalı metin.
Tüm görünüm boyutlarında bitiş ile hizalı metin.

SM (küçük) veya daha geniş görünüm boyutlarında bitiş ile hizalı metin.
MD (orta) veya daha geniş görünüm boyutlarında bitiş ile hizalı metin.
LG (büyük) veya daha geniş görünüm boyutlarında bitiş ile hizalı metin.
XL (ekstra büyük) veya daha geniş görünüm boyutlarında bitiş ile hizalı metin.
XXL (ekstra ekstra büyük) veya daha geniş görünüm boyutlarında bitiş ile hizalı metin.
:::tip
Metin hizalama sınıflarını kullanarak bileşenlerinizde kolayca hizalama yapabilirsiniz. 
:::


Not: Justifiye metinler için yardımcı sınıflar sunmuyoruz. Estetik açıdan justifiye edilmiş metin daha çekici görünebilir, ancak kelime aralığı daha rastgele olduğu için okunması daha zor hale gelir.
---

## Metin sarmalama ve taşma

Metni `.text-wrap` sınıfı ile sarın.

  Bu metin sarılmalıdır.

Metnin sarmasını önlemek için `.text-nowrap` sınıfını kullanın.

  Bu metin ebeveynin dışına taşmalıdır.

---

## Kelime kırılması

Uzun metin dizelerinin bileşenlerinizin düzenini bozmasını önlemek için `.text-break` kullanarak `word-wrap: break-word` ve `word-break: break-word` ayarını yapın. Daha geniş tarayıcı desteği için `overflow-wrap` yerine `word-wrap` kullanıyoruz ve esnek konteynerlerle sorun yaşamamak için eski `word-break: break-word` değerini ekliyoruz.


mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
:::warning
Kelime kırmanın [Arapça'da mümkün olmadığını](https://rtlstyling.com/posts/rtl-styling#3.-line-break) unutmayın; bu, en çok kullanılan RTL dillerinden biridir. Bu nedenle, `.text-break` RTL derlenmiş CSS'mizden kaldırılmıştır.
:::

---

## Metin dönüşümü

Bileşenlerde metni, metin büyük harf sınıflarımızla dönüştürün: `text-lowercase`, `text-uppercase` ya da `text-capitalize`.


Küçük harfli metin.
Büyük harfli metin.
Büyük Harfli metin.
`.text-capitalize` sınıfının yalnızca her kelimenin ilk harfini değiştirdiğini, diğer harflerin durumunu etkilemediğini unutmayın.

---

## Yazı tipi boyutu

Yazının `font-size` değerini hızlıca değiştirin. Başlık sınıflarımız (örn. `.h1`–`.h6`) `font-size`, `font-weight` ve `line-height` uygular; bu yardımcı programlar yalnızca `font-size` uygular. Bu yardımcı programların boyutlandırması, HTML'in başlık elemanlarıyla eşleşir, böylece sayı arttıkça boyutları küçülür.


.fs-1 metni
.fs-2 metni
.fs-3 metni
.fs-4 metni
.fs-5 metni
.fs-6 metni
Mevcut `font-size` değerlerinizi `$font-sizes` Sass haritasını değiştirerek özelleştirin.

---

## Yazı tipi ağırlığı ve italik

Yazının `font-weight` veya `font-style` değerini bu yardımcı programlarla hızlıca değiştirin. `font-style` yardımcı programların kısaltması `.fst-*` ve `font-weight` yardımcı programların kısaltması `.fw-*`dir.


Daha kalın ağırlıkta metin (ebeveyn öğeye göre).
Yarım kalınlıkta metin.
Orta kalınlıkta metin.
Normal kalınlıkta metin.
Hafif kalınlıkta metin.
Daha hafif kalınlıkta metin (ebeveyn öğeye göre).
İtalik metin.
Normal yazı tipi stiline sahip metin
---

## Satır yüksekliği

`.lh-*` yardımcı programlarıyla satır yüksekliğini değiştirin.


Bu, bir öğenin satır yüksekliğinin yardımcı programlarımızla nasıl etkilendiğini göstermek için yazılmış uzun bir paragraftır. Sınıflar, öğenin kendisine veya bazen ebeveyn öğeye uygulanır. Bu sınıflar, ihtiyaç duyuldukça yardımcı program API'mizle özelleştirilebilir.
Bu, bir öğenin satır yüksekliğinin yardımcı programlarımızla nasıl etkilendiğini göstermek için yazılmış uzun bir paragraftır. Sınıflar, öğenin kendisine veya bazen ebeveyn öğeye uygulanır. Bu sınıflar, ihtiyaç duyuldukça yardımcı program API'mizle özelleştirilebilir.
Bu, bir öğenin satır yüksekliğinin yardımcı programlarımızla nasıl etkilendiğini göstermek için yazılmış uzun bir paragraftır. Sınıflar, öğenin kendisine veya bazen ebeveyn öğeye uygulanır. Bu sınıflar, ihtiyaç duyuldukça yardımcı program API'mizle özelleştirilebilir.
Bu, bir öğenin satır yüksekliğinin yardımcı programlarımızla nasıl etkilendiğini göstermek için yazılmış uzun bir paragraftır. Sınıflar, öğenin kendisine veya bazen ebeveyn öğeye uygulanır. Bu sınıflar, ihtiyaç duyuldukça yardımcı program API'mizle özelleştirilebilir.
---

## Monospace

Bir seçimi monospace yazı tipi yığınımıza dönüştürmek için `.font-monospace` kullanın.


Bu monospace'dir
---

## Renk sıfırlama

Bir metin veya bağlantının rengini `.text-reset` ile sıfırlayın, böylece ebeveyninden rengi miras alır.

  İkincil gövde metni ile sıfırlanmış bağlantı.

---

## Metin süslemesi

Bileşenlerde metni, metin süslemesi sınıflarıyla süsleyin.


Bu metin altına bir çizgi var.
Bu metin üzerinden bir çizgi geçiyor.
Bu bağlantının metin süslemesi kaldırıldı
---

## Sass

### Değişkenler

### Haritalar

Yazı tipi boyutu yardımcı programları, bu harita ile birlikte yardımcı program API'mizden üretilir.

### Yardımcı Program API'si

Yazı tipi ve metin yardımcı programları, `scss/_utilities.scss` dosyasında yardımcı program API'mizde tanımlanır. `Yardımcı program API'sini nasıl kullanacağınızı öğrenin.`

