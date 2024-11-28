---
title: CLI ile Temel Dosya Yönetimi - BNB Greenfield Eğitimleri
order: 1
description: Bu eğitim, CLI ile BNB Greenfield'da dosya yönetimi süreçlerini açıklamaktadır. Dosyaların yedeklenmesi, depolama sağlayıcılarının seçimi ve hesap yönetimi gibi konulara odaklanarak veri güvenliği sağlanmasına yardımcı olmaktadır.
keywords: [dosya yönetimi, BNB Greenfield, CLI, yedekleme, merkeziyetsiz depolama, veri güvenliği, hesap yönetimi]
---

# CLI ile dosya yönetimine giriş
## Giriş
Dosyaların yedeklenmesi, her geliştirme süreci için hayati bir uygulamadır. Faydaları başlangıçta anlaşılır görünmeyebilir, ancak *yedeklemeler*, donanım arızaları, kazara silmeler veya doğal afetler durumunda verilerin kurtarılarak geri yüklenmesini sağlayarak bir güvenlik ağı sunar.

Yedeklemeler, değerli çalışmaların kaybolmamasını sağlamak için her zaman yerel değişiklikleri ve deneyleri depoda kapsamaktadır ve ana kod tabanına entegre edilebilmektedir. Ayrıca, depolar, kod dışı dosyaları ve operasyonel belgeleri etkili bir şekilde yönetemeyebilir, bu nedenle yedeklemeler korunması açısından hayati öneme sahiptir. Yedeklemeler, fazlalık ve veri bütünlüğü sağlayarak, yalnızca tek bir depoya güvenme riskini azaltır. Ayrıca, uzun vadeli arşivlemeyi kolaylaştırarak, depo politikaları değişse bile tarihsel verilere erişimi garanti eder.

Geleneksel bulut depolama hizmetleri, kullanışlı olmalarına rağmen merkezi ve genellikle verilerinizi üçüncü taraflarla ve devlet daireleriyle paylaşmalarına izin veren koşullara sahiptir. Bu noktada, BNB Chain üzerinde yeni bir merkeziyetsiz depolama olan BNB Greenfield, dosyalarınızı yedeklemek için daha güvenli ve özel bir alternatif sunmaktadır.

:::tip
Bu eğitimde, çevrenizi kurma, gerekli araçları yükleme ve dosyalarınızı BNB Greenfield'a etkili bir şekilde yedekleme sürecini keşfedeceğiz; merkeziyetsiz depolamanın avantajlarından yararlanırken veri güvenliğini ve sahipliğini sağlamaya odaklanacağız.
:::

CLI aracıyla nasıl etkileşim kuracağınızı, depolama sağlayıcılarını nasıl seçeceğinizi, hesap bakiyenizi nasıl yöneteceğinizi ve yüklenen dosyaları ve kovanları nasıl yöneteceğinizi de ele alacağız.

## Ortamın Kurulumu

### Kurulum

[Greenfield Komut](https://github.com/bnb-chain/greenfield-cmd), Greenfield ile etkileşimde bulunmak için güçlü bir komut satırıdır. Başlamak için, BNB Greenfield komut satırı aracını yüklemeli ve CLI GitHub sayfasındaki talimatları takip etmelisiniz.

Greenfield ile etkileşimde bulunan komutlar çalıştırıldığında, belirtilen yolda config/config.toml dosyası yoksa ve komutlar "--config" bayrağı olmadan çalıştırılıyorsa, araç, ortam yapılandırmasıyla tutarlı bir şekilde otomatik olarak config/config.toml dosyasını oluşturacaktır.

Yapılandırma dosyası örneği, gerekli RPC adresini ve zincir kimliğini ayarlayacaktır:

=== "Ana Ağ"

    ```
    rpcAddr = "https://greenfield-chain.bnbchain.org:443"
    chainId = "greenfield_1017-1"
    ```

=== "Test Ağı"

    ```
    rpcAddr = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    chainId = "greenfield_5600-1"
    ```

### Hesap İçe Aktarma ve Anahtar Dosyası Oluşturma
Yerel makinedeki kimliğinizi ayarlamak ve bir anahtar dosyası oluşturmak için, kimliğinizin özel anahtarını tutacak özel bir dosya oluşturmalısınız. Özel anahtarınızı MetaMask'tan dışa aktarabilir ve bunu yerel bir dosyaya düz metin olarak yazabilirsiniz. (MetaMask'tan açılır menüden "Hesap Ayrıntıları"nı seçebilirsiniz. Sayfanın en altındaki "Özel Anahtar Dışa Aktar" düğmesine tıklayın.) Hazır dosyalarınız olduğunda, aşağıdaki komutu çalıştırın: 

