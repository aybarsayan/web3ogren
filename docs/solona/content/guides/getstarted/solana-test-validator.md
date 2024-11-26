---
date: 2024-06-13T00:00:00Z
difficulty: intro
title: "Solana Test Validator Kılavuzu"
seoTitle: "Solana Test Validator Kılavuzu"
description:
  "Solana test validator kullanarak bilgisayarınızda localnet nasıl çalıştırılır ve yerel geliştirme için."
tags:
  - validator
  - localnet
keywords:
  - localnet
  - blockchain
  - devnet
  - development
  - test-validator
  - local-development
---

Solana test validator, Solana blockchain'i için yerel bir emülatördür ve
geliştiricilere, kamu testnet veya mainnet'e bağlanmadan Solana programlarını
inşa etmek ve test etmek için özel ve kontrollü bir ortam sağlar. Eğer Solana
CLI araç setiniz `zaten yüklüyse`, test validator'ü
aşağıdaki komutla çalıştırabilirsiniz:

```shell
solana-test-validator
```

## Avantajlar

- Blockchain durumunu herhangi bir anda sıfırlama yeteneği
- Farklı ağ koşullarını simüle etme yeteneği
- RPC hız limitlerinin olmaması
- Airdrop limitlerinin olmaması
- Doğrudan on-chain program dağıtımı
- Kamu kümesinden hesapları klonlama yeteneği
- Dosyalardan hesap yükleme yeteneği
- Yapılandırılabilir işlem geçmişi saklama süresi
- Yapılandırılabilir dönem uzunluğu

## Kurulum

`solana-test-validator` Solana CLI araç setinin bir parçası olduğu için, Solana'nın
komut satırı araçlarının yüklü olduğundan emin olun. Aşağıdaki komutla yükleyebilirsiniz:

