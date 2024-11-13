---
sidebar_position: 20
---

# Camino Yerel Token / CRC-20

## Camino Yerel Token Nedir?

Camino Yerel Token (CNT), X-Chain üzerinde oluşturulmuş sabit kapasiteli veya değişken kapasiteli bir token'dır. Bu tokenlar, X-Chain'de ışık hızında değişim yapabilme imkanı sunar; bu sayede DAG'ın lineer zincire göre daha yüksek performansından faydalanılır. Bu belgede, Camino Yerel Token'lar, X-Chain üzerinde oluşturulmuş fungible olmayan token'ları (NFT'ler) kapsamaz.

## CNT'yi X-Chain'den C-Chain'e Neden Taşımak Gerekir?

Akıllı sözleşme işlevselliği, durum geçişlerinin (işlemlerin) toplam sıralanmasını gerektirir. Sonuç olarak, CNT'ler akıllı sözleşmelerde kullanılmak istendiğinde C-Chain'e taşınmalıdır.

## C-Chain Üzerindeki Token'lar

### CAM

CAM, C-Chain'de ETH'nin Ethereum Ağı üzerindeki rolünü üstlenmektedir. Bir akıllı sözleşme oluşturduğunuzda veya çağırdığınızda, işlem ücretini (gas maliyeti) CAM ile ödersiniz. CAM'ı hesaplar arasında transfer edebilir ve yerel EVM araçları ve kütüphaneleri kullanarak bir akıllı sözleşmeye CAM gönderebilirsiniz.

### CNT'ler

CNT'lerin EVM içinde bir karşılığı yoktur. Bu nedenle, C-Chain, CNT bakiyelerini tutmayı ve CNT'leri C-Chain üzerinde transfer etmeyi desteklemek için bazı değişiklikler içermektedir.

C-Chain, her hesabın depolama alanında CNT'leri desteklemek amacıyla bir eşleme \[assetID → bakiye\] tutar. Bu token'lar X-Chain'e geri ihraç edilebilir ya da `nativeAssetCall` ve `nativeAssetBalance` kullanılarak C-Chain üzerinde kullanılabilir. `nativeAssetCall` ve `nativeAssetBalance`, C-Chain üzerinde CNT'lerin daha zengin bir kullanımına olanak tanıyan Apricot Faz 2'de yayımlanan ön-derlenmiş sözleşmelerdir.

#### nativeAssetCall

Bir EVM İşlemi aşağıdaki alanlardan oluşur:

- **`nonce`** Gönderen tarafından gönderilen işlem sayısına eşit skalar değer.
- **`gasPrice`** Bu işlemi gerçekleştirmek için birim gaz başına ödenen Wei (1 Wei = 10^-18 CAM) sayısına eşit skalar değer.
- **`gasLimit`** Bu işlemi gerçekleştirirken kullanılabilecek maksimum gaz miktarına eşit skaler değer.
- **`to`** Mesaj çağrısının alıcısının 20 baytlık adresi. İşlem bir sözleşme oluşturuyorsa, `to` boş bırakılır.
- **`value`** Mesaj çağrısının alıcısına, ya da bir sözleşme oluşturma durumunda, yeni oluşturulan sözleşmeye verilecek native asset (CAM) skalar değeri, Wei (1 Wei = 10^-18 CAM) cinsinden.
- **`v, r, s`** İşlemin imzasına karşılık gelen değerler.
- **`data`** Bir sözleşme çağrısına verilen girdi verilerini belirten sınırsız boyutta bayt dizisi. Eğer bir sözleşme oluşturuluyorsa, hesap başlatma süreci için EVM bytecode'u içerir.

`nativeAssetCall`, `0x0100000000000000000000000000000000000002` adresinde bulunan ön-derlenmiş bir sözleşmedir. `nativeAssetCall`, kullanıcılara verilen bir adrese atomik olarak bir yerel varlık transferi yapma ve isteğe bağlı olarak o adrese bir sözleşme çağrısı yapma imkanı sunar. Bu, normal bir işlemin bir değeri bir adrese gönderip o adrese bazı `data` ile atomik bir çağrı yapmasıyla paraleldir.

Not: `nativeAssetCall` çağrısının sahibi, çağrıda tanımlanan `address`'e aktarılır. Bu, `Address A`'nın `nativeAssetCall` aracılığıyla bir sözleşmeyi çağırdığında, sözleşmenin çağrıyı `Address A` olarak algılaması anlamına gelir. Bu, CRC-20 sözleşmeleri oluştururken kullandığımız depo mantığını sağlarken etkilidir.

```text
nativeAssetCall(address addr, uint256 assetID, uint256 assetAmount, bytes memory callData) -> {ret: bytes memory}
```

Bu argümanlar `abi.encodePacked(...)` tarafından Solidity'de paketlenebilir çünkü yalnızca bir varyant uzunlukta argüman (`callData`) vardır. İlk üç argüman sabit uzunluktadır, bu nedenle ön-derlenmiş sözleşme çağrı girişini şu şekilde ayrıştırır:

