---
sidebar_position: 11
title: AWS ile Camino Node Çalıştırma
description: Bu kılavuz, Camino Node'un AWS'de nasıl ayarlanacağı ve çalıştırılacağına dair adım adım talimatlar sunmaktadır.
---

# AWS Üzerinde Camino Node Kurulumu

Bu kılavuzda, Amazon Web Services (AWS) platformunda Camino Node kurulum sürecini adım adım geçeceğiz. Kurulum süreci için manuel yöntem, AWS Marketplace yöntemi ve Terraform kullanarak otomatik yöntem olmak üzere üç seçenek bulunmaktadır.

- : Daha fazla bireysel katılımı tercih ediyorsanız ve detaylı adımları anlamak istiyorsanız, manuel yöntem sizin için uygundur.

- : Bu yöntem, Camino Node'un dağıtımında AWS Marketplace'i kullanarak daha kullanıcı dostu bir arayüz sunar, manuel kurulumun karmaşıklıklarını en aza indirir. Teknik detaylara derinlemesine inmeden verimli ve basit bir dağıtım arayanlar için idealdir.

- : Otomatik bir yaklaşım tercih ediyorsanız ve kurulum sürecini kolaylaştırmak istiyorsanız, Terraform tercih edilmelidir. Bu yöntem, Camino Node'u minimum çaba ile hızla dağıtmanıza olanak tanır ve Terraform'un altyapı kodlaması paradigmasına aşina olan kullanıcılar için çekici bir seçenektir.

Blok zinciri teknolojisine yeniyseniz veya tecrübeli bir AWS kullanıcısıysanız, bu kılavuz erişilebilir ve takip etmesi kolay olacak şekilde tasarlanmıştır. Camino Node'un AWS'de düzgün çalışmaya başlaması için adım adım talimatlar sağlamaktadır.

AWS üzerinde Camino Node kurulum sürecine başlayalım. Tercihlerinize ve ihtiyaçlarınıza en uygun yöntemi seçin.

## Manuel Yöntem

### AWS'de EC2 Bölümüne Gidin

1. **Hizmetler > Hesaplama > EC2**'ye giderek AWS'deki EC2 bölümüne erişin. Burada sanal makine örneklerinizi oluşturacak ve yöneteceksiniz.



Fig.1: EC2 Bölümüne Git


### Anahtar Çifti Oluşturma: Makinenize Güvenli Erişim

Anahtar çifti oluşturmak, yeni oluşturduğunuz makineye güvenli erişim sağlamak için temel bir adımdır. Anahtar çifti ile makineye güvenli bir şekilde SSH (Güvenli Kabuk) üzerinden giriş yapabilir ve etkili bir şekilde yönetebilirsiniz.

Anahtar çifti oluşturma sürecinde bir ortak ve bir özel anahtar çifti oluşturacaksınız. Özel anahtar, makineye bağlanırken kendinizi doğrulamak için kullanılacak, ortak anahtar ise makineyle ilişkilendirilecek ve güvenli erişimi sağlayacaktır.

Özel anahtarınızı güvende tutun ve başkalarıyla paylaşmaktan kaçının. Bu anahtar çifti ile makinenize güvenli bir şekilde erişim sağlamak ve gerekli yapılandırmaları gerçekleştirmek için gereken kimlik bilgilerine sahip olacaksınız.

Güvenli erişim sağlamak için Camino Node makineniz için anahtar çiftini oluşturmaya geçelim.

1. **"Ağ & Güvenlik" > "Anahtar Çiftleri"** üzerine gidin.



Fig.2: "Anahtar Çiftleri" üzerine tıklayın


2. **"Anahtar Çifti Oluştur"** üzerine tıklayın.



Fig.3: "Anahtar Çifti Oluştur" üzerine tıklayın


3. Anahtar için bir ad yazın, örneğin "camino-key-pair".
4. Anahtar çifti türü olarak RSA'yı seçin.
5. Linux kullanıyorsanız .pem, Windows kullanıyorsanız .ppk'yi seçerek anahtar çiftini indirin.
6. **"Anahtar Çifti Oluştur"** üzerine tıklayın ve indirilen dosyayı kaydedin. Bu anahtar çifti, makineye SSH ile bağlanmak için kullanılacaktır.



Fig.4: Tamamladıktan sonra "Anahtar Çifti Oluştur" üzerine tıklayın


