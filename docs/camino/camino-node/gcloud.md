---
sidebar_position: 10
title: Google Cloud Platform ile Camino Düğümünü Çalıştırma
description: Bu kılavuz, Google Cloud Platform'da Camino Düğümü nasıl ayarlanacağı ve çalıştırılacağı konusunda adım adım talimatlar sağlar.
---

# Google Cloud Platform'da Camino Düğümünü Ayarlama

Bu eğitim, Google Cloud Platform (GCP) üzerinde Camino Düğümü yapılandırma sürecinde size rehberlik edecektir. Kurulum süreci için üç yöntem arasından seçim yapabilirsiniz: GCP Marketplace dağıtımı, manuel yöntem ve Terraform kullanarak otomatik yöntem.

- : Bu yöntem, Camino Düğümünü dağıtmak için Google Cloud Marketplace'i kullanır. Kullanıcı dostu bir arayüz sunarak, manuel kurulumun karmaşıklıklarını en aza indirir. Temel teknik ayrıntılara derinlemesine dalmadan etkili ve kolay bir dağıtım arayanlar için idealdir.

- : Daha etkileşimli bir yaklaşımı tercih ediyorsanız ve detaylı adımları anlamak istiyorsanız, manuel yöntem sizin için uygundur. Gerekli portu açmak için bir güvenlik duvarı kuralı oluşturmakla başlayarak, sanal makine (VM) örneğini ayarlamaya ve Camino Düğümünü GCP üzerinde sorunsuz çalışacak şekilde yapılandırmaya kadar ilerlemenizi sağlar. İster deneyimli bir geliştirici olun ister blockchain teknolojilerini keşfeden bir acemi, bu kılavuz sorunsuz bir kurulum süreci sağlamak için net talimatlar sunmaktadır.

- : Eğer otomatik bir yaklaşımı tercih ediyor ve kurulum sürecinizi basitleştirmek istiyorsanız, Terraform doğru tercihtir. Bu yöntem, Camino Düğümünü hızlı bir şekilde ve minimal çaba ile dağıtmanıza olanak tanır, bu da Terraform'un altyapıyı kod olarak ele alan paradigmasını bilen kullanıcılar için cazip bir seçenek haline getirir.

Teknik detaylara dalmadan önce, Camino Düğümü tarafından kullanılan staking ve API portlarının önemini anlamak kritik midir. Ayrıca düğümünüzü daha fazla işlevsellik için bir API düğümü olarak açma seçeneğini de tartışacağız. Bu kılavuzun sonunda, merkeziyetsiz ağa katkıda bulunmaya ve Camino ekosistemine katılmaya hazır tamamen işlevsel bir Camino Düğümüne sahip olacaksınız.

Google Cloud Platform'da Camino Düğümünüzü ayarlama yolculuğuna başlayalım! Tercihlerinize ve ihtiyaçlarınıza en uygun yöntemi seçin.

## GCP Marketplace Yöntemi

### Google Cloud Marketplace'deki Camino Düğümüne Gidin

-  sayfasına gidin.
- Alternatif olarak, gcloud marketplace'de "camino node" araması yapabilirsiniz.

### Dağıtım Başlatma

- "Başlat" butonuna tıklayın.



Şekil 15: Başlat butonuna tıklayın


### Dağıtım Parametrelerini Düzenleme



Şekil 16: Dağıtım Parametreleri


- **Dağıtım Adı**: İstenilen dağıtım adını girin. Bu ad, oluşturulan VM için de kullanılacak ve VPC ağı, statik dış IP, güvenlik duvarı ve hizmet hesabı için adların bir parçası olacaktır.
- **Hizmet Hesabı**: Mevcut bir hizmet hesabı seçin veya yeni bir tane oluşturun. Aşağıdaki izinlere sahip olduğundan emin olun:
  - Cloud Altyapı Yöneticisi
  - Hesaplama Yöneticisi