```
// Anahtarı içe aktar ve bir anahtar dosyası oluştur
// key.txt özel anahtar dosyasını belirtir
gnfd-cmd account import key.txt
```

Terminal, kullanıcıdan şifre bilgilerini girmesini isteyecektir. Kullanıcılar, "--passwordfile" kullanarak şifre dosyası yolunu da belirtebilir. Şifrenin uzunluğu veya karmaşıklığına dair herhangi bir kısıtlama olmasa da, genel olarak önerilen ilkelere uymak daha iyidir.

> **Önemli Not:** Bu komut, bir anahtar dosyası oluşturacak ve bunu sistemin ana dizinindeki veya "-home" ile ayarlanmış dizindeki "keystore/key.json" yoluna kaydedecektir. CLI kimlik ve ödeme gerektiren komutlar için bu dosyayı seçecektir. Anahtar dosyasını oluşturduktan sonra, içindeki özel anahtar bulunan key.txt dosyasını silmeyi unutmayın.

## BNB Greenfield ile Etkileşim
BNB Greenfield, depolama sağlayıcılarının önemli bir rol oynadığı dağıtık bir mimari üzerine inşa edilmiştir. Ağ, kullanıcıların verilerini depolamak ve geri almak için kaynaklarını sunan birden fazla depolama sağlayıcısından oluşmaktadır. BNB Greenfield kullanırken, kullanıcılar fiyat, koşullar ve ağ performansı gibi birçok faktöre dayanarak hangi depolama sağlayıcılarını kullanacaklarına karar verme esnekliğine sahiptir.

Depolama sağlayıcılarını seçerken, kullanıcılar CLI aracı aracılığıyla merkeziyetsiz depolama ağını sorgulayarak mevcut sağlayıcılar hakkında bilgi edinebilirler. Sağlayıcıların listesi, operatör adreslerini ve ilgili uç noktaları içerecektir. Kullanıcılar daha sonra yukarıda belirtilen faktörlere dayanarak sağlayıcıları analiz edebilir ve gereksinimleriyle en iyi şekilde uyumlu olanları seçebilirler.

:::info
İleri seviye kullanım durumları için, kullanıcılar depolama ihtiyacını artırmak için verilerini birden fazla sağlayıcı arasında çeşitlendirebilirler. Bu yaklaşım, verilerin farklı sağlayıcılar arasında dağıtılmasını sağlar ve böylece bir sağlayıcı sorun yaşasa bile verilerin diğer sağlayıcılardan erişilebilir olmasını garanti eder. 
:::

Fiyat, koşullar ve ağ performansı temelinde dikkatlice depolama sağlayıcılarını seçerek, kullanıcılar merkeziyetsiz depolama deneyimlerini optimize edebilir ve verilerinin kontrolünü sürdürürken daha iyi güvenlik ve gizlilik avantajlarından faydalanabilirler.

### Depolama Sağlayıcılarını Seçme
Ağı sorgulamak ve depolama sağlayıcılarının bir listesini almak için aşağıdaki komutu çalıştırın:

```
./gnfd-cmd sp ls
```

Sonuç, depolama sağlayıcılarının bir listesini göstermelidir. Ana ağ için, geliştirme amaçları için kullanılabilecek birkaç aktif depolama sağlayıcısı bulunmaktadır.

```
name     operator address                           endpoint                               status
bnbchain 0x231099e40E1f98879C4126ef35D82FF006F24fF2 https://greenfield-sp.bnbchain.org:443 IN_SERVICE
defibit  0x05b1d420DcAd3aB51EDDE809D90E6e47B8dC9880 https://greenfield-sp.defibit.io:443   IN_SERVICE
ninicoin 0x2901FDdEF924f077Ec6811A4a6a1CB0F13858e8f https://greenfield-sp.ninicoin.io:443  IN_SERVICE
nariox   0x88051F12AEaEC7d50058Fc20b275b388e15e2580 https://greenfield-sp.nariox.org:443   IN_SERVICE
lumibot  0x3131865C8B61Bcb045ed756FBe50862fc23aB873 https://greenfield-sp.lumibot.org:443  IN_SERVICE
voltbot  0x6651ED78A4058d8A93CA4979b7AD516D1C9010ac https://greenfield-sp.voltbot.io:443   IN_SERVICE
nodereal 0x03c0799AD70d19e723359E036a83E8f44f4B8Ba7 https://greenfield-sp.nodereal.io:443  IN_SERVICE
```

