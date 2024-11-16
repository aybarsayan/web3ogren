# ERTP Genel Bakış

ERTP (_Elektronik Hak Transfer Protokolü_), Agoric'in JavaScript'te token ve diğer dijital varlıkların transferi için geliştirdiği token standardıdır.  kullanarak, dijital varlıkları kolayca oluşturabilir ve kullanabilirsiniz. Bu varlıklar, tam olarak aynı şekilde ve aynı güvenlik özellikleriyle aktarılır.

ERTP, erişim kontrolünü sağlamak için  kullanır. Programınız bir nesneye referansa sahipse, o nesnenin yöntemlerini çağırabilir. Eğer bir referansa sahip değilse, çağıramaz. Nesne yetenekleri hakkında daha fazla bilgi için  göz atabilirsiniz.

## ERTP Kavramları Genel Bakış

### Varlık

Üç tür varlık bulunmaktadır:
,
, ve
.

Fungible varlıklar birbirleriyle değiştirilebilir. Örneğin, 100 bir dolarlık banknotunuz varsa ve birine 5 dolar ödemek istiyorsanız, hangi beş banknotu verdiğiniz önemli değildir.

Non-fungible varlıklar aynı markaya sahip olsa da, birbirleriyle değiştirilemezler. Örneğin, 100 tiyatro biletiniz olabilir. Ancak, sizden bir Genel Giriş bileti satın almak isteyen biri belirli bir tarih ve saat için bir bilet isteyecektir. Bu durum fiyatı da etkileyebilir; bir Cuma akşamı bileti için Çarşamba öğleden sonra biletine göre daha fazla ücret almak isteyebilirsiniz, hatta her ikisi de aynı gösteri içinse bile.

Semi-fungible varlıklar, birbirleriyle değiştirilemeyen farklı formlara sahiptir, ancak tek bir formun örnekleri birbirleriyle değiştirilebilir. Örneğin, tek bir gösteri için tiyatro biletleri Genel Giriş ve Balkon bölümlerine ayrılabilir ve bir bilet sahibi ilgili bölümdeki herhangi bir koltukta oturabilir.

### Miktar

Varlıklar, `brand` ve `value` içeren **** kayıtlarıyla tanımlanır.

- ****: Bir varlığın türü. Bir varlık hakkında "Bu nedir?" sorusunun cevabı olarak düşünülebilir.
- ****: Bir varlığın büyüklüğü. "Ne kadar var?" veya "Nedir?" sorularının yanıtı olarak düşünülebilir.

**Önemli**: Miktarlar, dijital varlıkların _tanımlarıdır_, gerçek varlıklar değildir. Ekonomik kıtlık veya içsel bir değeri yoktur.

Örneğin, kurgusal bir para birimi olan Quatloos'u kullanarak, "400 Quatloos" olarak tanımlanan bir varlık oluşturabilirsiniz. Bu durumda, `400n` `value` ve `Quatloos` `brand` olacaktır. Şimdilik, yalnızca değerleri negatif olmayan tamsayılar olarak temsil edilen fungible varlıkları inceleyeceğiz.



### MiktarMatematiği

ERTP, miktar değerlerini toplama, çıkarma ve karşılaştırma gibi işlemler için **** kütüphanesini kullanır. Bu işlemler, bir cüzdana varlık yatırırken ya da varlık çekerken gerçekleştirilir.

### Marka

Çoğu ERTP nesnesi, oluşturuldukları anda belirlenmiş bir **** ile çalışmak üzere kalıcı bir kısıtlamaya sahiptir. Örneğin, bir varlık Quatloos ile ilişkilendirilirse, yalnızca Quatloos ile ilişkilidir. Özel olarak, bir `brand` ile `mint` ve `issuer` birbirleriyle değiştirilemeyen birebir ilişkiler içerisindedir.

- ****: Belirli bir `brand`'in dijital varlıklarını üreten benzersiz yaratıcısıdır.
- ****: Her bir `purse` ve `payment`'in ne kadar dijital varlık içerdiğinin gerçek kaynağıdır. Bir `issuer`, kendisiyle ilişkilendirilmiş `brand` için güvenilmeyen taraflardan alınan `payments`'i doğrulamak için kullanılır.

{ width=200 height=200 }

### Cüzdanlar ve Ödemeler

Son iki kavramımızı daha önce dile getirmiştik:

