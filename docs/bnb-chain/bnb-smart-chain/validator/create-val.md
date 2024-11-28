---
title: BSC Validator Oluşturma - BNB Akıllı Zincir
description: Bu rehber, BNB Akıllı Zincir (BSC) üzerindeki yeni bir validator oluşturma sürecini özetlemektedir. BNB staking dApp resmi araçları kullanarak validatorları yönetmek için gerekli adımları içermektedir.
keywords: [BSC, Validator, BNB, Staking, Blockchain, Kripto, Geliştirme]
---

# BSC Validator Oluşturma

Bu rehber, BNB Akıllı Zincir (BSC) üzerindeki yeni bir validator oluşturma sürecini özetlemektedir. BNB staking dApp, BSC üzerindeki validatorları oluşturmak ve yönetmek için resmi araçtır.

- **Testnet**: [https://testnet-staking.bnbchain.org/en/bnb-staking](https://testnet-staking.bnbchain.org/en/bnb-staking)
- **Mainnet**: [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)

## Terimler

- **Operatör Adresi**: BSC üzerindeki validator bilgilerini oluşturmak ve değiştirmek için kullanılan adres. Staking dApp'ye bağlanırken bu adresi kullanmalısınız. İlgili hesap, geçerli olanı oluşturmak ve işlem ücretlerini ödemek için 2001 BNB'den fazla bulundurmalıdır.
- **Konsensüs Adresi**: Validator'unuzun düğümü için benzersiz bir adres. Yeni bloklar madenciliği sırasında konsensüs motoru için kullanılır. Operatör adresinden farklı olmalıdır.
- **BLS Oy Adresi**: Hızlı nihai oylama için kullanılan bir BLS adresi.
- **BLS Kanıtı**: Oy adresinin mülkiyetini doğrulayan bir BLS imzası.
- **Kimlik**: Yeni bir validatorü mevcut bir validator ile ilişkilendirmek için kullanılır. Eski bir validatorü taşıyorsanız bu isteğe bağlıdır.

## Adımlar

### 1. dApp'e Bağlanma

Lütfen **Operatör Adresinizi** kullanarak staking dApp'e bağlanın. `Trust Wallet`, `MetaMask` ve `WalletConnect` seçenekleri bu adım için mevcuttur. **Hesabın, bir sonraki adıma geçmeden önce 2001 BNB'den fazla olduğundan emin olun.**

![](../../images/bnb-chain/bnb-smart-chain/img/validator/create-validator0.png){:style="width:400px"}

### 2. Formu Doldurma

DApp'e gidin ve sayfanın ortasında sağ kısımda bulunan `Validator Ol` düğmesini seçerek oluşturma sürecini başlatın.

Bir validator oluşturmak için aşağıdaki bilgiler gereklidir.

#### 2.1 Temel Bilgiler

![](../../images/bnb-chain/bnb-smart-chain/img/validator/create-validator1.png){:style="width:600px"}

`Validator Oluştur` sayfasında aşağıdaki ayrıntıları sağlamanız gerekecek:

- **Validator Adı**: Özel karakterler hariç, 3-9 alfanümerik karakterden oluşan bir isim seçin.
- **Web Sitesi**: Validator'unuz hakkında ek bilgi sağlayan bir URL verin.
- **Açıklama**: Validator'unuz hakkında kısa bir açıklama.

> **Not:** Validator'ünüzün görünümünü artırmak için, [BSC validator dizinine](https://github.com/bnb-chain/bsc-validator-directory) ek bilgi yüklemeyi düşünün. Yüklenen avatarınız, staking dApp'de görüntülenecektir.

#### 2.2 Adresler

![](../../images/bnb-chain/bnb-smart-chain/img/validator/create-validator2.png){:style="width:600px"}

Aşağıdaki adresler gereklidir:

- **Konsensüs Adresi**: Validator'unuzun düğümü için benzersiz bir adres.
- **Oy Adresi**: Hızlı nihai oylama için kullanılan bir adres.
- **BLS Kanıtı**: Oy adresinin mülkiyetini doğrulayan bir BLS imzası.
- **Kimlik**: Yeni bir validatorü mevcut bir validator ile ilişkilendirmek için kullanılır. Eski bir validatorü taşıyorsanız bu isteğe bağlıdır.

##### Konsensüs Adresi Üretimi

BSC geth ikili dosyasını [resmi sürüm sayfasından](https://github.com/bnb-chain/bsc/releases/) indirin.

:::warning
Lütfen doğru binary dosyasını indirdiğinizden emin olun, örneğin MacOS kullanıyorsanız `geth_mac` dosyasını indirmelisiniz. Aşağıdaki işlemlerde ikiliyi basitlik açısından `geth` olarak anacağız.
:::

Yeni bir madencilik hesabı oluşturmak için lütfen aşağıdaki komutu kullanın ve hesap için bir parola belirleyin.

```shell
geth account new --datadir ${DATA_DIR}
```

- `DATA_DIR`: Anahtar depolama dosyalarınızı saklamak istediğiniz dizin.

Bu komut, genel adresi (konsensüs adresi) ve özel anahtarınıza giden yolu verecektir. Anahtar dosyasını güvenli bir şekilde yedeklemeyi unutmayın! Örnek bir konsensüs adresi `0x4b3FFeDb3470D441448BF18310cAd868Cf0F44B5`'tir.

Eğer zaten bir madencilik hesabınız varsa, hesabı geri yüklemek için tohum ifadesini kullanabilirsiniz.

```shell
geth account import --datadir ${DATA_DIR}
```

##### BLS Oy Adresi ve Kanıtı Üretimi

Yeni bir bls hesabı oluşturmak için lütfen aşağıdaki komutu kullanın.

```shell
geth bls account new --datadir ${DATA_DIR}
```

- `DATA_DIR`: Anahtar depolama dosyalarınızı saklamak istediğiniz dizin.

Eğer zaten bir oy anahtarınız varsa, bir bls cüzdan oluşturun ve anahtar dosyasını kullanarak geri yükleyin, aşağıdaki komutu kullanarak.

```shell
geth bls account import ${KEY_FILE} --datadir ${DATA_DIR}
```

- `DATA_DIR`: BLS hesabını geri yüklemek için yedek dosya.

Sonra aşağıdaki komutu çalıştırarak oy adresinizi alabilirsiniz.

```shell
geth bls account list --datadir ${DATA_DIR}
```

Örnek bir bls adresi `b5fe571aa1b39e33c2735a184885f737a59ba689177f297cba67da94bea5c23dc71fd4deefe2c0d2d21851eb11081f69`'dur.

Sonra aşağıdaki komutu çalıştırarak bls kanıtınızı alabilirsiniz.

```shell
geth bls account generate-proof --chain-id ${BSC_CHAIN_ID} ${OPEATOR_ADDRESS} ${VOTE_ADDRESS}
```

- `BSC_CHAIN_ID`: BSC ana ağı için `56`, BSC test ağı için `97`.
- `OPEATOR_ADDRESS`: Yeni validatorün operatörü olarak tanınacak hesabın adresi.
- `VOTE_ADDRESS`: Son adımda oluşturulan oy adresi.

Örnek bir bls kanıtı `0xaf762123d031984f5a7ae5d46b98208ca31293919570f51ae2f0a03069c5e8d6d47b775faba94d88dbbe591c51c537d718a743b9069e63b698ba1ae15d9f6bf7018684b0a860a46c812716117a59c364e841596c3f0a484ae40a1178130b76a5`'tir.

##### Kimlik Oluşturma

Kimlik, yeni validatorü BNB Beacon Chain üzerinde oluşturulmuş eski bir validator ile ilişkilendirmek için kullanılır. **Beacon Chain füzyosundan sonra boş bırakılmalıdır.**

#### 2.3 Komisyonlar

![](../../images/bnb-chain/bnb-smart-chain/img/validator/create-validator3.png){:style="width:600px"}

- **Oran**: Validator'un komisyon oranı.
- **Maks. Oran**: Validator'un ayarlayabileceği maksimum komisyon oranı.
- **Maks. Değişim Oranı**: Validator'un her dönem (1 gün) için ayarlayabileceği maksimum oran değişimi.

#### 2.4 Kendinden Delegasyon

![](../../images/bnb-chain/bnb-smart-chain/img/validator/create-validator4.png){:style="width:600px"}

- **Kendinden Delegasyon Miktarı**: Validator oluştururken delege edilecek miktar. Girilecek minimal sayı `2001`'dir - minimum kendinden delegasyon miktarı 2000 BNB ve ekstra 1 BNB bir ölü adrese kilitlenmek için gereklidir.

### 3. Formu Gönderme

Tüm gerekli bilgileri doldurduktan sonra, işlemi göndermek için `Gönder` butonuna tıklayın.

:::info
Not: Bu adımları tamamladıktan sonra, düğümünüzün aktif bir validator olacağının garantisi yoktur. Seçim, toplam stake edilen BNB'yi yansıtan bir sıralamaya dayanmaktadır ve yalnızca en üst N düğüm aktif validator olarak seçilmektedir. N sayısı, StakeHubContract içindeki "maxElectedValidators" parametresi (0x0000000000000000000000000000000000002002) ile belirlenir. 4 Kasım 2024 itibarıyla, bu sayı testnet için 8 ve mainnet için 45'tir.
:::