---
title: Run Challenger - BNB Greenfield Node
description: This guide provides detailed steps for setting up and running the BNB Greenfield Node using the Challenger application. It covers hardware requirements, key preparation, configuration, compilation, and execution, along with helpful tips and warnings.
keywords: [BNB, Greenfield Node, Challenger, configuration, MySQL, Docker, deployment]
order: 6
---

## Ön Koşullar

### Önerilen Donanım

Aşağıda önerilen donanım gereksinimleri listelenmiştir:
- **Donanım Gereksinimleri**: Güncel versiyonlarıyla Mac OS X veya Linux çalıştıran masaüstü veya dizüstü bilgisayar donanımı.
- **CPU**: 4 çekirdek
- **RAM**: 4 GB
- **İlişkisel veritabanı**: Mysql

### Anahtar Hazırlığı
- **Challenger özel anahtarı**: İşlemleri imzalamak ve onaylamak için kullanılır.
- **Bls özel anahtarı**: Oyları toplamak için kullanılır.

Bu iki anahtar, `become-validator` adım 2'de oluşturulan `validator_challenger` ve `validator_bls` 'yı ifade eder. 

Aşağıdaki komutlar ile bu anahtarları alabilirsiniz.

```bash
gnfd keys export validator_challenger --unarmored-hex --unsafe --keyring-backend test

gnfd keys export validator_bls --unarmored-hex --unsafe --keyring-backend test
```

## İkili Dosyayı Hazırla

Terminalinizde aşağıdaki komutu çalıştırarak greenfield-challenger uygulamasını alın:

```bash
git clone --branch "$(curl -s https://api.github.com/repos/bnb-chain/greenfield-challenger/releases/latest  | jq -r '.tag_name')" https://github.com/bnb-chain/greenfield-challenger.git
cd greenfield-challenger
```

## Konfigürasyon

`config/config.json` dosyasını değiştirin. Ya da yeni bir tane oluşturabilir ve `--config-path` bayrağı ile konfigürasyon yolunu belirtebilirsiniz.

::: info
Tam bir [konfigürasyon dosyası](https://github.com/bnb-chain/bnb-chain-charts/blob/master/gnfd-challenger-testnet-values/values.yaml#L4) referansı için.
:::

1. **Özel anahtarınızı ve bls anahtarınızı ayarlayın** (dosya veya aws sırrı aracılığıyla).

    ```json
    "greenfield_config": {
      "key_type": "local_private_key" veya "aws_private_key" anahtarları aws'de mi yoksa yerel olarak bu json dosyasında mı depoladığınıza bağlı,
      "aws_region": "aws_private_key" seçimini yaptıysanız bunu ayarlayın,
      "aws_secret_name": "aws_private_key" seçimini yaptıysanız bunu ayarlayın,
      "aws_bls_secret_name": "aws_private_key" seçimini yaptıysanız bunu ayarlayın,
      "private_key": "local_private_key" seçimini yaptıysanız bunu ayarlayın,
      "bls_private_key": "local_private_key" seçimini yaptıysanız bunu ayarlayın,
      ...
    }
    ```

    ::: note
    `private_key` terimi, `validator_challenger` hesabının özel anahtarına, `bls_private_key` terimi ise
    `validator_bls` hesabının özel anahtarına işaret eder. Bu özel anahtarları elde etmek için, 
    `anahtar hazırlığı` bölümünde verilen talimatları takip edebilirsiniz.
    :::

2. **RPC Adresinizi ve Zincir Kimliğinizi ayarlayın** 

    === "Ana Ağa"

        ```json
        "greenfield_config": {
            "rpcAddr": "https://greenfield-chain.bnbchain.org:443",
            "chainId": "greenfield_1017-1"
        }
        ```

    === "Test Ağı"

        ```json
        "greenfield_config": {
            "rpcAddr": "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443",
            "chainId": "greenfield_5600-1"
        }
        ```

3. **Veritabanı ayarlarınızı yapılandırın.**

    ```json
    "db_config": {
        "dialect": "mysql",
        "db_path": "your_db_path",
        "key_type": "local_private_key" veya "aws_private_key" anahtarları aws'de mi yoksa yerel olarak bu json dosyasında mı depoladığınıza bağlı,
        "aws_region": "aws_private_key" seçimini yaptıysanız bunu ayarlayın, aksi takdirde boş bırakın,
        "aws_secret_name": "aws_private_key" seçimini yaptıysanız bunu ayarlayın, aksi takdirde boş bırakın,
        "username": "local_private_key" seçimini yaptıysanız veritabanı kullanıcı adını ayarlayın, aksi takdirde boş bırakın,
        "password": "local_private_key" seçimini yaptıysanız veritabanı parolasını ayarlayın, aksi takdirde boş bırakın,
        ...
    }
    ```

4. **İçsel sp yapılandırmanızı ayarlayın** (ölçüm amacı için).

    ```json
    "sp_config": {
        "internal_sp_endpoints": [] // içsel SP’lerin uç noktalarının listesi
    }
    ```

## Derleme

**İkili dosyayı derleyin:**

```shell
make build
```

**Docker görüntüsünü derleyin:**

```shell
make build_docker
```

## Çalıştırma

### MySQL'i Docker'da çalıştırın (sqlite kullanıyorsanız atlanabilir)

```shell
docker run --name gnfd-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```

### Veritabanı Şemasını Oluşturun

MySQL istemcisinde şemayı oluşturun:

```sql
CREATE SCHEMA IF NOT EXISTS `challenger` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

### Challenger'ı Başlatın

```shell
./build/greenfield-challenger --config-type [local or aws] --config-path config_file_path  --aws-region [aws region or omit] --aws-secret-key [aws secret key for config or omit]
```

**Örnek:**

```shell
./build/greenfield-challenger --config-type local --config-path config/config.json
```

**Docker'ı çalıştırın:**

```shell
docker run -it -v /your/data/path:/greenfield-challenger -e CONFIG_TYPE="local" -e CONFIG_FILE_PATH=/your/config/file/path/in/container -d greenfield-challenger
```

Ayrıca greenfield challenger uygulamasını Helm Chart V3 kullanarak dağıtabilirsiniz. Lütfen [challenger-readme](https://github.com/bnb-chain/greenfield/blob/master/deployment/helm/challenger-readme.md) referansına bakın.