- ****: Belirli bir `brand`'in dijital varlıklarını tutan bir nesnedir.
- ****: Belirli bir `brand`'in dijital varlıklarını başka bir tarafa aktaran bir nesnedir.

Diğer bileşen örneklerinde olduğu gibi, bir `purse` ve bir `payment` yalnızca bir `brand` ile çalışır. Dolayısıyla, bir Quatloos'u tutan bir `purse` veya `payment`, bir Moola `brand` varlığını tutamaz. Bir `purse` veya `payment`'in başlangıçta ilişkilendirildiği `brand` değiştirilemez. Bir Quatloos cüzdanı veya ödeme oluşturduğunuzda, başka bir varlık tutamaz.

Ancak, bu ilişkiler birebir değildir. Quatloos veya başka bir `brand` tutan binlerce veya daha fazlası olabilir.



## Yöntem İsimlendirme Yapısı

ERTP yöntemleri, isimleri için bir şablon kullanır. Belirli bir yöntem adı öneki neyi temsil ettiği hakkında bilgi sahibi olmak, kod okurken size yardımcı olabilir. Tutarlılık sağlamak amacıyla, Agoric kodunuzda da bu şablonu kullanmak isteyebilirsiniz.

- `make()`: Yeni bir Foo nesnesi oluşturur ve yalnızca o nesneyi döndürür.
- `makeKit()`: Yeni bir Foo nesnesi ve diğer şeyler oluşturur. Genellikle yeni Foo nesnesini de içeren kullanışlı şeylerin bir kombinasyonunu döndürür. Ancak her zaman öyle değildir; bazen Foo'lar kavramsaldır ve örneğin bir nesne yerine iki yön dönebilir.
- `create()`: Yeni bir Foo oluşturur, ancak döndürmez.
- `get()`: Zaten var olan bir Foo'yu döndürür.
- `provide()`: Eğer Foo zaten mevcutsa, onu döndürür. Değilse, yeni bir Foo oluşturur ve onu döndürür.

## Varlıkların Hayatı

Bazı varlık operasyonu yaşam döngülerine bakalım. Varlıkların yok olmasının nadir olduğu düşünülse de, bu yaşam döngüleri varlıkların yaratılışından yaygın kullanım desenlerine kadar gösterir. Bunlar, temel, ana işlevselliğine indirgenmiş olarak tasarlanmıştır. İsteğe bağlı parametreler ve temel olmayan işlemler gösterilmemiştir, ayrıca bu girişin daha karmaşık hale gelmesine neden olabilecek bazı önemli kavramlar da ele alınmamıştır. Bunlar, bileşe özel sayfalarda anlatılmaktadır.

### Varlık Oluşturma ve Depolama