Her bir depolama sağlayıcısının fiyatını, operatör adresini kullanarak kontrol edebilirsiniz; örneğin:

```
./gnfd-cmd sp get-price 0x231099e40E1f98879C4126ef35D82FF006F24fF2
```

Yanıt, verilerin okunması ve saniye başına depolama fiyatı için fiyatı getirecektir.

```
get bucket read quota price: 0.1469890427  wei/byte
get bucket storage price: 0.02183945725  wei/byte
get bucket free quota: 1073741824
```

1 GB veri kullanımındaki ölçüm olan wei/byte üzerinden, ayda gigabayt (GB) fiyatını anlamak için, sonucu 0.002783138807808 ile çarpmanız gerekir; çünkü 1 GB'de 1,073,741,824 byte, bir ayda (30 gün * 24 saat * 60 dakika * 60 saniye) 2,592,000 saniye ve 1 BNB'de 10^18 wei bulunmaktadır.

Sonuç, veri depolama veya aktarma fiyatı, gigabayt başına ayda ifade edilecektir. Bu hesaplama, veri kullanım oranını ve bir ayın süresini dikkate almaktadır. Wei/byte/sec cinsinden dönen orana göre, dönüştürülen tutarlar şunlardır:

```
get bucket read quota price: 0.00041 BNB/GB/month
get bucket storage price: 0.00006 BNB/GB/month
```

Fiyatlandırma modeli ve hesaplamaların, kullandığınız belirli depolama sağlayıcısına bağlı olarak değişebileceğini unutmayın. Her zaman doğru ve güncel fiyatlandırma ayrıntıları için belgelere veya sağlayıcının bilgilerine başvurun.

### Hesap Yönetimi
BNB Akıllı Zinciri (BSC) ve BNB Greenfield, hesaplarını aynı formatta tanımlasa da, iki ayrı blockchain olduklarını anlamak önemlidir ve her biri için bakiyeleri ayrı ayrı yönetmek gerekmektedir.

Test BNB'yi BSC'den BNB Greenfield'a aktarmak için, kullanıcılar [dCellar](https://dcellar.io/) uygulamasını kullanabilir. dCellar uygulamasını kullanarak, kullanıcılar BSC adreslerinden BNB Greenfield adreslerine transfer işlemini başlatabilirler.

![Transfer Tokenları](../../../images/bnb-chain/bnb-greenfield/for-developers/tutorials/file-management/transfer-tokens.png)

