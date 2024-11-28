---
title: Bir Web Sitesi Barındırmak - BNB Greenfield Eğitimleri
description: Bu öğretici, BNB Greenfield üzerinde merkeziyetsiz bir depolama alanında web sitesi oluşturma ve yükleme sürecini açıklamaktadır. Adım adım yönergelerle, kullanıcıların kendi web sitelerini rahatlıkla dağıtmalarını sağlayacak bilgiler sunulmaktadır.
keywords: [web sitesi, BNB Greenfield, merkeziyetsiz depolama, öğretici, yükleme, HTML, CSS]
---

# CLI ile bir web sitesi oluşturma ve yükleme

## Giriş
Günümüzde, bir web sitesine sahip olmak bireyler ve işletmeler için vazgeçilmez hale gelmiştir. AI'daki gelişmelerle birlikte, ChatGPT ve Bard gibi araçlar, yalnızca birkaç cümle ile basit bir web sitesi veya başlangıç şablonu oluşturmanıza yardımcı olabilir. Bu öğretici, sizleri BNB Chain üzerinde merkeziyetsiz bir depolama alanı olan BNB Greenfield'a bir web sitesi oluşturma ve yükleme sürecinde rehberlik edecek.

## Web Sitesi Oluşturma

Bir web sitesi genellikle HTML sayfaları, CSS stilleri ve artırılmış etkileşim için JavaScript betikleri içerir. Bu dosyalar, web sitesinin görsel tasarımını, düzenini ve işlevselliğini oluşturmak için birlikte çalışır. **Seçtiğiniz AI aracına** gidin ve "Platon'un biyografisi hakkında resimlerle bir web sitesi oluştur" gibi bir şey yazın. Ve ideal olarak, birkaç döngüden sonra, makul görünümlü bir web sitesine ulaşacaksınız.

## Web Sitesi Yayınlama

Bir web sitesini bir web barındırma platformuna dağıtmak, web sitesini herkese açık hale getirdiği ve kullanıcıların erişimini sağladığı için kritik öneme sahiptir. Bir web sitesi bir bulut sunucusunda barındırıldığında, internet bağlantısına sahip herkes buraya erişim sağlayabilir. Kullanıcılar, web tarayıcısına URL veya alan adını yazarak web sitesine erişebilirler.

:::info
BNB Greenfield durumunda, **merkeziyetsiz depolama sağlayıcıları ağı**, web sitesinin dosyalarını birden fazla düğüm üzerinde dağıtarak artan kullanılabilirliğe katkıda bulunur. Ayrıca, BNB Greenfield gibi merkeziyetsiz ağlar, web sitesinin dosyalarının farklı düğümlerde birden fazla kopyasını saklayarak veri kaybı riskini azaltarak veri yedekliliği sağlar.
:::

### Bir Kova Oluşturma

Öncelikle, BNB Greenfield üzerinde web siteniz için ayrı bir kova oluşturun aşağıdaki komutu kullanarak:

```bash
./gnfd-cmd bucket create --visibility=public-read gnfd://my-plato-website --primarySP 0x231099e40E1f98879C4126ef35D82FF006F24fF2
```

Örnek geri dönüş mesajı aşağıdaki gibidir:
```
make_bucket: my-plato-website
transaction hash:  E083FB2647D0A53640B63AD1DB8EFA0E1C5CC05454C0774E3DB2A4822E73D423
```
İşlemi explorer'da burada doğrulayabilirsiniz: [burada](https://greenfieldscan.com/tx/E083FB2647D0A53640B63AD1DB8EFA0E1C5CC05454C0774E3DB2A4822E73D423).

### Destekleyici Dosyaları Yükleme

Sonra, stil dosyalarını ve resim dosyalarını yeni oluşturduğunuz kovaya yükleyin. Dosyaların herkes tarafından erişilebilir olması için görünürlük bayrağını public-read olarak ayarlayın:

```bash
./gnfd-cmd object put --visibility=public-read ./plato.jpg gnfd://my-plato-website/plato.jpg 
./gnfd-cmd object put --visibility=public-read ./styles.css gnfd://my-plato-website/styles.css
```

### BNB Greenfield URL'si

BNB Greenfield, merkeziyetsiz depolaması içinde nesneleri tanımlamak ve erişmek için bilinen özel bir URL formatı kullanır. **URL formatı** aşağıdaki örüntüyü takip eder: `gnfd://?[parameter]*`.

Bu formatın bileşenlerini inceleyelim:

