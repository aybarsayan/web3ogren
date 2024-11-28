---
title: Zincirle Etkileşim - BNB Greenfield
description: Bu doküman, BNB Greenfield ile etkileşim kurmanın farklı yollarını, CLI, gRPC ve REST uç noktalarını detaylı bir şekilde açıklar. Kullanıcılar için ayrıntılı bilgi ve örnekler sunar.
keywords: [BNB Greenfield, gRPC, REST, CLI, Cosmos SDK, zincirle etkileşim]
---

# Zincirle Etkileşim

Bir düğümle etkileşim kurmanın birden fazla yolu vardır: CLI kullanarak, gRPC kullanarak veya REST uç noktalarını kullanarak.

:::info
Greenfield Blockchain Cosmos tabanlı olduğundan, bu sayfadaki içeriğin büyük bir kısmı
[Cosmos SDK](https://docs.cosmos.network/main/run-node/interact-node) sayfasından alınmıştır.
:::

## CLI Kullanarak

Zinciriniz çalıştığına göre, ilk oluşturduğunuz hesaptan ikinci bir hesaba token göndermeyi deneme zamanı. 
Yeni bir terminal penceresinde, aşağıdaki sorgu komutunu çalıştırarak başlayın:

```bash
gnfd query bank balances $MY_VALIDATOR_ADDRESS 
```

Oluşturduğunuz hesabın mevcut bakiyesi, ona verdiğiniz orijinal `BNB` bakiyesine ve `gentx` aracılığıyla devrettiğiniz miktara eşit olmalıdır. Şimdi, ikinci bir hesap oluşturun:

```bash
gnfd keys add recipient --keyring-backend test

# Oluşturulan adresi daha sonra kullanılmak üzere bir değişkende saklayın.
RECIPIENT=$(gnfd keys show recipient -a --keyring-backend test)
```

Yukarıdaki komut, zincirde henüz kaydedilmemiş bir yerel anahtar çifti oluşturur. 
Bir hesap, başka bir hesaptan token aldığında oluşturulur. Şimdi, `recipient` hesabına token göndermek için aşağıdaki komutu çalıştırın:

```bash
gnfd tx bank send $MY_VALIDATOR_ADDRESS $RECIPIENT 1000000BNB  --keyring-backend test

# Alıcı hesabın tokenları alıp almadığını kontrol edin.
gnfd query bank balances $RECIPIENT 
```

## gRPC Kullanarak

**Protobuf ekosistemi**, `*.proto` dosyalarından çeşitli dillerde kod üretimi de dahil olmak üzere farklı kullanım durumları için araçlar geliştirmiştir. Bu araçlar, istemcilerin kolayca oluşturulmasını sağlar. Genellikle, istemci bağlantısı (yani taşıma) çok kolay bir şekilde takılabilir ve değiştirilebilir.

:::note
Kod üretim kütüphanesi büyük ölçüde kendi teknoloji yığınınıza dayandığından, yalnızca üç alternatif sunacağız:
- Genel hata ayıklama ve test için `grpcurl`,
- Programatik olarak Go ile,
:::

### grpcurl

[grpcurl](https://github.com/fullstorydev/grpcurl) `curl` gibi ama gRPC için. Ayrıca bir Go kütüphanesi olarak da mevcut olup, yalnızca hata ayıklama ve test amacıyla bir CLI komutu olarak kullanacağız. 
Kurulum için önceki bağlantıdaki talimatları izleyin.

Yerel bir düğüm çalıştığını varsayarsak (yerel ağ veya canlı bir ağa bağlı), 
aşağıdaki komutu çalıştırarak mevcut Protobuf hizmetlerini listeleyebilmelisiniz (localhost:9000'ı değiştirebilirsiniz 
başka bir düğümün gRPC sunucu uç noktası ile, bu `app.toml` içindeki `grpc.address` alanında yapılandırılmıştır):

```bash
grpcurl -plaintext localhost:9090 list
```

`cosmos.bank.v1beta1.Query` gibi gRPC hizmetlerinin bir listesini görmelisiniz. Buna yansıma denir, bu da mevcut tüm uç noktaların açıklamalarını döndüren bir Protobuf uç noktasını temsil eder. Bu uç noktaların her biri farklı bir Protobuf hizmetini temsil eder ve her hizmet, sorgulayabileceğiniz birden çok RPC yöntemi sunar.

Hizmetin açıklamasını almak için aşağıdaki komutu çalıştırabilirsiniz:

```bash
grpcurl \
    localhost:9090 \
    describe cosmos.bank.v1beta1.Query                  # İncelemek istediğimiz hizmet
```

Düğümden bilgi sorgulamak için bir RPC çağrısı da gerçekleştirebilirsiniz:

```bash
grpcurl \
    -plaintext
    -d '{"address":"$MY_VALIDATOR"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/AllBalances
```

#### grpcurl ile tarihsel durum sorgulaması

:::tip
Ayrıca, sorguya bazı [gRPC meta verilerini](https://github.com/grpc/grpc-go/blob/master/Documentation/grpc-metadata.md) geçerek tarihsel verileri sorgulayabilirsiniz: `x-cosmos-block-height` meta verisi sorgulamak için blok numarasını içermelidir. Yukarıdaki gibi grpcurl kullanarak, komut şöyle görünür:
:::

```bash
grpcurl \
    -plaintext \
    -H "x-cosmos-block-height: 279256" \
    -d '{"address":"$MY_VALIDATOR"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/AllBalances
```

Oluşum bu blokta düğüm tarafından henüz silinmemişse, bu sorgu boş olmayan bir yanıt döndürmelidir.

### Programatik Olarak Go ile

Aşağıdaki kod parçası, bir Go programı içinde gRPC kullanarak durumu sorgulamanın nasıl olduğunu gösterir. Amaç, bir gRPC bağlantısı oluşturmak ve sorgulamak için Protobuf tarafından oluşturulmuş istemci kodunu kullanmaktır.

#### Greenfield GO-sdk Kurulumu

En son bağımlılığı kurmak için [Go-sdk belgesi](https://github.com/bnb-chain/greenfield-go-sdk) başvurunuz.

Anahtar yöneticisi olmadan istemciyi başlatın; sadece sorgulama amacıyla kullanılmalıdır.
```go
client := NewGreenfieldClient("localhost:9090", "greenfield_9000-121")

query := banktypes.QueryBalanceRequest{
    Address: "0x76d244CE05c3De4BbC6fDd7F56379B145709ade9",
    Denom:   "BNB",
}
res, err := client.BankQueryClient.Balance(context.Background(), &query)  
```

İmza atmak ve tx göndermek için anahtar yöneticisi ile istemciyi başlatın.
```go
keyManager, _ := keys.NewPrivateKeyManager("ab463aca3d2965233da3d1d6108aa521274c5ddc2369ff72970a52a451863fbf")
gnfdClient := NewGreenfieldClient("localhost:9090", 
	                            "greenfield_9000-121",
	                            WithKeyManager(km),
                                    WithGrpcDialOption(grpc.WithTransportCredentials(insecure.NewCredentials()))
)
```

## REST Uç Noktalarını Kullanarak

[gRPC kılavuzunda](https://greenfield-chain.bnbchain.org/openapi) açıklananlara göre, Cosmos SDK'daki tüm gRPC hizmetleri daha kullanışlı REST tabanlı sorguları için kullanılabilir. URL yolunun formatı, Protobuf hizmet yönteminin tam olarak nitelikli adı üzerine kurulu olup, son URL'lerin daha anlamlı görünmesi için küçük özel düzenlemeler içerebilir. 

**Örneğin**, `cosmos.bank.v1beta1.Query/AllBalances` yöntemi için REST uç noktası `GET /cosmos/bank/v1beta1/balances/{address}`'dir. 
İstek argümanları sorgu parametreleri olarak iletilir.

Somut bir örnek olarak, bakiyeleri istemek için `curl` komutu şöyle görünür:

```bash
curl \
    -X GET \
    -H "Content-Type: application/json" \
    http://localhost:1317/cosmos/bank/v1beta1/balances/$MY_VALIDATOR
```

`localhost:1317` adresini, sizin düğümünüze ait `api.address` alanında yapılandırılmış REST uç noktası ile değiştirdiğinizden emin olun.

Tüm mevcut REST uç noktalarının listesi, `localhost:1317/swagger` adresinde bir Swagger spesifikasyon dosyası olarak mevcuttur. 
`app.toml` dosyanızda `api.swagger` alanının true olarak ayarlandığından emin olun.

### REST ile tarihsel durum sorgulaması

Tarihsel durumu sorgulama, HTTP başlığı `x-cosmos-block-height` kullanılarak yapılır. Örneğin, bir curl komutu şu şekilde görünür:

```bash
curl \
    -X GET \
    -H "Content-Type: application/json" \
    -H "x-cosmos-block-height: 279256"
    http://localhost:1317/cosmos/bank/v1beta1/balances/$MY_VALIDATOR
```

Oluşum bu blokta düğüm tarafından henüz silinmemişse, bu sorgu boş olmayan bir yanıt döndürmelidir.