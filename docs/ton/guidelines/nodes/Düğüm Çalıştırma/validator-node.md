# Doğrulayıcı Düğümü

## Minimum Donanım Gereksinimleri

- 16 çekirdekli CPU
- 128 GB RAM
- 1TB NVME SSD _VEYA_ Sağlanan 64+k IOPS depolama
- 1 Gbit/s ağ bağlantısı
- Genel IP adresi (_sabit IP adresi_)
- Pik yükte 100 TB/ay trafik

> Genellikle, pik yüklerde güvenilir bir şekilde barındırmak için en az 1 Gbit/s bağlantıya ihtiyaç duyacaksınız (ortalama yükün yaklaşık 100 Mbit/s olması bekleniyor).  
> — Doğrulayıcı Donanım Rehberi

> Doğrulayıcıları IOPS disk gereksinimlerine özel olarak dikkat çekiyoruz, bu, ağın sorunsuz çalışması için kritik öneme sahiptir.

## Port Yönlendirme

Tüm düğüm türleri, harici bir IP adresine, gelen bağlantılar için bir UDP portunun yönlendirilmesine ve tüm giden bağlantıların açık olmasına ihtiyaç duyar - düğüm, yeni giden bağlantılar için rastgele portlar kullanır. Düğümün dış dünyaya NAT üzerinden görünür olması gereklidir.

Bu, ağ sağlayıcınız ile yapılabilir veya `sunucu kiralayarak` bir düğüm çalıştırabilirsiniz.

:::info
Hangi UDP portunun açık olduğunu `netstat -tulpn` komutuyla öğrenebilirsiniz.
:::

## Ön Koşul

### Ceza Politikasını Öğrenin

Eğer doğrulayıcı, bir doğrulama turu sırasında beklenen blok sayısının %90'ından daha azını işlediyse, bu doğrulayıcı 101 TON ceza alacaktır.  
Daha fazla bilgi için `ceza politikasını` okuyun.

### Tam Düğüm Çalıştırma
Bu makaleye devam etmeden önce `Tam Düğüm` başlatın.

Doğrulayıcı modunun etkin olduğunu `status_modes` komutu kullanarak kontrol edin. Değilse, `mytonctrl etkin mod komutuna` bakın.

## Mimari

![image](../../../../images/ton/static/img/nominator-pool/hot-wallet.png)

## Cüzdanların Listesini Görüntüleyin

**MyTonCtrl** konsolunda `wl` komutunu kullanarak mevcut cüzdanların listesini kontrol edin:

```sh
wl
```

**mytonctrl** kurulumu sırasında **validator_wallet_001** cüzdanı oluşturulur:

