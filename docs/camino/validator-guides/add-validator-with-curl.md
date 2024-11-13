---
sidebar_position: 34
title: cURL ile Bir Doğrulayıcı Düğüme Ekleme
description: cURL ile bir Doğrulayıcı Düğüme nasıl eklenir
---

:::caution KULLANIMDIŞI BELGE

**camino-node** içindeki Keystore API'sinin kullanımdan kaldırılması nedeniyle, bu belgede açıklanan şekilde bir doğrulayıcı eklemek için `curl` kullanma yöntemi de kullanılmaktan kaldırılmıştır. Bu belge, bir doğrulayıcı ekleme sürecine ilişkin referans olarak mevcut kalmaya devam etmektedir.

Lütfen güncellenmiş yöntemler için  veya  sayfalarına başvurun.

:::

Bu kılavuz, cüzdan adresinizi düğüm kimliğinizle bağlama sürecini ve ardından o düğümü Camino ağı üzerinde bir doğrulayıcı olarak eklemeyi açıklayacaktır.

Herhangi bir sorunuz varsa veya herhangi bir adımda takılırsanız, lütfen  sunucumuz üzerinden bizimle iletişime geçmekten çekinmeyin.

:::info Varsayımlar

Bu kılavuz, verilen komutları çalıştıracağınız yerel makinenizde çalışan bir Camino düğümüne sahip olduğunuzu varsayıyor. `camino-node` için IP adresi ve port sırasıyla `127.0.0.1` ve `9650`’dir.

| CAMINO-NODE IP |  PORT  |
| :------------: | :----: |
|  `127.0.0.1`   | `9650` |

Düğümünüz bulutta veya uzaktan bir sunucuda yer alıyorsa, o makineye SSH kullanarak giriş yapmanız ve komutları shell’den çalıştırmanız gerekecektir.

:::

:::note Doğrulayıcı Stake Portu: `9651`

Bu kılavuz, istekler için API portu olarak `9650` kullanacak olsa da, doğrulayıcınızın doğru şekilde çalışabilmesi için sunucunuzun staking portu `9651`’i açmanız gerekmektedir. Bu genellikle bir güvenlik duvarı veya bir yönlendirici/modem aracılığıyla yapılır, eğer bir konut sağlayıcısındaysanız.

:::

## Gereksinimler

Bir doğrulayıcı düğüm eklemek için başlama sürecine geçmeden önce, tatmin etmeniz gereken birkaç gereksinim bulunmaktadır. Aşağıda, ana ağ (`camino`) ve test ağı (`columbus`) için bu gereksinimlerin bir listesi bulunmaktadır.

Aşağıda, bu bilgileri düğümünüzü sorgulayarak (uygun olduğunda) nasıl alacağınıza dair talimatlar bulacaksınız.

### **Camino Ana Ağı** & **Columbus Test Ağı**

- **NodeID**: Düğümünüzün adresi, sıradan bir cüzdan adresine benzer.
- **Düğümün Özel Anahtarı**: Bu, **NodeID**'nin sahipliğini kanıtlamak için gereklidir.
  Güvende ve emniyette tutun!
- **Cüzdan adresi ve özel anahtar**: Cüzdan adresinize ve özel anahtarınıza ihtiyacınız var.
  Özel anahtarınızı güvende tutmayı unutmayın!
- **P-Zincir cüzdanınızda 100.000 bağlı olmayan CAM**. Ayrıca işlem ücretlerini ödemek için birkaç CAM daha.
  En az 100.000 bağlı olmayan token'a sahip olduğunuzdan emin olmak için çevrimiçi  üzerinde kontrol edebilirsiniz.
- **Konsorsiyum Üyesi**: Cüzdan adresiniz bir konsorsiyum üyesi olmalıdır.
  Bunun hakkında emin değilseniz, lütfen açıklama için bizimle  üzerinden iletişime geçin. Ön satışa katıldıysanız, zaten bir Konsorsiyum Üyesi’siniz.
- **KYC/KYB Onaylı**: Know-Your-Customer (KYC) veya Know-Your-Business (KYB) onaylı olmalısınız.

:::note ÖN SATIŞ KATILIMCILARI

Ön satış katılımcıları, ana ve test ağlarında zaten konsorsiyum üyeleri olarak belirlenmişlerdir ve Know-Your-Customer (KYC) doğrulama sürecini de tamamlamışlardır.