### Güvenlik Grubu Oluşturma: Erişim İzinlerini Yapılandırma

Bu aşamada, Camino Node makinenizin gelen ve giden trafiğini kontrol eden sanal bir güvenlik duvarı görevi gören bir Güvenlik Grubu oluşturacağız. Güvenlik Grubu içindeki erişim izinlerini tanımlayarak, Camino Node için gerekli olan portların (staking portu, HTTP portu) ve SSH bağlantısının güvenli olmasını sağlayabiliriz.

Güvenlik Grubu ayarları, makineye hangi IP adreslerinin ve portlarının erişmesine izin verileceğini belirler. SSH erişimini güvenli uzaktan bağlantılar için ve Camino Node için gereken TCP portları üzerinden iletişimi sağlayacak şekilde Güvenlik Grubu'nu yapılandıracağız.

Güvenlik Grubu'nu uygun kurallarla ayarlayarak, Camino Node makinenizin hem erişilebilir olmasını hem de yetkisiz erişimden korunmasını sağlayabiliriz.

Güvenlik Grubu oluşturma ve erişim izinlerini yapılandırmaya geçelim.

1. **"Ağ & Güvenlik" >> "Güvenlik Grupları"**'na gidin.



Fig.5: "Güvenlik Grupları"na tıklayın


2. **"Güvenlik Grubu Oluştur"** üzerine tıklayın.

3. Güvenlik grubuna bir ad yazın, örneğin "camino-security-group".

4. Bir açıklama yazın, örneğin "SSH portu ve Camino TCP portları için gelen trafiğe izin ver".



Fig.6: Ayrıntıları doldurun