```text
+-------------+---------------+--------------------------------+
| address     : address       |                       20 bytes |
+-------------+---------------+--------------------------------+
| assetID     : uint256       |                       32 bytes |
+-------------+---------------+--------------------------------+
| assetAmount : uint256       |                       32 bytes |
+-------------+---------------+--------------------------------+
| callData    : bytes memory  |            len(callData) bytes |
+-------------+---------------+--------------------------------+
                              |       84 + len(callData) bytes |
                              +--------------------------------+
```

**Örnek**

Örneğin, `2nzgmhZLuVq8jc7NNu2eahkKwoJcbFWXWJCxHBVWAJEZkhquoK` assetID'sine sahip bir CNT'yi `0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC` adresinden `0xDd1749831fbF70d88AB7bB07ef7CD9c53D054a57` adresine göndermek için önce assetID'yi hex formatına çevirin: `0xec21e629d1252b3540e9d2fcd174a63af081417ea6826612e96815463b8a41d7`. Ardından, CNT'yi alan adresi, assetID ve assetAmount'ı birleştirip değerleri `data` parametresi olarak `0x0100000000000000000000000000000000000002` adresine `eth_sendTransaction` RPC'si kullanarak POST edin.

```text
curl --location --request POST 'https://columbus.camino.network:443/ext/bc/C/rpc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_sendTransaction",
    "params": [
        {
            "to": "0x0100000000000000000000000000000000000002",
            "from": "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
            "value": "",
            "gas": "0x2DC6C0",
            "gasPrice": "0x34630B8A00",
            "data": "0xDd1749831fbF70d88AB7bB07ef7CD9c53D054a57ec21e629d1252b3540e9d2fcd174a63af081417ea6826612e96815463b8a41d7000000000000000000000000000000000000000000000000000000000000012c"
        }
    ]
}'
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x451ffb79936be1baba438b591781192cbc9659d1f3a693a7a434b4a93dda639f"
}
```

#### nativeAssetBalance

`nativeAssetBalance`, `0x0100000000000000000000000000000000000001` adresinde bulunan ön-derlenmiş bir sözleşmedir. `nativeAssetBalance`, CAM bakiyesini almak için kullanılan `balance` işlevine karşılık gelen CNT'dir.

```text
nativeAssetBalance(address addr, uint256 assetID) -> {balance: uint256}
```

Bu argümanlar `abi.encodePacked(...)` ile Solidity'de paketlenebilir çünkü tüm argümanlar sabit uzunluktadır.

```text
+-------------+---------------+-----------------+
| address     : address       |        20 bytes |
+-------------+---------------+-----------------+
| assetID     : uint256       |        32 bytes |
+-------------+---------------+-----------------+
                              |        52 bytes |
                              +-----------------+
```

**Örnek**

Örneğin, `0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC` adresinin ve `2nzgmhZLuVq8jc7NNu2eahkKwoJcbFWXWJCxHBVWAJEZkhquoK` assetID'sinin bakiyesini almak için önce assetID'yi hex formatına çevirin: `0xec21e629d1252b3540e9d2fcd174a63af081417ea6826612e96815463b8a41d7`. Ardından, adresi ve assetID'yi birleştirip bu değeri `data` parametresi olarak `0x0100000000000000000000000000000000000001` adresine `eth_call` RPC'si kullanarak POST edin.

```text
curl --location --request POST 'https://columbus.camino.network:443/ext/bc/C/rpc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
        {
            "to": "0x0100000000000000000000000000000000000001",
            "data": "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FCec21e629d1252b3540e9d2fcd174a63af081417ea6826612e96815463b8a41d7"
        },
        "latest"
    ]
}'
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x000000000000000000000000000000000000000000000000000000000000012c"
}
```

## CRC-20'ler

CRC-20, altında yatan bir Camino Yerel Token'ı saran bir ERC-20 token'dır; bu, CAM'in sarmalamasına benzer.

### ERC-20 Nedir?

ERC-20, Ethereum üzerinde standartlaştırılmış bir token türüdür. Bir akıllı sözleşmenin Ethereum üzerinde bir token olarak hizmet etmesini sağlayan standart bir dizi işlev ve olay sunar. Tam bir açıklama için orijinal öneriyi  okuyabilirsiniz.

ERC-20'ler aşağıdaki arayüzü sunar:

