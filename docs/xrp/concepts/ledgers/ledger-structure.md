---
title: Defter Yapısı
seoTitle: XRP Defteri Yapısı
sidebar_position: 4
description: XRP Defteri, ardışık veri bloklarının geçmişini içerirken, her bir blok detaylı yapısı ile işlem görmektedir.
tags: 
  - XRP Defteri
  - defter yapısı
  - durum verisi
  - işlemler
  - blok zinciri
keywords: 
  - defter yapısı
  - XRP Defteri
  - durum verisi
  - işlem seti
  - defter başlığı
  - doğrulama durumu
  - defter indeksi
---

## Defter Yapısı

XRP Defteri bir blok zinciri olup, ardışık veri bloklarının bir geçmişini içerir. XRP Defteri blok zincirinde bir blok, *defter versiyonu* veya kısaca *defter* olarak adlandırılır.

Konsensüs protokolü, önceki bir defter versiyonunu başlangıç noktası olarak alır, geçerli işlemler seti üzerinde doğrulayıcılar arasında bir anlaşma oluşturur ve ardından bu işlemleri uyguladıklarında herkesin aynı sonuçları aldığını onaylar. Bu başarıyla gerçekleştiğinde, sonuç yeni bir *doğrulanmış* defter versiyonudur. Bu noktadan itibaren, süreç sonraki defter versiyonunu oluşturmak için tekrarlanır.

Her defter versiyonu, *durum verilerini*, bir *işlem setini* ve meta verileri içeren bir *başlığı* barındırır.



---

## Durum Verisi



_Durum verisi_, bu defter versiyonu itibarıyla tüm hesaplar, bakiyeler, ayarlar ve diğer bilgilerin bir anlık görüntüsünü temsil eder. Bir sunucu ağa bağlandığında, ilk yaptığı şeylerden biri, yeni işlemleri işlemek ve mevcut durum hakkında sorguları yanıtlamak için mevcut durum verilerinin tam bir setini indirmektir. Ağdaki her sunucu durum verilerinin tam bir kopyasına sahip olduğundan, tüm veriler kamuya açıktır ve her kopya eşit derecede geçerlidir.

:::info
Durum verisi, ağaç formatında saklanan *defter girdileri* adı verilen bireysel nesnelerden oluşur. Her defter girişi, durum ağacında aramak için kullanabileceğiniz benzersiz bir 256-bit ID'ye sahiptir.
:::

---

## İşlem Seti



Defterde yapılan her değişiklik bir işlemin sonucudur. Her defter versiyonu, belirli bir sırada yeni uygulanmış bir grup işlemi içeren bir *işlem seti* taşır. Önceki defter versiyonunun durum verilerini alırsanız ve bu defterin işlem setini bunun üzerine uygularsanız, bu defterin durum verisi sonucunu elde edersiniz.

Bir defterin işlem setindeki her işlem, aşağıdaki her iki bölümü de içerir:

- Gönderenin deftere ne yapmasını söylediğini gösteren *işlem talimatları*.
- İşlemin nasıl işlendiğini ve defterin durum verisini nasıl etkilediğini gösteren *işlem meta verileri*.

---

## Defter Başlığı

*Defter başlığı*, bir defter versiyonunu özetleyen bir veri bloğudur. Bir raporun kapağı gibi, defter versiyonunu benzersiz bir şekilde tanımlar, içeriğini listeler ve oluşturulma zamanını, bazı diğer notlarla birlikte gösterir. Defter başlığı aşağıdaki bilgileri içerir:



Bir defterin işlem seti ve durum verisi sınırsız boyutta olabilir, ancak defter başlığı her zaman sabit bir boyuttadır. Bir defter başlığının kesin verileri ve ikili formatı için `Defter Başlığı` sayfasına bakın.

---

## Doğrulama Durumu


Bir sunucunun Benzersiz Düğüm Listesi'ndeki doğrulayıcıların bir defter versiyonunun içeriği üzerinde bir mutabakata varması durumunda, bu defter versiyonu doğrulanmış ve değiştirilemez olarak işaretlenir. Defterin içeriği, bir sonraki defter versiyonunu oluşturan ardışık işlemlerle ancak değiştirilebilir.

Bir defter versiyonu ilk oluşturulduğunda, henüz doğrulanmamıştır. Aday işlemlerin farklı sunuculara ulaşma zamanlarındaki farklılıklar nedeniyle, ağ, zincirdeki bir sonraki adım olmak üzere birden fazla farklı defter versiyonu oluşturup önerebilir. `Konsensüs protokolü`, bunlardan hangisinin doğrulanacağına karar verir. (Doğrulanmış defter versiyonunda yer almayan herhangi bir aday işlem genellikle bir sonraki defter versiyonunun işlem setine dahil edilebilir.)

---

## Defter İndeksi mi Yoksa Defter Hash'i mi?

Bir defter versiyonunu tanımlamanın iki farklı yolu vardır: *defter indeksi* ve *defter hash'i*. Bu iki alan bir defteri tanımlasa da, farklı amaçlara hizmet eder. Defter indeksi, defterin zincirdeki konumunu gösterir ve defter hash'i, defterin içeriğini yansıtır.

Farklı zincirlerden gelen defterler aynı defter indeksine sahip olabilir ancak farklı hash'lere sahip olabilir. Ayrıca, doğrulanmamış defter versiyonlarıyla ilgilenirken, aynı indekse sahip ancak farklı içeriğe ve dolayısıyla farklı hash'lere sahip birden fazla aday defter olabilir.

> Aynı defter hash'ine sahip iki defter her zaman tamamen özdeştir.  
> — XRP Defteri Kılavuzu