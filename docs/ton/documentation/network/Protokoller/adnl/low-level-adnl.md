# Düşük Seviye ADNL

Soyut Datagram Ağ Katmanı (ADNL), TON'un temel protokolüdür ve ağ eşlerinin birbirleriyle iletişim kurmasına yardımcı olur.

## Eş kimliği
Her eşin en az bir kimliği olmalıdır; birden fazla kullanmak mümkündür ancak zorunlu değildir. Her kimlik, eşler arasında Diffie-Hellman yapmak için kullanılan bir anahtar çiftidir. Soyut bir ağ adresi, şu şekilde kamu anahtarından türetilir: `address = SHA-256(type_id || public_key)`. **type_id'nin küçük endian uint32 olarak serileştirilmesi gerektiğini unutmayın.**

:::note
Eş kimliği ve anahtar çiftleri, güvenli bir iletişim sağlamak için kritik öneme sahiptir.
:::

## Kamu anahtarı kriptografi sistemleri listesi
| type_id    | kriptografi sistemi  |
|------------|---------------------|
| 0x4813b4c6 | ed255191 |

_1. x25519 yapmak için, anahtar çiftinin x25519 formatında üretilmesi gerekir. Ancak, kamu anahtarı ağ üzerinden ed25519 formatında iletildiği için, x25519'den ed25519'e kamu anahtarını dönüştürmeniz gerekir; bu tür dönüşümlerin örnekleri [burada](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39) Kotlin için bulunmaktadır._

## İstemci-sunucu protokolü (ADNL TCP üzerinden)
İstemci, TCP kullanarak sunucuya bağlanır ve sunucunun soyut adresini, istemcinin kamu anahtarını ve istemci tarafından belirlenen şifreli AES-CTR oturum parametrelerini içeren bir ADNL el sıkışma paketi gönderir.

### El Sıkışma
**Öncelikle**, istemci kendi özel anahtarı ve sunucu kamu anahtarı kullanarak bir anahtar anlaşma protokolü (örneğin, x25519) gerçekleştirmelidir; sunucu anahtarının `type_id`'sini göz önünde bulundurarak. Sonuç olarak, istemci `secret` elde edecektir; bu, gelecekteki adımlarda oturum anahtarlarını şifrelemek için kullanılır.

Daha sonra, istemci yönler için hem TX (istemci->sunucu) hem de RX (sunucu->istemci) yönde 16 baytlık bir nonce ve 32 baytlık bir anahtar içeren AES-CTR oturum parametrelerini oluşturmalı ve bunu 160 baytlık bir tampon içine şu şekilde serileştirmelidir:

| Parametre    | Boyut     |
|--------------|----------|
| rx_key       | 32 bayt  |
| tx_key       | 32 bayt  |
| rx_nonce     | 16 bayt  |
| tx_nonce     | 16 bayt  |
| padding      | 64 bayt  |

**Padding'in amacı bilinmemektedir; sunucu uygulamaları tarafından kullanılmaz.** 160 baytlık tamponun tamamının rastgele baytlarla doldurulması önerilir. **Aksi takdirde, bir saldırgan, ele geçirilmiş AES-CTR oturum parametrelerini kullanarak aktif bir MitM (Adam ortada) saldırısı gerçekleştirebilir.**

Bir sonraki adım, yukarıda belirtilen anahtar anlaşma protokolü aracılığıyla `secret` kullanarak oturum parametrelerini şifrelemektir. Bunu yapmak için, AES-256'nın CTR modunda 128 bit büyük-endian bir sayacı kullanarak bir (anahtar, nonce) çifti ile başlatılması gerekir; bu da şu şekilde hesaplanır (`aes_params`, yukarıda oluşturulan 160 baytlık bir tampon):
```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```
`aes_params`'ın şifrelenmesi `E(aes_params)` olarak adlandırılır; **AES artık gerekli olmadığından kaldırılmalıdır.**

Artık tüm bu bilgileri 256 baytlık el sıkışma paketine serileştirmeye ve sunucuya göndermeye hazırız:

| Parametre           | Boyut      | Notlar                                                       |
|---------------------|-----------|-------------------------------------------------------------|
| receiver_address    | 32 bayt   | Sunucu eş kimliği, ilgili bölümde açıklandığı gibi         |
| sender_public       | 32 bayt   | İstemci kamu anahtarı                                      |
| SHA-256(aes_params) | 32 bayt   | Oturum parametrelerinin bütünlük kanıtı                     |
| E(aes_params)       | 160 bayt  | Şifrelenmiş oturum parametreleri                             |

Sunucu, istemciyle aynı şekilde anahtar anlaşma protokolü ile türetilen bir gizli anahtar kullanarak oturum parametrelerini şifrelemelidir. Ardından, sunucu, protokolün güvenlik özelliklerini doğrulamak için aşağıdaki kontrolleri gerçekleştirmelidir:

1. Sunucu, `receiver_address` için karşılık gelen özel anahtara sahip olmalıdır; aksi takdirde, anahtar anlaşma protokolünü gerçekleştirme imkanı yoktur.
2. `SHA-256(aes_params) == SHA-256(D(E(aes_params)))`; aksi takdirde, anahtar anlaşma protokolü başarısız olmuş ve her iki taraf için `secret` eşit değildir.

