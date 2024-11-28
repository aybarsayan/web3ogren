---
title: CLI ile Erişim Kontrol Yönetimi - BNB Greenfield Erişim Kontrolü
description: CLI üzerinden BNB Greenfield erişim kontrol yönetimi hakkında bilgi edinin. Bu kılavuz, kullanıcıların dosyalara erişimini yönetmelerine yardımcı olacak adımları ve örnekleri içerir.
keywords: [CLI, erişim kontrol, BNB Greenfield, grup yönetimi, politika yönetimi]
---

# CLI ile Erişim Kontrol Yönetimi
## Arka Plan

Geçtiğimiz eğitimde, ortamınızı kurma, gerekli araçları yükleme ve dosyalarınızı BNB Greenfield'a etkin bir şekilde yedekleme sürecinde size rehberlik ettik; merkeziyetsiz depolamanın avantajlarını kullanarak veri güvenliği ve sahipliğini sağladık.

Greenfield'ın ileri düzey kavramlarına daha derinlemesine dalmak için, CLI aracıyla nesne erişim kontrolünü nasıl yöneteceğimizi, gruplarınızı ve politikalarınızı nasıl yöneteceğimizi ele alacağız.

## Ortamı Doğrulama

`gnfd-cmd` yüklemesini tamamladığınızdan ve hesaplarınızı kurduğunuzdan emin olmak için lütfen `bu belgeye` bakın.

## Bucket Bilgisi Sorgulama
Bucket'i sorgulamak için şu komutu çalıştırın:

```shell
./gnfd-cmd bucket head gnfd://website-bucket
```

Aşağıdaki gibisini görmelisiniz:

```shell
latest bucket info:
owner:"0x525482AB3922230e4D73079890dC905dCc3D37cd"
bucket_name:"website-bucket"
visibility:VISIBILITY_TYPE_PRIVATE
id:"3101"
create_at:2023-10-31 01:17:15
payment_address:"0x525482AB3922230e4D73079890dC905dCc3D37cd"
global_virtual_group_family_id:40
```

## Grup ile Erişim Kontrol Yönetimi İş Akışı

Kullanıcıların dosyalarınıza nasıl erişebileceğini yönetmek için şu süreci izlemeniz gerekmektedir:
1. Yönetici rolüne sahip `Principle Address` belirleyin.
2. Grup üyelerini özelleştirin.
3. Durumlara bağlı olarak özelleştirilmiş erişim politikası belirleyin.
4. Politikayı gruba bağlayın/bağlayın.

### Grup İşlemleri

Grup komutları, grup oluşturmak, grup üyelerini güncellemek, grup silmek ve grup bilgisi sorgulamak için kullanılır.

:::tip
Grup oluşturma sürecinizin sorunsuz ilerlemesi için her adımı dikkatlice takip edin.
:::

Bir grup oluşturmak için istenen grup adı ile aşağıdaki `create group` komutunu çağırmanız gerekir.

```shell
// create group
gnfd-cmd group create gnfd://website-group
```

Bu işlem, ilişkili meta veriyi yazmak için BNB Greenfield blok zincirine bir işlem gönderecektir. Sonuç aşağıdakine benzer görünmelidir:
```shell
make_group: gnfd://website-group
transaction hash: A1FD3A0E2A337716C344392B840DCC8E804553AF42504FBD6F4C46B9C5B8FAF9
group id: 712
```

