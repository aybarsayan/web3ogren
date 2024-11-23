---
id: payment-object
title: Ödeme Nesnesi
---

# Ödeme Nesnesi

Bir **Ödeme**, taşınmakta veya yakında taşınması beklenen dijital varlıkları tutar. Bu varlıklar ****'a yatırılabilir, birden fazla **Ödeme** ile bölünebilir veya bir tanınmış **Ödeme** alınarak diğer herkesin erişimi iptal edilebilir.

**Ödemeler** içinde bulabileceğiniz dijital varlıklar şunlar olabilir:

- Para birimi benzeri varlıklar, örneğin hayali _Quatloos_ para birimimiz.
- Tiyatro biletleri veya bir oyunda kullanılan sihirli silahlar gibi mal benzeri dijital varlıklar.
- Belirli bir sözleşmeye katılma hakkı gibi diğer hak türleri.

Bir **Ödeme** lineerdir; bu, bir **Ödeme**'nin ya tam orijinal bakiyesi olduğu ya da tamamen kullanıldığı anlamına gelir. Bir **Ödeme**'yi kısmi olarak kullanamazsınız. Yani, bir **Ödeme** 10 _Quatloos_ ise, içinden yalnızca 3 _Quatloos_ almanız mümkün değildir.

Ancak, bir **Ödeme**'yi birden fazla **Ödeme**'ye bölebilirsiniz. Örneğin, 10 _Quatloos_ değerindeki bir **Ödeme**'yi **** yöntemini çağırarak 3 _Quatloos_ ve 7 _Quatloos_ olan iki yeni **Ödeme**'ye bölebilirsiniz. Bu yöntem, orijinal 10 _Quatloos_ **Ödeme**'sini tüketir ve iki yeni daha küçük **Ödeme** oluşturur.

**Ödemeler**, genellikle diğer aktörlerden alınır. Kendiliğinden doğrulanmadıkları için **Ödemeler**'e güvenemezsiniz. Bir **Ödeme**'nin doğrulanmış bakiyesini almak için **** yöntemini çağırmalısınız.

Bir **Ödeme**'yi yeni bir **Cüzdan**'a dönüştürmek için:

1. **Ödeme**'nin güvenilir ****'ni alın.
2. **Verici** kullanarak boş bir **Cüzdan** oluşturun.
3. **Ödeme**'yi yeni **Cüzdan**'a yatırın.

**** metodu **Ödeme**'yi tüketir ve daha sonra kullanılamaz hale getirir.

## aPayment.getAllegedBrand()

- Dönüş: ****

Bu **Ödeme**'nin iddia edilen dijital varlık türünü belirten **Marka**'yı döner. **Ödemeler** güvenilir olmadığından, üzerlerinde yapılan her tür yöntem çağrısı şüpheyle ele alınmalı ve başka yerlerde doğrulanmalıdır. Bir **Verici**'nin **Ödeme** üzerindeki herhangi bir başarılı işlemi onu doğrular.

```js
const payment = quatloosMint.mintPayment(AmountMath.make(quatloosBrand, 10n));
// 'quatloos' döndürmelidir
const allegedBrand = payment.getAllegedBrand();
```

## İlgili Yöntemler

Diğer ERTP bileşenlerinde aşağıdaki yöntemler ya bir **Ödeme** üzerinde çalışır ya da bir **Ödeme** döndürür.

- 
  - **Ödeme** içindeki tüm dijital varlıkları yok eder.
- 
  - **Ödeme**'nin bakiyesini bir **Miktar** olarak tanımlar.
- 
  - **Ödeme**'nin **Verici** tarafından oluşturulduysa ve kullanıma hazırsa (yani tüketilmemiş veya yok edilmemişse) **true** döner.
- 
  - **Mint**'in ilişkili **Markası**nın yeni dijital varlıklarını oluşturur.
- 
  - _payment_ içindeki tüm içerikleri **Cüzdan**'a yatırır.
- 
  - Diğer tarafların **Cüzdan**'a **Ödemeler** yatırmasına izin veren yeni bir sadece yatırma özelliği oluşturur ve döndürür.
- 
  - Belirtilen dijital varlıkların _miktarını_ **Cüzdan**'dan yeni bir **Ödeme**'ye çeker.
    ::: warning ESKI
- 
  - Tek bir **Ödeme**'yi iki yeni **Ödeme**'ye böler.
- 
  - Tek bir **Ödeme**'yi birden fazla **Ödeme**'ye böler.
- 
  - _payment_ içindeki tüm dijital varlıkları yeni bir **Ödeme**'ye aktarır.
- 
  - Birden fazla **Ödeme**'yi tek bir yeni **Ödeme**'de birleştirir.
    :::