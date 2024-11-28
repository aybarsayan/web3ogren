---
title: Genel Bakış - BSC Paymaster
description: Bu belge, Harici Sahipli Hesap (EOA) cüzdanları için özel olarak tasarlanmış bir paymaster çözümünü tanıtmaktadır. EIP-4337'de belirtilen paymaster'dan farklı olarak, kullanıcı deneyimini önemli ölçüde artırmak için gaz ücreti sponsorluğunu destekler. 
keywords: [EOA, BSC, paymaster, gaz ücreti, kullanıcı deneyimi]
---

# EOA Tabanlı Paymaster
Bu belge, Harici Sahipli Hesap (EOA) cüzdanları için özel olarak tasarlanmış bir paymaster çözümünü tanıtmaktadır. Bu, EIP-4337'de tanımlanan paymaster'dan farklıdır. Minimum değişikliklerle, cüzdanlar bu çözümü gaz ücreti sponsorluğunu desteklemek için entegre edebilir, bu da kullanıcı deneyimini önemli ölçüde artırır.

## EOA Tabanlı Paymaster Nedir

[EIP-4337](https://github.com/ethereum/ercs/blob/master/ERCS/erc-4337.md) (Giriş Noktası Sözleşme Spesifikasyonu aracılığıyla Hesap Soyutlaması) içindeki paymaster, Ethereum işlemlerinin esnekliğini ve kullanıcı deneyimini artırmak için tasarlanmış önemli bir bileşendir. Bu, bir üçüncü tarafın bir kullanıcının işlem ücretlerini ödemesine olanak tanır ve kullanıcıların gaz için ETH tutmasını gereksiz kılar.

EIP-4337, akıllı sözleşme cüzdanları için devrim niteliğinde paymaster kavramını tanıtırken, Ethereum ekosisteminin önemli bir kısmı hala EOA'lara dayanmaktadır. **Bunu tanıyarak, bu belge EOA cüzdanları için özel olarak tasarlanmış çığır açıcı bir paymaster çözümünü sunmaktadır.** Bu yenilik, işlem sponsorluğu ve geliştirilmiş kullanıcı deneyimi faydalarını, akıllı sözleşme cüzdanlarına geçiş yapmadan daha geniş BNB Chain kullanıcı tabanına getirir. EOA paymaster çözümü, sponsorlu işlemlere erişimi demokratikleştirmeyi ve mevcut EOA cüzdan kullanıcıları için blok zinciri etkileşimlerini daha kullanıcı dostu ve maliyet etkin hale getirmeyi amaçlamaktadır.

## Nasıl Çalışır

[BEP322](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP322.md) Proposer-Builder Ayrışması (PBS) mimarisi altında, işlem işleme konusunda önemli bir değişiklik meydana gelir:

1. **Doğrulayıcı Rolü**: Doğrulayıcılar artık bir blok içindeki bireysel işlem gaz fiyatlarını doğrulamamaktadır.
2. **İşlem Gruplama**: Özel işlemler gruplara alınır ve yapıcılara sunulur.
3. **Önceliklendirme**: Yapıcılar her grubun toplam gaz fiyatına göre önceliklendirme yapar.
4. **İç Gruplama Esnekliği**: Tek bir grup içinde, gaz fiyatları değişkenlik gösterebilir, bu da hem sıfır ücretli hem de daha yüksek ücretli işlemlerin aynı anda var olmasına olanak tanır.

Bu esneklik, **sponsorlu gaz ücretleri** ve **gazsız işlemler** gibi yenilikçi özelliklere olanak tanır.

### Tanımlar


Grup, Yapıcı, Önerici, Paymaster, Sponsor Politikası Tanımları

**Grup**: Atomik bir şekilde yürütülen işlemlerden oluşan siparişli bir dizi; gruptaki tüm işlemlerin birlikte işlenmesini veya hiç işlenmemesini sağlar.

**Yapıcı**: Blok inşasından sorumlu MEV tedarik zincirindeki yeni bir paydaş. Yapıcılar, işlem gruplarını, kamu txpool'undan bireysel işlemleri ve özel işlem sıralama akışını önerilen bloklara paketler.

**Önerici**: Blok zincirine dahil edilmek üzere birden fazla yapıcının önerilerinden en kârlı bloğu seçen bir doğrulayıcı.

**Paymaster**: İşlem sponsorluğunu mümkün kılan bir altyapı bileşeni; kendisinin veya üçüncü şahısların gaz ücretlerini karşılamasına izin verir.

**Sponsor Politikası**: Gaz sponsorunun hangi işlemlerin sponsorluğa uygun olduğunu belirlemek için tanımlanan kurallar kümesi. Bu, beyaz listeye alınmış işlem göndericileri veya belirli işlem türleri gibi kriterleri içerebilir.


### Genel İş Akışı

![workflow](../../../images/bnb-chain/bnb-smart-chain/img/paymaster-workflow.png)

Gaz sponsorluğu süreci, birkaç ana bileşen ve adım içerir:

1. **Kullanıcı Başlatma**:
    - Bir kullanıcı, uyumlu bir cüzdan kullanarak bir işlem hazırlar.
    - Cüzdan, potansiyel olarak sponsorlu işlemler için gaz fiyatını sıfıra ayarlar.

2. **Paymaster Gönderimi**:
    - Cüzdan, sıfır gaz fiyatına sahip işlemi Paymaster'a gönderir.

3. **Sponsor Politikası Doğrulama**:
    - Paymaster, işlemi mevcut sponsor politikalarına karşı kontrol eder.
    - Politikalar, gönderici/alıcı adresleri, token türleri veya işlem limitleri gibi kriterleri içerebilir.

4. **Sponsorluk İşleme**:
    - İşlem sponsorluğa uygunsa:
      a. Paymaster, daha yüksek bir gaz fiyatıyla bir sponsor işlemi oluşturur.
      b. Orijinal kullanıcı işlemi ve sponsor işlemi bir grup olarak birleştirilir.
    - Uygun değilse, işlem reddedilir veya normal işleme için kullanıcıya iade edilir.

5. **Grup Oluşturma ve Gönderim**:
    - Bu grup, birden fazla MEV yapıcısına gönderilir.

6. **Yapıcı Seçimi ve Blok Önerisi**:
    - MEV yapıcıları grubu blok önerilerine dahil eder.

7. **Blok Zincirine Dahil Etme**:
    - Önericiler (doğrulayıcılar), yapıcıların önerilerinden en kârlı bloğu seçer.
    - Seçilen blok, kullanıcının orijinal işlemi ve sponsorun işlemini içerecek şekilde blok zincirine eklenir.
    - Bu, her iki işlemin atomik olarak yürütülmesini sağlar.

8. **İşlem Sonrası İşleme**:
    - Paymaster Yöneticisi, sponsorun hesabını güncelleyerek sponsorlu gaz için uygun tutarı düşer.

---

Bu çözüm, mevcut cüzdan altyapısında büyük değişiklikler gerektirmeden, sorunsuz gaz sponsorluğu sağlamak için BEP322 Proposer-Builder Ayrışma mimarisini kullanır. Çeşitli sponsor modeli seçeneklerini barındıran esnek bir sistem sunarken, blok zinciri ağının güvenliğini ve bütünlüğünü korur.

## Paymaster Altyapısı

:::info
Uygulamanızda veya cüzdanınızda gazsız deneyimler sağlamak için hazır mısınız? BNB Chain'de mevcut olan paymaster altyapısı hakkında bazı yardımcı bilgiler:
:::

- **[Nodereal](https://docs.nodereal.io/docs/megafuel-overview)**: Nodereal tarafından sunulan MegaFuel, EOA Cüzdanı için BNB Chain Paymaster'a dayanan bir paymaster uygulamasıdır. Minimum değişikliklerle, cüzdanlar MegaFuel'i gaz ücreti sponsorluğu desteği eklemek için entegre edebilir, bu da kullanıcı deneyimini önemli ölçüde artırır. Aynı zamanda, sponsorlar MegaFuel'de sponsorluğunu özelleştirebilir, böylece sponsorlu kullanıcıların gazsız işlemler göndermesine olanak tanır.
- **[Bitget Cüzdanı](https://web3.bitget.com/en/)**: Bitget Cüzdanı, BSC üzerinde paymaster'ı entegre ederek sponsorlu kullanıcı işlemleri için gazsız işlevsellik sunmaktadır.