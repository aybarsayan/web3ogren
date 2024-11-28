---
title: Relayer Çalıştır - BNB Greenfield Düğümü
description: Bu eğitim, Greenfield'dan BSC ve opBNB'ye relayer'ları çalıştırmak için gereken adımları detaylandırmaktadır. Gerekli donanım ve yazılım yapılandırmaları ile birlikte önemli bilgiler ve örnek komutlar sunulmaktadır.
keywords: [Greenfield, relayer, BSC, opBNB, blockchain, yapılandırma, eğitim]
order: 5
---

# Relayer Çalıştır

Bu eğitim, Greenfield'dan BSC ve opBNB'ye relayer'ları çalıştırmak içindir. Aynı ikili dosyayı kullandıklarını, ancak farklı veritabanlarına bağlı iki ayrı sürecin gerektiğini lütfen unutmayın. Bu iki relayer için çoğu yapılandırma aynıdır, ancak aşağıda gösterileceği gibi bazı farklılıklar vardır.

## Ön Gereksinimler

### Önerilen Donanım

Aşağıda önerilen donanım gereksinimleri listelenmiştir:
- **Donanım Gereksinimleri:** Güncel Mac OS X veya Linux sürümlerini çalıştıran masaüstü veya dizüstü bilgisayar donanımı.
- **CPU:** 4 çekirdek
- **RAM:** 4 GB
- **İlişkisel veritabanı:** Mysql

### Anahtar Hazırlığı
- **Relayer özel anahtarı:** Bu, Greenfield ile BSC/opBNB arasında işlem iletmek için kullanılan hesaptır. Her iki Blockchain ağında da bakiyesi olduğundan emin olun.
- **Bls özel anahtarı:** Zincirler arası paket için bls imzası oluşturmak için kullanılır.

Bu iki anahtar, `validator_ol` adım 2'de oluşturulan `validator_relayer` ve `validator_bls`'ye atıfta bulunmaktadır.

Aşağıdaki komutlarla bunları alabilirsiniz.
```bash
gnfd keys export validator_relayer --unarmored-hex --unsafe --keyring-backend test

gnfd keys export validator_bls --unarmored-hex --unsafe --keyring-backend test
```

## İkili Dosyayı Hazırlayın

Terminalinizde aşağıdaki komutu çalıştırarak greenfield-relayer uygulamasını edinin:

```bash
git clone --branch "$(curl -s https://api.github.com/repos/bnb-chain/greenfield-relayer/releases/latest  | jq -r '.tag_name')" https://github.com/bnb-chain/greenfield-relayer.git
cd greenfield-relayer
```

## Yapılandırma

`config/config.json` dosyasını düzenleyin. Ya da yeni bir tane oluşturup relayer'ı başlatırken `--config-path` bayrağı ile yapılandırma yolunu belirtebilirsiniz.

