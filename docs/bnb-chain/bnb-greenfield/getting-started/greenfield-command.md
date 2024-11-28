---
title: Greenfield Komutu - BNB Greenfield
description: Greenfield komut satırı aracını nasıl kullanacağınıza dair yönergeler. Bu kılavuz, depolama işlemlerini yönetmek için gerekli olan tüm temel komutları ve pratik ipuçlarını içermektedir.
keywords: [Greenfield, komut satırı, BNB, depolama, komutlar, işlemler]
---

# Greenfield Komutu

[Greenfield Komutu](https://github.com/bnb-chain/greenfield-cmd), Greenfield üzerindeki kaynaklarınızı yönetmek ve Greenfield ile etkileşimde bulunmak için güçlü bir komut satırıdır.

## Komut Aracı Kılavuzu

Bu komut aracı, bucket oluşturma, dosya yükleme ve indirme, kaynak silme gibi temel depolama işlevlerini destekler. Ayrıca gruplar, politikalar, bankalar, hesaplar vb. gibi ilgili işlemleri de destekler. Komutların daha anlaşılır görünmesini sağlamak için farklı kategorilerdeki komutlar, farklı kategorilerin alt komutları olarak uygulanmıştır. Desteklenen komut kategorilerini görüntülemek için:

```shell
gnfd-cmd -h
```

komutunu kullanabilirsiniz.

Komut aracı, yapılandırma dosyasının ve anahtar deposunun yolunu belirtmek için "--home" seçeneğini destekler. Varsayılan yol, sistemin ana dizini altında ".gnfd-cmd" adlı bir klasördür. Greenfield ile etkileşimde bulunan komutlar çalıştırılırken, yol altında `config/config.toml` dosyası yoksa ve komutlar "--config" bayrağı olmadan çalıştırılıyorsa, araç otomatik olarak, yol altındaki testnet yapılandırması ile tutarlı bir `config/config.toml` dosyası oluşturacaktır.

:::tip
Kullanıcıların yapılandırma dosyalarını ve anahtar deposu yollarını düzgün bir şekilde ayarlamaları önemlidir. Aksi takdirde, beklenmedik hatalarla karşılaşabilirler.
:::

Aşağıda Testnet ve Mainnet için config dosyasının örnekleri bulunmaktadır. `rpcAddr` ve `chainId` Greenfield ağı ile tutarlı olmalıdır. Greenfield Mainnet için `Greenfield Mainnet RPC Uç Noktaları` sayfasına başvurabilirsiniz. 

Komut, isteğe yanıt vermek için doğru depolama sağlayıcısını akıllıca seçme yeteneğine sahiptir. Kullanıcı, belirli bir SP üzerinde bir bucket oluşturmak istiyorsa yalnızca depolama sağlayıcısı `operator-address`'ini ayarlamalıdır. Örneğin, kullanıcı:

```shell
gnfd-cmd storage put test gnfd://bucket1/object1
```

komutunu çalıştırarak `bucket1`'e bir dosya yükleyebilir ve ardından:

```shell
gnfd-cmd storage put test gnfd://bucket2/object
```

komutunu çalıştırarak başka bir SP'de depolanan `bucket2`'ye bir dosya yükleyebilir; bu da yapılandırmayı değiştirmeden yapılır.

## Temel İşlemler

### Hesap İşlemleri

Komut aracının zengin özelliklerini kullanmadan önce, "account import" veya "account new" komutu ile hesap bilgilerini başlatmalı ve anahtar deposu oluşturmalısınız. Diğer tüm komutların çalıştırılmadan önce anahtar deposu içeriğini yüklemesi gerekir.

"import" komutu, özel anahtar dosyasından hesap bilgilerini içe aktarır ve aşağıdaki dört adımı takip ederek bir anahtar deposu oluşturur:

1. MetaMask'tan özel anahtarınızı dışa aktarın ve bunu yerel bir dosyaya açık metin olarak yazın (MetaMask'ın açılır menüsünden "Hesap Detayları" seçeneğini seçebilirsiniz. Sayfanın altındaki "Özel Anahtarı Dışa Aktar" düğmesine tıklayın.)
2. "account import [keyfile]" komutu ile bir anahtar deposu oluşturun. Kullanıcıların 1. adımda oluşturulan özel anahtar dosyası yolunu belirtmeleri gerekir.
   
   ```shell
   // anahtarı içe aktar ve bir anahtar deposu dosyası oluştur 
   gnfd-cmd account import key.txt
   ```

