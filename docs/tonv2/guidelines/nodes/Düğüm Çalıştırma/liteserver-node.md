import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver Node

:::info
Bu makaleden önce `Tam Düğüm` hakkında bilgi edinin
:::

Bir uç nokta tam düğümde etkinleştirildiğinde, düğüm bir **Liteserver** rolünü üstlenir. Bu düğüm türü, Lite Clients'tan gelen talepleri karşılayabilir ve yanıt verebilir, TON Blockchain ile kesintisiz etkileşimi sağlar.

## Donanım gereksinimleri

Bir `doğrulayıcı` ile karşılaştırıldığında, liteserver modu daha az kaynak gerektirir. Ancak, bir liteserver çalıştırmak için güçlü bir makine kullanılması önerilir.

- en az 16 çekirdekli CPU
- en az 128 GB RAM
- en az 1TB NVMe SSD _VEYA_ 64+k IOPS depolama
- 1 Gbit/s ağ bağlantısı
- yüksek yükte 16 TB/ay trafik
- genel IP adresi (_sabit IP adresi_)

### Önerilen Sağlayıcılar

`Önerilen Sağlayıcılar` bölümünde listelenen bulut sağlayıcılarını kullanabilirsiniz.

Hetzner ve OVH, bir doğrulayıcı çalıştırmak için yasaklanmıştır, ancak bir liteserver çalıştırmak için bunları kullanabilirsiniz:

- __Hetzner__: EX101, AX102
- __OVH__: RISE-4

## Liteserver'in kurulumu

Eğer mytonctrl'unuz yoksa, `-m liteserver` bayrağı ile kurun:


  

  ```bash
  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
  sudo bash ./install.sh -m liteserver
  ```

  
  

  ```bash
  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
  su root -c 'bash ./install.sh -m liteserver'
  ```

  