```text
// Fonksiyonlar
function name() public view returns (string)
function symbol() public view returns (string)
function decimals() public view returns (uint8)
function totalSupply() public view returns (uint256)
function balanceOf(address _owner) public view returns (uint256 balance)
function transfer(address _to, uint256 _value) public returns (bool success)
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
function approve(address _spender, uint256 _value) public returns (bool success)
function allowance(address _owner, address _spender) public view returns (uint256 remaining)

// Olaylar
event Transfer(address indexed _from, address indexed _to, uint256 _value)
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

Bir ERC-20, bir akıllı sözleşme tarafından uygulanır, yani kendi durumunu korur. Yani, eğer hesabınız verilen bir ERC-20'den 5 adet sahibiyseniz, hesabınızın sahiplik verisi aslında o ERC-20'nin sözleşmesinde saklanır. Bunun aksine, bir ETH bakiyesi kendi hesabınızın depolama alanında tutulur.

### CNT'den CRC-20'ye

ERC-20'lerin aksine, Camino Yerel Token'ları (CNT'ler) doğrudan sahip oldukları hesap üzerinde saklanır. CNT'ler, C-Chain'de akıllı sözleşmelerde kullanılabilir hale getirmek için "sarılabilir". Bu sarılmış varlığı CRC-20 olarak adlandırıyoruz. Bunu gerçekleştirmek için, CRC-20 sözleşmesine altında yatan varlığı temsil etmek için bir `assetID` alanı ekleriz.

Ayrıca, CRC-20 sözleşmesi iki ek işlevi destekler: `withdraw` ve `deposit`. Bunun gerçekleşmesi için CRC-20'ler, ön-derlenmiş sözleşmeleri kullanmak zorundadır: `nativeAssetCall` ve `nativeAssetBalance`.

#### Sözleşme Bakiyesi / Toplam Arz

ERC-20'ler genellikle bir toplam arz alanına sahiptir, ancak bu, sarılmış bir varlık bağlamında farklı şeyler ifade edebilir. Toplam arz, platform üzerindeki sarılmamış varlığın toplam arzını veya sarılmış sözleşmedeki varlığın miktarını gösterebilir.

Basitlik açısından, toplam arzı CRC-20 sözleşmesindeki sarılmış varlığın toplam arzı olarak kabul ediyoruz.

#### CRC-20 Yatırımları

Bir CRC-20'ye fon yatırmak için, CRC-20 sözleşmesine yatırılacak miktarı göndermemiz ve ardından sözleşmenin yatırımı tanıyabilmesi ve çağrının bakiyesini güncelleyebilmesi için sözleşmenin deposit fonksiyonunu çağırmamız gerekmektedir. Bu, Ethereum üzerindeki WETH (Wrapped ETH) ile benzer bir durumdur. WETH ile, bu basit bir `call` ile mümkündür, çünkü bu yöntem çağrının hem ETH göndermesine hem de bir akıllı sözleşmeyi atomik olarak çağırmasına izin verir. CAM olmayan CRC-20'lerde, `nativeAssetCall`, CNT'ler için C-Chain'de aynı işlevselliği sağlar.

Örneğin:

- **`nonce`**: 2
- **`gasPrice`**: 225 gwei
- **`gasLimit`**: 3000000
- **`to`**: `0x0100000000000000000000000000000000000002`
- **`value`**: 0
- **`v, r, s`**: \[İşlem İmzası\]
- **`data`**: abi.encodePacked(arc20Address, assetID, assetAmount, abi.encodeWithSignature("deposit()"))

Bu, `assetAmount` miktarındaki `assetID`'yi CRC-20 sözleşmesinin adresine aktarır ve ardından sözleşmede `deposit()` çağrısını yapar.

Deposit fonksiyonu, toplam arzın önceki değerini kullanarak ne kadar `assetID` aldığını hesaplar. Çünkü `nativeAssetCall`, çağrı sahibini çağrılan sözleşmeye aktarır, deposit çağrıldığında, CRC-20 sözleşmesi `msg.sender` değerini `nativeAssetCall`ın orijinal çağrı sahibine göre görmektedir ve doğru adres adına bakiyeyi artırabilir.

Not: Sözleşmenin `assetID` bakiyesi, birisi fonları `deposit()` çağırmadan sözleşmeye gönderirse toplam arz ile senkronize olmayabilir. Bu durumda, bir sonraki `deposit()` çağrısını yapan hesap, daha önce gönderilen fonlar için kredi alacaktır.

```go
function deposit() public {
    uint256 updatedBalance = NativeAssets.assetBalance(address(this), _assetID);
    uint256 depositAmount = updatedBalance - _totalSupply;
    assert(depositAmount >= 0);

    _balances[msg.sender] += depositAmount;
    _totalSupply = updatedBalance;
    emit Deposit(msg.sender, depositAmount);
}
```

#### CRC-20 Para Çekme

Bir CRC-20 sözleşmesi, bir para çekme talebi aldığında, yeterli hesap bakiyesini doğrular, bakiyeyi ve toplam arz’ı günceller ve fonları `nativeAssetCall` ile çekene gönderir. CRC-20'lerin para çekme fonksiyonu şu şekildedir:

```go
function withdraw(uint256 value) public {
    require(_balances[msg.sender] >= value, "Yetersiz fon");

    _balances[msg.sender] -= value;
    _totalSupply -= value;

    NativeAssets.assetCall(msg.sender, _assetID, value, "");
    emit Withdrawal(msg.sender, value);
}