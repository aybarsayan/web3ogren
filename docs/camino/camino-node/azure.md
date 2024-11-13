---
sidebar_position: 12
title: Microsoft Azure'da Camino Node Çalıştırma
description: Bu kılavuz, Microsoft Azure'da Camino Node'u nasıl kuracağınız ve çalıştıracağınız hakkında adım adım talimatlar sunmaktadır.
---

# Azure'da Camino Node Kurulumu

Bu kılavuzda, Microsoft Azure platformunda Camino Node kurulum sürecini adım adım inceleyeceğiz. Kurulum süreci için iki yöntem bulunmaktadır: manuel yöntem ve Terraform kullanarak otomatik yöntem.

Blockchain teknolojisine yeni başlamış olsanız ya da deneyimli bir Azure kullanıcısı olsanız, bu kılavuz size erişilebilir ve kolay takip edilebilir bir deneyim sunmak için tasarlanmıştır. Camino Node'u Azure üzerinde sorunsuz bir şekilde kurmanıza yardımcı olacak adım adım talimatlar içermektedir.

Hadi, Azure'da Camino Node'un kurulum sürecine başlayalım. Kendi tercihlerinize ve ihtiyaçlarınıza en uygun olan yöntemi seçin.

## Otomatik Yöntem

Microsoft Azure'da kurulum işlemine başlamadan önce, `template.json` ve `parameters.json` dosyalarına sahip olduğunuzdan emin olun. Bunları aşağıdaki bağlantılardan indirebilirsiniz:

- 
- 

:::caution İndirdikten Sonra Dosyaları Yeniden Adlandırın

İndirilen dosyaların adlarına UUID'ler eklenmiştir. İndirdikten sonra, bunları sırasıyla `template.json` ve `parameters.json` olarak yeniden adlandırınız.

:::

### 1: `parameters.json` Dosyasını Düzenleme

Kuruluma başlamadan önce, `parameters.json` dosyasındaki birkaç değişiklik yapmanız gerekiyor:

1. IP adresinizi girmek için satır 40 ve 55'i değiştirin.
2. Satır 172'de, genel SSH anahtarınızı girin. Eğer bir SSH anahtarınız yoksa, aşağıdaki talimatları izleyin.

### 2: SSH Anahtarı Oluşturma

Aşağıdaki komutları çalıştırarak bir SSH anahtarı oluşturun:

```bash
ssh-keygen -m PEM -t rsa -b 4096 -f $(pwd)//azurekey -N ""
```

Ardından, `azurekey.pub` dosyasını açın ve içeriğini kopyalayın. Bu içeriği `parameters.json` dosyasının satır 172'sine yapıştıracaksınız.

### 3: Azure CLI'yi Yükleme

Azure kaynaklarıyla etkileşimde bulunmak için Azure Komut Satırı Arayüzü (CLI)ni yükleyin. Detaylı yükleme talimatlarını  bulabilirsiniz.

Ubuntu sistemleri için aşağıdaki komutla doğrudan yükleme yapabilirsiniz:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 4: Azure Girişi

Dağıtıma devam etmeden önce, Azure hesabınıza giriş yaptığınızdan emin olun:

```bash
az login
```

Giriş işlemini tamamlamak için ekrandaki talimatları izleyin.

### 5: Kaynak Grubu Oluşturma

`camino-node-rg` adında yeni bir kaynak grubu oluşturun. Farklı bir konum seçerseniz, `parameters.json` dosyasındaki satır 6'yı da güncellemeyi unutmayın.

```bash
az group create --name camino-node-rg --location "westeurope"
```

### 6: Şablonu Dağıtma

Her şey hazır olduğunda, şablonu dağıtabilir ve sanal makinenizi başlatabilirsiniz:

```bash
az deployment group create -f template.json --parameters parameters.json -g camino-node-rg
```

Hepsi bu! Bu adımları izlerseniz, Microsoft Azure'da Camino Node'unuzu otomatik olarak kurmuş olacaksınız.

## Manuel Yöntem

### 1. Sanal Makinelere Gidin

