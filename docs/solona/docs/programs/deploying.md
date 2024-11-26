---
title: "Programları Dağıtma"
description:
  Zincir üstü programları, derlenmiş byte-kodu Solana blok zincirine yüklemek için
  Yükseltilebilir BPF yükleyicisini kullanarak Solana CLI ile dağıtılabilir.
sidebarSortOrder: 2
---

Solana programları, ağda "çalıştırılabilir" hesaplar içinde saklanır. Bu
hesaplar, kullanıcıların programla etkileşimde bulunmasını sağlayan derlenmiş
byte kodunu içerir.

## CLI Komutları

Bu bölüm, Solana programlarını oluşturmak ve dağıtmak için temel CLI komutlarına
bir referans olarak tasarlanmıştır. İlk programınızı oluşturmak için adım adım
bir rehber için `Rust'ta Program Geliştirme` ile başlayın.

### Programı Oluşturma

Programınızı oluşturmak için `cargo build-sbf` komutunu kullanın.

```shell
cargo build-sbf
```

:::note
Bu komut aşağıdaki işlemleri gerçekleştirecektir:
1. Programınızı derleyecek
2. Bir `target/deploy` dizini oluşturacak
3. `.so` dosyasını üretecek; burada `` `Cargo.toml` dosyanızdaki program adını eşleşecektir.
:::

Çıktı `.so` dosyası, programınızı dağıttığınızda bir Solana hesabında saklanacak
olan programınızın derlenmiş byte kodunu içerir.

### Programı Dağıtma

Programınızı dağıtmak için `solana program deploy` komutunu, ardından
`cargo build-sbf` komutuyla oluşturulan `.so` dosyasının yolu ile birlikte
kullanın.

```shell
solana program deploy ./target/deploy/your_program.so
```

:::tip
Sıkışıklık zamanlarında, program dağıtımına yardımcı olmak için birkaç ek bayrak
kullanabilirsiniz:
- `--with-compute-unit-price`: İşlem için hesaplama birim fiyatını ayarlayın, her işlem birimi için 0.000001 lamport (mikro-lamport) artışlarıyla.
- `--max-sign-attempts`: Blockhash süresi dolduktan sonra işlemleri imzalamak veya yeniden imzalamak için maksimum deneme sayısı.
- `--use-rpc`: Yazma işlemlerini yapılandırılmış RPC'ye göndermek için doğrulayıcı TPU'ları yerine bu bayrağı kullanın.
:::

Bayrakları bireysel olarak kullanabilir veya bir araya getirebilirsiniz. Örneğin:

```shell
solana program deploy ./target/deploy/your_program.so --with-compute-unit-price 10000 --max-sign-attempts 1000 --use-rpc
```