:::

:::info BAĞLI OLMAYAN CAM TOKENLARI

Camino Ağı'nda, CAM tokenleri çeşitli amaçlar için teminat olarak kullanılabilir; örneğin, depozitolar kazanmak, doğrulayıcı stake'leri veya DAO önerileri yapmak. Bu teminatların iki türü vardır: **depozitolar** ve **tahviller**.

Bireyler, belirli bir süre boyunca CAM tokenlerini yatırarak ödüller kazanabilirler. Bu durumda, tokenler "**depozitoya**" ve "**kilitli**" hale gelir.

Benzer şekilde, bireyler tokenlerini bir doğrulayıcı stake'ine veya bir DAO önerisine bağlayabilir. Bu senaryoda, tokenler "**bağlı**" ve "**kilitli**" olur.

Yatırılan tokenlerin tahviller için kullanılabileceğini ve tam tersinin de mümkün olduğunu belirtmekte fayda var.

Kilitli tokenlerin **işlem ücretlerini ödemek için kullanılamayacağını** da unutmamak önemlidir.

Deposito ve tahvillerle ilgili daha fazla ayrıntılı bilgi için lütfen şu sayfaya başvurun: 

:::

## Düğümünüzün Kimliğini Alma

Düğümünüzü ilk kurduğunuzda, kullandığınız kurulum yöntemine bağlı olarak düğümünüzün kimliği terminalde görüntülenecektir. Eğer bunu not aldıysanız, o kimliği kullanabilirsiniz. Aksi takdirde, `camino-node`'un Bilgi API'sine istek yaparak bu bilgiyi alabilirsiniz.

Aşağıda, bunu `curl` komutları kullanarak nasıl yapacağınıza dair bir örnek verilmiştir.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNodeID"
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/info
```

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "nodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
    "nodePOP": {}
  },
  "id": 1
}
```

Bu örnekte, **NodeID**’niz `NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ`

:::

## Düğümünüzün Özel Anahtarını Alma

Düğümünüzün özel anahtarını Altyapı API'sinin `admin.getNodeSigner` metoduna istek yaparak alabilirsiniz.

Aşağıda, bunu `curl` komutunu kullanarak nasıl yapacağınıza dair bir örnek verilmiştir.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.getNodeSigner",
    "params": {
    }
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/admin
```

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "privateKey": "PrivateKey-2ZW6HUePBW2dP7dBGa5stjXe1uvK9LwEgrjebDwXEyL5bDMWWS",
    "publicKey": "D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
  },
  "id": 1
}
```

Bu örnekte, **Düğüm**’ünüzün **Özel Anahtarı** `PrivateKey-2ZW6HUePBW2dP7dBGa5stjXe1uvK9LwEgrjebDwXEyL5bDMWWS`.

Ayrıca kamu anahtarınızı (düğümünüzün adresi, aynı zamanda `NodeID` olarak da bilinir) görebilirsiniz.

:::

:::caution YÖNETİM API UÇ NOKTASI

Lütfen unutmayın ki Yönetim API'si varsayılan olarak Camino Düğümlerinde devre dışıdır. Uç noktayı kullanmak için etkinleştirmeniz gerekmektedir. Daha fazla bilgi için  bakabilirsiniz.

:::

## Cüzdan Özel Anahtarınızı Alma

Eğer cüzdan adresinizi zaten aldıysanız,  ile cüzdanınızın özel anahtarını **Anahtarları Yönet** menüsünden alabilirsiniz.

Adresinizi bilmiyorsanız,  üzerinde cüzdanınızı oluşturduğunuzda, sizden bir anahtar cümlesini kaydetmeniz istenmiş olabilir.

Bu anahtar cümlesini kullanarak, cüzdan adresinizi kurtarabilir ve özel anahtarınızı çıkarabilirsiniz. Cüzdanınıza giriş yapın ve menüden **Anahtarları Yönet** seçeneğine tıklayın. **Anahtarlarım** altında cüzdan adresinizi göreceksiniz. Adresin hemen yanında **C-Chain Özel Anahtarını Görüntüle** adlı bir buton olacaktır.



## P-Zincirine Token Transferi

