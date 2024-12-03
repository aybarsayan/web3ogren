---
title: Tokenlar
seoTitle: XRP Ledger Tokenları ve Özellikleri
sidebar_position: 4
description: Herkes XRP Ledgerda dijital değeri temsil eden tokenlar oluşturabilir. Bu sayfa, tokenların nasıl çalıştığını, farklı türlerini ve kullanım alanlarını açıklamaktadır.
tags: 
  - XRP Ledger
  - token
  - stablecoin
  - NFT
  - ICO
  - dijital varlık
  - topluluk kredisi
keywords: 
  - XRP Ledger
  - token
  - stablecoin
  - NFT
  - ICO
  - dijital varlık
  - topluluk kredisi
---

# Token'lar

XRP dışındaki tüm varlıklar, XRP Ledger'da _token_ olarak temsil edilebilir.

Standart token'lar değiştirilebilir: bu, o token'ın tüm birimlerinin birbirinin yerine geçebilir ve ayırt edilemez olduğu anlamına gelir. Token'lar `döviz ödemeleri` için kullanılabilir ve `merkeziyetsiz borsa`'da işlem görebilir.

:::info
XRP Ledger'daki token'lar geçmişte "IOU" (yani [Ben-yetkisi](https://en.wikipedia.org/wiki/IOU)) ve "ihraç edilen para birimleri" olarak da adlandırılmıştır. Ancak, bu terimler, XRP Ledger token'larının temsil edebileceği dijital varlık yelpazesini tam olarak kapsamadıkları için tercih edilmez.
:::

Token'lar aynı zamanda değiştirilemez de olabilir. Değiştirilemez token'lar (NFT'ler), benzersiz fiziksel, fiziksel olmayan veya tamamen dijital malların mülkiyetini kodamak için hizmet eder, örneğin sanat eserleri veya oyun içi nesneler gibi.

`Fungible Token'lar` ve `Değiştirilemez Token'lar` kısmına bakın.

## Stablecoin'ler

Stablecoin'ler, XRP Ledger'da token'lar için yaygın bir modeldir. İhracatçı, XRP Ledger dışındaki değeri temsil eden varlıkları tutar ve ledger'da eşdeğer değeri temsil eden token'lar ihraç eder.

`Stablecoin'ler` kısmına bakın.

## Topluluk Kredisi

XRP Ledger'ı kullanmanın bir başka yolu "topluluk kredisi"dir; bireylerin birbirlerini tanıdığı, XRP Ledger'ı kimin kime ne kadar borcu olduğunu takip etmek için kullandıkları bir sistemdir. XRP Ledger’ın bir özelliği, bu borçları otomatik ve atomik bir şekilde, `rippling` aracılığıyla ödeme yapmak için kullanabilmesidir.

Bu tür bir kullanım hakkında daha fazla bilgi için `path'ler` kısmına bakın.

## Diğer Token'lar

XRP Ledger'da ihraç edilen token'lar için başka kullanım durumları da vardır. Örneğin, belli bir miktarda para birimi ihraç ederek bir "İlk Para Arzı" (ICO) oluşturabilirsiniz; ardından "anahtarı atarak" ihracatçıdan uzaklaşabilirsiniz.

:::danger
ICO'lar ABD'de [menkul kıymet olarak düzenlenebilir](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings).
:::

Herhangi bir finansal hizmet işine girmeden önce ilgili düzenlemeleri araştırmayı unutmayın.

## Token Özellikleri

XRP Ledger'daki token'lar, XRP'den temelde farklıdır. Token'lar her zaman _güven hatlarında_ bulunur ve token transferlerinin tümü güven hatları boyunca gerçekleşir. Başka birinin hesabında, güven hattında yapılandırılan _limit_ kadar token tutmasını sağlayamazsınız. (Örneğin, merkeziyetsiz borsa da daha fazla satın alarak veya zaten pozitif bir bakiyeniz olduktan sonra limiti düşürerek kendi güven hattınızı limitin üzerine çıkarabilirsiniz.)

Gerekli güven hatları mevcutsa, herkes `Ödeme işlemi` göndererek token'lar ihraç edebilir. Token'ları, onları ihraççıya geri göndererek "yakabilirsiniz". Bazı durumlarda, döviz ödemeleri veya ticaretler de bir ihracatçının ayarlarına göre daha fazla token oluşturabilir.

:::tip
İhracatçılar, kullanıcıların token'larını transfer ederken otomatik olarak düşülen bir `transfer ücreti` talep edebilirler. Ayrıca token'larına dahil olan валютların `tick boyutunu` tanımlayabilirler. Hem ihracatlar hem de normal hesaplar, o güven hatlarında token'ların nasıl kullanılabileceğini sınırlayan `dondurma` işlemi yapabilir.
:::

Token'lar, 15 basamak hassasiyetle ondalık (base-10) matematik kullanır ve çok büyük değerleri (9999999999999999 × 10^80 kadar) ve çok küçük değerleri (1.0 × 10^-81 kadar) ifade etmelerine olanak tanıyan bir üslü ifadeye sahiptir.