::: info
    Testnet yapılandırması için [Testnet yapılandırması](https://github.com/bnb-chain/bnb-chain-charts/blob/master/gnfd-relayer-testnet-values/values.yaml#L4) bölümüne bakın. Aşağıda gösterileceği gibi birkaç değişiklik yaparak bunu ana ağ yapılandırmanız için bir şablon olarak kullanabilirsiniz.
:::

1. Relayer özel anahtarı ve bls özel anahtarı içe aktarma yöntemini (dosya veya aws sırrı) ve anahtarları, blok izleme başlangıç yüksekliklerini ayarlayın.
   ```json
   "greenfield_config": {
     "key_type": "local_private_key", // veya aws gizli yöneticisi kullanıyorsanız "aws_private_key".
     ...
     "aws_bls_secret_name": "",
     "private_key": "your_private_key", // bu relayer işlemlerinin iletimi için kullanılan özel anahtardır.
     "bls_private_key": "your_private_key", // bu, zincirler arası paket imzası için kullanılan bls anahtarıdır.
     "rpc_addrs": [
       "https://greenfield-chain.bnbchain.org:443"
      ],
     "chain_id": 1017,
     ...
     "start_height": 1,  // lütfen Greenfield ağının mevcut blok yüksekliğine değiştirin.
     "chain_id_string": "greenfield_1017-1"
   }, 
   "bsc_config": {
     "key_type": "local_private_key",  // veya aws gizli yöneticisi kullanıyorsanız "aws_private_key".
     ...
     "rpc_addrs": [
        "BSC_RPC"
     ],
     "private_key": "your_private_key", // yukarıdaki greenfield_config'deki ile aynı.
     "gas_limit": 20000000,
     ...
     "start_height": 0,   // lütfen BSC ağının mevcut blok yüksekliğine değiştirin.
     "chain_id": 56  // 56, BSC Ana Ağı zincir kimliğidir.
   }
   ```
   `opBNB`'ye zincirler arası bağ kurmak için relayer'ı ayarlarken `bsc_config`'i aşağıdaki gibi değiştirin.
   ```json
   "bsc_config": {
        "op_bnb": true, // bu, yapılandırmanın opBNB zincirleri arası olduğunu belirtir.
        "key_type": "local_private_key",  // veya aws gizli yöneticisi kullanıyorsanız "aws_private_key".
        ...
        "rpc_addrs": [
           "opBNB_RPC"
        ],
        "private_key": "your_private_key", // yukarıdaki greenfield_config'deki ile aynı.
        "gas_limit": 20000000,
        ...
        "start_height": 0,   // lütfen opBNB ağının mevcut blok yüksekliğine değiştirin.
        "chain_id": 204 // opBNB ana ağ zincir kimliği
      }
   ```
   **Not:**
   Greenfield RPC adresi için `Greenfield Uç Noktaları`, BSC RPC adresi için [BSC Uç Noktaları](https://docs.bscscan.com/misc-tools-and-utilities/public-rpc-nodes) ve konumunuza göre uygun olanları kullanın, opBNB RPC adresi için `opBNB Uç Noktaları` ve konumunuza göre uygun olanları kullanın.
   
   Resmi BSC/opBNB uç noktalarını kullanırken `Hız sınırı` sorunu ile karşılaşabilirsiniz, 3. Parti RPC'leri kullanmanızı şiddetle öneririz, örneğin [NodeReal MegaNode](https://nodereal.io/meganode).

2. CrossChain, Greenfield hafif istemcisi ve relayer hub akıllı sözleşme adreslerini yapılandırın, diğerlerini varsayılan değerlerde tutabilirsiniz, ana ağ/test ağı için adresleri almak için bu `sözleşme listesine` başvurun.

    === "BSC-Ana Ağ"
    
        ``` json
        "relay_config": {
            ... 
            "cross_chain_contract_addr": "0x77e719b714be09F70D484AB81F70D02B0E182f7d",
            "greenfield_light_client_contract_addr": "0x433bB48Bd86c089375e53b2E2873A9C4bC0e986B",
            "relayer_hub_contract_addr": "0x31C477F05CE58bB81A9FB4b8c00560f1cBe185d1"
        }
        ```
    
    === "BSC-Test Ağı"
    
        ``` json
        "relay_config": {
          ... 
          "cross_chain_contract_addr": "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7",
          "greenfield_light_client_contract_addr": "0xa9249cefF9cBc9BAC0D9167b79123b6C7413F50a",
          "relayer_hub_contract_addr": "0x91cA83d95c8454277d1C297F78082B589e6E4Ea3"
        }
        ```
    
    === "opBNB-Ana Ağ"
    
        ``` json
        "relay_config": {
          ... 
          "cross_chain_contract_addr": "0x7E376AEFAF05E20e3eB5Ee5c08fE1B9832b175cE",
          "greenfield_light_client_contract_addr": "0xf51ba131716776685A805E8E4Ecc95be2f923B93",
          "relayer_hub_contract_addr": "0xEd873b460C53D22f0FF3fc511854d9b8b16C4aE2"
        }
        ```
    
    === "opBNB-Test Ağı"
    
        ``` json
        "relay_config": {
          ... 
          "cross_chain_contract_addr": "0xF0Bcf6E4F72bCB33b944275dd5c9d4540a259eB9",
          "greenfield_light_client_contract_addr": "0xc50791892F6528E42A58DD07869726079C71F3f2",
          "relayer_hub_contract_addr": "0x59ACcF658CC4589C3C41720fd48e869B97A748a1"
        }
        ```

3. Veritabanı ayarlarını yapılandırın.
    
    ```json
    "db_config": {
        "dialect": "mysql",
        "key_type": "local_private_key",
        "aws_region": "",
        "aws_secret_name": "",
        "password": "${pass}",
        "username": "${user}",
        "url": "tcp(${host})/greenfield-relayer?charset=utf8&parseTime=True&loc=Local",
        "max_idle_conns": 10,
        "max_open_conns": 100
    }
    ```
    
    **Not:** Lütfen ${pass}, ${user}, ${host} değerlerini Mysql örneğinizin kimlik bilgileri ve ana bilgisayarı ile değiştirin. Ve `greenfield-relayer` dışındaki farklı bir veritabanı kullanın, örneğin, aynı DB örneğinde opBNB'ye geçiş yaparken `greenfield-op-relayer` kullanın.

## Derleme

İkili dosyayı derleyin:

```shell
make build
```

Ya da Docker imajını oluşturun:

```shell
make build_docker
```

## Çalıştır

### DB Şemasını Oluşturun
Veritabanı örneğinin çalıştığından emin olun.

MySQL istemcisi ile şema oluşturun:

```shell
CREATE SCHEMA IF NOT EXISTS `greenfield-relayer` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

### Relayer'ı Başlatın

```shell
./build/greenfield-relayer --config-type [local veya aws] --config-path config_file_path  --aws-region [aws bölgesi veya hariç tut] --aws-secret-key [yapılandırma için aws gizli anahtarı veya hariç tut]
```

**Örnek:**
```shell
./build/greenfield-relayer --config-type local --config-path config/config.json
```

Docker'ı çalıştırın:
```shell
docker run -it -v /your/data/path:/greenfield-relayer -e CONFIG_TYPE="local" -e CONFIG_FILE_PATH=/your/config/file/path/in/container -d greenfield-relayer
```

Ya da Greenfield relayer uygulamasını Helm Chart V3 kullanarak dağıtabilirsiniz. Lütfen [relayer-readme](https://github.com/bnb-chain/greenfield/blob/master/deployment/helm/relayer-readme.md) bölümüne başvurun.