1. **"gnfd://"** - Bu, URL'nin BNB Greenfield ile ilişkili olduğunu belirten sabit ön tanımlayıcıdır. Zorunludur ve Greenfield URL'lerinin bir işareti olarak hizmet eder.
2. **bucket_name** - Nesnenin depolandığı kovanın adını ifade eder. Bu zorunlu bir bileşendir ve BNB Greenfield içinde belirli depolama konumunu tanımlamaya yardımcı olur.
3. **object_name** - Kova içindeki nesnenin adını temsil eder (örn. dosya). Bu da zorunludur ve istenen kaynağın kesin tanımlanmasını sağlar.
4. **parameter** - Bu bileşen isteğe bağlıdır ve anahtar-değer çiftlerinin bir listesini içerir. Parametreler, URI için ek bilgiler sağlar, özelleştirme veya belirli işlevsellik sağlama imkanı verir. Parametre örnekleri, önbellek ayarları veya diğer meta veriler olabilir.

:::note
Ayrıca, BNB Greenfield, Hizmet Sağlayıcılarının (SP'ler), hizmetlerine erişim için birden fazla uç nokta kaydetmelerine olanak verir. 
:::

Web sitemiz bağlamında, kova SP2 hizmet sağlayıcı altında oluşturulmuştur ve web sitesinin içeriğine erişim için hizmet eden uç nokta `https://gnfd-testnet-sp-2.bnbchain.org/` olarak belirlenmiştir. Bu uç nokta, kullanıcıların BNB Greenfield üzerindeki belirtilen kovada saklanan HTML, CSS, resimler ve daha fazlası gibi web sitesi dosyalarına erişim sağlamalarına olanak tanır.

### Referansların Güncellenmesi

Destekleyici dosyalar yüklendikten sonra, HTML dosyanızdaki bağlantıları doğru URL'lere yönlendirin. BNB Greenfield URL formatına göre, `index.html` dosyamızdaki URL'leri güncellememiz gerekiyor.

Örneğin, "images" dizininde yer alan `plato.jpg` adlı bir resim dosyamız varsa, daha önceki URL referansı "images/plato.jpg" olurdu. Ancak, BNB Greenfield'ın URL formatıyla, bu URL'yi hizmet eden uç noktayı ve belirli kova adını dahil etmek için değiştirmeliyiz.

"images/plato.jpg" yerine, bunu `https://gnfd-testnet-sp-2.bnbchain.org/view/my-plato-website/images/plato.jpg` şeklinde değiştireceğiz; burada "my-plato-website" dosyanın saklandığı kova adını ifade eder. Bu güncellenmiş URL, tarayıcının doğru resim dosyasını BNB Greenfield'dan almasını sağlar.

Ama işler daha iyiye gidiyor! **BNB Greenfield URL formatı**, aynı kovadaki tüm dosyalar için aynı kaldığı için, aynı kovada bulunan dosyalar için URL'leri basitleştirebiliriz. CSS dosyası durumunda, tam URL'yi belirtmeden göreli bir yol kullanarak atıfta bulunabiliyoruz. Örneğin:

```html
<link rel="stylesheet" type="text/css" href="styles.css">
```

Benzer şekilde, `plato.jpg` resim dosyası için tam URL belirtmeden göreli bir yol kullanabiliriz:

```html
<img src="plato.jpg" alt="Plato" class="plato-image">
```

Göreli yollar kullanarak, tarayıcı, bu belirli durumlarda CSS dosyasını ve resim dosyasını aynı kovadan doğru bir şekilde alacaktır, tam yolu dahil etme gereğini ortadan kaldıracaktır.

### HTML Dosyalarını Yükleme

Değiştirilmiş `index.html` dosyasını kovasına yüklemek için aşağıdaki komutu kullanın:

```bash
./gnfd-cmd object put --visibility=public-read --contentType=text/html ./index.html gnfd://my-plato-website/index.html
```

Örnek çıktı:
```
object index.html created on chain
transaction hash:  20921F3C1DBE3F911217CE82BDC9DC2A745AF61912651A5F9D80F10989A8FC20

sealing...
upload index.html to gnfd://my-plato-website/index.html
```

Artık, heyecanla yeni web sitemizi [https://gnfd-testnet-sp1.bnbchain.org/view/my-plato-website/index.html](https://gnfd-testnet-sp1.bnbchain.org/view/my-plato-website/index.html) adresinden görüntülemek için tıklayalım ve beklentiye kapılalım.

🥁Davul sesi...

Ama, ah hayır! Bir şeyler ters gitti. Web sitesi yüklenmek yerine dosya otomatik olarak indirilmeye başladı. Hayal kırıklığı baş gösterdi ve birkaç saat süren bir hata ayıklama yolculuğuna çıktım, sorunu çözmeye çalışarak.

Sonunda, suçluyu keşfettim: dosyaların içerik türünü belirtmeyi unuttuk, bu durum dosyaların tanınamaz hale gelmesine ve sunulmaktansa indirilmesine neden oldu.

Ama unutmayalım ki **BNB Greenfield değiştirilemez bir depolama alanıdır**. Yani dosyayı güncellemek için önce silmeliyiz ve sonra tekrar yüklemeliyiz.

Bunu başarmak için 'object delete' komutunun gücünü kullandım:

```bash
./gnfd-cmd object rm gnfd://my-plato-website/index.html
```

Dosyanın başarıyla silindiğine dair bir onay bekleyin, ardından bir işlem hash'i: 
`4B12BCF26525C1B661389529524DF14E23164D000FA47FB2E0D0BE26B131E04A` ile.

Ve html dosyasını, bu sefer içerik türü bayrağı ile birlikte tekrar yükleyin:

```bash
./gnfd-cmd object put --visibility=public-read --contentType=text/html ./index.html gnfd://my-plato-website/index.html
```

🥁🥁Davul sesi artıyor...

Ah, hayır! Web sitesi hala oldukça kötü görünüyor ve daha da kötüsü, Platon'un resmi hiçbir yerde yok. Hayal kırıklığımız, tarayıcının yanlış MIME türü nedeniyle bir hata verdiğini keşfettiğimizde tele düşüşe geçti. Bunu çözmek için, [https://gnfd-testnet-sp-2.bnbchain.org/view/my-plato-website/styles.css](https://gnfd-testnet-sp-2.bnbchain.org/view/my-plato-website/styles.css) adresindeki stilleri uygulamayı reddetti çünkü MIME türü 'text/plain' olarak ayarlanmıştı ve bu, sıkı MIME kontrolü etkin olduğunda desteklenen bir stil dosyası MIME türü değildir. Korkmayın! Hata tanıdık geliyor ve ne yapılması gerektiğini biliyoruz. Hızla sorunlu dosyaları silip doğru bir şekilde yeniden yükleyerek:

```bash
./gnfd-cmd object rm gnfd://my-plato-website/plato.jpg
./gnfd-cmd object rm gnfd://my-plato-website/styles.css
```
Ve sonra, kararlı bir ruh haliyle:
```bash
./gnfd-cmd object put --visibility=public-read --contentType=image/jpeg ./plato.jpg gnfd://my-plato-website/plato.jpg
./gnfd-cmd object put --visibility=public-read --contentType=text/css ./styles.css gnfd://my-plato-website/styles.css
```

🥁🥁🥁Davul sesi zirveye ulaşıyor…

Ve sonunda, zafer naralarının sesini duydum! 

![Plato Web Sitesi](../../../images/bnb-chain/bnb-greenfield/for-developers/tutorials/website-example.png)

Ancak, [siteye](https://greenfield-sp.bnbchain.org/view/my-plato-website/index.html) baktığımızda, özellikle muhteşem görünmediğini kabul edemiyoruz. En yüksek beklentilerimizi karşılamaktan uzak. Nitekim, bunu yalnızca birkaç dakika içinde oluşturup yüklediğimiz göz önüne alındığında, zaman ve çaba yatırdığımız hesaba katıldığında yine de kabul edilebilir bir sonuç.

İçerik ve resim güzel görünüyor, yalnızca stillerle biraz daha sevgiye ihtiyaç var... ama bu başka bir öğreticinin konusu.

## Sonuç

Web sitesi geliştirme yolculuğumuz birçok iniş ve çıkışla doluydu. Yol boyunca zorluklarla karşılaştık ama azim ve biraz hata ayıklama ile web sitemizi başarıyla dağıttık.

BNB Greenfield'ın URL formatı ve değiştirilemez depolama ilkeleri, içerik türlerine dikkat edilmesini ve dosyaları güncellerken dikkatli olunmasını gerektirir. Küçük aksaklıklara rağmen, **BNB Greenfield, web siteleri dağıtmak için değerli bir platform olmaya devam ediyor** ve artan kullanılabilirlik, güvenilirlik ve oldukça kolay komut araçları sunuyor.

Umarım hoşunuza gitmiştir ve BNB Greenfield üzerinde web sitelerinizi görmeyi dört gözle bekliyoruz.