Doğrulayıcınıza stake yapmak için P-Zincirinde **100.000 bağlı olmayan CAM** tokenına sahip olmanız gerekecektir. Eğer zaten P-Zincirinde yoklarsa, bunları transfer etmeniz gerekecektir.

Transferi gerçekleştirmek için  kullanabilirsiniz. Ana menüde **Çapraz Zincir** seçeneğine tıklayın ve kullanıcı arayüzündeki talimatları takip edin.

## Konsorsiyum Üyesi

Eğer ön satışa katıldıysanız, bir cüzdan adresi sağladıysanız ve seyahatle ilgili bir şirketseniz, zaten **Konsorsiyum Üyesi** olarak atanmışsınız demektir.

Eğer üye değilseniz veya Camino Test Ağı `columbus` için eklenmek istiyorsanız, lütfen  üzerinden bizimle iletişime geçin.

## Know-Your-Customer ve Know-Your-Business Doğrulaması

Camino Ağı'nda KYC (Know Your Customer) doğrulamasını tamamlamak için  ile giriş yapabilir ve "KYC Doğrulaması" butonuna tıklayabilirsiniz. Bir açılır pencere belirecek ve sizden e-posta ve telefon numaranızı talep edecektir. Doğrulama işlemini tamamlamak için gerekli talimatları takip edin; bu süreçte sizden bazı kimlik formları sunmanız gerekecektir.

Ayrıca, KYC süreci bir tarayıcıda başlatıldıktan sonra telefonunuzda da devam ettirilebilir; bu da daha fazla kolaylık ve esneklik sağlar. KYC süreci hakkında daha fazla bilgi için lütfen  sayfasına bakın.

KBY süreci şu anda geliştirilme aşamasındadır ve belgeler çok yakında güncellenecektir. Bu arada, yardıma ihtiyacınız olursa, lütfen Camino topluluğuna  üzerinden ulaşın.

:::tip KYC/KYB Süreci & Gizlilik

KYC/KYB sürecinin **özel bilgilerinizi** blok zincirine maruz bırakmayacağını lütfen unutmayınız. Süreç off-chain (zincir dışı) olarak tamamlanır ve cüzdan adresiniz yalnızca blok zincirinde _"kyc-onaylı"_ olarak işaretlenir.

Ağda hiçbir özel bilgi kaydedilmez.

:::

## Doğrulayıcı Olmak

Eğer bir Doğrulayıcı olmanız için gerekli tüm gereksinimlere ve bilgilere sahipseniz, şimdi bu bilgileri blok zincirine kaydedebiliriz. Bunu yapmak için şu adımları izlemelisiniz:

Aşağıda yapacağınız adımların özeti bulunmaktadır:

1. **Kullanıcı oluşturun** düğümünüzün _keystore_'unda
2. **Cüzdan ve düğümün özel anahtarını** keystore'a içe aktarın
3. **Düğümünüzü** cüzdan adresinizle **kaydedin**
4. **Düğümünüzü** **doğrulayıcı** olarak **ekleyin**
5. **Doğrulayıcı** durumunu **kontrol edin**

Şimdi, bu adımları `curl` API istekleri kullanarak nasıl tamamlayacağınızı görelim.

## Düğümünüzde Kullanıcı Oluşturun

Düğümünüzdeki bazı API yöntemleriyle etkileşimde bulunabilmek için bir kullanıcı adı ve şifreye sahip olmanız gerekecektir. Bu süreçteki ilk adım, bir kullanıcı oluşturmaktır.

Kullanıcılar, düğümünüzdeki keystore'da saklanmaktadır. Ana ağda doğrulama ve delegasyon için, işlemleri yapmak üzere Camino Ağı'ndaki  kullanmanız önerilir. Bu, fonlarınız için özel anahtarların düğümünüzde saklanmamasını sağlamakta ve düğümün çalıştırıldığı bilgisayarın tehlikeye girmesi durumunda riski önemli ölçüde azaltmaktadır.

:::note

Eğer daha önce oluşturduysanız zaten bir kullanıcınız varsa, bu adımı atlayabilirsiniz.

:::

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.createUser",
    "params" :{
        "username": "myUsername",
        "password": "myPassword"
    }
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/keystore
```

:::

:::caution Yanıt

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "şifre çok zayıf",
    "data": null
  },
  "id": 1
}
```

:::