Gördüğünüz gibi, sonuç bir işlem hash değeri döndürüyor; bu değeri blok tarayıcısı kullanarak inceleyebilirsiniz, örneğin [https://greenfieldscan.com](https://greenfieldscan.com/). [https://testnet.greenfieldscan.com/tx/A1FD3A0E2A337716C344392B840DCC8E804553AF42504FBD6F4C46B9C5B8FAF9](https://testnet.greenfieldscan.com/tx/A1FD3A0E2A337716C344392B840DCC8E804553AF42504FBD6F4C46B9C5B8FAF9) adresine giderek işlemle ilgili tüm ayrıntıları görebilirsiniz.

Gruba yeni bir üye eklemek için:
```shell
// update group member
gnfd-cmd group update --addMembers 0x843e77D639b6C382e91ef489881963209cB238E5 gnfd://website-group
```

Yeni üyenin gerçekten grubun bir parçası olduğunu doğrulamak için:
```shell
// head group member
gnfd-cmd group head-member  0x843e77D639b6C382e91ef489881963209cB238E5 website-group
```

Sonuç aşağıdakine benzer görünmelidir:
```shell
the user 0x843e77D639b6C382e91ef489881963209cB238E5 is a member of the group: gnfd://website-group
```

### Politika İşlemleri
`gnfd-cmd policy` komutu, kaynak politikalarını (nesneler, bucket'lar ve gruplar dahil) anahtar için destekler.

Anahtar, bir Greenfield hesabını gösteren `--grantee` ile veya grup kimliğini gösteren `--groupId` ile belirlenmelidir.

:::info
Nesne politika eylemi "oluştur", "sil", "kopyala", "al", "çalıştır", "listele" veya "hepsi" olabilir.
:::

Bucket politika eylemleri "güncelle", "sil", "oluştur", "listele", "güncelle", "getObj", "createObj" vb. olabilir. Grup politika eylemleri "güncelle", "sil" veya hepsi olabilir, güncelleme "update-group-member" eylemini ifade eder.

Bu örnekte, anahtar `delete bucket`, `update bucket` erişimini bu gruba vermektedir.
```shell
// grant bucket operation permissions to a group
gnfd-cmd policy put --groupId 712 --actions delete,update,createObj,getObj grn:b::website-bucket
```

Sonuç aşağıdakine benzer görünmelidir:
```shell
put policy of the bucket:website-bucket succ, txn hash: 63735FBF6BDFF95AEED9B8BC8D794474431C77E7EBF768BFAA9E3F7CFB25FF97
latest bucket policy info:
 id:"2316" principal:<type:PRINCIPAL_TYPE_GNFD_GROUP value:"172" > resource_type:RESOURCE_TYPE_BUCKET resource_id:"3101" statements:<effect:EFFECT_ALLOW actions:ACTION_DELETE_BUCKET actions:ACTION_UPDATE_BUCKET_INFO actions:ACTION_CREATE_OBJECT >
```
Gördüğünüz gibi, sonuç bir işlem hash değeri döndürüyor; bu değeri blok tarayıcısı kullanarak inceleyebilirsiniz, örneğin [https://greenfieldscan.com](https://greenfieldscan.com/). [https://testnet.greenfieldscan.com/tx/63735FBF6BDFF95AEED9B8BC8D794474431C77E7EBF768BFAA9E3F7CFB25FF97](https://testnet.greenfieldscan.com/tx/63735FBF6BDFF95AEED9B8BC8D794474431C77E7EBF768BFAA9E3F7CFB25FF97) adresine giderek `put policy` işlemi ile ilgili tüm ayrıntıları görebilirsiniz.

Anahtar hesabıyla özel bir dosya yüklemek:

```shell
gnfd-cmd object put --contentType "text/xml" --visibility private ./website/index.html gnfd://website-bucket/index.html
```

Bu örnekte, anahtar `delete object`, `update object` erişimini bu gruba vermektedir.
```shell
// grant object operation permissions to a group
gnfd-cmd policy put --groupId 712 --actions get,delete grn:o::website-bucket/index.html
```

Sonuç aşağıdakine benzer görünmelidir:
```shell
put policy of the object:index.html succ, txn hash: BD2E3F74B2FBD18300B2C313E8F0393426C851EC3A9153F37DFD6CDC10F92FF8
latest object policy info:
 id:"2318" principal:<type:PRINCIPAL_TYPE_GNFD_GROUP value:"712" > resource_type:RESOURCE_TYPE_OBJECT resource_id:"187293" statements:<effect:EFFECT_ALLOW actions:ACTION_GET_OBJECT actions:ACTION_DELETE_OBJECT >
```

![İşlem Detayları](../../../../images/bnb-chain/bnb-greenfield/static/asset/view_private_file.png)

Grup politikasının çalıştığını doğrulamak için, `0x843e77D639b6C382e91ef489881963209cB238E5` hesabıyla özel nesneyi görüntülemeyi deneyebilirsiniz.
1. Keşfede özel nesnenin detay sayfasını bulun.
2. "Önizleme" butonuna tıklayın.
3. Cüzdanınızı açın ve doğru adresi seçin. Ardından, HTML dosyasını görüntüleyebilmelisiniz.

ya da dosyayı `gnfd-cmd` ile indirebilirsiniz.
```shell
./gnfd-cmd object get  gnfd://website-bucket/index.html
```

### Grup ile Erişim Kontrolünü Güncelleme

Bir grubu güncellemek için komut çok basittir.

#### Gruptan bir üyeyi kaldırmak:
```shell
// update group member
gnfd-cmd group update --removeMembers 0xca807A58caF20B6a4E3eDa3531788179E5bc816b gnfd://groupname

```
#### Üyelik için süre sonu ekleyin

Yeni eklenen üye için son tarih damgasını ayarlayabilirsiniz. Varsayılan değer süresi dolmuş değildir.
```shell
// update group member
gnfd-cmd group update --removeMembers 0xca807A58caF20B6a4E3eDa3531788179E5bc816b gnfd://groupname --expireTime 1699699763

```

#### Politika Kaldırma

Bir politikayı silmek için örnek
* Bir adres için politikayı silin.
```shell
gnfd-cmd policy rm --grantee 0x843e77D639b6C382e91ef489881963209cB238E5 --actions get grn:o::website-bucket/index.html
```

* Bir grup için politikayı silin.
```shell
gnfd-cmd policy rm --groupId 111 --actions get grn:o::website-bucket/index.html
```

## Sonuç
Genel olarak, Greenfield'ın erişim kontrol yönetimi oldukça güçlüdür ve birçok senaryoda kullanılabilir. 

:::note
Kullanıcıların, farklı hesap grup yönetim işlemleri ve izin mekanizmalarını deneyerek pratik yapmaları şiddetle önerilir. Bu, BNB Greenfield'ın nasıl çalıştığını ve merkeziyetsiz depolama sisteminde verileri nasıl etkili bir şekilde yönetip güvence altına alabileceğiniz konusunda daha derin bir anlayış sağlayacaktır.
:::