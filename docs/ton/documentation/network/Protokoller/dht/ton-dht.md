# TON DHT Servisi

Implementation:
* [DHT GitHub Repository](https://github.com/ton-blockchain/ton/tree/master/dht)
* [DHT Server GitHub Repository](https://github.com/ton-blockchain/ton/tree/master/dht-server)

## Genel Bakış

Kademlia benzeri Dağıtık Hash Tablosu (DHT), TON projesinin ağ kısmında kritik bir rol oynamaktadır ve ağdaki diğer düğümleri bulmak için kullanılır.

TON DHT'nin anahtarları basitçe 256 bitlik tam sayılardır. Çoğu durumda, bu anahtarlar TL-serialleştirilmiş bir nesnenin SHA256'sı olarak hesaplanır.

Bu 256 bitlik anahtarlara atanan değerler, esasen sınırlı uzunluktaki keyfi bayt dizeleridir. Bu bayt dizelerinin yorumu, ilgili anahtarın ön görüntüsü tarafından belirlenir; genellikle anahtarı arayan düğüm ve anahtarı depolayan düğüm tarafından bilinir.

> **Anahtar**: En basit durumda, anahtar bir düğümün ADNL Adresi'ni temsil etmektedir ve değer, IP adresi ve bağlantı noktası olabilir.  
> — TON DHT Tanımı

TON DHT'nin anahtar-değer eşlemesi, DHT düğümlerinde tutulur.

## DHT Düğümleri

Her DHT Düğümü, 256 bitlik bir DHT adresine sahiptir. Bir ADNL Adresi'nden farklı olarak, bir DHT Adresi çok sık değişmemelidir, aksi takdirde diğer düğümler aradıkları anahtarları bulamaz.

Anahtar `K`'nin değeri, `K`'ya en yakın `S` Kademlia düğümünde depolanması beklenmektedir.

Kademlia mesafesi = 256 bitlik anahtar `XOR` 256 bitlik DHT düğüm adresi (coğrafi konumla hiçbir ilgisi yoktur).

:::note
`S`, güvenilirliği artırmak için gerekli olan küçük bir parametredir, örneğin `S = 7`. Eğer anahtarı sadece `K`'ya en yakın bir düğümde saklasaydık, bu tek düğüm çevrimdışı olursa anahtarın değeri kaybolurdu.
:::

## Kademlia Yönlendirme Tablosu

DHT'ye katılan herhangi bir düğüm genellikle bir Kademlia yönlendirme tablosu bulundurur.

Bu tablo, 0'dan 255'e kadar numaralandırılmış 256 kovadan oluşur. `i`-inci kova, düğümün adresi `a`'dan Kademlia mesafesi `2^i` ile `2^(i+1) − 1` arasında olan bazı bilinen düğümlerin (bir sabit sayıda "en iyi" düğüm ve belki bazı ek adayların) bilgilerini içerecektir.

Bu bilgi, DHT Adreslerini, IP Adreslerini ve UDP Bağlantı Noktalarını ve son ping'in zamanı ve gecikmesi gibi bazı erişilebilirlik bilgilerini içerir.

Bir Kademlia düğümü, herhangi bir sorgu sonucunda başka bir Kademlia düğümünü öğrendiğinde, bunu yönlendirme tablosunun uygun bir kovasına, önce bir aday olarak yerleştirir. Daha sonra, o kovadaki "en iyi" düğümlerden bazıları arızalanırsa (örneğin, uzun bir süre ping sorgularına yanıt vermezse), bunlar bu adaylardan bazıları ile değiştirilir. Bu şekilde Kademlia yönlendirme tablosu dolu kalır.

## Anahtar-değer Eşlemleri

Anahtar-değer eşlemleri TON DHT'ye eklenebilir ve güncellenebilir.

"Update kuralları" farklılık gösterebilir. Bazı durumlarda, yeni değer, eski değerin yerine geçmesine izin verir. Gerekirse yeni değer sahibinin/yaratıcısının imzası ile imzalanmalı (imza, bu anahtarın değeri elde edildikten sonra başka herhangi bir düğüm tarafından kontrol edilmek üzere değerin bir parçası olarak saklanmalıdır). Diğer durumlarda, eski değer yeni değeri bir şekilde etkiler. Örneğin, bir sıra numarasını içerebilir ve eski değer yalnızca yeni sıra numarası daha büyükse (tekrarlama saldırılarını önlemek için) üzerine yazılır.

:::tip
TON DHT, yalnızca ADNL Düğümlerinin IP Adreslerini depolamak için kullanılmaz; aynı zamanda:
- TON Depolamanın belirli bir torrentini depolayan düğümlerin adres listesi,
- Bir üst ağda bulunan düğümlerin adres listesi,
- TON hizmetlerinin ADNL Adresleri,
- TON Blockchain hesaplarının ADNL Adresleri gibi diğer amaçlar için de kullanılabilir.
:::

:::info
`DHT` makalesinde veya [TON Beyaz Kitabı](https://docs.ton.org/ton.pdf) 3.2. bölümünde TON DHT hakkında daha fazla bilgi edinin.
:::