---
title: Validator Oluşturma Kılavuzu
description: Bu kılavuz, BNB Akıllı Zinciri (BSC) üzerinde yeni bir doğrulayıcı oluşturma sürecini özetler. BNB staking dApp, BSC üzerinde doğrulayıcı oluşturmak ve yönetmek için resmi araçtır.
keywords: [doğrulayıcı, BNB, BNB Akıllı Zinciri, staking dApp, konsensüs adresi, BLS kanıtı, oy adresi]
---

# Validator Oluşturma Kılavuzu

Bu kılavuz, BNB Akıllı Zinciri (BSC) üzerinde yeni bir doğrulayıcı oluşturma sürecini özetler. BNB staking dApp, BSC üzerinde doğrulayıcı oluşturmak ve yönetmek için resmi araçtır.

- **Testnet**: [https://testnet-staking.bnbchain.org/en/bnb-staking](https://testnet-staking.bnbchain.org/en/bnb-staking)
- **Mainnet**: [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)

## Terminoloji

- **Operatör Adresi**: BSC üzerinde doğrulayıcı bilgilerini oluşturma ve değiştirme adresidir. Staking dApp'e bağlanırken bu adresi kullanmalısınız. İlgili hesabın geçerli doğrulayıcılar oluşturmak ve işlem ücretlerini ödemek için 2001'den fazla BNB'ye sahip olması gerekmektedir.
- **Konsensüs Adresi**: Doğrulayıcınızın düğümü için benzersiz bir adrestir. Yeni bloklar madenciliği için konsensüs motoru tarafından kullanılır. Operatör adresinden farklı olmalıdır. Beacon Chain üzerinde mevcut bir doğrulayıcıya sahipseniz, eski konsensüs adresi tekrar kullanılamaz ve yeni bir tane oluşturmalısınız.
- **Oy Adresi**: Hızlı sonlandırma oylaması için kullanılan bir adres. Beacon Chain üzerinde mevcut bir doğrulayıcıya sahipseniz, eski oy adresi tekrar kullanılamaz ve yeni bir tane oluşturmalısınız.
- **BLS Kanıtı**: Oy adresinin mülkiyetini doğrulayan BLS imzasıdır.
- **Kimlik**: Yeni bir doğrulayıcıyı Beacon Chain'deki mevcut bir doğrulayıcı ile ilişkilendirmek için kullanılır. Delegatörler `paylarını göç ettirdiklerinde` faydalıdır - aynı doğrulayıcı operatörü tarafından işletilen yeni bir doğrulayıcının çalıştığını bilebilirler. Bu, eski bir doğrulayıcıyı göç ettirmiyorsanız isteğe bağlıdır.

## Adımlar

### 1. dApp'e Bağlanma

Lütfen **Operatör Adresinizi** kullanarak staking dApp'e bağlanın. `Trust Wallet`, `MetaMask` ve `WalletConnect` seçenekleri bu adım için mevcuttur. Bir sonraki adıma geçmeden önce hesabın 2001'den fazla BNB'ye sahip olduğundan emin olun.

![](../../images/bnb-chain/assets/bcfusion/create-validator0.png){:style="width:400px"}

### 2. Formu Doldurma

dApp'e gidin ve oluşturma sürecini başlatmak için sayfanın ortasında sağda bulunan `Doğrulayıcı Ol` butonuna tıklayın.

:::tip
Doğrulayıcı oluşturmak için aşağıdaki bilgiler gereklidir.
:::

#### Temel Bilgiler

![](../../images/bnb-chain/assets/bcfusion/create-validator1.png){:style="width:600px"}

`Doğrulayıcı Oluştur` sayfasında aşağıdaki bilgileri sağlamanız gerekmektedir:

- **Doğrulayıcı Adı**: Özel karakterler hariç, 3-9 alfanümerik karakterden oluşan bir isim seçin.
- **Web Sitesi**: Doğrulayıcınız hakkında daha fazla bilgi için bir URL sağlayın.
- **Açıklama**: Doğrulayıcınız hakkında kısa bir açıklama.

> "Doğrulayıcınızın görünürlüğünü artırmak için ek bilgileri [BSC doğrulayıcı dizinine](https://github.com/bnb-chain/bsc-validator-directory) yüklemeyi düşünün. Yüklenen avatarınız staking dApp'te görüntülenecektir." — BNB Staking Takımı

#### Adresler

![](../../images/bnb-chain/assets/bcfusion/create-validator2.png){:style="width:600px"}

Aşağıdaki adresler gereklidir:

- **Konsensüs Adresi**: Doğrulayıcınızın düğümü için benzersiz bir adres.
- **Oy Adresi**: Hızlı sonlandırma oylaması için kullanılan bir adres.
- **BLS Kanıtı**: Oy adresinin mülkiyetini doğrulayan BLS imzası.
- **Kimlik**: Yeni bir doğrulayıcıyı Beacon Chain'deki mevcut bir doğrulayıcı ile ilişkilendirmek için. Eski bir doğrulayıcıyı taşımıyorsanız isteğe bağlıdır.

#### Konsensüs Adresi Oluşturma

BSC geth ikili dosyasını [resmi sürüm sayfasından](https://github.com/bnb-chain/bsc/releases/) indirin.

Not: Lütfen doğru ikili dosyayı indirdiğinizden emin olun, örneğin, MacOS kullanıyorsanız `geth_mac` dosyasını indirmelisiniz. Kolaylık olması açısından, ikili dosyayı `geth` olarak adlandıracağız.

Yeni bir madencilik hesabı oluşturmak için lütfen aşağıdaki komutu kullanın ve hesap için bir şifre belirleyin.

```shell
geth account new --datadir ${DATA_DIR}
```

- `DATA_DIR`: Anahtar deposu dosyalarınızı saklamak istediğiniz dizin.

Bu komut, genel adresi (yani **konsensüs adresi**) ve özel anahtarınıza giden yolu döndürecektir. Anahtar dosyasını yedekleyin!

Örnek bir konsensüs adresi `0x4b3FFeDb3470D441448BF18310cAd868Cf0F44B5`'dir.

Eğer zaten bir madencilik hesabına sahipseniz, hesabı geri yüklemek için tohum cümlesini kullanabilirsiniz.

```shell
geth account import --datadir ${DATA_DIR}
```

Beeacon Chain üzerinde bir doğrulayıcı oluşturduysanız, konsensüs adresi için farklı olanı kullanmalısınız.

#### Oy Adresi ve BLS Kanıtı Oluşturma

Yeni bir BLS hesabı oluşturmak için lütfen aşağıdaki komutu kullanın.

```shell
 geth bls account new --datadir ${DATA_DIR}
```

- `DATA_DIR`: Anahtar deposu dosyalarınızı saklamak istediğiniz dizin.

Eğer zaten bir oy anahtarına sahipseniz, bir bls cüzdanı oluşturun ve anahtar dosyasını geri yüklemek için aşağıdaki komutu kullanın.

```shell
 geth bls account import ${KEY_FILE} --datadir ${DATA_DIR}
```

- `DATA_DIR`: BLS hesabını geri yüklemek için yedek dosya.

Sonra aşağıdaki komutu çalıştırarak oy adresinizi alabilirsiniz.

```shell
geth bls account list --datadir ${DATA_DIR}
```

Örnek bir adres `b5fe571aa1b39e33c2735a184885f737a59ba689177f297cba67da94bea5c23dc71fd4deefe2c0d2d21851eb11081f69`'dir.

Sonra aşağıdaki komutu çalıştırarak bls kanıtınızı alabilirsiniz.

```shell
geth bls account generate-proof --chain-id ${BSC_CHAIN_ID} ${OPEATOR_ADDRESS} ${VOTE_ADDRESS}
```

- `BSC_CHAIN_ID`: BSC ana ağı için `56`, ve BSC test ağı için `97`.
- `OPEATOR_ADDRESS`: Hesabınızın adresi, yeni doğrulayıcının operatörü olarak tanınacaktır.
- `VOTE_ADDRESS`: Son adımda oluşturulan oy adresi.

Örnek bir kanıt `0xaf762123d031984f5a7ae5d46b98208ca31293919570f51ae2f0a03069c5e8d6d47b775faba94d88dbbe591c51c537d718a743b9069e63b698ba1ae15d9f6bf7018684b0a860a46c812716117a59c364e841596c3f0a484ae40a1178130b76a5`'tir.

#### Kimlik Oluşturma

Kimlik, yeni doğrulayıcıyı Beacon Chain üzerinde oluşturulan eski doğrulayıcı ile ilişkilendirmek için kullanılır; bu sayede delegatörlerin `göç ettirdikleri` paylarını aynı doğrulayıcı operatörüne taşımaları kolaylaşır. Eğer bu [sayfada](https://www.bnbchain.org/en/staking) bir doğrulayıcı oluşturmadıysanız, boş bırakabilirsiniz.

Lütfen BC istemci ikili dosyasını [resmi sürüm sayfasından](https://github.com/bnb-chain/node/releases/tag/v0.10.19) indirin.

Not: Lütfen doğru ikili dosyayı indirdiğinizden emin olun, örneğin, MacOS kullanıyorsanız `macos_binary.zip` dosyasını indirmelisiniz; zip dosyasını açtıktan sonra `bnbcli` (ana ağ için) ve `tbnbcli` (test ağı için) bulacaksınız. Kolaylık olması açısından, ikili dosyayı `bnbcli` olarak adlandıracağız.

###### Hesap Kurulumu

Eğer bir ayrıntılara sahipseniz, hesabınızı aşağıdaki komutu çalıştırarak içe aktarabilirsiniz:

```shell
$ ${workspace}/bin/bnbcli keys add <your-account-name> --recover --home ${HOME}/.bnbcli
Enter a passphrase for your key:
Repeat the passphrase:
> Enter your recovery seed phrase:
```

Bu hesap için bir şifre belirlemeniz ve tohum cümlenizi girmeniz istenecektir. Daha sonra hesap bilgilerinizi alacaksınız.

- `${workspace}/bin/bnbcli`: `bnbcli` ikili dosyasının yürütülebilir dosyasının yolu. Test ağı için bunun yerine `tbnbcli` kullanmalısınız.
- `${HOME}`: Hesap bilgilerinizi sakladığınız klasör.

Veya eğer bir defter varsa, hesabınızı aşağıdaki komutu çalıştırarak içe aktarabilirsiniz:

```shell
${workspace}/bin/bnbcli keys add <your-account-name> --ledger --index ${index} --home ${HOME}/.bnbcli
```

- `${workspace}/bin/bnbcli`: `bnbcli` ikili dosyasının yürütülebilir dosyasının yolu. Test ağı için bunun yerine `tbnbcli` kullanmalısınız.
- `${HOME}`: Hesap bilgilerinizi sakladığınız klasör.
- `${index}`: İçe aktarmak istediğiniz defter hesabının indeksi.

##### Kimliği Alma

Hesap içe aktarıldıktan sonra kimliğinizi almak için aşağıdaki komutu çalıştırabilirsiniz:

Yerel anahtar için:
```shell
${workspace}/bin/bnbcli \
  validator-ownership \
  sign-validator-ownership \
  --bsc-operator-address ${NEW_VALIDATOR_OPERATOR_ADDR_ON_BSC} \
  --from ${ACCOUNT_NAME} \
  --chain-id ${BC_CHAIN_ID} \
```

Defter anahtarı için:
```shell
${workspace}/bin/bnbcli \
  validator-ownership \
  sign-validator-ownership \
  --bsc-operator-address ${NEW_VALIDATOR_OPERATOR_ADDR_ON_BSC} \
  --from ${BSC_OPERATOR_NAME} \
  --chain-id ${CHAIN_ID} \
  --ledger
```

- `${workspace}/bin/bnbcli`: `bnbcli` ikili dosyasının yürütülebilir dosyasının yolu. Test ağı için bunun yerine `tbnbcli` kullanmalısınız.
- `--to ${NEW_VALIDATOR_OPERATOR_ADDR_ON_BSC}`: Yeni doğrulayıcı operatör adresinin eşleştirileceği BSC adresini belirtir.
- `--chain-id ${BC_CHAIN_ID}`: BC (BNB beacon chain) için zincir kimliğini belirtir. Varsayılan olarak, ana ağ zincir kimliği `Binance-Chain-Tigris`dir. Ve test ağı zincir kimliği `Binance-Chain-Ganges`dir.
- `--from ${ACCOUNT_NAME}`: İmzanın gerçekleştirileceği hesap adını belirtir. Hesap, Beacon Chain üzerinde oluşturulan doğrulayıcının operatörü olmalıdır.

Ve aşağıdaki gibi bir çıktı alacaksınız:

```
TX JSON: {"type":"auth/StdTx","value":{"msg":[{"type":"migrate/ValidatorOwnerShip","value":{"bsc_operator_address":"RXN7r5XZlaljqzp8msZvx6Y6124="}}],"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"Ahr+LlBMLgiUFkP75kIuJW1YHrsTy39GeOdV+IaTREDN"},"signature":"AL5mj52s0+tcdoEb6c6PAmqBixuv3XEmrLW3Y1kvUeYgG3RqVvWU/dIVcfxiHHwLGXlcn0X1v00jFrpLIsxtqA==","account_number":"0","sequence":"0"}],"memo":"","source":"0","data":null}}
Sign Message:  {"account_number":"0","chain_id":"Binance-GGG-Ganges","data":null,"memo":"","msgs":[{"bsc_operator_address":"0x45737baf95d995a963ab3a7c9ac66fc7a63ad76e"}],"sequence":"0","source":"0"}
Sign Message Hash:  0x8f7179e7969e497b5f3c006535e55c2fa5bea5d118a8008eddce3fccd1675673
Signature: 0x00be668f9dacd3eb5c76811be9ce8f026a818b1bafdd7126acb5b763592f51e6201b746a56f594fdd21571fc621c7c0b19795c9f45f5bf4d2316ba4b22cc6da8
PubKey: 0x021afe2e504c2e08941643fbe6422e256d581ebb13cb7f4678e755f886934440cd
```

`İmza`, Beacon Chain üzerinde oluşturulan eski doğrulayıcı ile ilişkilendirmek için kimliğinizdir.

#### Komisyonlar

![](../../images/bnb-chain/assets/bcfusion/create-validator3.png){:style="width:600px"}

- **Oran**: Doğrulayıcının komisyon oranı.
- **Maksimum Oran**: Doğrulayıcının ayarlayabileceği maksimum komisyon oranı.
- **Maksimum Değişiklik Oranı**: Doğrulayıcının her dönem (1 gün) için ayarlayabileceği maksimum oran değişikliği.

#### Kendinden Delegasyon

![](../../images/bnb-chain/assets/bcfusion/create-validator4.png){:style="width:600px"}

- **Kendinden Delegasyon Miktarı**: Doğrulayıcıyı oluştururken aktarılacak miktar. Giriş için minimal sayı `2001`'dir - minimal kendinden delegasyon miktarı 2000 BNB ve ek olarak 1 BNB de ölü bir adrese kilitlenmek içindir.

### 3. Formu Gönderme

Gerekli tüm bilgileri doldurduktan sonra, işlemi göndermek için `Gönder` butonuna tıklayın.

:::warning
Bu adımları tamamladıktan sonra, düğümünüzün aktif bir doğrulayıcı olma garantisi yoktur. Seçim, toplam stake edilmiş BNB miktarını yansıtan bir sıralama temelinde gerçekleştirilir; yalnızca en üstteki N düğüm aktif doğrulayıcılar olarak seçilecektir. N sayısı StakeHubContract içindeki "maxElectedValidators" parametresi (0x0000000000000000000000000000000000002002) ile belirlenir. 4 Kasım 2024 tarihi itibarıyla, bu sayı test ağı için 8 ve ana ağ için 45'tir.
:::