---
sidebar_position: 1
title: Manuel Kurulum
description: Kendin yap veya önceden oluşturulmuş ikili dosyaları kullan
---

# Camino Düğümleri Manuel Kurulumu

Camino hakkında en hızlı şekilde öğrenmenin yolu bir düğüm çalıştırmak ve ağ ile etkileşime girmektir.

Bu öğreticide, şunları yapacağız:

- Bir Camino düğümü kurmak ve çalıştırmak
- Camino'ya bağlanmak

Bu öğretici esasen geliştiricilere ve Camino Ağı'nın nasıl çalıştığıyla ilgilenen kişilere yöneliktir. Eğer sadece bir düğüm kurarak stake yapmak istiyorsanız,  öğreticisini takip etmenizi öneririz. Kurulum programı, kurulum işlemini otomatikleştirir ve bunu bir sistem hizmeti olarak ayarlayarak, gözetimsiz işlem için önerilir. Önce bu öğreticiyi takip ederek deneyim kazanmayı ve daha sonra kurulum programını kalıcı bir çözüm olarak kullanarak düğümü ayarlamayı deneyebilirsiniz.

:::caution DÜĞÜM SÜRÜMLERİ

Lütfen yalnızca  sayfasında belirtilen önerilen düğüm sürümlerini kullanmaya dikkat edin. Mainnet'te RC veya Alpha sürümlerini kullanmaktan kaçının.

:::

## Gereksinimler

Camino, düğümlerin yaygın donanımda çalışmasına olanak tanıyan hafif bir protokoldür. Ağ kullanımı arttıkça, donanım gereksinimlerinin değişebileceğini unutmayın.

- CPU: 8 AWS vCPU eşdeğeri
- RAM: 16 GiB
- Depolama: 512 GiB
- OS: Ubuntu 18.04/20.04/22.04

## Camino Düğümünü Çalıştırmak ve Fon Göndermek

Camino Düğümü'nü, Camino düğümünün Go uygulamasını kurup Camino Kamu Test Ağı (Columbus) ile bağlanalım.

### Camino-Node İndirme

Bu düğüm, bir ikili programdır. İster kaynak kodunu indirebilir ve ardından ikili programı derleyebilir, isterseniz önceden oluşturulmuş ikili dosyayı indirebilirsiniz. Her ikisini de yapmanıza gerek yok.

Sadece kendi düğümünüzü çalıştırmayı ve buna stake yapmayı hedefliyorsanız,  indirmek daha kolay ve önerilen bir yöntemdir.

Geliştiriciyseniz ve Camino'da denemeler yapmak istiyorsanız, düğümü kaynak kodundan inşa etmeniz önerilir.

#### **Kaynak Kod**

Düğümü kaynak kodundan inşa etmek istiyorsanız, öncelikle Go 1.16.8 veya daha yenisini kurmanız gerekecek. Talimatları  takip edin.

`go version` komutunu çalıştırın. **Versiyon 1.16.8 veya üzerinde olmalıdır.** `echo $GOPATH` komutunu çalıştırın. **Boş olmamalıdır.**

Camino-Node deposunu indirin:

```sh
git clone https://github.com/chain4travel/camino-node.git
```

Not: Bu işlem chain4travel dalına çıkış yapar. En son kararlı sürüm için en son etikete çıkış yapın. Testnet (columbus) ile uyumlu en son sürüm v0.2.1-rc2'dir.

`camino-node` dizinine geçin:

```sh
cd camino-node
```

Camino-Node'u derleyin:

```sh
./scripts/build.sh
```

İkili dosya, `camino-node/build` içinde `camino-node` adıyla yer alır.

#### **İkili Dosya**

İkili dosyayı kendiniz derlemek yerine önceden oluşturulmuş bir dosya indirmek isterseniz,  gidin ve istediğiniz sürümü seçin (muhtemelen en son olanı).

`Assets` altında uygun dosyayı seçin.

MacOS için: İndir: `camino-node-macos-.zip`
Aç: `unzip camino-node-macos-.zip` Ortaya çıkan klasör, `camino-node-` ikili dosyaları içerir.

PC'ler veya bulut hizmetleri için Linux için: İndir: `camino-node-linux-amd64-.tar.gz`
Aç: `tar -xvf camino-node-linux-amd64-.tar.gz` Ortaya çıkan klasör, `camino-node--linux` ikili dosyaları içerir.

RaspberryPi4 veya benzeri Arm64 tabanlı bilgisayarlar için Linux: İndir: `camino-node-linux-arm64-.tar.gz`
Aç: `tar -xvf camino-node-linux-arm64-.tar.gz` Ortaya çıkan klasör, `camino-node--linux` ikili dosyaları içerir.

### Düğümleri Başlatın ve Camino'ya Bağlanın

Eğer kaynaktan derlediyseniz:

```sh
./build/camino-node --network-id=columbus
```

Eğer MacOS üzerindeki önyüklenmiş ikili dosyaları kullanıyorsanız:

```sh
./camino-node-/build/camino-node --network-id=columbus
```

Linux üzerindeki önyüklenmiş ikili dosyaları kullanıyorsanız:

```sh
./camino-node--linux/camino-node --network-id=columbus
```

Düğüm başlatıldığında, diğer ağ düğümleriyle senkronize olmaya çalışacaktır. Senkronizasyon süreci hakkında günlük kayıtlarını göreceksiniz. Belirli bir zincirin senkronizasyonu tamamlandığında, aşağıda gibi bir günlük çıktısı alacaksınız:

`INFO [06-07|19:54:06]  /snow/engine/avalanche/transitive.go#80: senkronizasyon tamamlandı ve kabul edilen cephede 1 zirve var`

Belirli bir zincirin senkronizasyonunun tamamlandığını kontrol etmek için, başka bir terminal penceresinde  komutunu aşağıdaki komutu kopyalayıp yapıştırarak çağırabilirsiniz:

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.isBootstrapped",
    "params": {
        "chain":"X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

Eğer bu `true` dönerse, zincir senkronize olmuştur. Eğer henüz senkronize olmamış bir zincire API çağrısı yaparsanız, bu `API çağrısı reddedildi çünkü zincir senkronize olmamış` şeklinde bir hata dönecektir.

Düğümü kapatmak için `Ctrl + C` kullanabilirsiniz.

Düğümünüzle denemeler yapmak istiyorsanız okumaya devam edin.

Düğümünüzden diğer makinelerden API çağrıları yapabilmek için, düğümü başlatırken `--http-host=` argümanını ekleyin (örn. `./build/camino-node --http-host=`).

Ana ağ (Camino) yayınlandığında, `--network-id=columbus` parametresini atlayabilir veya ana ağımızın adı olan `--network-id=camino` parametresini geçebilirsiniz.

Doğrulayıcıların, diğer düğümlerin kendilerine nasıl bağlanacağını bildirebilmeleri için kamuya açık IP adreslerini bilmeleri gerekir. Bu nedenle, düğümünüz bir doğrulayıcı olarak çalışacaksa, `--public-ip` seçeneğini kullanmanız gerekecektir. Daha fazla bilgi için  kısmına bakabilirsiniz.

## Sonra ne olacak?

Düğümünüz şu an çalışıyor ve bağlı durumda. Eğer düğümünüzü bir doğrulayıcı olarak kullanmak istiyorsanız, 'na gidin ve düğümünüzü orada kaydedin.