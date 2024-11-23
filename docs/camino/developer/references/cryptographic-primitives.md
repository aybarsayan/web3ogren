---
sidebar_position: 40
---

# Kriptografik Primitifler

, çeşitli işlevleri için bir dizi kriptografik primitif kullanmaktadır. Bu dosya, ağ ve blok zinciri katmanlarında kullanılan kriptografi türünü ve çeşitlerini özetlemektedir.

## Ağ Katmanında Kriptografi

Camino, düğümden düğüme iletişimleri dinleyenlerden korumak için Taşıma Katmanı Güvenliği (TLS) kullanmaktadır. TLS, açık anahtarlı kriptografinin pratikliğini, simetrik anahtarlı kriptografinin verimliliği ile birleştirir. Bu, TLS'nin internet iletişimi için standart haline gelmesine neden olmuştur. Çoğu klasik konsensüs protokolü, mesajların üçüncü taraflara alındığını kanıtlamak için açık anahtarlı kriptografi kullanırken, yenilikçi Snow\* konsensüs ailesinin böyle kanıtlar gerektirmemesi önemli bir farklılıktır. Bu, Camino’nun staker'ları doğrulamak için TLS kullanabilmesini sağlar ve ağ mesajlarını imzalamak için maliyetli açık anahtarlı kriptografi gereksinimini ortadan kaldırır.

### TLS Sertifikaları

Camino merkezi bir üçüncü tarafa güvenmez ve özellikle, üçüncü taraf autentikasyon sağlayıcıları tarafından verilen sertifikaları kullanmaz. Ağ katmanında uç noktaları tanımlamak için kullanılan tüm sertifikalar kendinden imzalıdır, böylece kendi kendine yeterli bir kimlik katmanı oluşturmuş olur. Hiçbir üçüncü taraf asla dahil edilmez.

### TLS Adresleri

Platform zincirine tam TLS sertifikasını göndermemek için, sertifika öncelikle hashlenir. Tutarlılık sağlamak amacıyla, Camino TLS sertifikaları için Bitcoin'de kullanılan aynı hashleme mekanizmasını kullanmaktadır. Yani, sertifikanın DER temsili sha256 ile hashlenir ve ardından ripemd160 ile hashlenerek staker'lar için 20 baytlık bir tanımlayıcı elde edilir.

Bu 20 baytlık tanımlayıcı "NodeID-" ile başlar ve ardından verinin  kodlu dizisi gelir.

## Avalanche Sanal Makinesinde Kriptografi

Avalanche Sanal Makinesi, blok zincirindeki imzaları için eliptik eğri kriptografisi, özellikle `secp256k1` kullanmaktadır.

Bu 32 baytlık tanımlayıcı "PrivateKey-" ile başlar ve ardından verinin CB58 kodlu dizisi gelir.

### Secp256k1 Adresleri

Camino, adresleme şemaları hakkında kesin bir kural koymaz; bunun yerine adreslemeyi her blok zincirine bırakmayı tercih etmektedir.

X-Zincir ve P-Zincir’in adresleme şeması secp256k1 üzerine kuruludur. Camino, Bitcoin ile benzer bir yaklaşım izleyerek ECDSA açık anahtarını hashler. 33 baytlık sıkıştırılmış açık anahtar, sha256 ile **bir kez** hashlenir. Sonuç, ripemd160 ile hashlenerek 20 baytlık bir adres elde edilir.

Camino, bir adresin hangi zincirde bulunduğunu belirtmek için `chainID-adress` kuralını kullanır. `chainID`, zincirin bir takma adıyla değiştirilebilir. Dış uygulamalar aracılığıyla bilgi iletimi yaparken, CB58 kuralı gereklidir.

### Bech32

X-Zincir ve P-Zincir’deki adresler  tarafından belirlenen Bech32 standardını kullanmaktadır. Bech32 adres şemasının dört bileşeni vardır. Görünüm sırasına göre:

- İnsan tarafından okunabilir bir kısım (HRP). Ana ağda bu `camino`dur.
- HRP ile adres ve hata düzeltme kodunu ayıran `1` sayısı.
- 20 baytlık adresi temsil eden base-32 kodlu dize.
- 6 karakterlik base-32 kodlu hata düzeltme kodu.

Ayrıca, bir Camino adresi bulunduğu zincirin takma adıyla başlar ve ardından bir tire gelir. Örneğin, X-Zincir adresleri `X-` ile başlar.

Aşağıdaki düzenli ifade, X-Zincir, P-Zincir ve C-Zincir üzerinde adresleri eşleştirir. Dikkat edilmesi gereken, tüm geçerli Camino adreslerinin bu düzenli ifadeye uymasıdır, ancak geçerli olmayan bazı dizeler bu düzenli ifadeye uymakta olabilir.

```text
^([XPC]|[a-km-zA-HJ-NP-Z1-9]{36,72})-[a-zA-Z]{1,83}1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}$
```

### Secp256k1 Kurtarılabilir İmzalar

Kurtarılabilir imzalar, 65 baytlık **`[R || S || V]`** olarak saklanır; burada **`V`**, hızlı açık anahtar kurtarılabilirliği sağlamak için 0 veya 1'dir. **`S`**, imza esnekliğini önlemek için olası aralığın alt yarısında olmalıdır. Bir mesajı imzalamadan önce, mesaj sha256 ile hashlenir.