Gördüğünüz gibi, verdiğiniz şifre kabul edilmek için yeterince güvenli değildir. Kullanıcı hesabınızın güvenliğini sağlamak için daha güçlü bir şifre vermeniz önemlidir. Güçlü bir şifre genellikle büyük ve küçük harflerin, sayılar ve özel karakterlerin bir kombinasyonunu içerir ve en az 8 karakter uzunluğunda olmalıdır.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"keystore.createUser",
    "params" :{
        "username": "myUsername",
        "password": "ZMHiL8mTGJHu"
    }
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/keystore
```

- Lütfen burada gördüğünüz şifreyi kullanmayın. :)

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {},
  "id": 1
}
```

- Şu anda başarılı bir yanıt aldığınız için şifrenizi güvenli ve emniyetli bir yerde saklamak önemlidir. Şifrenizi korumak için şifreleme sağlayan bir şifre yöneticisi kullanmanızı şiddetle öneririz.

:::

## Keystore Hakkında Bilgi

:::tip KEYSTORE NEDİR

Her düğümün entegre bir keystore'u vardır. İstemciler, düğümün API yöntemleriyle etkileşimde bulunurken kimlikler olarak görev yapan kullanıcılar oluşturabilirler. Bu etkileşimler, blok zinciri ve özelliklerine erişim sağlar.

:::

:::caution KEYSTORE DÜĞÜMÜNÜZE ÖZELDİR

Bir keystore, düğüm seviyesinde var olduğu için, bir düğüm üzerinde kullanıcı oluşturduğunuzda bu, **yalnızca** o özel düğümde var olacaktır. Ancak, API kullanarak kullanıcıları içe ve dışa aktarmak mümkündür, bu da onların birden fazla düğümde kullanılmasına olanak tanır.

:::

:::danger GÜVENLİK - BU ÇOK ÖNEMLİ

_**Düğümünüze ait bir keystore kullanıcısı oluşturduğunuzda, yalnızca kendi kontrolünüzde olan bir düğümde oluşturmanız önemlidir çünkü düğüm operatörü, düz metin şifrelerinize ve özel anahtarlarınıza erişim sağlayacaktır. Bu nedenle, keystore kullanıcısını oluşturduğunuz düğümün operatörüne güvenmek önemlidir.**_

:::

## Cüzdan ve Düğüm Özel Anahtarlarını İçe Aktarma

Cüzdan ve düğüm sahipliğinizi kanıtlamak için, özel anahtarlarınızı düğümdeki keystore'a eklemeniz gerekecektir. Bu süreç, bir özel anahtarın içe aktarılması olarak da adlandırılır ve oluşturduğunuz keystore kullanıcısını düğümün API yöntemleriyle etkileşimde bulunmak ve blok zincirine erişim sağlamak için kullanmanıza olanak tanır.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.importKey",
    "params" :{
        "username": "myUsername",
        "password": "ZMHiL8mTGJHu",
        "privateKey":"PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
    }
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/keystore
```

Cüzdan adresinizle ilişkili özel anahtarı `privateKey` alanına girin.

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "address": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"
  },
  "id": 1
}
```

Bu başarılı bir yanıt olmuştur. Yanıt alanının, sağladığınız özel anahtarın kontrol ettiği bir `address` içerdiğini belirtmek önemlidir. Bu, özel anahtarın doğru olduğunu ve cüzdan adresinizle eşleştiğini doğrulamada kullanılır. Bu, doğru özel anahtarı içe aktardığınızı ve cüzdanın sahipliğini başarıyla kanıtladığınızı garanti etmeye yardımcı olur.

:::

:::note ADRESLER HAKKINDA BİLGİ

Burada gördüğünüz adresler, kullandığınız ağa bağlı olarak aşağıdaki dizelerden biri ile başlamaktadır:

- **ana ağ**: `P-camino`
- **test ağı**: `P-columbus`
- **geliştirici ağı**: `P-kopernikus`

:::

Artık cüzdanınızın özel anahtarını içe aktardığınıza göre, düğümünüzün özel anahtarını da içe aktarmanız gerekecektir. Bu, düğümünüzün sahipliğini kanıtlamanıza olanak tanır.

