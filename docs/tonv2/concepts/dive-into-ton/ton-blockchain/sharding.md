# TON Blok Zinciri'nde Sharding

[//]: # (TODO, bu gpt'den)

TON Blok Zinciri, ölçeklenebilirlik ve performansı artırmak için gelişmiş sharding mekanizmaları kullanarak, büyük bir işlem hacmini verimli bir şekilde işleyebilme kapasitesine sahiptir. 

Temel kavram, blok zincirini **shard** olarak adlandırılan daha küçük, bağımsız parçalara ayırmaktır. Bu shard'lar, paralel olarak işlem yapabilir, böylece ağın büyümesi sırasında yüksek işlem hacmi sağlanır.

:::tip
**Öneri:** Sharding mekanizmasının nasıl çalıştığını anlamak için, blok zincirlerinin temel prensiplerini öğrenmek faydalıdır.
:::

TON'da sharding oldukça dinamik bir yapıdadır. Belirli sayıda shard'a sahip olan diğer blok zincirlerinin aksine, TON talep üzerine yeni shard'lar oluşturabilir. İşlem yükü arttıkça shard'lar bölünür ve yük azaldıkça birleşir. 

:::note
Bu esneklik, sistemin değişken yüklemelere uyum sağlayabilmesini ve verimliliği korumasını sağlar.
:::

**Masterchain**, ağ yapılandırmasını ve tüm **workchain** ve **shardchain**'lerin nihai durumunu koruyarak kritik bir rol oynar. Masterchain genel koordinasyondan sorumlu iken, **workchain**'ler kendi belirli kuralları altında çalışır; her biri daha sonra shardchain'lere bölünebilir. 

**Şu anda, yalnızca bir workchain** (**Basechain**) TON üzerinde işlem yapmaktadır.

:::info
Bu yapı, ağa daha fazla workchain eklendikçe genişleyerek daha fazla işlem hacmi sağlayabilir.
:::

TON'un verimliliğinin merkezinde, her hesabı kendi "accountchain"inin bir parçası olarak ele alan **Sonsuz Sharding Paradigması** bulunmaktadır. Bu accountchain'ler daha sonra shardchain bloklarında birleştirilerek verimli işlem işlemeyi kolaylaştırır.

:::warning
Shard'ların dinamik olarak oluşturulması, bazı durumlarda karışıklıklara yol açabilir. Dikkatli bir yönetim gerekmektedir.
:::

Shard'ların dinamik olarak oluşturulmasının yanı sıra, TON **Böl ve Birleştir** fonksiyonunu kullanır; bu, ağın değişen işlem yüklerine verimli bir şekilde yanıt vermesini sağlar. 

:::quote
"Bu sistem, blok zinciri ağında ölçeklenebilirliği ve etkileşimi artırarak, TON'un verimlilik ve küresel tutarlılığa odaklanan ortak blok zinciri zorluklarını çözme yaklaşımını örnekler." — TON Geliştirici Ekibi
:::

## Diğer Kaynaklar

* `Shards Dive In`
* `# Sonsuz Sharding Paradigması`