### Secp256k1 Örneği

Farz edelim ki Rick ve Morty güvenli bir iletişim kanalı kuruyorlar. Morty yeni bir açık-özel anahtar çifti oluşturuyor.

Özel Anahtar: `0x98cb077f972feb0481f1d894f272c6a1e3c15e272a1658ff716444f465200070`

Açık Anahtar (33 bayt sıkıştırılmış): `0x02b33c917f2f6103448d7feb42614037d05928433cb25e78f01a825aa829bb3c27`

Rick’in sonsuz bilgeliği nedeniyle, Morty’nin açık anahtarını taşıyacak kadar güvenmiyor; bu yüzden sadece Morty'nin adresini istiyor. Morty, talimatları takip ediyor, açık anahtarını SHA256 ile hashliyor ve ardından bu sonucu ripemd160 ile hashleyerek bir adres üretiyor.

SHA256(Açık Anahtar): `0x28d7670d71667e93ff586f664937f52828e6290068fa2a37782045bffa7b0d2f`

Adres: `0xe8777f38c88ca153a6fdc25942176d2bf5491b89`

Morty oldukça kafası karışık çünkü bir açık anahtar kamu bilgisi olmak zorundadır. Rick, geğirerek açık anahtarın hashlenmesinin özel anahtar sahibi için eliptik eğri kriptografisindeki potansiyel güvenlik açığına karşı bir koruma sağladığını açıklar. Kriptografi kırıldığı ve bir açık anahtardan özel anahtar türetilebildiği durumda, kullanıcılar fonlarını daha önce hiç işlem imzalamamış bir adrese transfer edebilir, böylece saldırganların fonlarına erişimini engelleyebilirler. Bu, kriptografi güncellenirken coin sahiplerinin korunmasını sağlar.

Daha sonra, Morty Rick’in geçmişi hakkında daha fazla bilgi edinince, Rick’e bir mesaj göndermeye çalışır. Morty, Rick’in sadece kendisine ait olduğunu doğrulayabileceği bir mesajı okuyacağını bildiği için, mesajı özel anahtarıyla imzalar.

Mesaj: `0x68656c702049276d207472617070656420696e206120636f6d7075746572`

Mesaj Hash: `0x912800c29d554fb9cdce579c0abba991165bbbc8bfec9622481d01e0b3e4b7da`

Mesaj İmzası: `0xb52aa0535c5c48268d843bd65395623d2462016325a86f09420c81f142578e121d11bd368b88ca6de4179a007e6abe0e8d0be1a6a4485def8f9e02957d3d72da01`

Morty bir daha asla görülmedi.

## İmzalı Mesajlar

Bitcoin Script formatı ve Ethereum formatına dayalı, birbirleriyle uyumlu genel imzalı mesajlar için bir standart.

```text
sign(sha256(length(prefix) + prefix + length(message) + message))
```

Prefix, `\x1AAvalanche Signed Message:\n` biçimindeki stringdir; burada `0x1A`, prefix metninin uzunluğudur ve `length(message)`, mesaj boyutunun bir dır.

### Gantt Ön Görünüm Spesifikasyonu

```text
+---------------+-----------+------------------------------+
| prefix        : [26]byte  |                     26 bytes |
+---------------+-----------+------------------------------+
| messageLength : int       |                      4 bytes |
+---------------+-----------+------------------------------+
| message       : []byte    |          size(message) bytes |
+---------------+-----------+------------------------------+
                            |       26 + 4 + size(message) |
                            +------------------------------+
```

### Örnek

"Uzlaşma aracılığıyla yıldızlara" mesajını imzalayacağız.

```text
// prefix boyutu: 26 bayt
0x1a
// prefix: Avalanche Signed Message:\n
0x41 0x76 0x61 0x6c 0x61 0x6e 0x63 0x68 0x65 0x20 0x53 0x69 0x67 0x6e 0x65 0x64 0x20 0x4d 0x65 0x73 0x73 0x61 0x67 0x65 0x3a 0x0a
// mesaj boyutu: 30 bayt
0x00 0x00 0x00 0x1e
// mesaj: Uzlaşma aracılığıyla yıldızlara
54 68 72 6f 75 67 68 20 63 6f 6e 73 65 6e 73 75 73 20 74 6f 20 74 68 65 20 73 74 61 72 73
```

`sha256` ile hashlenip ön görü gerçekleştikten sonra, değer  kodlu olarak döndürülür: `4Eb2zAHF4JjZFJmp4usSokTGqq9mEGwVMY2WZzzCmu657SNFZhndsiS8TvL32n3bexd8emUwiXs8XqKjhqzvoRFvghnvSN`. İşte bu  kullanılarak yapılan bir örnek.



## Ethereum Sanal Makinesinde Kriptografi

Camino düğümleri, tam Ethereum Sanal Makinesi (EVM) desteği sunarak Ethereum'da kullanılan tüm kriptografik yapıların tam bir kopyasını üretmektedir. Bu, Keccak hash fonksiyonu ve EVM'deki kriptografik güvenlik için kullanılan diğer mekanizmaları içermektedir.

## Diğer Sanal Makinelerde Kriptografi

Camino, genişletilebilir bir platform olduğundan, zamanla insanların sisteme ek kriptografik primitifler ekleyeceğini beklemekteyiz.