Lütfen cüzdan özel anahtarınızı içe aktardığınız adımlarla aynı adımı takip edin, ancak bu sefer **düğümünüzün özel anahtarını** kullanarak.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.importKey",
    "params" :{
        "username": "myUsername",
        "password": "ZMHiL8mTGJHu",
        "privateKey":"PrivateKey-2ZW6HUePBW2dP7dBGa5stjXe1uvK9LwEgrjebDwXEyL5bDMWWS"
    }
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/keystore
```

Düğümünüzün özel anahtarını `privateKey` alanına girin.

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "address": "P-kopernikus1swcam4a3vmd7vvzuytldtavsv4f9cnj3lynmrf"
  },
  "id": 1
}
```

Dikkat edin ki, cüzdanınızın özel anahtarını içe aktardığınızda olduğu gibi yanıt alanında yine bir `address` bulunmaktadır. Camino'da, düğümlerin de fonları göndermek ve almak için kullanılabilecek adresleri vardır. Kullanıcılar, bu adresleri kontrol etmek için (düğümün) özel anahtarlarını da kullanabilirler.

:::

## Düğümünüzü Kaydedin

Düğümünüzün özel anahtarını içe aktardıktan sonra, düğümünüzü cüzdanınızla kaydetmeniz gerekecektir. Bu, düğümünüz ile cüzdan arasındaki bağlantıyı oluşturacak ve `platform.addValidator` gibi bu özelliği gerektiren işlevlerle etkileşimde bulunmanıza olanak tanıyacaktır.

Düğümünüzü kaydetmek için uygun API yöntemini kullanmanız ve gerekli bilgileri sağlamanız gerekecektir:

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.registerNode",
    "params": {
        "oldNodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "newNodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "consortiumMemberAddress": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
        "username": "myUsername",
        "password": "ZMHiL8mTGJHu"
    },
    "id": 1
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/bc/P
```

- **oldNodeID**: Bu alanda mevcut düğümünüzün kimliğini (varsa) girin. Bu alan ayrıca gelecekte kayıtlı düğümünüzü değiştirmek için de kullanılabilir.
- **newNodeID**: Buraya yeni düğüm kimliğinizi girin.
- **consortiumMemberAddress**: Önceki adımda özel anahtarınızı içe aktardığınız cüzdan adresini bu alana girin. Bu, cüzdanınızı düğümünüzle bağlayacaktır.

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "dkcfLECeCiEDwidaWeXBkfB3ea6bYupcrReqbDg3cKrHy3MC1",
    "changeAddr": "P-kopernikus1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv3qzan"
  },
  "id": 1
}
```

Bu kayıt sürecinin yanıtında iki alan bulacaksınız:

**txID**: Bu, düğümü kaydedecek olan gönderilen işlemdir. Bu kimliği kullanarak işlemin durumunu  üzerinden kontrol edebilirsiniz.
**changeAddr**, işlemin tamamlanmasının ardından harcanmamış tokenlerin iade edileceği adresdir. Bu durumda önemli değildir.

:::

:::note DÜĞÜM KAYDI HAKKINDA DAHA FAZLA BİLGİ

Düğüm kaydı, düğümünüzü sağladığınız cüzdan adresi ile ilişkilendirir. Bu, Camino'nun cüzdan adreslerini, **çok imzalı cüzdanlar** dahil olmak üzere, düğümle ilgili işlemler için kullanmasına olanak tanır; örneğin, düğümü doğrulayıcı olarak eklemek gibi. Cüzdan yapınız çok imzalı bir cüzdan ise, bununla bağlantılı tüm özel anahtarları içe aktarmanız gerekir.

Bu şekilde, düğümün imzasını gerektiren tüm işlemler, aynı zamanda bağlantılı cüzdanın imzasını da gerektirecektir. Bu, bir çok imzalı yapı oluşturarak, bir işlemin gerçekleştirilmesinden önce birden fazla tarafın bu işlemi onayladığını temin eder.

Örneğin, bir oylama işlemi mevcutsa, oy vermek için bağlı cüzdandan da imzalar alınması gerekecektir. Bu, hem düğümün hem de cüzdan sahibi onaylanmadan işlemin blok zincirinde gerçekleştirilmesini sağlar.

:::


## Düğümünüzü Validatör Haline Getirin

Artık düğümün kaydını yaptırıp cüzdanınızla bağladığınıza göre, düğümünüzü bir validatör haline getirmeye hazırsınız.