3. Terminal, kullanıcıdan şifre bilgilerini girmesini istemek için bir istirham yapacaktır. Kullanıcılar ayrıca "--passwordfile" kullanarak şifre dosyası yolunu belirtebilir. Kullanıcılar, şifre bilgilerini yönetmekten sorumludur.

Anahtar deposu, sistemin ana dizini altındaki "keystore/keyfile" yolunda veya "--home" ile belirlenen dizin altında oluşturulacaktır. Ve diğer komutları çalıştırırken anahtar deposunu yüklemek için bu yol da kullanılır.

4. Adım 1'de oluşturulan özel anahtar dosyasını silin. Anahtar deposu oluşturulduktan sonra bu dosyaya ihtiyaç yoktur.

Kullanıcıların içe aktaracak özel anahtarı yoksa, "account new" komutunu kullanarak yeni bir Greenfield hesabı ve anahtar deposu oluşturabilirler. Hesap oluşturduktan sonra, kullanıcı diğer komutları kullanmadan önce bu hesabın adresine token transfer etmelidir.

```shell
// yeni hesap oluştur ve anahtar deposunu oluştur key.json
gnfd-cmd account account new
```

Kullanıcılar, "account export" komutunu kullanarak hesap ve anahtar deposu bilgilerini alabilirler; bu komut özel anahtar bilgilerini yazdırır ve "account ls" komutu hesap bilgilerini görüntüler.

```shell
// hesap bilgilerini ve anahtar deposu yolunu listele
gnfd-cmd account ls

// şifrelenmiş anahtar deposunu veya özel anahtarı görüntüle
gnfd-cmd account export --unarmoredHex --unsafe
```

Kullanıcılar, "account import" veya "account new" komutunu kullanarak birden fazla hesap oluşturabilirler. Hangi hesabın diğer komutların çalıştırılmasında varsayılan olarak kullanılacağını belirtmek için "set-default" komutunu kullanabilirsiniz. Varsayılan hesap kullanılarak komutlar çalıştırıldığında, anahtar deposunu belirtmeye gerek kalmaz.

```shell
// varsayılan hesabı ayarla.
gnfd-cmd account set-default [address]
```

### SP İşlemleri

Bir bucket oluşturup dosya yüklemeden önce, dosyaları bucket içinde saklayacak bir depolama sağlayıcısını seçmemiz gerekir. Aşağıdaki komutu çalıştırarak Greenfield üzerindeki depolama sağlayıcılarının bir listesini alabiliriz.

```shell
$ gnfd-cmd sp ls
name     operator address                           endpoint                               status
bnbchain 0x231099e40E1f98879C4126ef35D82FF006F24fF2 https://greenfield-sp.bnbchain.org:443 IN_SERVICE
defibit  0x05b1d420DcAd3aB51EDDE809D90E6e47B8dC9880 https://greenfield-sp.defibit.io:443   IN_SERVICE
ninicoin 0x2901FDdEF924f077Ec6811A4a6a1CB0F13858e8f https://greenfield-sp.ninicoin.io:443  IN_SERVICE
nariox   0x88051F12AEaEC7d50058Fc20b275b388e15e2580 https://greenfield-sp.nariox.org:443   IN_SERVICE
lumibot  0x3131865C8B61Bcb045ed756FBe50862fc23aB873 https://greenfield-sp.lumibot.org:443  IN_SERVICE
voltbot  0x6651ED78A4058d8A93CA4979b7AD516D1C9010ac https://greenfield-sp.voltbot.io:443   IN_SERVICE
nodereal 0x03c0799AD70d19e723359E036a83E8f44f4B8Ba7 https://greenfield-sp.nodereal.io:443  IN_SERVICE
```