- **İzin Verilen IP Aralığı**: Bir güvenlik duvarı kuralı oluşturmak istiyorsanız IP aralığını belirtin. Bu kural, sağlanan IP aralığı için 9650 ve 22 numaralı portları açacaktır. Format CIDR notasyonu olmalıdır: `x.x.x.x/x`.
- **Camino Docker Etiketi**: İstenilen Camino Düğüm sürümünü girin, örneğin `vx.x.x` (örneğin: `v1.0.0`). Alternatif olarak, en son kararlı sürüm için `latest` kullanabilirsiniz.
- **Ağ**: Camino Düğümü ağ kimliğini belirleyin. Ana ağ için `camino`, test ağı için `columbus` kullanın.
- **Kaynak Görüntü**: Bu, VM için temel görüntüdür. Varsayılan değeri koruyun ve değişiklik yapmaktan kaçının.
- **VM Bölgesi**: Sanal makine için uygun yeri seçin. Sağlanan gcloud VM bölgelerinden birine karşılık gelmelidir.

### Dağıtımı Tamamlama

- Dağıtım sürecini başlatmak için "Dağıt" butonuna tıklayın.

## Manuel Yöntem

### Port 9651'i Açmak İçin Güvenlik Duvarı Kuralı Oluşturma

1. Google Cloud Platform (GCP) Konsoluna erişin ve "VPC Ağı" > "Güvenlik Duvarı" kısmına gidin.



Şekil 1: "VPC Ağı"na tıklayın ve "Güvenlik Duvarı"nı seçin


2. "Güvenlik Duvarı Kuralı Oluştur" butonuna tıklayın ve TCP port 9651'i tüm gelen trafiğe izin verecek şekilde ayarlayın. Hedef etiketini "camino-network-p2p" olarak ayarlayın.



Şekil 2: "Güvenlik Duvarı Kuralı Oluştur" butonuna tıklayın


3. Aşağıdaki ekran görüntülerinde gösterildiği gibi güvenlik duvarı kuralını yapılandırın:



Şekil 3: Güvenlik Duvarı kuralını yapılandırın


4. "Belirtilen portlar ve protokoller" altında TCP portları için "9651" yazın. Diğer alanları aşağıdaki ekran görüntüsünde gösterildiği gibi ayarlayın ve "Oluştur" butonuna tıklayın.

:::tip PORTLARI ANLAMAK: STAKE ETME & API PORTLARI

Camino Düğümü, farklı özellikler için iki port kullanır. 9651 numaralı port, Camino Ağı üzerindeki onaylayıcı düğümlerle iletişim kurmak için kullanılan staking portudur.

Başka bir port olan 9650, API'yi açmak için kullanılır. Düğümünüzü bir API düğümü olarak kullanmak istiyorsanız, güvenlik duvarı kuralı ayarlama sırasında izin verilen portlara 9650 numaralı portu da ekleyebilirsiniz. API erişimini belirli IP adresleri veya alt ağlarla sınırlamak istiyorsanız, kaynak IP aralığını buna göre düzenleyebilirsiniz. Bu senaryoda, stake etme portuna (9651) tüm IP adreslerine (0.0.0.0/0) erişim izni vermek için ayrı bir güvenlik duvarı kuralı oluşturmanız gerekecektir.

APIs hakkında daha fazla bilgi için lütfen  belgesine başvurun.

:::



Şekil 4: Kural yapılandırmanızı tamamlayın ve hazır olduğunuzda "Oluştur" butonuna tıklayın


### VM Örneğini Oluşturma

1. "Hesaplama Motoru" > "VM Örnekleri" kısmına gidin.



Şekil 5: "Hesaplama Motoru"na tıklayın ve "VM Örnekleri"ni seçin


2. "ÖRNEK OLUŞTUR" butonuna tıklayın.



Şekil 6: "Örnek Oluştur" butonuna tıklayın


3. VM örneğini aşağıdaki bilgilerle yapılandırın:
   - Örneğe bir ad girin.
   - İstediğiniz bölgeyi ve alanı seçin.
   - Makine serisi olarak E2'yi seçin.
   - Makine tipi olarak "e2-standard-4" seçin.
   - "Konteyner Dağıt" butonuna tıklayın.



Şekil 7: Örneği yapılandırın




Şekil 8: "Konteyner Dağıt" butonuna tıklayın


4. Konteyner yapılandırması için şu bilgileri sağlayın:
   - Docker görüntüsü: `c4tplatform/camino-node:latest`
   - Komut: `/camino-node/build/camino-node`
   - Argümanlar: `--network-id=columbus` ve `--public-ip-resolution-service=ifconfigme`