:::info İstek

```sh
curl -s -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.addValidator",
    "params": {
        "nodeID":"NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "from": ["P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"],
        "rewardAddress": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
        "startTime":'$(date --date="10 minutes" +%s)',
        "endTime":'$(date --date="2 days" +%s)',
        "stakeAmount":2000000000000,
        "delegationFeeRate":10,
        "username": "myUsername",
        "password": "ZMHiL8mTGJHu"
    },
    "id": 1
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/bc/P
```

- **nodeID**: Düğümünüzün kimliğini buraya girin.

- **from**: Cüzdan adresiniz. 
  Bu alan bir liste olduğu için, tek bir adres girseniz bile köşeli parantezler içinde belirtmeniz gerekir.

- **rewardAddress**: Validatör tarafından kazanılan ödüllerin gönderileceği adres.

- **startTime**: Düğümün doğrulama dönemi için başlangıç zamanı. 
  Bu **Unix Zamanı** formatındaki bir değerdir; bu değer `1970-01-01 00:00:00 UTC` tarihinden itibaren geçen saniye sayısı olarak temsil edilir. 
  Bu değeri almak için `date` komutunu kullanabilirsiniz. Bu örnekte, `startTime` için _10 dakika geleceği_ kullandık. 
  Bunu istediğiniz gibi değiştirebilirsiniz, ancak en az _20 saniye_ geleceğe ayarlanmış olması gerektiğine dikkat edin. 
  (Not: Eğer bir Mac kullanıyorsanız `date` komutunu `gdate` ile değiştirin. `gdate` kurulu değilse `brew install coreutils` komutunu çalıştırın.)

- **endTime**: Doğrulama dönemi sona erme zamanı. Bu, `startTime` ile aynı formattadır. Bu örnekte _2 gün_ gelecekte olarak kullandık. 
  Camino ana ağında minimum `endTime` **2 hafta** ve maksimum **365 gün** olmalıdır.

- **stakeAmount**: Bu, staking yapılacak sabit token miktarıdır. Camino ana ağında `camino` ve testnet `columbus` için bu miktar `100000000000000` nCAMs (100,000 CAMs)dir. (Geliştirici ağı `kopernikus` için bu miktar 2000 CAMs'tir.)
  
- **delegationFeeRate**: Bu, diğerlerinin stake'lerini bu validatöre devrettiğinde geçerli olan yüzde ücretidir.
  En fazla 4 ondalık hanelere izin verilir, fazladan ondalık haneler göz ardı edilir. 0 ile 100 arasında olmalıdır, dahil.
  Örneğin, eğer `delegationFeeRate` değeriniz `1.2345` ise ve birisi bu validatöre devrederse, delegasyon dönemi sona erdiğinde `1.2345%` ödül validatöre ve geri kalan kısım delegatöre gider.

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "2m47Hp59WiqeYGvWcjgkB5a2Gz4PNJCyQZbuMQTCjJ6xVV85oo",
    "changeAddr": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"
  },
  "id": 1
}
```

Bu yanıt, `addValidator` isteğiniz için işlem ID'sini gösterir. Bu ID'yi kullanarak işlemin durumunu blockchain keşif aracı üzerinde kontrol edebilirsiniz; örneğin,  kullanabilirsiniz.

İşlem onaylandığında, düğümünüz validatör olarak kaydedilecek ve konsensüs sürecine katılıp ödül kazanabileceksiniz.

:::

## Validatörünüzü Doğrulayın

Artık işlemi doğru bir şekilde tamamlayıp tamamlamadığınızı kontrol etmek için blockchain'i sorgulayabilir ve düğümünüzün durumunu kontrol edebilirsiniz.

:::info İSTEK

```sh
curl -s -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getCurrentValidators",
    "params": {
        "subnetID":null,
        "nodeIDs":["NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"]
    },
    "id": 1
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/bc/P
```

- **nodeIDs**: Bu alana düğümünüzün kimliğini girin. 
  Alternatif olarak, bu alanı boş bırakabilir ve `"nodeIDs":[]` girebilirsiniz. Bu durumda, şu anda kayıtlı olan tüm validatörler için bilgi döndürülecektir.

:::

:::info Yanıt

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": [
      {
        "txID": "2m47Hp59WiqeYGvWcjgkB5a2Gz4PNJCyQZbuMQTCjJ6xVV85oo",
        "startTime": "1672836683",
        "endTime": "1678009764",
        "stakeAmount": "2000000000000",
        "nodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "rewardOwner": {
          "locktime": "0",
          "threshold": "1",
          "addresses": ["P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"]
        },
        "validationRewardOwner": {
          "locktime": "0",
          "threshold": "1",
          "addresses": ["P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"]
        },
        "delegationRewardOwner": {
          "locktime": "0",
          "threshold": "1",
          "addresses": ["P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"]
        },
        "potentialReward": "0",
        "delegationFee": "0.0000",
        "uptime": "1.0000",
        "connected": true,
        "delegators": null
      }
    ]
  },
  "id": 1
}
```