- **Azure Services** bölümünde, **Sanal Makineler** seçeneğini seçin.
- **Oluştur**'a tıklayın, ardından **Azure Sanal Makinesi** seçeneğini seçin.



Şekil 1: Sanal Makineleri Seçin




Şekil 2: Azure Sanal Makinesine Tıklayın


### 2. Sanal Makine Yapılandırmasını Ayarlama

- İstediğiniz **Aboneliği** seçin.
- İsteğe bağlı olarak, Camino için yeni bir kaynak grubu oluşturun.
- Sanal makineniz için bir isim girin ve bölgesini seçin.

### 3. Sanal Makine Görüntüsü ve Boyutu

- VM görüntüsü olarak, **Ubuntu 22.04**'ü x86 mimarisi ile seçin.
- **Standard_D4s_v3** boyutundaki bir makineyi seçmeniz önerilir. (Şekil 4)



Şekil 3


### 4. SSH Anahtarı Oluşturma

- Sanal makinenize güvenli bir şekilde bağlanmak için yeni bir genel/özel anahtar çifti oluşturun.

### 5. Giriş Portlarını Ayarlama

- Genel giriş portlarını seçerken **Hiçbiri** seçeneğini tercih edin.



Şekil 4


### 6. Disk Yapılandırması

- **Sonraki: Diskler** seçeneğine gidin.
- OS disk boyutunu **512 GB** olarak ayarlayın.
- Ardından, **Sonraki: Ağ** seçeneğine geçin.



Şekil 5


### 7. Ağ Yapılandırması

- Gerekirse yeni bir **Sanal Ağ** oluşturun.
- Makine için yeni bir genel IP adresi seçin veya atayın.
- **NIC ağ güvenlik grubu** altında, **Gelişmiş** seçeneğini seçin ve ardından **Yeni oluştur**'u seçin.



Şekil 6


- Varsayılan giriş kuralını kaldırın.



Şekil 7


### 8. Ağ Güvenlik Kuralları

- Tüm çıkış trafiğine izin vermek için bir dış yönlendirme kuralı ekleyin.



Şekil 8




Şekil 9


- Üç adet giriş kuralı yapılandırın:
  - Tüm kullanıcılar için **9651** portunu açın.
  - Camino API çağrılarına izin vermek için belirli IP aralıkları için **9650** portunu açın.
  - SSH bağlantılarını kurmak için belirli IP aralıkları için **22** portunu açın.



Şekil 10: Giriş kuralı eklemek için tıklayın




Şekil 11: Stake portu için tüm trafiğe izin verin




Şekil 12: Belirli IP aralıkları için API portuna izin verin.


:::info API Erişimi

Unutmayın: API düğümünüzün evrensel olarak erişilebilir olmasını istiyorsanız, tüm IP aralıklarına API erişimi sağlayabilirsiniz. Bu, düğümünüzün internetteki herkes tarafından erişilebilir olmasını sağlar.

:::



Şekil 13: SSH portunu açın


Güvenlik kurallarını ayarladıktan sonra, **Tamam**'a tıklayın.



Şekil 14


### 9. Özel Script Ekleme

- **Gelişmiş** sekmesine gidin.



Şekil 15


- **Özel veri** altına aşağıdaki script'i girin.



Şekil 16


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
## for columbus use gs://columbus-db
gsutil -m rsync -d -R  gs://camino-db /home/camino-data/db

docker run -d -v /home/camino-data:/root/.caminogo -p 9650:9650 -p 9651:9651 --restart always c4tplatform/camino-node:latest ./camino-node --network-id=camino --http-host=0.0.0.0 --public-ip-resolution-service=ifconfigme

```

### 10. Etiket Ekleme

- **Etiketler** sekmesine geçin.
- Sanal makinenize `camino-node` veya `network-id: columbus` gibi ilgili etiketler ekleyin.



Şekil 18


### 11. Tamamlanma

- **Gözden Geçir ve Oluştur** seçeneğine tıklayın.
- Son olarak, VM'inizi dağıtmak için **Oluştur**'u seçin.



Şekil 19


- Gelecekte sanal makinenize güvenli bir şekilde bağlanmak için özel anahtar dosyasını indirmenizi unutmayın.



Şekil 20