```shell
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

`stable` ifadesini, istediğiniz sürümün yazılım sürümüyle eşleşen sürüm etiketiyle
(değişken: `v1.18.12`) veya üç sembolik kanal isminden biriyle değiştirebilirsiniz:
`stable`, `beta` veya `edge`.

> **Daha ayrıntılı talimatlar için**, Solana geliştirme için `yerel ortamınızı ayarlama` kılavuzuna göz atın. Bu, Solana CLI, Anchor yüklemesini, yerel bir anahtar çifti edinmeyi ve daha fazlasını içermektedir.

## Test Validator'ü Başlatma

Yerel validator’ünüzü başlatmak için:

```shell
solana-test-validator
```

Bu komut yeni bir defter oluşturur ve validator'ü başlatır.

## Çalışan Bir Test Validator'ü ile Etkileşim

`solana-test-validator`'ü başlattıktan sonra, çeşitli Solana CLI (Komut Satırı
Arayüzü) komutlarıyla onunla etkileşimde bulunabilirsiniz. Bu komutlar, `program
dağıtımları`, `hesapları` yönetme,
`işlemler` gönderme ve daha birçok şeyi yapmanıza
olanak tanır. İşte kullanacağınız anahtar komutlar için ayrıntılı bir kılavuz.

### Test Validator'ün Durumunu Kontrol Etme

Test validator ile etkileşime girmeden önce, durumunu doğrulamak ve düzgün
çalıştığından emin olmak faydalıdır.

```shell
solana ping
```

Bu komut, yerel test validator'ü pingler ve geçerli blockhash ile gecikmeyi
döndürerek aktif olduğunu doğrular.

### Hesap Yönetimi

Yeni bir anahtar çifti (hesap) oluşturmak için:

```shell
solana-keygen new
```

Bu komut yeni bir anahtar çifti oluşturur ve belirtilen dosyaya kaydeder.

Hesabınıza SOL eklemek için:

```shell
solana airdrop 10 <ACCOUNT_ADDRESS>
```

> **Not:** Bir hesabın detaylarını, bakiye ve sahip gibi, almak için:

```shell
solana account <ACCOUNT_ADDRESS>
```

Hesabın var olması için önce hesaba para yatırmanız gerekir.

Bu komut, belirtilen hesap adresine 10 SOL gönderir.

### Programları Dağıtma ve Yönetme

Derlenmiş bir programı (BPF) test validator'e dağıtmak için:

```shell
solana program deploy <PROGRAM_FILE_PATH>
```

Bu, bir programı blockchain'e yükler ve dağıtır.

Dağıtılan bir programın detaylarını kontrol etmek için:

```shell
solana program show <ACCOUNT_ADDRESS>
```

### İşlemleri Gönderme

Bir hesaptan diğerine SOL transfer etmek için:

```shell
solana transfer --from /path/to/keypair.json <RECIPIENT_ADDRESS> <AMOUNT>
```

Bu, `AMOUNT` kadar SOL'u kaynak hesaptan `RECIPIENT_ADDRESS`'e gönderir.

### İşlemleri Simüle Etme ve Onaylama

Gerçekten bir işlemi göndermeden önce, başarısının olup olmadığını görmek için
onu simüle edebilirsiniz:

```shell
solana transfer --from /path/to/keypair.json --simulate <RECIPIENT_ADDRESS> <AMOUNT>
```

Bir işlemin detaylarını ve durumunu onaylamak için:

```shell
solana confirm <TRANSACTION_SIGNATURE>
```

### Son Blok Üretimini Görüntüleme

Performans sorunlarını gidermek için yararlı olabilecek son blok üretimi hakkında
bilgi almak için:

```shell
solana block-production
```

### Token Hesapları Oluşturma

### Logları Ayarlama

Hata ayıklama için daha ayrıntılı loglar istiyorsanız:

```shell
solana logs
```

Bu, validator'den log mesajlarını akıtır.

> **Faydalı İpuçları:**
> 
> - Hata ayıklama için daha ayrıntılı çıktı almak istiyorsanız `-v` bayrağı ile log
>   ayrıntılığını artırabilirsiniz.
> - RPC sunucu ayarlarını özelleştirmek için `--rpc-port` ve `--rpc-bind-address`
>   seçeneklerini kullanın.
> - Validator tarafından kullanılan CPU çekirdeklerini `--gossip-host` seçeneği ile
>   ayarlayarak ağ koşullarını daha gerçekçi bir şekilde simüle edebilirsiniz.

## Yapılandırma

CLI Araç Seti yapılandırmasını kontrol edin:

```shell
solana genesis-hash
```

Solana test validator için tüm yapılandırma seçeneklerini görüntüleyin:

```shell
solana-test-validator --help
```

---

## Yerel Defter

Varsayılan olarak, defter verileri, mevcut çalışma dizininizde "test-ledger"
adlı bir dizinde saklanır.

### Defter Lokasyonunu Belirleme

Test validator'ü başlatırken, defter verileri için farklı bir dizin belirleyebilirsiniz
`--ledger` seçeneğiyle:

```shell
solana-test-validator --ledger /path/to/custom/ledger
```

### Defteri Sıfırlama

Varsayılan olarak, validator mevcut bir deftere devam eder. Defteri sıfırlamak
için, defter dizinini manuel olarak silmeli veya validator'ü `--reset` bayrağı ile
yeniden başlatmalısınız:

```shell
solana-test-validator --reset
```

Eğer defter mevcutsa, bu komut defteri genesis'e sıfırlar, bu da mevcut verileri
silerek temiz bir başlangıç yapar.

---

## Çalışma Zamanı Özellikleri

Solana, test validator çalıştırıldığında belirli blockchain özelliklerini etkinleştirme
veya devre dışı bırakmanıza olanak tanıyan bir özellik seti mekanizmasına sahiptir. Varsayılan olarak,
test validator tüm çalışma zamanı özellikleri etkin olarak çalışır.

Çalışma zamanı özellik durumu sorgulamak için:

```shell
solana feature status <ADDRESS>
```

- `ADDRESS`, sorgulanacak özellik durumudur [varsayılan: tüm bilinen özellikler]

Belirli bir özelliği etkinleştirmek için:

```shell
solana feature activate <FEATURE_KEYPAIR> <CLUSTER>
```

- `FEATURE_KEYPAIR`, etkinleştirilecek özelliğin imzacı bilgisidir
- `CLUSTER`, özelliği etkinleştireceğiniz kümedir

Genesis'te belirli özellikleri devre dışı bırakmak için:

```shell
solana-test-validator --deactivate-feature <FEATURE_PUBKEY> --reset
```

Bu, yeni bir defter üzerinde yapılmalıdır, bu yüzden çalışma dizininizde halihazırda
bir defter varsa, genesis'e sıfırlamak için `--reset` bayrağını eklemeniz gerekir.

---

## Sürümleri Değiştirme

Mevcut `solana-test-validator` sürümünüzü kontrol etmek için:

```shell
solana-test-validator --version
```

`solana-test-validator`'ünüz, Solana CLI sürümüyle aynı sürümde çalışmaktadır.

Programlarınızı Solana çalışma zamanının farklı sürümlerine karşı test etmek
için, birden fazla Solana CLI sürümü yükleyebilir ve bunlar arasında geçiş
yapabilirsiniz:

```shell
solana-install init <VERSION>
```

- `VERSION`, yüklemek istediğiniz CLI sürümüdür

Sürümleri değiştirdikten sonra doğru sürümde çalıştığına emin olmak için Solana
test validator'ünüzü yeniden başlatmayı unutmayın.

---

## Program Klonlama

Mevcut on-chain programları yerel ortamınıza eklemek için, programı yeni bir
defter ile klonlayabilirsiniz.

Kümeden bir hesabı klonlamak için:

```shell
solana-test-validator --clone PROGRAM_ADDRESS --url CLUSTER_PROGRAM_IS_DEPLOYED_TO
```

Bu, standart programlarla etkileşimleri test etmek için yararlıdır.

Eğer çalışma dizininizde bir defter halihazırda mevcutsa, bir programı klonlayabilmek
için defteri sıfırlamanız gerekir.

Bir defter zaten mevcutken bir kümeden bir hesabı klonlamak için:

```shell
solana-test-validator --clone PROGRAM_ADDRESS --url CLUSTER_PROGRAM_IS_DEPLOYED_TO --reset
```

Kümeden bir yükseltilebilir program ve onun yürütülebilir verilerini klonlamak için:

```shell
solana-test-validator --clone-upgradeable-program PROGRAM_ADDRESS --url CLUSTER_PROGRAM_IS_DEPLOYED_TO
```

---

## Başlangıçta Hesapların Durumunu Sıfırlama

Varsayılan olarak, validator mevcut bir deftere devam eder _(varsa)_. Ancak
başlangıçta, defteri ya genesis'e ya da sağladığınız belirli hesap durumuna sıfırlayabilirsiniz.

### Genesis'e Sıfırlama

Defteri genesis durumuna sıfırlamak için:

```shell
solana-test-validator --reset
```

### Belirli Hesaplara Sıfırlama

Validator'ü her başlattığınızda belirli hesapların durumunu sıfırlamak için
hesap anlık görüntüleri ve `--account` bayrağını kullanarak bir kombinasyon
oluşturabilirsiniz.

Öncelikle, bir hesabın istenen durumunu JSON dosyası olarak kaydedin:

```shell
solana account PROGRAM_ADDRESS --output json > account_state.json
```

Daha sonra validator'ü sıfırladığınız her seferinde bu durumu yükleyin:

```shell
solana-test-validator --reset --account PROGRAM_ADDRESS account_state.json
```

---

## Solana CLI Komutları

Tüm CLI komutlarını görüntülemek ve test validator ile etkileşimde bulunmanın
diğer yollarını görmek için:

```shell
solana --help
```

Bu komut, mevcut tüm bayrakları, seçenekleri ve alt komutları listeler.

---

## Örnek Kullanım Durumu

Yerel ağınızda bir USDC Token Hesabı oluşturun

1. USDC mint adresini yerel validator'ünüze klonlayın

```shell
solana-test-validator --clone EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v --url mainnet-beta --reset
```

2. Bir token hesabı oluşturun

```shell
spl-token create-account EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v --url localhost
```