* `-d` - **mytonctrl** en son blockchain durumunun bir [dump](https://dump.ton.org/) dosyasını indirecek.
  Bu, senkronizasyon süresini birkaç kat azaltacaktır.
* `-c ` - Senkronizasyon için genel olmayan liteserver'lar kullanmak istiyorsanız. _(zorunlu değil)_
* `-i` - Minimum gereksinimleri göz ardı et, sadece gerçek düğüm kullanımı olmadan derleme sürecini kontrol etmek istiyorsanız kullanın.
* `-m` - Mod, `doğrulayıcı` veya `liteserver` olabilir.

**Testnet'i kullanmak için**, `-c` bayrağı `https://ton.org/testnet-global.config.json` değeri ile sağlanmalıdır.

Varsayılan `-c` bayrağı değeri `https://ton-blockchain.github.io/global.config.json` olup, varsayılan ana ağ yapılandırmasıdır.

Eğer mytonctrl'unuz zaten kuruluysa, çalıştırın:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Firewall ayarlarını kontrol et

Öncelikle, `/var/ton-work/db/config.json` dosyanızda belirtilen Liteserver portunu doğrulayın. Bu port, her yeni `MyTonCtrl` kurulumuyla birlikte değişir. `port` alanında yer almaktadır:

```json
{
  ...
  "liteservers": [
    {
      "ip": 1605600994,
      "port": LITESERVER_PORT
      ...
    }
  ]
}
```

:::warning
Eğer bir bulut sağlayıcı kullanıyorsanız, bu portu güvenlik duvarı ayarlarında açmanız gerekir. Örneğin, AWS kullanıyorsanız, portu [güvenlik grubunda](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html) açmanız gerekir.
:::

Aşağıda, bare metal sunucu güvenlik duvarında bir port açmanın örneği bulunmaktadır.

### Güvenlik Duvarında Bir Port Açma

`ufw` yardımcı programını kullanacağız ([kısa not](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). Tercih ettiğinizi kullanabilirsiniz.

1. Yüklü değilse `ufw`'yi kurun:

```bash
sudo apt update
sudo apt install ufw
```

2. ssh bağlantılarına izin verin:

```bash
sudo ufw allow ssh
```

3. `config.json` dosyasında belirtilen portu açın:

```bash
sudo ufw allow <port>
```

4. Güvenlik duvarını etkinleştirin:

```bash
sudo ufw enable
```

5. Güvenlik duvarı durumunu kontrol edin:

```bash
sudo ufw status
```

Bu şekilde, sunucunuzun güvenlik duvarı ayarlarında portu açabilirsiniz.

## Liteserver ile Etkileşim (lite-client)

> 0. Bilgisayarınızda boş bir proje oluşturun ve `config.json` dosyasını proje klasörüne yapıştırın. Bu yapılandırmayı elde etmek için aşağıdaki komutu kullanın:  
> `installer clcf # mytonctrl içinde`  
> Bu, mytonctrl'un kurulu olduğu makinede `/usr/bin/ton/local.config.json` dosyasını oluşturacaktır. Daha fazla bilgi için `mytonctrl belgelerini kontrol edin`.

1. Kütüphaneleri yükleyin.


  

  ```bash
  npm i --save ton-core ton-lite-
  ```

  
  

  ```bash
  pip install pytonlib
  ```

  
  

  ```bash
  go get github.com/xssnick/tonutils-go
  go get github.com/xssnick/tonutils-go/lite
  go get github.com/xssnick/tonutils-go/ton
  ```
  


2. Bir başlatın ve liteserver'ın çalıştığından emin olmak için masterchain bilgisi talep edin.


  

Proje türünü `module` olarak değiştirin `package.json` dosyanızda:

  ```json
  {
      "type": "module"
  }
  ```

`index.js` dosyasını aşağıdaki içerik ile oluşturun:
  ```js
  import { LiteSingleEngine } from 'ton-lite-/dist/engines/single.js'
  import { LiteRoundRobinEngine } from 'ton-lite-/dist/engines/roundRobin.js'
  import { Lite } from 'ton-lite-/dist/.js'
  import config from './config.json' assert {type: 'json'};


  function intToIP(int ) {
      var part1 = int & 255;
      var part2 = ((int >> 8) & 255);
      var part3 = ((int >> 16) & 255);
      var part4 = ((int >> 24) & 255);

      return part4 + "." + part3 + "." + part2 + "." + part1;
  }

  let server = config.liteservers[0];

  async function main() {
      const engines = [];
      engines.push(new LiteSingleEngine({
          host: `tcp://${intToIP(server.ip)}:${server.port}`,
          publicKey: Buffer.from(server.id.key, 'base64'),
      }));

      const engine = new LiteRoundRobinEngine(engines);
      const  = new Lite({ engine });
      const master = await .getMasterchainInfo()
      console.log('master', master)

  }

  main()

  ```

  
  

  ```python
    from pytoniq import LiteClient

    async def main():
        client = LiteClient.from_mainnet_config(  # ana ağa, test ağı veya özel yapılandırma sözlüğü seçin
            ls_i=0,  # yapılandırmadan liteserver'ın dizini
            trust_level=2,  # liteserver için güven seviyesi
            timeout=15  # timeout, pytonlib'de anahtar blok senkronizasyonunu içermez
        )
    
        await client.connect()
    
        await client.get_masterchain_info()
    
        await client.reconnect()  # herhangi bir hata aldıysa mevcut bir nesneye yeniden bağlanabilir
    
        await client.close()
    
        """ya da bunu bağlam yöneticisi ile kullanın: """
        async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2, timeout=15) as client:
            await client.get_masterchain_info()

  ```

  
  

  ```go
  package main

  import (
      "context"
      "encoding/json"
      "io/ioutil"
      "log"
      "github.com/xssnick/tonutils-go/liteclient"
      "github.com/xssnick/tonutils-go/ton"
  )

  func main() {
      client := liteclient.NewConnectionPool()

      content, err := ioutil.ReadFile("./config.json")
      if err != nil {
          log.Fatal("Dosya açma hatası: ", err)
      }

      config := liteclient.GlobalConfig{}
      err = json.Unmarshal(content, &config)
      if err != nil {
          log.Fatal("Unmarshal() sırasında hata: ", err)
      }

      err = client.AddConnectionsFromConfig(context.Background(), &config)
      if err != nil {
          log.Fatalln("bağlantı hatası: ", err.Error())
          return
      }

      // ton API liteserver bağlantı sargısını başlat
      api := ton.NewAPIClient(client)

      master, err := api.GetMasterchainInfo(context.Background())
      if err != nil {
          log.Fatalln("masterchain bilgisi alma hatası: ", err.Error())
          return
      }

      log.Println(master)
}

  ```
  


3. Artık kendi liteserver'ınızla etkileşimde bulunabilirsiniz.

## Ayrıca Bakınız

* [[YouTube] Liteserver'ı başlatma ile ilgili öğretici](https://youtu.be/p5zPMkSZzPc)