5. **"Gelen kurallar"** altında **"Kural ekle"** üzerine tıklayın ve aşağıdaki ayarlarla 3 kural ekleyin:

   - **Kural 1**:
     - **Tip**: SSH
     - **Port**: 22
     - **Kaynak**: Özel Kaynak
     - **IP Aralığı**: Kendi IP Aralığınız (SSH erişimini sağlamak için)
     - **Açıklama**: SSH portu
   - **Kural 2**:
     - **Tip**: Özel TCP
     - **Port**: 9650
     - **Kaynak**: Özel Kaynak
     - **IP Aralığı**: Kendi IP Aralığınız (HTTP port erişimini sağlamak için)
     - **Açıklama**: HTTP portu
   - **Kural 3**:
     - **Tip**: Özel TCP
     - **Port**: 9651
     - **Kaynak**: Her yerde-IPv4
     - **IP Aralığı**: 0.0.0.0/0 (herhangi bir IP'den staking port erişimine izin vermek için)
     - **Açıklama**: Staking portu



Fig.7: Ayrıntıları doldurun


:::tip PORTLARI ANLAMAK: STAKING & API PORTLARI

Camino Node, farklı işlevler için iki port kullanmaktadır. Port 9651, Camino Ağı üzerindeki doğrulayıcı düğümleriyle iletişim için kullanılan staking portudur.

Ayrıca, port 9650 API'yi açmak için kullanılmaktadır. Eğer düğümünüzü bir API düğümü olarak kullanmayı planlamıyorsanız, kural 2'yi hariç tutabilir veya API erişimini belirli IP adresleri veya alt ağlara kısıtlamak istiyorsanız, kaynak IP aralığını buna göre değiştirebilirsiniz. Staking portu (9651) her zaman tüm IP adreslerine (0.0.0.0/0) kısıtlamasız erişime sahip olmalıdır.

API'ler hakkında daha kapsamlı bir anlayış için lütfen  belgesine danışın.

:::

6. Güvenlik grubunu oluşturmak için **"Güvenlik grubunu oluştur"** üzerine tıklayın.



Fig.8: "Güvenlik grubunu oluştur" üzerine tıklayın


### EC2 örneği oluşturma: Camino Node Makinenizi Başlatma

Bu adımda, Camino Node makineniz olacak Amazon Elastic Compute Cloud (EC2) örneğini oluşturacağız. EC2 örneği, Camino Node gibi uygulamaları AWS bulutunda çalıştırmak için ölçeklenebilir ve esnek bir hesaplama ortamı sağlar.

EC2 örneği oluşturma sırasında, Camino Node gereksinimlerinize uygun örnek türü, işletim sistemi ve diğer yapılandırmaları seçeceksiniz. Ayrıca önceden oluşturduğunuz Anahtar Çifti ve Güvenlik Grubu ile ilişkilendirerek güvenli erişim ve iletişimi sağlayacağız.

EC2 örneğiniz çalışmaya başladıktan sonra Camino Node kuruluma başlayabileceksiniz. Örnek, Camino Node'u verimli bir şekilde çalıştırmak için gerekli kaynaklar ile donatılacaktır.

AWS'de Camino Node makinenizi oluşturmak için EC2 örneği oluşturmaya geçelim.

1. Yeni bir EC2 örneği oluşturma sürecine başlamak için **"Örnekleri Başlat"** üzerine tıklayın.



Fig.9: "Örnekleri Başlat" üzerine tıklayın


2. Örneği kolayca tanımlamak için bir ad yazın.

3. **Ubuntu LTS** işletim sistemini **64-bit (x86) yapılandırması** ile seçin.



Fig.10: Ayrıntıları doldurun


4. **Örnek türü: t3.xlarge**'ı seçin (veya uygun başka bir örnek türünü seçin,  kontrol edin).



Fig.11: Örnek türünü seçin


5. **"Anahtar çifti"** altında daha önce oluşturduğunuz anahtar çiftini açılır listeden seçin. Bu, örneğe SSH ile bağlanmanızı sağlar.



Fig.12: Anahtar çiftini seçin


6. **"Ağ Ayarları"** altında **"Mevcut bir güvenlik grubunu seçin"** seçeneğini işaretleyin ve listeden daha önce oluşturdunuz güvenlik grubunu seçin. Böylece SSH ve Camino TCP portları için belirlediğiniz gelen kurallar uygulanacaktır.



Fig.13: Güvenlik Grubunu seçin


7. **"Depolama yapılandırması"** altında boyutu **500 GB** olarak ayarlayın ve depolama türünüzü **gp3** olarak seçin.



Fig.14: Disk boyutunu ayarlayın


8. Ek ayarları yapılandırmak için **"Gelişmiş ayrıntılar"** üzerine tıklayın.

9. **"Kullanıcı verisi"** altında aşağıda sağlanan başlangıç betiğini ekleyin. Bu betik örnek başlatıldığında çalıştırılacak ve Camino Node'un çalışması için gerekli bileşenleri kuracaktır.



Fig.15: Başlangıç betiği ekleyin


```bash
#!/bin/bash

apt-get update
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

apt-get install -y apt-transport-https ca-certificates gnupg curl sudo

echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

apt-get update && apt-get install -y google-cloud-cli

mkdir -p /home/camino-data/db
## columbus için gs://columbus-db kullanın
gsutil -m rsync -d -R  gs://camino-db /home/camino-data/db

docker run -d -v /home/camino-data:/root/.caminogo -p 9650:9650 -p 9651:9651 --restart always c4tplatform/camino-node:latest ./camino-node --network-id=camino --http-host=0.0.0.0 --public-ip-resolution-service=ifconfigme
```

:::note AĞ KİMLİĞİ

Düğümünüzü testnet üzerinde çalıştırmayı düşünüyorsanız, aşağıdaki değişiklikleri yapın:

- `--network-id=camino` seçeneğini `--network-id=columbus` olarak değiştirin.
- `gs://camino-db`'yi `gs://columbus-db` olarak güncelleyin.

Bu ayarlamalar, Camino Node'un Columbus testnetinde çalışmasını sağlayacaktır.

:::

:::note GENEL İP

Yukarıdaki başlangıç betiğinde, genel IP adresini belirlemek için bir genel IP çözümleme hizmeti kullandık. Ancak, stabilite için statik bir genel IP'ye sahip olmanız önerilir. Statik bir genel IP'niz varsa, `--public-ip-resolution-service=ifconfigme` kısmını `--public-ip=` ile değiştirin.

:::

## AWS Marketplace Yöntemi

:::tip YAKINDA MEVCUT

Camino Node, kısa süre içerisinde AWS Marketplace'te mevcut olacak. Bu belge bölümü, Amazon'un gereksinimlerini yerine getirmek amacıyla hazırlanmaktadır. Burada belirtilen adımlar, erken referansınız için sağlanmaktadır.

:::

1. **Anahtar Çifti Oluşturma:** Yukarıdan  talimatlarını takip ederek bir anahtar çifti oluşturun.

2. **Güvenlik Grubu Oluşturma:** Yukarıdan  talimatlarını takip ederek bir güvenlik grubu oluşturun.

:::info

Eğer "Camino Node" ürününe zaten abone olduysanız, 3-6 adımlarını atlayabilir ve doğrudan 7. adıma geçebilirsiniz.

Marketplace aboneliklerinize gidin ve "Camino Node" ürünü için "Yeni örnek başlat" seçeneğini seçin.



Fig.16: "Yeni örnek başlat" üzerine tıklayın


:::

3. AWS Marketplace'e gidin ve "Camino Node"u arayın.

4. "Camino Node" ürün sayfasına erişin ve "Abone olmaya devam et" üzerine tıklayın.



Fig.17: "Abone olmaya devam et" üzerine tıklayın


5. "Şartları kabul et" üzerine tıklayın.



Fig.18: "Şartları kabul et" üzerine tıklayın


6. "Yapılandırmaya devam et" üzerine tıklayın.



Fig.19: "Yapılandırmaya devam et" üzerine tıklayın


7. İstenilen Camino Node sürümünü seçin. Sürüm adı, ağ (testnet için columbus veya mainnet için camino) ve sürüm numarasını içerir, GitHub sürümleri  ile kontrol edebilirsiniz.



Fig.20: İstenilen sürümü seçin


8. Tercih ettiğiniz AWS bölgesini seçin.



Fig.21: Bölgeyi seçin


9. Bir örnek türü seçin. Bu kılavuzun oluşturulma tarihine göre önerilen tür `t3.xlarge`'dir.



Fig.22: Örnek türünü seçin


10. Tercih ettiğiniz VPC ayarlarını ve alt ağı yapılandırın.



Fig.23: VPC & Alt Ağı yapılandırın


11. İlk iki adımda oluşturduğunuz güvenlik grubu ve anahtar çiftini seçin, ardından "Başlat" üzerine tıklayın.



Fig.24: Güvenlik grubunu ve anahtar çiftini seçin


## Terraform Yöntemi

### AWS Üzerinde Terraform ile Camino Node Kurulumu

AWS'de Camino Node yapılandırma sürecini otomatik hale getirmek için Terraform ile işlerinizi kolaylaştırabilirsiniz. Terraform, kod olarak altyapı oluşturmaya ve yönetmeye izin vererek kurulum ve dağıtım adımlarını önemli ölçüde basitleştirir.

:::note

Lütfen bu bölümün AWS'de Camino Node'u yüklemek için alternatif bir yöntem sunduğunu unutmayın. Eğer bu kılavuzda belirtilen adımları zaten tamamladıysanız, bu alternatif yöntemi takip etmenize gerek yoktur.

Bu alternatif yöntem, AWS üzerinde Camino Node kurulumunu gerçekleştirmek için faydalı olabilir.

:::

Camino Node'u kurmak için Terraform'dan faydalanmak için aşağıdaki adımları izleyin:

1. .
2. Terminal veya komut istemcinizde aşağıdaki komutları çalıştırın, `AWS_ACCESS_KEY_ID` ve `AWS_SECRET_ACCESS_KEY` değerlerini güncellediğinize emin olun:

:::caution AWS KİMLİK BİLGİLERİ

Devam etmeden önce AWS kimlik bilgilerinizin hazır olduğundan emin olun. Eğer henüz oluşturmadıysanız, AWS kimlik bilgilerini oluşturma talimatları için  belgesine başvurabilirsiniz.

:::

```bash
terraform init
terraform fmt
terraform validate

## AWS erişimi için GEREKEN değişkenler
export AWS_ACCESS_KEY_ID="xxxxxxx"
export AWS_SECRET_ACCESS_KEY="xxxxxx"

## İSTEĞE BAĞLI değişkenler, aşağıdakiler varsayılan değerlerdir
export TF_VAR_network=camino    ## testnet için columbus kullanın
export TF_VAR_aws_region=eu-north-1
export TF_VAR_vm_name=camino-node
# ssh ile vm'ye bağlanacak ve port 9650'yi kullanarak api çağrıları yapacak ip aralığınızı yazın. örneğin: 1.1.1.1/32
export TF_VAR_allowed_ip_range=""

terraform apply