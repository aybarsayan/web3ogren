# Validator/Collator Ayrımı

:::caution
Geliştirilmektedir. Bu özellik şu anda yalnızca testnet içindir! Kendi riskinizle katılın.
:::

TON blok zincirinin ana özelliği, işlem işlemenin ağ düğümleri arasında dağıtılabilmesi ve "herkes tüm işlemleri kontrol ediyor" durumundan "her işlem güvenli bir doğrulayıcı alt kümesi tarafından kontrol ediliyor" durumuna geçebilmesidir. Bir çalışma zincirinin gerekli sayıda *shardchain*'e bölündüğünde, shard'lar üzerinde yenilenebilir yatay olarak ölçeklenebilme yeteneği, TON'u diğer L1 ağlarından ayırır.

Ancak, bir veya başka bir shard'ı işleyen doğrulayıcı alt kümelerinin düzenli olarak döndürülmesi gerekmektedir. Aynı zamanda, işlemleri işlemek için doğrulayıcıların işlem öncesinde shard'ın durumunu bilmesi açıkça gerekmektedir. En basit yaklaşım, tüm doğrulayıcıların tüm shard'ların durumunu bilmesini gerektirmektir.

Bu yaklaşım, TON kullanıcılarının birkaç milyon içinde kaldığı ve TPS (saniye başına işlem) yüzün altında olduğu sürece iyi işlemektedir. Ancak, gelecekte TON, saniyede birçok binlerce işlemi işlediğinde ve yüz milyonlarca veya milyarlarca insanı sunarken, tek bir sunucu, tüm ağın gerçek durumunu tutamaz. Neyse ki, TON bu tür yükler göz önünde bulundurularak tasarlanmış ve hem verim (throughput) hem de durum güncellemesini desteklemektedir.

Bu, iki rolün ayrılmasıyla sağlanmaktadır:

- **Collator** - yalnızca ağın bir kısmını izleyen, gerçek durumu bilen ve bir sonraki blokları *collate* (oluşturma) yapan aktör.
- **Validator** - *Collator*'dan yeni blokları alan, geçerliliğini kontrol eden ve etkili bir şekilde doğru olup olmadığını belirten, teminat riskini üstlenen aktör.

:::note
TON'un mimarisi, *Validator*'ın yeni blokları doğrulamasına, blockchain durumunu gerçekten saklamadan, özel olarak hazırlanmış kanıtları kontrol ederek olanak tanımaktadır.
:::

Bu şekilde, TON'un verimi, tek bir makine tarafından işlenemeyecek kadar ağır hale geldiğinde, ağ, yalnızca işleme kapasitesine sahip olduğu zincirlerin bir kısmını işleyen *collator* alt ağı ve yeni işlemleri taahhüt etmek için birden çok güvenli set oluşturan doğrulayıcılardan oluşan bir alt ağdan oluşacaktır.

Mevcut olarak, TON testnet'i bu *Validator*/*Collator* ayrımını test etmek için kullanılmaktadır; burada bazı doğrulayıcılar normal şekilde çalışmaktadır ve bazıları blokları kendileri oluşturmaz ve *collator*'lardan alır.

---

# "Lite Doğrulayıcı" ile Katılın

