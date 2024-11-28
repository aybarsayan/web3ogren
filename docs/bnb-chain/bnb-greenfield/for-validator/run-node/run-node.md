---
title: Node Çalıştır - BNB Greenfield Düğümu
description: Bu belge, BNB Greenfield Tam Düğümü kurulum sürecini ve minimum sistem gereksinimlerini ayrıntılı bir şekilde açıklamaktadır. Kullanıcıların düğümlerini nasıl kuracaklarına dair adım adım talimatlar ve önemli bilgiler içermektedir.
keywords: [BNB Greenfield, Tam Düğüm, kurulum, sistem gereksinimleri, blockchain, ağ, yönlendirme]
order: 4
---

# Node Çalıştır

## Minimum Sistem Gereksinimleri
Donanım, Tam Düğüm çalıştırmak için belirli gereksinimleri karşılamalıdır:

* **Son sürüm Mac OS X veya Linux** çalıştıran masaüstü veya dizüstü donanım.
* **En az 100 MB/s** okuma/yazma hızına erişilebilir 1 TB boş disk alanı.
* **4 çekirdekli CPU** ve **12 gigabayt bellek (RAM)**.
* **En az saniyede 1 megabayt** yükleme/indirme hızına sahip geniş bant internet bağlantısı.

---

## Yeni Bir Düğüm Kurulumu

::: info
Kullanım için gerekli olan doğru sürüm ve yapılandırma dosyası hakkında ayrıntılar için lütfen [greenfield repo](https://github.com/bnb-chain/greenfield/releases/latest) sayfasını kontrol edin.
:::

1. Greenfield Zinciri için bir ana klasör `$NODE_HOME` (örn. ~/.gnfd) seçmeniz gerekir. Bunu aşağıdaki şekilde ayarlayabilirsiniz:

   ```
   mkdir ~/.gnfd
   mkdir ~/.gnfd/config
   ```

2. `https://github.com/bnb-chain/greenfield/releases` adresinden `app.toml`, `config.toml` ve `genesis.json` dosyalarını indirin ve `$NODE_HOME/config` dizinine kopyalayın.


mainnet

```bash
wget  $(curl -s https://api.github.com/repos/bnb-chain/greenfield/releases/latest |grep browser_ |grep mainnet_config |cut -d\" -f4)
unzip mainnet_config.zip
cp mainnet_config/*  ~/.gnfd/config/
```



testnet

```bash
wget  $(curl -s https://api.github.com/repos/bnb-chain/greenfield/releases/latest |grep browser_ |grep testnet_config |cut -d\" -f4)
unzip testnet_config.zip
cp testnet_config/*  ~/.gnfd/config/
```


Bu takma ismi daha sonra, `$NODE_HOME/config/config.toml` dosyasında düzenleyebilirsiniz:
```toml
# Bu düğüm için özel bir insan tarafından okunabilir isim
moniker = "<your_custom_moniker>"
```

::: note
Takma isimler yalnızca ASCII karakterler içerebilir. Unicode karakterler kullanmak düğümünüzün ulaşılamaz hale gelmesine neden olur.
:::

Artık Tam Düğümünüz başlatılmıştır.

4. Tam Düğümünüzü başlatın.

```shell
gnfd start
```

::: note
Alternatif olarak, farklı bir $NODE_HOME konumu seçtiyseniz ve önerilen varsayılan `~/.gnfd` kullanmıyorsanız, $NODE_HOME'unuzun seçilen dizin olduğunu belirterek aşağıdaki komutla tam düğümü başlatabilirsiniz.

Örnek: Eğer `/usr/local/gnfd` dizinini ana dizin olarak ayarladıysanız, aşağıdaki komutla Tam Düğümü başlatın.

```shell
gnfd start --home /usr/local/gnfd
```
:::

---

### Ek Yapılandırma
- **Seed düğümü**: Tam Düğümünüzün blockchain ağındaki akranları bulabilmesi gerekir. Sağlıklı seed düğümlerini `$NODE_HOME/config/config.toml` dosyasına eklemeniz gerekecek. Önerilen `config.toml` zaten bazı seed düğümlerine bağlantılar içerir.

- **Hizmet Portu**: RPC hizmeti varsayılan olarak `26657` portunu dinlerken, P2P hizmeti `26656` portunu dinler. Tam düğümü başlatmadan önce bu iki portun açık olduğundan emin olun, aksi takdirde tam düğüm başka portları dinlemek zorunda kalabilir.

- **Depolama**: Tüm durum ve blok verileri `$NODE_HOME/data` altında depolanacak, bu dosyalardan herhangi birini silmeyin veya düzenlemeyin.

---

## Tam Düğümünüzden Ek Bilgiler Alın

Eğer bir Tam Düğüm çalıştırıyorsanız, yerel dosyalara ek mesajlar yayınlayabilirsiniz.

##### Eş Zamanlama Sürecini İzleme

Eyalet eş zamanlamasının tamamlanıp tamamlanmadığını şu komut ile kontrol edebilirsiniz:

```shell
curl localhost:26657/status
```

Yanıt olarak `latest_block_height` değerinin artıp artmadığını kontrol ederek bu süreci doğrulayabilirsiniz.

```
"sync_info": {
  ...
  "latest_block_height": "280072",
  "latest_block_time": "2023-04-07T01:58:13.572249854Z",
  ...
}
```

---

## Prometheus Metrikleri

Prometheus varsayılan olarak `26660` portunda etkinleştirilmiştir ve uç nokta `/metrics`'dir.

## Araçlar

* [Explorer](https://greenfieldscan.com/)