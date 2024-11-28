---
title: SP Derleme ve Bağımlılıkları - BNB Greenfield SP
description: Bu doküman, BNB Greenfield SP'nin derlenmesi için gereken bağımlılıkları ve adımları açıklamaktadır. Kullanıcılar, yapılandırma ve kurulum sürecinde karşılaşabilecekleri yaygın hata mesajlarına da göz atabiliyorlar.
keywords: [BNB Greenfield, SP, Golang, bağımlılıklar, kurulum, derleme]
---

## SP'yi Derle

Derleme bağımlılıkları:

- [Golang](https://go.dev): SP, **Golang** ile yazılmıştır, bunu kurmanız gerekir. Golang sürümü `1.20+` gerektirir.
- [Buf](https://buf.build): Protokol Buffers ile çalışmanın yeni bir yolu. SP, proto dosyalarını yönetmek için **Buf** kullanır.
- [protoc-gen-gocosmos](https://github.com/cosmos/gogoproto): Go için Gadget'lerle Protokol Buffers. SP, pb.go dosyaları oluşturmak için bu protobuf derleyicisini kullanır.
- [mockgen](https://github.com/uber-go/mock): Birim testlerinde kullanılan Go programlama dili için bir mocking çerçevesi.
- [jq](https://stedolan.github.io/jq/): Komut satırı JSON işleyici. Kullanıcılar, işletim sisteminize göre **jq** yüklemelidir.

```shell
# kaynak kodu klonla
git clone https://github.com/bnb-chain/greenfield-storage-provider.git

cd greenfield-storage-provider/

# bağımlı araçları yükle: buf, protoc-gen-gocosmos ve mockgen
make install-tools

# sp'yi derle
make build

# derleme dizinine geç
cd build

# gnfd-sp ikili dosyasını çalıştır
./gnfd-sp version

# gnfd-sp sürüm bilgilerini göster
Greenfield Storage Provider
    __                                                       _     __
    _____/ /_____  _________ _____ ____     ____  _________ _   __(_)___/ /__  _____
    / ___/ __/ __ \/ ___/ __  / __  / _ \   / __ \/ ___/ __ \ | / / / __  / _ \/ ___/
    (__  ) /_/ /_/ / /  / /_/ / /_/ /  __/  / /_/ / /  / /_/ / |/ / / /_/ /  __/ /
    /____/\__/\____/_/   \__,_/\__, /\___/  / .___/_/   \____/|___/_/\__,_/\___/_/
    /____/       /_/

Sürüm : v1.0.0
Dal    : master
Gönderim: 7e1f56809c5385bf1ea6f41d318ab1419dcb0f86
Derleme : go1.20.3 darwin arm64 2023-10-08 10:31

# gnfd-sp yardım bilgilerini göster
./gnfd-sp -h
```

### Not

:::warning
Eğer `make install-tools` komutunu shell'inizde zaten çalıştırdıysanız, ancak derleme yapmayı başaramadıysanız ve aşağıdaki hata mesajlarından biriyle karşılaştıysanız:
:::

```shell
# hata mesajı 1
buf: command not found
# golang'ı /usr/local/go/bin altında kurduğunuzu varsayarsak aşağıdaki komutu çalıştırabilirsiniz. Diğer OS'ler benzer şekildedir.
GO111MODULE=on GOBIN=/usr/local/go/bin go install github.com/bufbuild/buf/cmd/buf@v1.25.0

# hata mesajı 2
Failure: plugin gocosmos: could not find protoc plugin for name gocosmos - please make sure protoc-gen-gocosmos is installed and present on your $PATH
# yine golang'ı /usr/local/go/bin altında kurduğunuzu varsayarsak aşağıdaki komutu çalıştırabilirsiniz. Diğer OS'ler benzer şekildedir.
GO111MODULE=on GOBIN=/usr/local/go/bin go install github.com/cosmos/gogoproto/protoc-gen-gocosmos@latest

# sp'nin birim testini çalıştırmak istiyorsanız, aşağıdaki komutu çalıştırmalısınız. Yine golang'ı /usr/local/go/bin altında kurduğunuzu varsayarsak, diğer OS'ler benzer şekildedir.
GO111MODULE=on GOBIN=/usr/local/go/bin go install go.uber.org/mock/mockgen@latest
```

Yukarıdaki hata mesajları, kullanıcıların **go** ortamını doğru ayarlamamasından kaynaklanmaktadır. Kullanıcılar daha fazla bilgi için `GOROOT`, `GOPATH` ve `GOBIN` arayabilirler.

## SP Bağımlılıkları

Bir kullanıcı lokal modda veya testnet modda SP başlatmak istiyorsa, `SPDB`, `BSDB` ve `PieceStore` bağımlılıklarını hazırlamalıdır.

### SPDB ve BSDB

SP, bazı meta verileri depolamak için [SPDB](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/modules/spdb.md) ve [BSDB](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/modules/bsdb.md) kullanır; bunlar nesne bilgileri, nesne bütünlük hash'i vb. içerir. Bu iki veritabanı şimdi karşılık gelen işlevi tamamlamak için `RDBMS` kullanmaktadır.

Kullanıcılar şimdi meta verileri depolamak için `MySQL` veya `MariaDB` kullanabilir. Aşağıda desteklenen **RDBMS** listelenmiştir:

1. [MySQL](https://www.mysql.com/)
2. [MariaDB](https://mariadb.org/)

:::info
Gelecekte `PostgreSQL` veya NewSQL gibi daha fazla veritabanı türü desteklenecektir.
:::

### PieceStore

Greenfield, ana veri depolama sistemi olarak nesne depolamasını kullanan merkeziyetsiz bir veri depolama sistemidir. SP, birden fazla veri depolama sistemiyle uyumlu ortak arayüzler sağlayan [PieceStore](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/modules/piece-store.md) olarak veri depolamayı kapsüller. Bu nedenle, bir kullanıcı SP'ye katılmak veya SP'nin işlevlerini test etmek istiyorsa, bir veri depolama sistemi kullanmalıdır.

Aşağıda desteklenen veri depolama sistemleri listelenmiştir:

1. [AWS S3](https://aws.amazon.com/s3/): Üretim ortamında kullanılabilecek bir nesne depolama.
2. [Aliyun OSS](https://www.alibabacloud.com/en/product/object-storage-service): Herhangi bir yerden veri depolamak ve erişmek için tam yönetilen nesne depolama hizmeti.
3. [B2](https://www.backblaze.com/cloud-storage): Backblaze B2, Amazon S3'ün 1/5'i maliyetle bulutta sınırsız veri depolama sağlar.
4. [MinIO](https://min.io/): AWS S3 ile uyumlu üretim ortamında kullanılabilecek bir nesne depolama.
5. [POSIX Dosya Sistemi](https://en.wikipedia.org/wiki/POSIX): SP'nin temel özelliklerini deneyimlemek ve SP'nin nasıl çalıştığını anlamak için yerel dosya sistemi kullanılır. SP tarafından oluşturulan parça verileri ağ üzerinde elde edilemez ve yalnızca tek bir makinada kullanılabilir.

:::note
`PieceStore` hakkında detaylı bilgi için bu `belgeye` başvurabilirsiniz.
:::

### Bağımlılıkları Yükle

#### CentOS'ta MySQL'i Yükle

1. MySQL yum paketini yükleyin

```shell
# 1. MySQL yum paketini indirin
wget http://repo.mysql.com/mysql57-community-release-el7-10.noarch.rpm

# 2. MySQL kaynağını yükleyin
rpm -Uvh mysql57-community-release-el7-10.noarch.rpm

# 3. kamu anahtarını yükleyin
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

# 4. MySQL sunucusunu yükleyin
yum install -y mysql-community-server

# 5. MySQL'i başlat
systemctl start mysqld.service

# 6. Başlatmanın başarılı olup olmadığını kontrol et
systemctl status mysqld.service

# 7. Geçici şifreyi alın
grep 'temporary password' /var/log/mysqld.log 

# 8. Geçici şifre ile MySQL'e giriş yapın
# Geçici şifre ile giriş yaptıktan sonra başka bir işlem yapmayın. Aksi takdirde hata alınır. Bu durumda şifreyi değiştirmeniz gerekir.
mysql -uroot -p

# 9. MySQL şifre kurallarını değiştir
mysql> set global validate_password_policy=0;
mysql> set global validate_password_length=1;
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';