Kit()` yöntemi yeni bir Foo (bu durumda bir `issuer`) ve diğer şeyleri oluşturarak her üç yeni nesneyi döndürür. `mint`, `issuer` ve `brand`, birbirleriyle değiştirilemeyen ilişkiler içerisindedir.

Bu örnekte, `brand` ismi olarak 'quatloos' kullandınız.





Diyelim ki, Alice'in kendi Quatloos `purse`'ı var. Diğer tarafların güvenli bir şekilde Quatloos yatırmasını sağlamak için, o cüzdan için bir  oluşturuyor. Herhangi biri, bir deposit facet'e erişime sahipse, o cüzdana varlık yatırabilir, ancak cüzdanından para çekemez veya bakiyesini göremez. Bu, birine e-posta adresiyle para göndermeye benzer; arkadaşınızın hesabından para çekemez veya ne kadar para bulunduğunu bilemezsiniz.





Alice, depo facetedini Agoric'in  üzerinde, genel kullanıma sunmak için açıklar. Board, kullanıcıların bir değere karşılık gelen bir İd'i gönderdiği ve bu İd ile değeri elde ettikleri basit bir ilan panosu türüdür. Alice, İd'lerini duyurmak için istediği iletişim yöntemlerini kullanabilir; özel e-posta, bir mail listesine veya birçok bireye gönderim, bir web sitesinde, TV programında veya gazetede reklam alabilir, kendi web sitesinde yayınlayabilir vb.

<<< @/../snippets/ertp/guide/test-readme.js#getValue

Unutmayın, ERTP'nin OCaps kullanımında, bir nesnenin yöntemlerini çalıştırmak için o nesneye erişiminiz olmalıdır. Bu yüzden, Alice'in deposit facet'ini kullanmak isteyen birinin önce onu Board'dan alması gerekir.

Alice, Quatloos `purse`'daki deposit facet'iyle ilişkili olan Board İd'sini size söyler. Bu İd ile ilişkili değeri alırsınız; bu size o deposit facet'ine erişim sağlar. Ardından, facet'e 5 Quatloos'luk `payment`'inizi almasını söylersiniz.

Sonuç olarak, sizin Quatloos `purse`'ınızda 2 Quatloos (7 - 5), Alice'in Quatloos `purse`'ında ise artık 5 Quatloos olur ve 5 Quatloos'luk `payment` transfer gerçekleştiğinde tüketilir.

`E()` notasyonu, uzaktaki nesneler üzerinde yöntemleri çağırmanıza olanak tanıyan yerel bir "köprü"dir. Bu, uzaktaki bir nesne için yerel bir temsilciyi (bir ) bir argüman olarak alır ve uzaktaki nesneye mesajlar gönderir. Bu,  daha ayrıntılı olarak açıklanmaktadır.

## Değiştirilemeyen Varlıkları Oluşturma ve Kullanma

Diyelim ki Agoric Tiyatrosu'nda bir oyun için koltuk biletleri satmak istiyorsunuz. Biletler, belirli bir oyun için belirli bir koltuk ve belirli bir tarih/saat referans alarak değiştirilemeyen varlıklardır. Alıcıların hangi bileti aldıkları önemlidir.

Agoric Tiyatrosu'nun 1114 tane `1` ile `1114` arasında numaralandırılmış koltuğu vardır. Geçerli bir bileti temsil eden bir nesnenin özellikleri:

- `seat`: Bir numara.
- `show`: Gösterinin tanımını içeren bir dize.
- `start`:  ile temsil edilen bir dize.

<<< @/../snippets/ertp/guide/test-readme.js#ticketValues

Bilet oluşturmak için, her biri bir bileti temsil eden JavaScript nesneleri oluşturuyorsunuz. Ardından, dijital varlıkların mintlenmesi gereken miktarı belirtmeniz gerektiğinden, `AmountMath` kullanarak bir miktar oluşturabilirsiniz. Bu durumda, _Hamilton_ oyununa bir performans için bilet oluşturuyorsunuz.

<<< @/../snippets/ertp/guide/test-readme.js#makeTicketIssuer

Önceki işlemlerde olduğu gibi, Agoric Tiyatrosu bilet varlıklarını oluşturmak için bir `mint` oluşturmak için `makeIssuerKit()` kullanıyorsunuz. Fungible bir varlık oluştururken yalnızca `AssetKind.SET` ikinci argümanını kullanmalısınız.

İki tane `AssetKinds` bulunmaktadır. Her biri, aynı yöntem kümesini polymorfik olarak uygular.

- `AssetKind.NAT`: Doğal sayılar ile çalışır `values` ve fungible varlıklar. `makeIssuerKit()` için varsayılan değerdir.
- `AssetKind.SET`: Değiştirilemeyen varlıklarla kullanılır, anahtarlar ve değerlerle kayıtların (nesnelerin) bir dizisi üzerinde çalışır.

<<< @/../snippets/ertp/guide/test-readme.js#ticketPayments

Öncelikle vermek istediğiniz her bilet için bir `amount` tanımı yapıyorsunuz.

Ardından, her bilet için bir varlık oluşturmak üzere uygun `brand` için `mint`'inizi kullanıyorsunuz. Her bilet varlığı ayrı bir `payment`'dir. Değiştirilemeyen bir varlık `payment`'ini fungible bir varlık `payment`'i gibi transfer edip yatırabilirsiniz.

## Miktarlar Varlık Değildir

**ÖNEMLİ**: Görünüşte olduğu gibi, bir `amount`, kendisi bir varlık değildir. Sadece varlıkları iki eksen boyunca tanımlar; ne oldukları ve ne kadar oldukları (`brand` ve `value`). Miktarlar, bir anlaşma yapılmadan önce gerçek varlıkları göndermeden veya paylaşmadan müzakere etmek için kullanılır.

Örneğin, size bir varlığı satın alma teklifi yapacak olsaydım, diyelim ki bir oyunda sihirli bir kılıç, size 5 Quatloos teklif ettiğim bir `amount` göndereceğim. Gerçek 5 Quatloos'u göndermiyorum; yalnızca, ticaret şartları üzerinde anlaştığımızda, size 5 Quatloos'luk bir `payment` gönderdiğimde, gerçekten varlığı gönderiyorum.
Eğer teklifimi reddederseniz, belirteceğim `amount`'ı 10 Quatloos olacak şekilde değiştirebilirim. Gerçek varlıklara 5 Quatloos eklemedim, yalnızca kılıç için yaptığım teklifin varlıklarının tanımını gönderdim.

Yeni bir `amount` oluşturmak yeni varlıklar yaratmaz. İki `amount` eklemek de, çünkü bir `amount` değişmezdir, yalnızca yeni bir `amount` yaratır. Ertp varlıkları yalnızca `mint`'lerinin yeni bir `payment` içeren varlıkları döndürmesiyle oluşturulabilir. Çünkü bir `amount`, bir varlığın tanımıdır, o bir on dolarlık banknotun resmi gibidir. Bir `asset`, değerinin hükümet destekli güvenliğinden türediği yetkili bir tesis tarafından basılmış gerçek on dolarlık banknota benzer.

Başka bir deyişle, size _Hamilton_ oyununa 300 dolara bir bilet satacağım teklifi yaparken size gerçek bir bilet göndermiyorum; 300 doları, bunun karşılığında ne vereceğimi öğrenmeden göndermiyorum. Bunun yerine, takas için neyi değiştireceğimi ileten bir tanım yaparak sizlere teklifte bulunuyorum ("300 dolara bir _Hamilton_ bileti değiştireceğim"). Eğer teklif kabul edilirse, **o zaman** gerçek varlığı gönderiyorum (gösterinin tadını çıkarın!) ve siz de bana o 300 doları (harcamaktan keyif alacağım!) gönderiyorsunuz.
Agoric yığında, takasın varlıkları  ile gözetim altındadır.

## Nesne Yetenekleri ve ERTP

ERTP,  kullanır. Bir nesneyi kullanmak ve ona komut vermek için o nesneye erişiminiz olmalıdır; yalnızca onun okunaklı adı ya da benzeri bir şey değil. Örneğin, Quatloos'u üreten mint'in 'quatloos-mint' adını taşıdığını biliyor olabilirim (ya da iyi bir tahminde bulunabiliyorum). Ancak, `quatloos` `brand` nesnesiyle ilişkili gerçek `mint` nesnesine sahip olmadan, bir milyon Quatloos yaratmak ve hepsini  üzerindeki gladyatör mücadelesi için Kirk'e bahis oynamak için kullanamam.

## Güvenlik Özellikleri

ERTP `purses`'in bir `payment` argümanı alarak `deposit` yöntemi vardır. Öncelikle, `payment`'in gerçek olup olmadığını ve `purse` ile aynı varlık `brand`ine ait olup olmadığını kontrol eder.

Eğer her şey kontrollerden geçerse, varlık `payment`'ten `purse`'a geçer. Eğer bir sorun olursa, bir hata fırlatır.

Başarılı bir yatırma işleminden sonra, ERTP şunları garanti eder:

- `payment`, `issuer`'ın kayıtlarından silinir ve artık ona bağlı hiçbir varlık kalmaz.
- `issuer`, artık bu `payment`'i tanımaz.
- `purse`, `payment`'te bulunan tüm dijital varlıkları içerir.

`deposit` çağrısı bir hata fırlattığında (yani bir sorun oluştuğunda), ERTP, ne `purse` ne de iddia edilen `payment`'in etkilenmediğini garanti eder.

Buna ek olarak, herhangi bir `purse` için bir  oluşturabilirsiniz. Bu, belirli bir `purse` ile ilişkilendirilmiş bir nesnedir ve başka bir tarafa gönderilebilir. Güvenlik avantajı, diğer tarafın yalnızca o `purse`'a para yatırmak için kullanabileceğidir. `purse`'dan para çekme veya bakiyesini sorma işlemlerini yapamaz.

## Sözler

Birçok ERTP yöntemi _eşzamanlı_dır ve beklenen değerlerini hemen döndürmek yerine, bu değerin _vaadini_ döndürürler.

JavaScript, `Promise` nesnelerini uygular ve bu çalışmaları kolaylaştırmak için yeni iki anahtar kelime olan `async` ve `await` eklenmiştir. JavaScript'in uygulamasıyla ilgili genel ve kapsamlı bilgi için  veya  sayfasına göz atabilirsiniz.