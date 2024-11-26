---
title: Terminoloji
description:
  "Solana blok zinciri ve geliştirme modellerinde kullanılan temel terminolojiyi öğrenin."
keywords:
  - terimler
  - sözlük
  - tanımlar
  - tanımla
  - programlama modelleri
isSkippedInNav: true
---

Aşağıdaki terimler, Solana belgeleri ve geliştirme ekosisteminde kullanılmaktadır.

## hesap

Veri tutan veya çalıştırılabilir bir program olan Solana defterindeki bir kayıt.

Geleneksel bir bankadaki hesap gibi, bir Solana hesabı `lamport` olarak adlandırılan fonları tutabilir. Linux'taki bir dosya gibi, genellikle `açık anahtar` veya pubkey olarak adlandırılan bir anahtar ile adreslenebilir.

Anahtar şunlardan biri olabilir:

- bir ed25519 açık anahtar
- programdan türetilmiş bir hesap adresi (ed25519 eğrisinden zorlanmış 32 baytlık değer)
- 32 karakterlik bir dize ile ed25519 açık anahtarın bir hash'i

## hesap sahibi

Hesabı sahip olan programın adresi. Sadece sahip program, hesabı değiştirme yetkisine sahiptir.

:::note
Ayrıca bakınız: `yetki`.
:::

## uygulama

Bir Solana kümesiyle etkileşimde bulunan bir ön yüz uygulaması.

## yetki

Belli bir hesap üzerinde bazı izinlere sahip olan bir kullanıcının adresi.

Örneğin:

- Yeni tokenleri mintleme yetkisi, token minti için 'mint yetkisi' olan hesaba verilir.
- Bir programı güncelleme yetkisi, programın 'güncelleme yetkisi' olan hesaba verilir.

## banka durumu

Belirli bir `tıklama yüksekliği` üzerindeki defterdeki tüm programların yorumlanmasının sonucu. En azından sıfırdan fazla `yerel token` tutan tüm `hesaplar` setini içerir.

## blok

Bir `oy` ile kapsanan defterdeki bir dizi `giriş`. Bir `lider` her `slot` başına en fazla bir blok üretir.

## blok hash'i

Bir kaydı (blok) tanımlayan benzersiz bir değer (`hash`). Solana, bloğun son `giriş kimliğinden` bir blok hash'i hesaplar.

## blok yüksekliği

Geçerli bloğun altındaki `bloklar` sayısı. `ilk blok` sonrası ilk blok yüksekliği bir olur.

## bootstrap doğrulayıcı

Bir blok zincirinin `ilk blok` (genesis) üreten `doğrulayıcı`.

## BPF yükleyici

Onchain programlarla etkileşime girmesine izin veren Solana programı `BPF`.

## istemci

Solana sunucu ağı `kümesine` erişen bir bilgisayar programı.

## taahhüt

Bir `blok` için ağ onay ölçüsü.

## küme

Tek bir `defter` bakımını yapan `doğrulayıcılar` seti.

## hesaplama bütçesi

Her işlem için harcanan maksimum `hesaplama birimleri` sayısı.

## hesaplama birimleri

Blok zincirinin hesaplama kaynaklarının tüketimi için en küçük ölçü birimi.

## onay süresi

Bir `lider` tarafından bir `tıklama girişi` oluşturulması ile oluşturulan bir `onaylı blok` arasındaki gerçek süre.

## onaylı blok

Bir `blok` olup en az `üstün çoğunluk` `defter oyları` almış.

## kontrol uçağı

Bir `küme` `düğümlerini` bağlayan bir gıybet ağı.

## soğuma süresi