Yeni düğüm yazılımı [accelerator](https://github.com/ton-blockchain/ton/tree/accelerator) dalında mevcuttur.

## Collator

Yeni bir collator oluşturmak için TON düğümünü ayarlamanız gerekir; düğümün işlemek istediği shardchain'lere göz kulak olmaması için `-M` bayrağını kullanabilirsiniz.

`validator-engine-console` içinde collator için yeni bir anahtar oluşturun, bu anahtara adnl kategorisi `0` ayarlayın ve komutla kolasyona ilişkin varlığı ekleyin:

```bash
addcollator <adnl-id> <chain-id> <shard-id>
```

Örneğin:

```bash
newkey
addadnl <adnl-id> 0
addcollator <adnl-id> 0 -9223372036854775808
```

Collator şu komutla durdurulabilir:

```bash
delcollator <adnl-id> 0 -9223372036854775808
```

:::info
Şu anda Ağ'da bir collator bulunmaktadır ve **-41** dizini adnl adresini duyurmak için kullanılmaktadır.
:::

## Validator

Doğrulayıcıyı çalıştırmak için TON düğümünü ayarlamanız gerekir, collator'lardan yeni bloklar talep etmek için doğrulayıcının oluşturulmasını sağlamak için `--lite-validator` bayrağını kullanın ve staking sürecini ayarlayın. Lite modda bir doğrulayıcı, *collator* düğümlerini `-41` yapılandırmasından alır.

En kolay yol şudur:

1. Testnet için MyTonCtrl'ü ayarlayın.
2. Doğrulayıcıyı durdurun:

   ```bash
   sudo systemctl stop validator
   ```

3. Hizmet dosyasını güncelleyin:

   ```bash
   sudo nano /etc/systemd/system/validator.service
   ```
   `--lite-validator` bayrağını ekleyin.
   
4. Systemctl'yi yeniden yükleyin:

   ```bash
   sudo systemctl daemon-reload
   ```

5. Doğrulayıcıyı başlatın:

   ```bash
   sudo systemctl start validator
   ```

## Liteserver

Collator'lar gibi, Liteserver'lar yalnızca blockchain'in bazı kısımlarını izlemek üzere yapılandırılabilir. Bu, `-M` seçeneği ile bir düğüm çalıştırarak ve `validator-engine-console`'da shard'ları ekleyerek yapılabilir:

```bash
addshard 0 -9223372036854775808
```

Masterchain varsayılan olarak her zaman izlenmektedir. Shard'lar `delshard 0 -9223372036854775808` kullanılarak kaldırılabilir.

### Lite Client

Küresel yapılandırma en az bir veya iki bölüm içermelidir: `liteservers` ve `liteservers_v2`. İlk bölüm, tüm shard durumları hakkında verileri olan "tam" Liteserver'leri içerir. İkinci bölüm, blockchain'in bazı bölümleri hakkında veri içeren "kısmi" liteserver'leri içerir.

"Kısmi" Liteserver'ler aşağıdaki gibi tanımlanır:

```json
"liteservers_v2": [
  {
    "ip": ...,
    "port": ...,
    "id": {
      "@type": "pub.ed25519",
      "key": "..."
    },  
    "shards": [
      {   
        "workchain": 0, 
        "shard": -9223372036854775808
      }   
    ]   
  }
  ...
]
```

Lite Client ve Tonlib bu yapılandırmayı destekler ve her sorgu için uygun bir Liteserver seçebilir. Her Liteserver varsayılan olarak masterchain'i izlediğini unutmayın, ve `liteservers_v2` içindeki her sunucu, masterchain hakkında sorguları kabul etmek üzere dolaylı olarak yapılandırılmıştır. Yapılandırmada shard `wc:shard_pfx`, sunucunun shard `wc:shard_pfx`, ataları ve nesilleri hakkında sorguları kabul ettiğini ifade eder (tam olarak collator yapılandırması gibi).

## Tam Kolasyona Dayalı Veri

Varsayılan olarak, yeni blok öneren doğrulayıcılar doğrulayıcı setinde "bloğun öncesinde" durumu kanıt eden verileri eklemez. Bu veriler, diğer doğrulayıcılar tarafından yerel olarak saklanan durumdan edinilmelidir. Bu şekilde, eski (ana dalda) ve yeni düğümler uzlaşmaya ulaşabilir, ancak yeni doğrulayıcılar tüm ağ durumuna dikkat etmelidir.

Doğrulayıcıların blokları kolasyona dayalı verilerle paylaşacağı yeni protokole geçiş şunlarla yapılabilir:
- Tüm doğrulayıcıları yeni düğüm sürümüne yükseltmek.
- [full_collated_data](https://github.com/ton-blockchain/ton/tree/accelerator/crypto/block/block.tlb#L858)'yı true olarak ayarlamak.

---

# Sonraki Adımlar

*Validator* ve *Collator* rollerini ayırma yeteneği, sınırsız verimlilik yolundaki ana dönüm noktasıdır, ancak gerçekten merkeziyetsiz ve sansür direnci olan bir ağ oluşturmak için şunların sağlanması gerekmektedir:

- *Collator*'ların bağımsızlığını ve yedekliliğini sağlamak.
- Doğrulayıcılar ve Collator'lar arasındaki etkileşim için istikrarlı ve güvenli bir yol sağlamak.
- Yeni blokların dayanıklı kolasyona teşvik eden uygun mali modelin sağlanması.

Mevcut durumda, bu görevler kapsam dışındadır.