:::info
`--with-compute-unit-price` bayrağı ile ayarlanacak öncelikli ücret tahmini
almak için [Helius tarafından Öncelikli Ücret API'sini](https://docs.helius.dev/guides/priority-fee-api) kullanın.

`--use-rpc` bayrağı ile kullanılacak bir [stake-ağırlıklı](https://solana.com/developers/guides/advanced/stake-weighted-qos)
RPC bağlantısını [Helius](https://www.helius.dev/) veya
[Trition](https://triton.one/) üzerinden alabilirsiniz. `--use-rpc` bayrağı,
yalnızca bir stake-ağırlıklı RPC bağlantısıyla kullanılmalıdır.
:::

Varsayılan RPC URL'nizi özel bir RPC son noktasıyla güncellemek için
`solana config set` komutunu kullanın.

```shell
solana config set --url <RPC_URL>
```

Yaygın olarak dağıttığınız programların listesini `solana program show --programs`
komutunu kullanarak görebilirsiniz.

```shell
solana program show --programs
```

Örnek çıktı:

```
Program Id                                   | Slot      | Authority                                    | Balance
2w3sK6CW7Hy1Ljnz2uqPrQsg4KjNZxD4bDerXDkSX3Q1 | 133132    | 4kh6HxYZiAebF8HWLsUWod2EaQQ6iWHpHYCz8UcmFbM1 | 0.57821592 SOL
```

### Programı Güncelleme

Bir programın güncelleme yetkisi, mevcut bir Solana programını yeni bir `.so`
dosyası dağıtarak değiştirebilir.

Mevcut bir Solana programını güncellemek için:

- Program kaynak kodunuzda değişiklikler yapın
- Güncellenmiş bir `.so` dosyası oluşturmak için `cargo build-sbf` komutunu çalıştırın
- Güncellenmiş `.so` dosyasını dağıtmak için `solana program deploy ./target/deploy/your_program.so` komutunu çalıştırın

Güncelleme yetkisi, `solana program set-upgrade-authority` komutunu kullanarak
değiştirilebilir.

```shell
solana program set-upgrade-authority <PROGRAM_ADDRESS> --new-upgrade-authority <NEW_UPGRADE_AUTHORITY>
```

### Değiştirilemez Program

Bir program, güncelleme yetkisini kaldırarak değiştirilemez hale getirilebilir.
Bu geri alınamaz bir eylemdir.

```shell
solana program set-upgrade-authority <PROGRAM_ADDRESS> --final
```

Bölüm sırasında programın değiştirilemez olmasını belirlemek için programı
dağıtırken `--final` bayrağını ayarlayabilirsiniz.

```shell
solana program deploy ./target/deploy/your_program.so --final
```

:::warning
Solana programınızı kapatarak hesaba tahsis edilen SOL'u geri alabilirsiniz.
Bir programı kapatmak geri alınamazdır, bu nedenle dikkatli yapılmalıdır.
:::

Bir programı kapatmak için `solana program close ` komutunu kullanın.
Örneğin:

```shell filename="Terminal"
solana program close 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz --bypass-warning
```

Örnek çıktı:

```
Kapatılan Program Id 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz, 0.1350588 SOL geri alındı
```

Bir program kapatıldıktan sonra, program ID'si bir daha kullanılamaz. Daha önce
kapatılan bir program ID'si ile bir program dağıtma girişimi hata ile sonuçlanır.

```
Hata: Program 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz kapatılmıştır, yeni
bir Program Id kullanın
```

Kapatıldıktan sonra bir programı yeniden dağıtmanız gerekiyorsa, yeni bir
program ID'si oluşturmalısınız. Program için yeni bir anahtar çifti oluşturmak
için aşağıdaki komutu çalıştırın:

```shell filename="Terminal"
solana-keygen new -o ./target/deploy/your_program-keypair.json --force
```

Alternatif olarak, mevcut anahtar çifti dosyasını silebilir ve `cargo build-sbf`
komutunu tekrar çalıştırarak yeni bir anahtar çifti dosyası oluşturabilirsiniz.

### Program Buffer Hesapları

Bir programı dağıtmak, Solana'daki işlemler için 1232 byte'lık limit nedeniyle
birden fazla işlem gerektirir. Dağıtım sürecinin ara adımı, programın byte kodunu
geçici "buffer hesabına" yazmaktır.

:::info
Bu buffer hesabı, başarılı program dağıtımından sonra otomatik olarak kapatılır.
Ancak, dağıtım başarısız olursa, buffer hesabı kalır ve ya:
- Mevcut buffer hesabını kullanarak dağıtıma devam edin
- Ayrılan SOL'u (kira) geri almak için buffer hesabını kapatın
:::

Herhangi bir açık buffer hesabınız olup olmadığını `solana program show --buffers`
komutunu kullanarak kontrol edebilirsiniz.

```shell
solana program show --buffers
```

Örnek çıktı:

```
Buffer Address                               | Authority                                    | Balance
5TRm1DxYcXLbSEbbxWcQbEUCce7L4tVgaC6e2V4G82pM | 4kh6HxYZiAebF8HWLsUWod2EaQQ6iWHpHYCz8UcmFbM1 | 0.57821592 SOL
```

Dağıtıma devam etmek için `solana program deploy --buffer ` komutunu
kullanabilirsiniz.

Örneğin:

```shell
solana program deploy --buffer 5TRm1DxYcXLbSEbbxWcQbEUCce7L4tVgaC6e2V4G82pM
```

Başarılı bir dağıtımda beklenen çıktı:

```
Program Id: 2w3sK6CW7Hy1Ljnz2uqPrQsg4KjNZxD4bDerXDkSX3Q1

İmza: 3fsttJFskUmvbdL5F9y8g43rgNea5tYZeVXbimfx2Up5viJnYehWe3yx45rQJc8Kjkr6nY8D4DP4V2eiSPqvWRNL
```

Buffer hesaplarını kapatmak için `solana program close --buffers` komutunu
kullanın.

```shell
solana program close --buffers
```

### ELF Dump

SBF paylaşılan nesne iç yapıları, bir programın bileşimini ve çalışma zamanında
ne tür işlemler gerçekleştirdiğini daha iyi anlamak için metin dosyasına dökülebilir.
Döküm, hem ELF bilgilerini hem de tüm sembollerin ve bunları uygulayan
talimatların bir listesini içerecektir. Bazı BPF yükleyicisinin hata günlüğü
mesajları, hatanın meydana geldiği belirli talimat numaralarını referans alır.
Bu referanslar, sorunun kaynağı olan talimat ve bağlamını tanımlamak için ELF
dökümünde aranabilir.

```shell
cargo build-bpf --dump
```

Dosya `/target/deploy/your_program-dump.txt` konumuna çıkarılacaktır.

## Program Dağıtım Süreci

Solana'da bir programı dağıtmak, 1232 byte'lık maksimum boyut sınırı nedeniyle
birden fazla işlem gerektirir. Solana CLI, bu işlemleri `solana program deploy`
alt komutuyla gönderir. Süreç, şu 3 aşamaya ayrılabilir:

1. [Buffer başlatma](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/cli/src/program.rs#L2113):
   İlk olarak, CLI, [bir buffer hesabı oluşturur](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/cli/src/program.rs#L1903)
   byte kodunun dağıtımı için yeterince büyük. Ayrıca, buffer otoritesini set
   eden [buffer başlatma talimatını](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/programs/bpf_loader/src/lib.rs#L320)
   çağırır, yazmayı, dağıtıcı tarafından seçilen adrese kısıtlamak için.
2. [Buffer yazma](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/cli/src/program.rs#L2129):
   Buffer hesabı başlatıldığında, CLI
   [program byte kodunu böler](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/cli/src/program.rs#L1940)
   ~1KB parçalarına ve
   [saniyede 100 işlem hızıyla işlemleri gönderir](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/client/src/tpu_client.rs#L133)
   her parçayı yazmak için
   [yazma buffer talimatıyla](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/programs/bpf_loader/src/lib.rs#L334).
   Bu işlemler, mevcut liderin işlem işleme (TPU) portuna doğrudan gönderilir ve
   birbirleri ile paralel olarak işlenirler. Tüm işlemler gönderildikten sonra
   CLI, her yazımın başarılı ve onaylı olduğundan emin olmak için
   [işlem imzalarının gruplarıyla RPC API'sını kontrol eder](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/client/src/tpu_client.rs#L216).
3. [Tamamlama](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/cli/src/program.rs#L1807):
   Yazımlar tamamlandıktan sonra, CLI,
   [yeni bir programı dağıtmak](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/programs/bpf_loader/src/lib.rs#L362)
   veya
   [mevcut bir programı yükseltmek için](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/programs/bpf_loader/src/lib.rs#L513)
   son bir işlem gönderir. Her iki durumda da, buffer hesabına yazılan byte kodu
   bir program veri hesabına kopyalanacak ve doğrulanacaktır.

## Yükseltilebilir BPF Yükleyici Programı

BPF yükleyici programı, Solana'daki tüm çalıştırılabilir hesapların "sahibi" olan
programdır. Bir program dağıttığınızda, program hesabının sahibi bu BPF yükleyici
programı olarak ayarlanır.

### Durum Hesapları

Yükseltilebilir BPF yükleyici programı, üç farklı türde durum hesabını destekler:

1. [Program hesabı](https://github.com/solana-labs/solana/blob/master/sdk/program/src/bpf_loader_upgradeable.rs#L34):
   Bu zincir üstü programın ana hesabıdır ve adresi genellikle "program kimliği"
   olarak adlandırılır. Program kimlikleri, işlem talimatlarının bir programı
   çağırmak için referans verdiği kimliklerdir. Program hesapları, dağıtıldıktan
   sonra değiştirilemez, bu nedenle onları byte koduna ve diğer hesaplarda
   saklanan duruma bir proxy hesabı olarak düşünebilirsiniz.
2. [Program veri hesabı](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/bpf_loader_upgradeable.rs#L39):
   Bu hesap, zincir üstündeki programın çalıştırılabilir byte kodunu saklar.
   Program yükseltildiğinde, bu hesabın verileri yeni byte kodu ile güncellenir.
   Byte kodunun yanı sıra, program veri hesapları ayrıca en son değiştirilme anındaki
   slotu saklamak ve hesabı değiştirme yetkisine sahip tek hesabın adresini
   saklamakla sorumludur (bu adres, bir programı değiştirilemez hale getirmek için
   temizlenebilir).
3. [Buffer hesapları](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/bpf_loader_upgradeable.rs#L27):
   Bu hesaplar, bir program aktif olarak bir dizi işlemle dağıtılırken byte kodunu
   geçici olarak saklarlar. Her biri, yazma işlemlerine yetkili tek hesabın adresini
   saklar.

### Talimatlar

Yukarıda listelenen durum hesapları, yalnızca Yükseltilebilir BPF Yükleyici programı
tarafından desteklenen aşağıdaki talimatlardan biri ile değiştirilebilir:

1. [Buffer'ı başlat](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L21):
   Bir buffer hesabı oluşturur ve buffer'ı değiştirmeye yetkili bir yetki adresi
   saklar.
2. [Yaz](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L28):
   Belirli bir byte ofsetinde bir buffer hesabına byte kodu yazar. Yazma işlemleri,
   Solana işlemlerinin maksimum seri boyutunun 1232 byte olmasından dolayı küçük
   parçalar halinde işlenir.
3. [Dağıt](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L77):
   Hem bir program hesabı hem de bir program veri hesabı oluşturur. Buffer
   hesabında saklanan byte kodunu kopyalayarak program veri hesabını doldurur. Byte
   kodu geçerli ise, program hesabı çalıştırılabilir olarak ayarlanır ve çağrılmasına
   izin verilir. Byte kodu geçersizse, talimat başarısız olur ve tüm değişiklikler
   geri alınır.
4. [Yükselt](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L102):
   Çalıştırılabilir byte kodunu bir buffer hesabından kopyalayarak mevcut bir program
   veri hesabını doldurur. Dağıtım talimatı ile benzer şekilde, sadece byte kodu
   geçerli olduğu sürece başarılı olacaktır.
5. [Yetkiyi ayarla](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L114):
   Hesabın mevcut yetkisi, işleme alınan işlemi imzaladıysa, bir program veri hesabı
   veya buffer hesabının yetkisini günceller. Yetki yerine bir yetki silinirse,
   yeni bir adrese ayarlanamaz ve hesap asla kapatılamaz.
6. [Kapat](https://github.com/solana-labs/solana/blob/7409d9d2687fba21078a745842c25df805cdf105/sdk/program/src/loader_upgradeable_instruction.rs#L127):
   Bir program veri hesabının veya buffer hesabının verilerini temizler ve kira
   istisna deposit için kullanılan SOL'u geri alır.