Kullanıcılar belirli bir SP hakkında ayrıntılı bilgi almak için "sp head" ve "sp get-price" komutlarını kullanabilir. Endpoint'i [https://greenfield-sp.nodereal.io:443](https://greenfield-sp.nodereal.io:443) olan bir SP hakkında bilgi almak için bir örnek.

```shell
// depolama sağlayıcısı bilgilerini al
$ gnfd-cmd sp head  https://greenfield-sp.nodereal.io:443

// depolama sağlayıcısının kota ve depolama fiyatı bilgilerini al:
$ gnfd-cmd sp get-price https://greenfield-sp.nodereal.io:443
get bucket read quota price: 0.1469890427  wei/byte
get bucket storage price: 0.02183945725  wei/byte
get bucket free quota: 1073741824
```

Yüklemek istediğiniz depolama sağlayıcısının `operator-address` bilgilerini not edebilirsiniz. Bu parametre, bir sonraki adımda bucket oluşturmak için gerekecektir.

### Bucket İşlemi

Bucket işlemleri yardımı almak için:

```shell
./gnfd-cmd bucket -h
```

komutunu çalıştırabilirsiniz.

Aşağıdaki komut, `testbucket` adlı yeni bir bucket oluşturmak için kullanılabilir:

```shell
gnfd-cmd bucket create gnfd://testbucket
```

Bu komut, bir bucket oluşturmak istediğiniz depolama sağlayıcısını seçmek için "-primarySP" bayrağını destekler. Bayrağın içeriği, depolama sağlayıcısının `operator` adresi olmalıdır. Bu değer ayarlanmazsa, varsayılan olarak depolama sağlayıcıları listesindeki ilk SP yükleme hedefi olarak seçilecektir.

Kullanıcı, "bucket update" komutu ile bucket meta verilerini güncelleyebilir. Bucket görünürlüğünü, ücretli kotayı veya ödeme adresini güncellemeyi destekler.

```shell
// bucket ücretli kotalarını güncelle 
gnfd-cmd bucket update --chargedQuota 50000 gnfd://testbucket
// bucket görünürlüğünü güncelle
gnfd-cmd bucket update --visibility=public-read gnfd://testbucket
```

Kullanıcı, "bucket ls" komutları ile kendisine ait bucket'ları listeleyebilir.

```shell
gnfd-cmd bucket ls
```

### Dosya Yükleme/İndirme

(1) Nesne Yükleme

Kullanıcı, "object put" komutu ile yerel dosyayı bucket'a yükleyebilir. Aşağıdaki komut örneği, `testobject` adlı bir nesneyi `testbucket` bucket'ına yükler. Yükleme için dosya yükü, 'file-path' ile gösterilen yerel dosyadan okunur.

```shell
gnfd-cmd object put --contentType "text/xml" file-path gnfd://testbucket/testobject
```

Eğer nesne ismi ayarlanmışsa, komut dosya adını nesne adı olarak kullanacaktır. Komut çalıştırıldıktan sonra, nesneyi oluşturmak için bir işlem gönderir ve nesnenin yük içeriğini depolama sağlayıcısına yükler. Komut, nesne sızdırma işlemi tamamlandığında dönecektir. Kullanıcılar sızdırma sürecini kesmeyi de seçebilir; bu da nesnenin son tamamlanmasını etkilemez. Yükleme süresi boyunca terminal, yükleme ilerlemesini ve yükleme hızını yazdırır.

(2) Nesne İndirme

Kullanıcı, "object get" komutu ile nesneyi yerel dosyaya indirebilir. Aşağıdaki komut örneği `testobject` nesnesini `testbucket` üzerinden yerel `file-path` indirir ve indirilen dosyanın uzunluğunu yazdırır. Dosya yolu, belirli bir dosya yolu, bir dizin yolu veya hiç ayarlanmayabilir. Eğer dosya yolu belirlenmemişse, komut mevcut dizinde nesne adıyla aynı isimli bir dosyaya içerik indirilecektir.