Test ağı için, kullanıcılar BNB Greenfield tarafından sağlanan bir test musluğundan test BNB tokenlarını alabilirler; bu, [https://gnfd-bsc-faucet.bnbchain.org/](https://gnfd-bsc-faucet.bnbchain.org/) adresinden erişilebilir. Musluk web sitesine giderek, kullanıcılara BSC test ağı adreslerine belirli bir miktarda test BNB tokenı gönderilmesi talep edilebilir.

Aşağıdaki komutla bakiyenizi kontrol edebilirsiniz:

```
./gnfd-cmd bank balance --address 0x14cfe3777565d942f7a3e1d1dcffd7945170c8fe
```

Sonuç, mevcut bakiyeyi gösterecektir:
```
balance: 10001464255952380934 weiBNB
```
### Nesne İşlemleri

BNB Greenfield'da nesneler ve kovalara ana bileşenlerdir. Kovalara, verileri düzenlemek ve yönetmek için kullanılan kaplar denir; nesneler ise bu kovalarda saklanan gerçek dosyalardır. Kovalara benzersiz isimler verilerek üst düzey depolama birimleri olarak hizmet edebilir, nesneler ise kendi kovalardaki benzersiz tanımlayıcılardır. Kullanıcılar, nesneler üzerinde yükleme, indirme ve silme gibi işlemler gerçekleştirebilir ve kova ve nesne düzeyinde izinler ve erişim kontrolleri uygulayabilirler. Bu yapı, merkeziyetsiz bir depolama ağında verilerin verimli bir şekilde saklanmasını, düzenlenmesini ve alınmasını sağlar.

Bir kova oluşturmak için, istenen kova adıyla aşağıdaki `storage make-bucket` komutunu çağırmak gerekir.

```
./gnfd-cmd bucket create gnfd://bucket123123123
```

İşlem, otomatik olarak bir depolama sağlayıcısı seçecek ve ilişkili metadata'yı yazmak için BNB Greenfield blockchain'ine bir işlem gönderecektir. Alternatif olarak, belirli bir sağlayıcı kullanılacaksa, depolama sağlayıcı adresini, yani operatör adresini sağlayabilirsiniz. Sonuç, aşağıdaki gibi görünmelidir:

```
choose primary sp: https://greenfield-sp.bnbchain.org:443
create bucket bucket123123123 succ, txn hash: 0x6c89316c5912cda8b69eac6e96aa644d374c39c635e07fae4297e03496e7726a
```

Gördüğünüz gibi, sonuç bir işlem hash'ı döndürür; bu hash ile blok tarayıcıyı kullanarak inceleyebilirsiniz, örneğin [https://greenfieldscan.com](https://greenfieldscan.com/). [https://greenfieldscan.com/tx/0x6c89316c5912cda8b69eac6e96aa644d374c39c635e07fae4297e03496e7726a](https://greenfieldscan.com/tx/0x6c89316c5912cda8b69eac6e96aa644d374c39c635e07fae4297e03496e7726a) adresine giderseniz, işlemin tüm ayrıntılarını görebilirsiniz.

![İşlem Ayrıntıları](../../../images/bnb-chain/bnb-greenfield/for-developers/tutorials/file-management/transaction.png)

Ayrıntılarda, kova sahibi ayrıntılarını, benim; birincil depolama sağlayıcısı adresini ve ödeme adresini görebiliriz. Ayrı bir ödeme hesabı oluşturmadığımızdan, varsayılan hesabımız ödeme hesabı olarak da hizmet edecektir.

Depolama sağlayıcısı adresiyle ilgili olarak, hatırlarsanız, bizim için otomatik olarak seçildi; [https://greenfield-sp.bnbchain.org:443](https://greenfieldscan.com/account/0x231099e40E1f98879C4126ef35D82FF006F24fF2) adresidir. Depolama Sağlayıcılarını Seçme bölümünden, adresinin gerçekten 0x231099e40E1f98879C4126ef35D82FF006F24fF2 olduğunu görebiliriz.

Son olarak, bir dosya yükleme zamanı; ancak herhangi bir şey yüklemeden önce, aşağıdaki gibi `echo` komutunu kullanarak bir örnek metin ile oluşturacağız:

```
echo 'Rastgele örnek metin' > test4.txt
```

Son olarak, yeni oluşturduğumuz kova olan `bucket123123123`'e dosyayı yüklemek için aşağıdaki komutu çalıştırmalısınız:

```
./gnfd-cmd object put  --contentType "text/xml" --visibility private ./test4.txt  gnfd://bucket123123123/test4.txt
```
Görün, erişim durumu olarak dosyayı özel hale getirdiğimiz bir görünürlük bayrağı ekledik. Başarılı sonuç aşağıdaki gibi görünmelidir:

```
create object test4.txt on chain finish, txn Hash: 0x5a885b7da8e8eb6921c84540d29b385b2dcee1f5ebdb4bb6c9219cf82e6ca80d
put object test4.txt successfully 
```

Benzer şekilde, [https://greenfieldscan.com/tx/0x5a885b7da8e8eb6921c84540d29b385b2dcee1f5ebdb4bb6c9219cf82e6ca80d](https://greenfieldscan.com/tx/0x5a885b7da8e8eb6921c84540d29b385b2dcee1f5ebdb4bb6c9219cf82e6ca80d) adresine giderek dosya yükleme ayrıntılarını görebilirsiniz. Burada, işlem yükü ve "visibility" niteliğine kaydırarak, gizlilik durumunu doğrulamak için gözlemleyin.

```
{"key":"visibility" "value":"\"VISIBILITY_TYPE_PRIVATE\"" }
```

Dosyayı başarıyla yükledikten sonra, dosyanın içeriğini kontrol edelim ve yüklediğimiz ile karşılaştıralım - tam olarak aynı olmalıdır.
```
./gnfd-cmd object get gnfd://bucket123123123/test4.txt ./test4-copy.txt
```

İşlem dosyayı indirecek ve dosyanın uzunluğunu aşağıdaki gibi çıkartacaktır:
```
download object test4.txt successfully, the file path is ./test4-copy.txt, content length:19
```

Nesnenin ait olduğu sp uç noktasını biliyorsanız, indirme hızını artırmak için `--spEndpoint` bayrağını ekleyebilirsiniz, aşağıdaki gibi:
```
./gnfd-cmd object get --spEndpoint https://gnfd-testnet-sp3.nodereal.io gnfd://bucket123123123/test4.txt ./test4-copy.txt
```

Dosyanın bütünlüğünü doğrulamak için, içeriğini ilk yüklediğimiz dosyayla karşılaştırabiliriz. Boş çıktı, fark olmadığını doğrular.

```
diff test4.txt test4-copy.txt 
```
### Birden Fazla Nesne Yükleme

`gnfd-cmd`, ayrıca bir klasördeki tüm dosyaları özyinelemeli olarak yüklemeyi de destekler.

Diyelim ki, tüm web siteniz için dosyaları depoladığınız "website" adında bir klasör var.

```shell
$ ls
index.html  plato.jpeg  styles.css
```
Bu dosyaların hepsini kovanıza yüklemek için aşağıdaki komutları çalıştırabilirsiniz:

```
gnfd-cmd object put --recursive ./website gnfd://ylatitsb
```

Lütfen `--recursive` bayrağının belirtilen dizin veya ön ek altındaki tüm dosyaları veya nesneleri özyinelemeli olarak koymak için kullanıldığını unutmayın. Varsayılan değer false.

Başarılı sonuç aşağıdaki gibi görünmelidir:

```
================================================
Toplu yüklemeniz bir görev olarak gönderildi, görev ID'si sdgerdf-sfdgasg-1237hedfg
Görev durumunu ve ilerlemesini aşağıdaki cmd ile kontrol edebilirsiniz:

- Tüm görevlerinizi listeleyin: ./gnfd-cmd task ls
- Durumu kontrol et: ./gnfd-cmd task status --task.id taskID
- Yeniden dene (bu işlem kazara sonlandırılırsa): ./gnfd-cmd task retry --task.id taskID
- Görevi sil: ...

>>================================================
Yükleme Görevi oluşturuluyor

sealed index.html
```

#### Görev İşlemleri
Nesne koymak için `--recursive` kullanıldığında, görevler otomatik olarak oluşturulur.

Görevleri `gnfd-cmd task` ile görebilir/yeniden deneyebilirsiniz.

`gnfd-cmd task` kullanımı, `gfnd-cmd object put --recursive` işlemi devam ederken yeni bir oturum açmayı gerektirir. Eğer mevcut oturum kesilirse, nesne koyma işlemi de kesilecektir.

```
./build/gnfd-cmd task  status --taskId abe92a9a-1aa0-45be-9e0b-4cd400c38a06
```
Görev durumunu görme
taskId, `gfnd-cmd object put --recursive` sonrasında üretilecektir.

```
Folder: ./website
Status: created
sealed            index.html
wait_for_upload   styles.css
```

```
./build/gnfd-cmd task  retry --taskId abe92a9a-1aa0-45be-9e0b-4cd400c38a06
```

`gfnd-cmd object put --recursive`, bir hata veya kesilmeden sonra tekrar denemek için kullanılacaktır.

```
task: abe92a9a-1aa0-45be-9e0b-4cd400c38a06
folder name: ./website
retrying...

sealed index.html
```

```
./build/gnfd-cmd task  delete --taskId abe92a9a-1aa0-45be-9e0b-4cd400c38a06
```
Bir görevi silmek için, görevi silmek yeterlidir.

Kovanızın değişimlerini görmek için [GreenfieldScan](https://testnet.greenfieldscan.com) adresine gidebilirsiniz.

## Sonuç
Genel olarak, yazılım geliştirme sırasında yedeklemeler, zihinsel huzur, verimli iyileşme ve proje bütünlüğünün korunmasını sağlar. Bunlar, çalışma süresini en aza indirir ve önemli aksaklıkları önler.

:::note
Bu eğitimle komut satırı aracı ve BNB Greenfield ile tanıştıktan sonra, bir sonraki adım dosyalar, kovalara ve izin gruplarına oluşturarak keşfetmek ve denemek olacaktır. Birden fazla dosya oluşturarak ve bunları kovalara düzenleyerek, kullanıcılar BNB Greenfield'ın depolama yetenekleri ile uygulamalı deneyim kazanabilirler.
:::

Kullanıcıların, farklı cüzdanlarla uygulamalı keşiflerde bulunmaları ve temel işlemler ile izin mekanizmalarını anlamaları kesinlikle önerilmektedir. Bu, BNB Greenfield'ın nasıl çalıştığını ve merkeziyetsiz depolama sisteminde verilerin nasıl etkili bir şekilde yönetileceğini daha iyi anlamalarını sağlayacaktır.

Bu pratik deneyim, gelecekteki makalelerde tartışılacak programlanabilirlik ve BNB Greenfield'ın akış bazlı faturalama ve varlık monetizasyonu gibi yenilikçi kavramlarını anlamak için bir zemin oluşturacaktır. Çeşitli işlevleri keşfederek ve farklı yapılandırmalar ile deneyerek, kullanıcılar BNB Greenfield'ın tam potansiyelini açabilir ve yeni veri ekonomisi kavramlarını keşfedebilirler.