:::note AĞ KİMLİĞİ

Eğer düğümünüzü ana ağda çalıştırmayı planlıyorsanız, `--network-id=columbus` seçeneğini `--network-id=camino` olarak değiştirin.

:::

:::note KAMU IP

Bu kılavuz boyunca, kamu IP adresini belirlemek için bir kamu IP çözümü servisi kullandık. Bununla birlikte, stabilite için statik bir kamu IP sahip olmanız önerilir. Eğer statik bir kamu IP'ye sahipseniz, lütfen `--public-ip-resolution-service=ifconfigme`’yi `--public-ip=` ile değiştirmeyi unutmayın.

:::



Şekil 9: Konteyner detaylarını yapılandırın


5. `/root/.caminogo` dizinine Okuma/Yazma erişimi ile bir bağlı hacim ekleyin.



Şekil 10: Bir bağlı hacim ekleyin


6. Önyükleme Disk boyutunu 500 GB olarak ayarlayın.



Şekil 11: "Değiştir" butonuna tıklayın




Şekil 12: Boyutu 500 GB olarak ayarlayın ve "Seç" butonuna tıklayın


7. "camino-network-p2p" ağ etiketini ekleyin.



Şekil 13: Ağ etiketini ekleyin


9. İsteğe bağlı olarak, veritabanını indirmek ve başlatma süresini azaltmak için şu başlangıç betiğini ekleyin:

```bash
#! /bin/bash
mkdir -p /home/camino-data
docker pull google/cloud-sdk:434.0.0
export CONTNAME=$(docker ps -q --filter ancestor=c4tplatform/camino-node:latest)
docker container stop $CONTNAME || true
mkdir -p /home/camino-data/db
## aşağıdaki satırda  kısmını columbus veya camino olarak değiştirin
docker run -v /home/camino-data/db:/opt/db --name gcloud-config google/cloud-sdk:434.0.0 gsutil -m rsync -d -R gs://-db /opt/db
docker rm -f gcloud-config
docker container start $CONTNAME || true
```



Şekil 14: Başlangıç betiğini ayarlayın


## Terraform Yöntemi

### Terraform ile Camino Düğümünü Ayarlama

Google Cloud Platform'da (GCP) Camino Düğümünün yapılandırılma sürecini otomatik hale getirmek Terraform ile daha kolay hale gelmektedir. Terraform, altyapıyı kod olarak oluşturmanızı ve yönetmenizi sağlar, böylece kurulum ve dağıtım adımlarını önemli ölçüde basitleştirir.

:::note

Lütfen bu bölümün GCP'de Camino Düğümünü kurmak için alternatif bir yöntem sunduğunu unutmayın. Eğer bu kılavuzda yer alan adımları tamamladıysanız, bu alternatif yöntemi takip etmenize gerek yoktur.

Bu alternatif yöntem, Camino Düğümünü GCP'de kurmak için ek bir yaklaşım sunar ve belirli kullanım durumları veya tercihleri için faydalı olabilir.

:::

Terraform'u kullanarak Camino Düğümünü kurmak için şu adımları izleyin:

1. .
1. Aşağıdaki komutları terminalinizde veya komut istemenizde çalıştırın, `GOOGLE_CREDENTIALS` ve `TF_VAR_gcp_project_id` değerlerini güncellediğinizden emin olun:

```bash
terraform init
terraform fmt
terraform validate

## GEREKEN değişkenler
export GOOGLE_CREDENTIALS=
export TF_VAR_gcp_project_id=

## İSTEĞE BAĞLI değişkenler, aşağıda varsayılan olarak atanan değerler bulunmaktadır
export TF_VAR_network=columbus    ## ana ağ için camino kullanın
export TF_VAR_vm_zone=europe-west1-b
export TF_VAR_vm_name=camino-node
export TF_VAR_template_name=camino-node-template
# ssh ile vm'ye bağlanacak ve 9650 portundan api çağrıları yapacak ip aralığınızı yazın. örneğin: 1.1.1.1/32
export TF_VAR_allowed_ip_range=""

terraform apply