:::warning
Bu kontrollerden herhangi biri başarısız olursa, sunucu isteği yanıtlamadan bağlantıyı derhal kapatır.
:::

Tüm kontroller geçerse, sunucu, belirtilen `receiver_address` için özel anahtara sahip olduğunu kanıtlamak için istemciye boş bir datagram (Datagram bölümüne bakınız) göndermelidir.

### Datagram

Hem istemcinin hem de sunucunun, her biri için iki AES-CTR örneğini başlatması gerekir; TX ve RX yönde. **AES-256, 128 bit büyük-endian bir sayacı ile CTR modunda kullanılmalıdır.** Her AES örneği, el sıkışmadaki `aes_params`'dan alınan bir (anahtar, nonce) çifti ile başlatılmalıdır.

Bir datagram göndermek için bir eş (istemci veya sunucu), aşağıdaki yapıyı inşa etmelidir, şifrelemeli ve diğer eşe göndermelidir:

| Parametre | Boyut                | Notlar                                                       |
|-----------|----------------------|-------------------------------------------------------------|
| length    | 4 bayt (LE)          | Tüm datagramın uzunluğu, `length` alanı hariç              |
| nonce     | 32 bayt              | Rastgele değer                                              |
| buffer    | `length - 64` bayt   | Diğer tarafa gönderilecek gerçek veri                      |
| hash      | 32 bayt              | Bütünlüğü sağlamak için `SHA-256(nonce \|\| buffer)`        |

Tüm yapı, ilgili AES örneği kullanılarak şifrelenmelidir (TX için istemciden sunucuya, RX için sunucudan istemciye).

**Alıcı eş**, ilk 4 baytı almak, `length` alanına şifrelemek ve toplamda `length` bayt okumak zorundadır; böylece tam datagram elde edilir. Alıcı eş, `buffer`'ı önceden şifrelemeye ve işlemeye başlayabilir ancak bozulabileceğini göz önünde bulundurmalıdır; bu, kasıtlı veya tesadüfi olabilir. Datagram `hash`'ı, `buffer`'ın bütünlüğünü sağlamak için kontrol edilmelidir. **Başarısızlık durumunda yeni datagramlar verilemez ve bağlantı kapatılmalıdır.**

Oturumdaki ilk datagram, sunucu, el sıkışma paketi sunucu tarafından başarıyla kabul edildikten sonra istemciye her zaman gider ve gerçek tamponu boştur. İstemci bunu şifrelemeli ve hata durumunda sunucudan bağlantıyı kesmelidir; çünkü bu, sunucunun protokole tam olarak uymadığı ve gerçek oturum anahtarlarının sunucu ve istemci tarafında farklı olduğu anlamına gelir.

### İletişim detayları

İletişim detaylarına dalmak isterseniz, bazı örnekleri görmek için `ADNL TCP - Liteserver` makalesine bakabilirsiniz.

### Güvenlik hususları
#### El Sıkışma padding
Eğer bir şifreleme anahtarı yalnızca `secret` parametresinden türetilirse, bu statik olacaktır çünkü gizli anahtar statiktir. Geliştiricilerin her oturum için yeni bir şifreleme anahtarı türetmek için, `SHA-256(aes_params)` kullanması da gereklidir; bu, `aes_params` rastgele olduğunda rastgele olacaktır.

:::tip
Bunu yapmak için, spesifikasyonın, diğer eşin güncellenmiş ilkelere geçmeye hazır olduğunu belirten özel bir sihirli değer içerecek şekilde genişletilmesi gerekebilir.
:::

#### Datagram nonce
Datagramdaki `nonce` alanının neden mevcut olduğu belirsizdir; çünkü bu olmadan bile, AES için oturum sınırlı anahtarları ve CTR modundaki şifreleme nedeniyle herhangi iki şifreli metin farklı olacaktır. Ancak, yok veya tahmin edilebilir bir nonce durumunda aşağıdaki saldırı gerçekleştirilebilir:

**Bir saldırgan**, şifrelenmiş datagrama ait olan düz metni biliyorsa, saf bir anahtar akışı elde edebilir, bu akışı kendi düz metniyle XORlayabilir ve eş tarafından gönderilen mesajı verimli bir şekilde değiştirebilir. Tampon bütünlüğü bir SHA-256 hash'i ile korunmaktadır; ancak bir saldırgan, tam metnin bilgisini bilmek, onun hash'inin bilgisini de bilmek anlamına geldiğinden bunu da değiştirebilir. **Nonce alanı**, böyle bir saldırıyı önlemek için mevcuttur; bu nedenle, hiçbir saldırgan SHA-256'yı değiştiremez, nonce bilgisini bilmeden.

## P2P protokolü (ADNL UDP üzerinden)

Detaylı açıklama `ADNL UDP - İnternode` makalesinde bulunabilir.

## Referanslar
- [The Open Network, s. 80](https://ton.org/ton.pdf)
- [TON'daki ADNL uygulaması](https://github.com/ton-blockchain/ton/tree/master/adnl)

_Thanks to the [hacker-volodya](https://github.com/hacker-volodya) for contributing to the community!_  
_Here a [link to the original article](https://github.com/tonstack/ton-docs/tree/main/ADNL) on GitHub._