![wallet list](../../../../images/ton/static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## Cüzdanları Etkinleştir

1. Gerekli sayıda madeni parayı cüzdana gönderin ve etkinleştirin.

   Son zamanlarda (_2023'ün sonlarında_), minimum teminat yaklaşık __340K TON__ ve maksimum yaklaşık __1M TON__ olmuştur.

   Gerekli madeni para miktarını anlamak için [tonscan.com](https://tonscan.com/validation) adresinden güncel teminatları kontrol edin.

   `maksimum ve minimum teminatların nasıl hesaplandığını` daha fazla okuyun.

2. Transfer geçmişini görüntülemek için `vas` komutunu kullanın:

    ```sh
    vas [cüzdan adı]
    ```

3. `aw` komutunu kullanarak cüzdanı etkinleştirin (`cüzdan adı` isteğe bağlıdır, herhangi bir argüman sağlamazsanız tüm mevcutları etkinleştirir)

    ```sh
    aw [cüzdan adı]
    ```

![account history](../../../../images/ton/static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Doğrulayıcınız Artık Hazır

**mytoncore**, seçimlere otomatik olarak katılacaktır. Cüzdan bakiyesini iki parçaya böler ve seçimlere katılmak için akçelerini teminat olarak kullanır. Teminat miktarını manuel olarak da ayarlayabilirsiniz:

```sh
set stake 50000
```

`set stake 50000` — bu, teminat miktarını 50k madeni para olarak ayarlar. Bahis kabul edilirse ve düğümümüz doğrulayıcı olursa, bahis yalnızca ikinci seçimde çekilebilir (elektör kurallarına göre).

## Kılavuzları Sürdürün

:::caution Kötü Doğrulayıcıların Cezalandırılması
Eğer doğrulayıcı, bir doğrulama turu sırasında beklenen blok sayısının %90'ından daha azını işlediyse, bu Doğrulayıcı 101 TON ceza alacaktır.  
`ceza politikasını` daha fazla okuyun.
:::

TON Doğrulayıcıları olarak, ağ stabilitesini sağlamak ve gelecekte ceza almaktan kaçınmak için bu kritik adımlara uyduğunuzdan emin olun.

**Temel Eylemler:**

1. [@tonstatus](https://t.me/tonstatus) ile bildirimleri açın ve gerekirse acil güncellemeleri uygulamak için hazır olun.
2. Donanımınızın `minimum sistem gereksinimlerini` karşıladığından veya daha yüksek olduğundan emin olun.
3. Lütfen [mytonctrl](https://github.com/ton-blockchain/mytonctrl) kullanmanızı önemle rica ediyoruz.
   - `mytonctrl` içerisinde bildirimlere göre güncellemeleri takip edin ve telemetriyi etkinleştirin: `set sendTelemetry true`
4. RAM, Disk, Ağ ve CPU kullanımı için izleme panelleri ayarlayın. Teknik destek için @mytonctrl_help_bot ile iletişime geçin.
5. Doğrulayıcınızın verimliliğini paneller ile izleyin. 
   - `mytonctrl` ile `check_ef` üzerinden kontrol edin.
   - `APIs ile panel oluşturun`.

:::info
`mytonctrl`, `check_ef` komutunu kullanarak doğrulayıcıların etkinliğini kontrol etmenizi sağlar; bu da son turdaki ve mevcut turdaki doğrulayıcı etkinliği verilerinizi çıkarır. Bu komut, `checkloadall` yardımcı programını çağırarak veri çeker. Etkililiğinizin %90'dan fazla olduğundan emin olun (tam tur süresi için).
:::

:::info
Düşük etkinlik durumunda - sorunu düzeltmek için harekete geçin. Gerekirse teknik destekle iletişime geçin [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## Doğrulama ve Etkililik API'leri

:::info
Lütfen bu API'leri kullanarak doğrulayıcılarınızı izlemek için paneller ayarlayın.
:::

#### Cezalı Doğrulayıcıların İzleyicisi

Her turda ceza alan doğrulayıcıları [@tonstatus_notifications](https://t.me/tonstatus_notifications) üzerinden takip edebilirsiniz.

#### Doğrulama API'si
https://elections.toncenter.com/docs - bu API'yi mevcut ve geçmiş doğrulama turları (döngüler) hakkında bilgi almak için kullanın - turların süresi, hangi doğrulayıcıların katıldığı, teminatları vb.

Mevcut ve geçmiş seçimler (doğrulama turu için) hakkında bilgi de mevcuttur.

#### Verimlilik API'si

https://toncenter.com/api/qos/index.html#/ - bu API'yi doğrulayıcıların zaman içerisindeki etkinliği hakkında bilgi almak için kullanın.

Bu API, verimliliği tahmin etmek için catchain'den bilgi analiz eder ve doğrulayıcının etkinliğinin tahminini oluşturur. Bu API, doğrulama turlarında yalnızca `checkloadall` yardımcı programını kullanmaz, onun alternatifidir. `checkloadall` yalnızca doğrulama turlarında çalışırken, bu API'de doğrulayıcının etkinliğini analiz etmek için herhangi bir zaman aralığını belirleyebilirsiniz.

**İş Akışı:**

1. API'ye doğrulayıcınızın ADNL adresini ve zaman aralığını (`from_ts`, `to_ts`) geçirin. Doğru bir sonuç için yeterli bir aralık almak mantıklıdır, örneğin şu andan 18 saat öncesine kadar.

2. Sonucu alın. Eğer etkinlik yüzdesi alanınız %80'in altındaysa, doğrulayıcınız düzgün çalışmıyor demektir.

3. Doğrulayıcınızın doğrulamaya katıldığından ve belirtilen zaman dilimi boyunca aynı ADNL adresine sahip olduğundan emin olmak önemlidir.

Örneğin, bir doğrulayıcı her ikinci turda doğrulamaya katılıyorsa - yalnızca doğrulamaya katıldığı aralıkları belirtmeniz gerekir. Aksi takdirde, yanlış bir alt değerlendirme alırsınız.

Bu, Masterchain doğrulayıcıları (indeks  100) için de çalışır.

## Destek

Teknik destek için [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot) ile iletişime geçin. Bu bot yalnızca doğrulayıcılar içindir ve normal düğümlerle ilgili sorulara yardımcı olmayacaktır.

Eğer bir normal düğümünüz varsa, o zaman gruba ulaşın: [@mytonctrl_help](https://t.me/mytonctrl_help).

## Ayrıca Bakınız

* `Tam Düğüm Çalıştır`
* `Sorun Giderme`
* `Teminat Teşvikleri`