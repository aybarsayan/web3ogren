# Veriler için Hücreler

TON'daki her şey hücrelerde saklanır. Bir hücre, şunları içeren bir veri yapısıdır:

- **1023 bit** veriye kadar (bayt değil!)
- Diğer hücrelere **4 referansa kadar**

Bitler ve referanslar karıştırılmaz (ayrı saklanırlar). Dairesel referanslar yasaktır: herhangi bir hücre için, hiçbir torun hücresi bu orijinal hücreyi referans olarak alamaz.

Böylece, tüm hücreler yönlendirilmiş asiklik grafik (DAG) oluşturur. İşte bunu açıklamak için güzel bir resim:

![Yönlendirilmiş Asiklik Grafik](../../../../images/ton/static/img/docs/dag.png)

## Hücre Türleri

Şu anda 5 tür hücre bulunmaktadır: _olağan_ ve 4 _egzotik_.
Egzotik türler şunlardır:

* Budanmış dal hücresi
* Kütüphane referans hücresi
* Merkle kanıt hücresi
* Merkle güncelleme hücresi

:::tip
Egzotik hücreler hakkında daha fazla bilgi için: [**TVM Beyaz Kitap, Bölüm 3**](https://ton.org/tvm.pdf).
:::

## Hücre Tatları

Bir hücre, kompakt depolama için optimize edilmiş opak bir nesnedir.

Özellikle, verileri tekrar etmez: eğer çeşitli eşdeğer alt hücreler farklı dallarda referans gösteriliyorsa, bunların içeriği yalnızca bir kez saklanır. Ancak, opaklık bir hücrenin doğrudan değiştirilip okunamayacağı anlamına gelir. Böylece, hücrelerin 2 ek tadı vardır:

* _Yapıcı_ kısmen inşa edilmiş hücreler için, bit dizileri, tam sayılar, diğer hücreler ve diğer hücrelere referans eklemek için hızlı işlemler tanımlanabilir.
* _Dilim_ kısmen ayrıştırılmış bir hücrenin kalanını veya böyle bir hücre içerisinde yer alan ve ayrıştırma talimatı ile çıkarılan bir değeri (alt hücre) temsil eden 'kesilmiş' hücreler içindir.

:::info
TVM'de kullanılan bir diğer özel hücre tadı şudur:
* _Devam_ TON Sanal Makinesi için op-kod (talimat) içeren hücreler için, `TVM genel görünümü` bakınız.
:::

## Verilerin Hücrelere Serileştirilmesi

TON'daki herhangi bir nesne (mesaj, mesaj kuyrugu, blok, tüm blok zinciri durumu, sözleşme kodu ve verisi) bir hücreye serileştirilir.

Serileştirme süreci bir TL-B şeması ile açıklanır: bu nesnenin _Yapıcı_ içine nasıl serileştirilebileceği veya bir _Dilim_ içinden belirli bir türden bir nesneyi ayrıştırmanın nasıl yapılacağına dair resmi bir tanım. Hücreler için TL-B, bayt akışları için TL veya ProtoBuf ile aynıdır.

:::note
Hücre (de)serileştirmesi hakkında daha fazla ayrıntılı bilgi almak istiyorsanız, `Hücre & Hücre Torbası` makalesini okuyabilirsiniz.
:::

## Ayrıca Bakınız

* `TL-B Dili`