Burada, düğümünüzün artık bir **validatör** olduğunu görebilirsiniz! Tebrikler!

Bu isteğin belirli bir süre geçtikten sonra yapılması gerektiğini unutmayın; bu, kayıt sürecinde belirtilen `startTime`'ın ulaşabileceği bir zaman aralığında olmasını sağlar. Bu, düğümün bir validatör olarak etkinleştiğinden emin olmak için gereklidir.

:::

### Boş Yanıt Alırsanız

:::caution BOŞ YANIT

Eğer böyle bir boş yanıt alırsanız:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": []
  },
  "id": 1
}
```

Belirttiğiniz `startTime` kayıt sürecinde ulaşılamamış olabilir. **Lütfen sonraki adıma bakın; burada beklemede olan validatörleri sorgulayabilirsiniz.**

Ayrıca, düğüm henüz bir validatör olmamış, sağladığınız düğüm kimliği yanlış veya sağladığınız düğüm kimliği validatör olarak kayıtlı olmamış olabilir.

Düğüm kimliğini ve diğer ayrıntıları, kayıt sırasında sağlanan bilgilerle karşılaştırmak faydalı olabilir. İşlemin durumunu kontrol edin ve kayıt sürecinin doğru bilgilerle başarılı bir şekilde tamamlandığından emin olun.

:::

### Bekleyen Validatörleri Kontrol Edin

:::info BEKLEYEN VALIDATÖRLER İSTEĞİ

Ayrıca, düğümünüzün validatör olarak etkinleşebilmesi için `startTime`'ın geçmesini bekleyip beklemediğini kontrol etmek amacıyla bekleyen validatörleri kontrol edebilirsiniz.

```sh
curl -s -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getPendingValidators",
    "params": {
        "subnetID": null,
        "nodeIDs": []
    },
    "id": 1
}' -H 'content-type:application/json;' http://127.0.0.1:9650/ext/bc/P
```

:::

:::info YANIT

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": [
      {
        "txID": "2m47Hp59WiqeYGvWcjgkB5a2Gz4PNJCyQZbuMQTCjJ6xVV85oo",
        "startTime": "1672836683",
        "endTime": "1678009764",
        "stakeAmount": "2000000000000",
        "nodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "delegationFee": "0.0000",
        "connected": true,
        "delegators": null
      }
    ],
    "delegators": []
  },
  "id": 1
}
```

Burada, düğümünüzün hala bekleyen validatörler arasında listelendiğini görebilirsiniz. `startTime`'ın geçmesini bekliyor.

`startTime`'ın geçmesini beklemek ve ardından **** yöntemini kullanarak düğümünüzün validatör olarak etkinleşip etkinleşmediğini kontrol etmek önerilir.

:::

:::caution BEKLEYEN VALIDATÖRLER

Bekleyen validatörler, kayıt sürecini tamamlamış ancak kayıt sırasında belirtilen `startTime`'ın henüz ulaşmadığı durumları belirtmektedir. `startTime`'a ulaşıldığında, düğüm blockchain üzerinde validatör olarak etkinleşecektir.

:::

## Daha Fazla Yardım Almak

Validatörlerle ilgili daha fazla sorunuz varsa, web sitemizdeki  bölümüne başvurabilirsiniz veya  sunucumuzu ziyaret edebilirsiniz. 
Her zaman yardımcı olmaktan mutluluk duyuyoruz.

Herhangi bir ek yardıma ihtiyacınız olursa, lütfen bizimle iletişime geçmekten çekinmeyin.