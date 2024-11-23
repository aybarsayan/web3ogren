# Kaynaklardan Derleme

Önceden derlenmiş ikili dosyaları `buradan` indirebilirsiniz.

Eğer kaynakları kendiniz derlemek istiyorsanız, aşağıdaki talimatları izleyin.

:::caution
Bu, basit bir hızlı derleme kılavuzudur. 

Eğer üretim için derleme yapıyorsanız ve ev kullanımı için değilse, [otomatik derleme scriptlerini](https://github.com/ton-blockchain/ton/tree/master/.github/workflows) kullanmanız daha iyi olur.
:::

## Genel

Yazılımın çoğu Linux sisteminde derlenip düzgün çalışması bekleniyor. macOS ve hatta Windows'ta da çalışması gerekir.

1) GitHub deposundan mevcut en yeni TON Blockchain kaynaklarını indirin: https://github.com/ton-blockchain/ton/:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2) Şunların en yeni sürümlerini yükleyin:
   - `make`
   - `cmake` sürüm 3.0.2 veya daha yeni
   - `g++` veya `clang` (veya işletim sisteminize uygun başka bir C++14 uyumlu derleyici).
   - OpenSSL (C başlık dosyaları dahil) sürüm 1.1.1 veya daha yeni
   - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`

### Ubuntu'da

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3) Kaynak ağaç dosyasını `~/ton` dizinine çektiğinizi ve `~/ton-build` adında boş bir dizin oluşturduğunuzu varsayın:

```bash
mkdir ton-build
```

Sonra Linux veya macOS terminalinde aşağıdaki komutları çalıştırın:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### MacOS'ta

Gerekli sistem paketlerini yükleyerek sistemi hazırlayın:
```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

Yeni yüklenen clang'i kullanın. 
```zsh
export CC=/opt/homebrew/opt/llvm@16/bin/clang
export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

secp256k1'i derleyin:
```zsh
git clone https://github.com/bitcoin-core/secp256k1.git
cd secp256k1
secp256k1Path=`pwd`
git checkout v0.3.2
./autogen.sh
./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
make -j12
```

ve lz4:

```zsh
git clone https://github.com/lz4/lz4
cd lz4
lz4Path=`pwd`
git checkout v1.9.4
make -j12
```

ve OpenSSL 3.0'ı yeniden bağlantı yapın:

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

Artık TON'u derleyebilirsiniz:

```zsh
cmake -GNinja -DCMAKE_BUILD_TYPE=Release .. \
-DCMAKE_CXX_FLAGS="-stdlib=libc++" \
-DSECP256K1_FOUND=1 \
-DSECP256K1_INCLUDE_DIR=$secp256k1Path/include \
-DSECP256K1_LIBRARY=$secp256k1Path/.libs/libsecp256k1.a \
-DLZ4_FOUND=1 \
-DLZ4_LIBRARIES=$lz4Path/lib/liblz4.a \
-DLZ4_INCLUDE_DIRS=$lz4Path/lib
```
:::

:::tip
Eğer az bellekli bir bilgisayarda derleme yapıyorsanız (örneğin, 1 Gb), unutmayın ki `bir takas bölümü oluşturmalısınız`.
:::

## Küresel Konfigürasyonu İndirin

Lite client gibi araçlar için küresel ağ konfigürasyonunu indirmeniz gerekmektedir.

Ana ağ için en yeni konfigürasyon dosyasını [global.config.json](https://ton-blockchain.github.io/global.config.json) adresinden indirin:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

veya test ağı için [testnet-global.config.json](https://ton-blockchain.github.io/testnet-global.config.json) adresinden indirin:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite Client

Lite client derlemek için `ortak kısımları` yapın, `konfigürasyonu indirin` ve ardından:

```bash
cmake --build . --target lite-client
```

Konfigürasyon ile Lite Client'ı çalıştırın:

```bash
./lite-client/lite-client -C global.config.json
```

> Her şey başarıyla yüklendiyse, Lite Client özel bir sunucuya (TON Blockchain Ağı için tam düğüm) bağlanacak ve sunucuya bazı sorgular gönderecektir. Eğer istemciye yazılabilir bir "veritabanı" dizini belirttiyseniz, en yeni masterchain bloğuna karşılık gelen bloğu ve durumu indirecek ve kaydedecektir:

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Temel yardım bilgileri, Lite Client'a `help` yazarak elde edilebilir. Çıkmak için `quit` yazın veya `Ctrl-C` tuşuna basın.

## FunC

FunC derleyicisini kaynak kodundan derlemek için, yukarıda açıklanan `ortak kısımları` yapın ve ardından:

```bash
cmake --build . --target func
```

FunC akıllı sözleşmesini derlemek için:

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

Fift derleyicisini kaynak kodundan derlemek için, yukarıda açıklanan `ortak kısımları` yapın ve ardından:

```bash
cmake --build . --target fift
```

Fift scriptini çalıştırmak için:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

tonlib-cli'yi derlemek için, `ortak kısımları` yapın, `konfigürasyonu indirin` ve ardından:

```bash
cmake --build . --target tonlib-cli
```

tonlib-cli'yi konfigürasyon ile çalıştırın:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Temel yardım bilgileri, tonlib-cli'ye `help` yazarak elde edilebilir. Çıkmak için `quit` yazın veya `Ctrl-C` tuşuna basın.

## RLDP-HTTP-Proxy

rldp-http-proxy'yi derlemek için, `ortak kısımları` yapın, `konfigürasyonu indirin` ve ardından:

```bash
cmake --build . --target rldp-http-proxy
```

Proxy ikili dosyası aşağıda bulunmaktadır:

```bash
./rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

generate-random-id'yi derlemek için, `ortak kısımları` yapın ve ardından:

```bash
cmake --build . --target generate-random-id
```

İkili dosya aşağıda bulunmaktadır:

```bash
./utils/generate-random-id
```

## storage-daemon

storage-daemon ve storage-daemon-cli'yi derlemek için, `ortak kısımları` yapın ve ardından:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

İkili dosya aşağıda bulunmaktadır:

```bash
./storage/storage-daemon/
```

--- 

# Eski TON Sürümlerini Derleme

TON sürümleri: [https://github.com/ton-blockchain/ton/tags](https://github.com/ton-blockchain/ton/tags)

```bash
git clone https://github.com/ton-blockchain/ton.git
cd ton
# Örneğin, func-0.2.0'a gitmek için git checkout <TAG>
git checkout func-0.2.0
git submodule update --init --recursive 
cd ..
mkdir ton-build
cd ton-build
cmake ../ton
# func 0.2.0'ı derleyin
cmake --build . --target func
```

## Apple M1'de Eski Sürümleri Derleme:

TON, 11 Haziran 2022'den itibaren Apple M1'i desteklemektedir ([Apple M1 desteği ekle (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430) commit).

Apple M1 üzerinde eski TON revizyonlarını derlemek için:

1. RocksDb alt modülünü 6.27.3'e güncelleyin:
   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. Kök `CMakeLists.txt` dosyasını [https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt](https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt) ile değiştirin.