```shell
gnfd-cmd object get gnfd://testbucket/testobject file-path
```

Komut çalıştırıldıktan sonra, depolama sağlayıcısına bir indirme isteği gönderir ve nesneyi indirir. Terminal, indirme ilerlemesini ve hızını yazdırır.

(3) Nesne Listeleme ve Nesne Silme

Kullanıcı, "object ls" komutu ile belirli bir bucket'ın nesnelerini listeleyebilir.

```shell
gnfd-cmd object ls gnfd://testbucket
```

Kullanıcı, "object delete" komutu ile nesneyi silebilir.

```shell
gnfd-cmd object delete gnfd://testbucket/testobject 
```

### Grup İşlemi

Kullanıcılar, grup işlemleri için yardım almak üzere:

```shell
./gnfd-cmd group -h
```

komutunu çalıştırabilirler.

Kullanıcı, "group create" komutu ile yeni bir grup oluşturabilir. Bu komut, `--initMembers` parametresi aracılığıyla başlangıç grup üyesini ayarlayabilir. Komut başarılı bir şekilde çalıştıktan sonra grup ID ve işlem hash bilgisi dönecektir.

Bir gruba üye eklemek veya çıkarmak için "group update" komutunu kullanabilirsiniz. Kullanıcılar, `addMembers` ile eklenmek istenen üyelerin adreslerini belirtebilir veya `removeMembers` ile çıkarılmak istenen üyelerin adreslerini belirtebilir.

```shell
// grup oluştur
gnfd-cmd group create gnfd://testGroup
// üye güncelle
gnfd-cmd group update --groupOwner 0x.. --addMembers 0x.. gnfd://testGroup
```

### Politika İşlemi

Kullanıcılar, izin işlemleri için yardım almak üzere:

```shell
./gnfd-cmd policy -h
```

komutunu çalıştırabilir.

Kullanıcılar, "policy put [RESOURCE-URL]" komutunu kullanarak diğer hesaplara veya gruplara (yani prensiplere) kaynak izinleri atayabilirler; örneğin, nesneleri silme izni. Komut başarılı bir şekilde çalıştıktan sonra, prensibin nesne politika bilgisi dönecektir. Prensip, grubu belirten `--groupId` veya hesabı belirten `--grantee` ile ayarlanır.

Kaynak URL'si aşağıdaki türlerde olabilir:

1) "**grn:**b::bucket-name", bu bucket politikasını ifade eder.

2) "**grn:**o::bucket-name/object-name", bu nesne politikasını ifade eder.

3) "**grn:**g:owner-address:group-name", bu grup politikasını ifade eder.

```shell
// nesne politikasını koy 
gnfd-cmd policy put --groupId 11 --actions get,delete grn:o::gnfd-bucket/gnfd-object

// bucket politikasını koy
gnfd-cmd policy put --grantee 0x.. --actions delete  grn:b::gnfd-bucket
```

Kullanıcılar aynı zamanda "policy delete" komutu ile izni geri alabilirler.

```shell
// bir gruptan bucket politikasını sil
gnfd-cmd policy delete --groupId 11  grn:b::gnfd-bucket

// bir granteeden nesne politikasını sil
gnfd-cmd policy delete --grantee 0..  grn:o::gnfd-bucket/gnfd-object
```

Kullanıcılar "policy ls" komutunu kullanarak granteenin veya grup-id'nin politikasını listeleyebilirler.

```shell
// bir grubun politika bilgilerini listele
gnfd-cmd policy ls --groupId 11  grn:o::gnfd-bucket/gnfd-object
```

Yukarıda belirtilen temel komutların yanı sıra, Greenfield Komutu token transferi ve ödeme hesabı işlemleri gibi işlevleri de desteklemektedir. Daha fazla örnek için [Greenfield Komutu](https://github.com/bnb-chain/greenfield-cmd) readme dosyasına göz atabilirsiniz.