`Stake` devre dışı bırakıldıktan sonra belirli bir süre boyunca progresif olarak geri çekilebilir hale geldiği `dönemler`. Bu süre zarfında stake "devre dışı" kabul edilir. Daha fazla bilgi için:  
[sıcaklık ve soğuma](https://docs.solanalabs.com/implemented-proposals/staking-rewards#stake-warmup-cooldown-withdrawal)

## kredi

Bakınız: `oy kredi`.

## çapraz program çağrısı (CPI)

Bir `onchain program`'dan diğerine bir çağrı. Daha fazla bilgi için `programlar arasında çağrı`.

## veri uçağı

Etkili bir şekilde `girişleri` doğrulamak ve uzlaşma elde etmek için kullanılan çoklu yayılma ağı.

## dron

Bir kullanıcının özel anahtarının saklayıcısı olarak görev yapan bir dış hizmet. Genellikle işlemleri doğrulamak ve imzalamak için hizmet eder.

## giriş

Defterdeki bir `giriş`, ya bir `tıklama` ya da bir `işlemin girişi`.

## giriş kimliği

Bir girişin nihai içerikleri üzerinde önresme dirençli bir `hash` olup, girişin (giriş) küresel benzersiz tanımlayıcısı olarak işlev görür. Hash, şunların kanıtı olarak hizmet eder:

- Girişin belirli bir süre sonunda oluşturulmuş olması
- Belirtilen `işlemler` girişte yer alanlardır
- Girişin defterdeki diğer girişlere göre konumu

Bakınız: `tarih kanıtı`.

## dönem

`Slot` sayısı, geçerli bir `lider programı` için geçerli olduğu süre.

## ücret hesabı

İşlemdeki ücret hesabı, işlemin deftere dahil edilmesi için maliyetini ödeyen hesaptır. Bu, işlemin ilk hesabıdır. Bu hesap, işlemi ödeme yetkisi gerektirdiğinden Okuma-Yazma (yazılabilir) olarak ilan edilmelidir.

## nihai

Düğümlerin `stake`'in 2/3'ünü temsil etmesi durumunda meydana gelir.

## çatallama

Ortak girişlerden türeyen ancak daha sonra ayrılan bir `defter`.

## ilk blok

Zincirdeki ilk `blok`.

## ilk yapılandırma

Defteri `ilk blok` için hazırlayan yapılandırma dosyası.

## hash

Bir bayt dizisinin dijital parmak izi.

## enflasyon

Zamanla token arzında artış, bu, doğrulama için ödülleri ve Solana'nın sürekli gelişimi için finanse etmek amacıyla kullanılır.

## iç talimat

Bakınız: `çapraz program çağrısı`.

## talimat

Bir `program` içindeki belirli bir `talimat işleyici`'yi çağırmak için bir çağrı. Bir talimat ayrıca hangi hesapları okumak veya değiştirmek istediğini ve `talimat işleyici` için ek girdiler olarak işlev görecek ek verileri de belirtmektedir. Bir `istemci` bir `işlem`'de en az bir talimat dahil etmelidir ve tüm talimatların tamamlanması, işlemin başarılı olarak kabul edilmesi için gereklidir.

## talimat işleyici

Talimat işleyicileri, `işlemleri` `işlemlere` işleyen `program` fonksiyonlarıdır. Bir talimat işleyici, bir veya daha fazla `çapraz program çağrısını` içerebilir.

## anahtar çift

Bir hesabı erişim için `açık anahtar` ve karşılık gelen `özel anahtar`.

## lamport

0.000000001 `sol` değerine sahip bir kesirli `yerel token`.

> Hesaplama bütçesi içinde, bir miktar  
> _[mikro-lamport](https://github.com/solana-labs/solana/blob/ced8f6a512c61e0dd5308095ae8457add4a39e94/program-runtime/src/prioritization_fee.rs#L1-L2)_  
> `öncelik ücretlerinin` hesaplamasında kullanılmaktadır.

## lider

Bir `doğrulayıcı`'nın `girişleri` deftere ekleme rolü.

## lider programı

Bir dizi `doğrulayıcı` `açık anahtar` `slot` ile eşlenmiştir. Küme, lider programını, belirli bir anda hangi doğrulayıcının `lider` olduğunu belirlemek için kullanır.

## defter

`İşlemler` ile `istemciler` tarafından imzalanmış `girişler` listesi. Kavramsal olarak, bu, `ilk bloğa` kadar izlenebilir, ancak gerçek bir `doğrulayıcı`'nın defteri yalnızca yeni `bloklar` bulundurabilir, eski olanlar gelecekteki blokların doğrulanması için gerekli olmadığından depolama azalması için.

## defter oyu

Belirli bir `tıklama yüksekliği` üzerindeki `doğrulayıcı durumu`'nın `hash`i. Bir `doğrulayıcı`'nın, aldığı bir `blok`'un doğrulandığını onaylaması ve bir belirli süre boyunca çelişkili bir `blok` \(örn. `çatallama`\) için oy vermemeyi taahhüt etmesi.

## hafif istemci

Geçerli bir `kümeye` işaret ettiğini doğrulayan bir `istemci` türü. Daha fazla defter doğrulaması gerçekleştirir, ancak `inceltilmiş istemci`'den daha azdır.

## yükleyici

Diğer onchain programların ikili kodlamasını yorumlama yeteneğine sahip bir `program`.

## kilitlenme

Bir `doğrulayıcı`'nın başka bir `çatallama` üzerinde oy vermesinin mümkün olmadığı süre.

## mesaj

Bir `işlem`'in yapılandırılmış içeriği. Genellikle bir başlık, hesap adreslerinin dizisi, son `blok hash'i` ve bir dizi `talimat` içerir.

Daha fazla bilgi için:  
`işlem içindeki mesaj biçimlendirme`.

## Nakamoto katsayısı

Merkeziyetsizlik ölçüsü; Nakamoto Katsayısı, bir blok zincirini kapatmak için kolektif hareket edebilen en küçük bağımsız varlık sayısıdır. Terim, Balaji S. Srinivasan ve Leland Lee tarafından [Merkeziyetsizliği Nicelleştirmek](https://news.earn.com/quantifying-decentralization-e39db233c28e) adlı çalışmada ortaya atılmıştır.

## yerel token

Bir kümedeki `düğümlerin` yaptığı çalışmayı takip etmek için kullanılan `token`.

## düğüm

Bir `küme`'de katılan bir bilgisayar.

## düğüm sayısı

Bir `küme`'de katılan `doğrulayıcılar` sayısı.

## onchain program

Her bir `işlem` içinde gönderilen `talimatları` yorumlayan Solana blok zincirindeki yürütülebilir kod. Bu programlar, diğer blok zincirlerinde "`akıllı sözleşmeler`" olarak da adlandırılmaktadır.

## PoH

Bakınız: `Tarih Kanıtı`.

## nokta

Bir ödül rejiminde ağırlıklı `kredi`. `Doğrulayıcı` [ödül rejiminde](https://docs.solanalabs.com/consensus/stake-delegation-and-rewards), bir `stake` ile geri dönüş sırasında sahip olunan nokta sayısı, kazanılan `oy kredisi` ile stake edilen lamport sayısının çarpımıdır.

## özel anahtar

Bir `anahtar çifti`'nin özel anahtarı.

## program

Bakınız: `onchain program`.

## programdan türetilmiş hesap (PDA)

İmza yetkisi bir program olan ve dolayısıyla diğer hesaplar gibi bir özel anahtar tarafından kontrol edilmeyen bir hesaptır.

## program kimliği

Bir `program` içeren `hesap`'ın açık anahtarı.

## tarih kanıtı (PoH)

Her birinin bazı verilerin oluşmadan önce var olduğunu ve önceki kanıtın ardından belirli bir süre geçtiğini kanıtladığı bir kanıtlar yığını. Bir `VDF` gibi, Tarih Kanıtı, üretilmesinden daha kısa bir sürede doğrulanabilir.

## öncelik ücreti

Kullanıcının `işlemlerini` önceliklendirmek için hesaplama bütçesinde belirlemesi gereken ek bir ücret.

Öncelik ücreti, talep edilen maksimum hesaplama birimini, hesaplama birimi fiyatıyla çarparak hesaplanır (0.000001 lamport cinsinden artırmalar olarak belirlenir) ve en yakın lamporta yuvarlanır.

İşlemlerin ücretleri minimize etmek için yürütme için gerekli minimum hesaplama birimini talep etmesi önerilir.

## açık anahtar (pubkey)

Bir `anahtar çifti`'nin açık anahtarı.

## kira

`Hesaplar` ve `Programlar` tarafından blok zincirinde veri depolamak için ödenen ücret. Hesaplar yeterli bakiye bulundurmadıklarında, Çöp Toplama işlemi yapılabilir.

Ayrıca bakınız: `kira muafiyeti` aşağıda. Kira hakkında daha fazla bilgi için:  
`Kira nedir?`.

## kira muafiyeti

Hesapta saklanan veri miktarına orantılı minimum lamport bakiyesini koruyan hesaplar. Yeni oluşturulan tüm hesaplar, hesap kapatılana kadar on-chain olarak kalır. Kira muafiyeti eşiğinin altına düşen bir hesap oluşturmak mümkün değildir.

## kök

Bir `doğrulayıcı` üzerindeki maksimum `kilitlenme` süresine ulaşmış bir `blok` veya `slot`. Kök, aktif tüm çatallamaların üst nesnesi olan en yüksek bloktur. Bir kökün tüm üst nesne blokları da geçişli olarak kök kabul edilir. Bir kökün üst nesnesi olmayan ve kökün alt nesnesi olmayan bloklar, uzlaşma için dikkate alınmaz ve atılabilir.

## çalışma zamanı

Bir `doğrulayıcı`'nın `program` yürütmesinden sorumlu bileşeni.

## Sealevel

Solana'nın `onchain programlar` için paralel çalışma zamanı.

## parça

Bir `blok`'un bir bölümü; `doğrulayıcılar` arasında gönderilen en küçük birim.

## imza

R (32 bayt) ve S (32 bayt) içeren 64 baytlık bir ed25519 imzası. R'nin küçük sıraya sahip olmayan bir paketli Edwards noktası olması ve S'nin `0 <= S < L` aralığında bir skalar olması gerekmektedir. Bu gereklilik, imzanın değişkenlikten etkilenmemesini sağlar. Her işlemin `ücret hesabı` için en az bir imza içermesi gerekmektedir. Bu nedenle işlemin içindeki ilk imza, `işlem kimliği` olarak kabul edilebilir.

## atlama oranı

Geçerli dönemdeki toplam lider slotlarının yüzdesi olarak `atlanan slotlar`. Bu metrik, dönem sınırından sonra yüksek varyansa sahip olması ve düşük sayıda lider slotlarına sahip doğrulayıcılar için yanıltıcı olabilir; ancak, zaman zaman düğüm konfigürasyon hatalarının belirlenmesinde de faydalı olabilir.

## atlanan slot

Bir `blok` üretmeyen geçmiş bir `slot`, çünkü lider çevrimdışıydi veya slotu içeren `çatallama`, küme konsensüsü tarafından daha iyi bir alternatif için terk edildi. Bir atlanan slot, sonraki slotlarda bloklar için üst nesne olarak görünmeyecek, `blok yüksekliğini` artırmayacak ya da en eski `recent_blockhash`'yi sona erdirmeyecektir.

Bir slotun atlanıp atlanmadığını belirlemek yalnızca, en son `kök` (yani atlanmayan) slotunun daha eski hale geldiğinde mümkün olacaktır.

## slot

Her bir `lider`'in işlemleri alıp `blok` ürettiği süre.

Toplu olarak, slotlar mantıksal bir saat oluşturur. Slotlar sıralı ve örtüşmeyen şekilde düzenlenmiştir ve `PoH` gereğince yaklaşık eşit gerçek dünya zamanından oluşur.

## akıllı sözleşme

Bakınız: `onchain program`.

## SOL

Bir Solana `kümesi`'nin `yerel tokenı`.

## Solana Program Kitaplığı (SPL)

Solana'daki [program kütüphanesi](https://spl.solana.com/) (spl-token gibi) token oluşturma ve kullanma gibi görevleri kolaylaştırır.

## stake

Kötü niyetli `doğrulayıcı` davranışının kanıtlanması durumunda kümeden kaybedilen tokenler.

## stake-ağırlıklı hizmet kalitesi (SWQoS)

SWQoS, [stake edilen doğrulayıcılardan gelen işlemler için öncelikli muamele sağlar](https://solana.com/developers/guides/advanced/stake-weighted-qos).

## üstün çoğunluk

Bir `küme` için 2/3.

## sysvar

Bir sistem `hesabı`.  
[Sysvars](https://docs.solanalabs.com/runtime/sysvars), mevcut tıklama yüksekliği, ödüller `nokta` değerleri vb. gibi küme durumu bilgilerini sağlar. Programlar, bir Sysvar hesabı (pubkey) aracılığıyla veya bir syskolla sorgulayarak Sysvarlara erişebilir.

## ince istemci

Geçerli bir `küme` ile iletişim kurduğuna güvenen bir `istemci` türü.

## tıklama

Bir defter `girişi` olup gerçek zaman tahmininde bulunur.

## tıklama yüksekliği

Defterdeki N'inci `tıklama`.

## token

Dijital olarak transfer edilebilir bir varlık.

## Token Uzantıları Programı

[Token Uzantıları Programı](https://spl.solana.com/token-2022), `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` program kimliğine sahiptir ve `Token Programı` ile aynı özelliklerin yanı sıra gizli transferler, özel transfer mantığı, genişletilmiş meta veriler gibi uzantıları da içerir.

## token mint

Tokenleri üretebilen (veya 'mint' yapabilen) bir hesap. Farklı tokenler benzersiz token mint adresleri ile ayrılır.

## Token Programı

[Token Programı](https://spl.solana.com/token), `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` program kimliğine sahip olup, tokenlerin transferi, dondurulması ve mint edilmesi gibi temel yetenekleri sağlar.

## tps

`İşlemler` başına.

## tpu

[İşlem işleme birimi](https://docs.solanalabs.com/validator/tpu).

## işlem

Bir veya daha fazla `talimat` içeren ve biri veya daha fazla `anahtar çifti` ile imzalanmış, yalnızca iki olası sonuçla atomik olarak yürütülen bir birim: başarı veya başarısızlık.

## işlem kimliği

Bir `işlem`'deki ilk `imza`, bu işlem, tüm `defter` boyunca benzersiz olarak tanımlamak için kullanılabilir.

## işlem onayları

İşlemin `defter`'e kabul edildiğinden beri alınan `onaylı bloklar` sayısı. Bir işlem, bloğu bir `kök` haline geldiğinde nihai olarak kabul edilir.

## işlemler girişi

Paralel olarak yürütülebilecek bir dizi `işlem`.

## tvu

[İşlem doğrulama birimi](https://docs.solanalabs.com/validator/tvu).

## doğrulayıcı

Yeni `bloklar` üreten, bir Solana ağı `kümesine` tam katılımcı olan bir birim. Bir doğrulayıcı, deftere eklenen işlemleri doğrular.

## VDF

Bakınız: `doğrulanabilir gecikme işlevi`.

## doğrulanabilir gecikme işlevi (VDF)

Belirli bir süre boyunca geçerli olan, çalıştığını kanıtlayan bir kanıt üreten bir tür işlev. Bu kanıt, üretim süresinden daha kısa bir sürede doğrulanabilir.

## oy

Bakınız: `defter oyu`.

## oy kredisi

`Doğrulayıcılar` için bir ödül toplamıdır. Bir arasındaki `kredi` doğrulayıcı, bir `kök` ulaştığında oy hesabında verilir.

## cüzdan

Kullanıcıların fonlarını yönetmelerine yardımcı olan bir `anahtar çifti` koleksiyonu.

## ısınma süresi

`Stake` devredildikten sonraki bazı `dönemler`, kademeli olarak etkili hale gelene kadar. Bu süre zarfında stake "aktifleştiriliyor" kabul edilir. Daha fazla bilgi için:  
[ısınma ve soğuma](https://docs.solanalabs.com/consensus/stake-delegation-and-rewards#stake-warmup-cooldown-withdrawal)