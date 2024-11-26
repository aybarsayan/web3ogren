---
date: 2024-09-26T00:00:00Z
difficulty: intermediate
title: "Bir Programı Nasıl Doğrularsınız"
description:
  "Doğrulanmış yapılar, programınızı kaynak koduna bağlamanın bir yoludur ve
  herkesin sağlanan kaynak kodundan gerçekten inşa edildiğini bağımsız olarak
  doğrulamasına olanak tanır."
tags:
  - web3js
keywords:
  - eğitim
  - doğrulanmış yapılar
  - security.txt
  - doğrulanmış kaynak kodu
  - programların kaynak kodunu bulma
  - güvenlik
  - blockchain eğitimi
---

Bu kılavuz, Solana'da programları için doğrulanmış yapılar uygulamak isteyen geliştiriciler için bir referans olarak tasarlanmıştır. Doğrulanmış yapıların ne olduğunu, nasıl kullanılacağını, özel dikkate almayı ve programınızın on-chain'deki özgünlüğünü sağlamak için en iyi uygulamaları ele alacağız.

# Doğrulanmış yapılar nedir?

Doğrulanmış yapılar, Solana'nın ağına dağıttığınız yürütülebilir programın depo kaynağındaki kaynak kodu ile eşleştiğinden emin olmanızı sağlar. Bunu yaparak, geliştiriciler ve kullanıcılar, on-chain'de çalışan programın tam olarak halka açık kod tabanıyla ilişkili olduğuna güvenebilir, böylece şeffaflık ve güvenlik teşvik edilir.

Doğrulama süreci, on-chain programının hash'ini kaynak kodundan yerel olarak inşa edilen programın hash'i ile karşılaştırmayı içerir. Bu, iki versiyon arasında herhangi bir tutarsızlık olmadığını garanti eder.

> **Önemli Not:** Doğrulanmış bir yapının, doğrulanmamış bir yapıdan daha güvenli olarak düşünülmemesi gerektiği önemlidir; ancak bu yapı, geliştiricilerin kaynak kodunun, on-chain'de dağıtılan kodla eşleştiğini kendi kendine doğrulamasına olanak tanır. Geliştirici, kaynak kodunu kullanarak, bir işlem gönderildiğinde kodun ne yaptığını doğrulayabilir.

Doğrulanmış yapılar hattı, [Ellipsis Labs](https://ellipsislabs.xyz/) ve [OtterSec](https://osec.io/) tarafından düşünülmüş ve sürdürülmektedir. Daha fazla detay için, [orijinal doğrulanmış yapılar](https://github.com/Ellipsis-Labs/solana-verifiable-build) deposuna ve orada desteklendiği takdirde [Anza](https://www.anza.xyz/) aracılığıyla doğrudan doğrulama yapma sürecini takip edebilirsiniz.

---

# Nasıl çalışır?

Doğrulama süreci, on-chain programının hash'ini kaynak kodundan yerel olarak inşa edilen programın hash'i ile karşılaştırarak gerçekleştirilir. Programınızı Solana Verify CLI ve Docker kullanarak kontrol edilen bir ortamda inşa edersiniz. Bu, yapım sürecinin belirleyici ve farklı sistemler arasında tutarlı olmasını sağlar. Yürütülebilir dosyanız olduğunda, onu Solana ağına dağıtabilirsiniz. Yapım süreci sırasında [verify program](https://github.com/otter-sec/otter-verify) için bir [PDA](https://explorer.solana.com/address/63XDCHrwZu3mXsw2RUFb4tbNpChuUHx4eA5aJMnHkpQQ/anchor-account) oluşturulacaktır. Bu PDA, programı doğrulamak için gerekli olan tüm verileri içermektedir. PDA, program adresini, git url'sini, commit hash'ini ve programı inşa etmek için kullanılan argümanları içerir.

PDA'daki veriler kullanılarak herkes yerel olarak doğrulama program komutunu çalıştırabilir ve programın sağlanan kaynak kodundan inşa edilip edilmediğini kontrol edebilir. Sonra herkes tamamen güvenilir bir şekilde kendileri doğrulayabilir veya [OtterSec](https://github.com/otter-sec) tarafından bakılan kendi [doğrulama API'sini](https://github.com/otter-sec/solana-verified-programs-api) çalıştırabilir, bu da kullanıcıların doğrulamayı kontrol etmeleri için kolay bir erişim noktası sağlar. Bu [API çağrılarını](https://verify.osec.io/status/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY) [Solana Explorer](https://explorer.solana.com/address/E1fcPKuV1UJEsTJPpab2Jr8y87ZN73i4CHTPLbWQE6CA/verified-build) ve [SolanaFM](https://solana.fm/address/E1fcPKuV1UJEsTJPpab2Jr8y87ZN73i4CHTPLbWQE6CA/transactions?cluster=mainnet-alpha) gibi birçok yerde zaten kullanıldığını görebilirsiniz.

---

# Neden doğrulanmış yapılar kullanmalıyım?

Doğrulanmış yapılar aşağıdaki avantajları sağlar:

- **Güvenlik:** On-chain'de çalışan programın, kötü niyetli değişiklikleri önleyerek kaynak koduyla eşleşmesini garanti eder.
  
- **Şeffaflık:** Diğer kullanıcıların ve geliştiricilerin, on-chain programın güvenilir olduğunu doğrulamasına olanak tanır.

- **Güven:** Kullanıcıların güvenini artırır, çünkü doğrulanmış yapılar, programınızın on-chain davranışının halka açık koduyla uyumlu olduğunu gösterir. Doğrulanmış programlar inşa ederken, yetkisiz veya kötü niyetli kod çalıştırma ile ilgili riskleri minimize edersiniz. Ayrıca en iyi uygulamalara uymanızı sağlar ve güvenlik araştırmacılarına sizinle iletişim kurmanın kolay bir yolunu sunar. Ayrıca cüzdanlar ve diğer araçlar, programınızın doğrulanmış olması durumunda işlemleri daha kolay gerçekleştirebilir.

- **Keşfedilebilirlik:** Programınızın doğrulanmış yapısını sağladığınızda, herkes kaynak kodunuza, belgelerinize, program SDK'nıza veya IDL'nize erişebilir ve bir sorun olması durumunda kolayca Github aracılığıyla sizinle iletişim kurabilir.

--- 

# Doğrulanmış yapılar nasıl oluşturulur?

Doğrulanmış yapılar oluşturmak için bu adımları takip etmelisiniz:


Özet

- Kodunuzu bir halka açık depoya gönderin
- Docker'da doğrulanmış bir yapıyı oluşturun
- Doğrulanmış yapıyı dağıtın
- Dağıtılan programı kamu API'sine karşı doğrulayın



Docker konteynerinde inşa edilmemiş bir programı doğruladığınızda büyük ihtimalle başarısız olacaktır, çünkü Solana programının yapıları farklı sistemler arasında belirleyici değildir.

### Docker ve Cargo'yu Kurun

Gerekli araçları kurun; Docker ve Cargo'nun kurulu olduğundan emin olun. Docker, tutarlılığı sağlamak için kontrol edilen bir yapı ortamı sağlar ve Cargo, Rust paketlerini yönetmek için kullanılır.

- **Docker:** Docker'ın kendi platformunuza kurulumu için [Docker web sitesi](https://docs.docker.com/engine/install/) üzerindeki adımları takip edin. Kurulduktan sonra, Docker hizmetinin çalıştığından emin olun.
- **Cargo:** Eğer daha önce Cargo kurmadıysanız, aşağıdaki komutu çalıştırarak kurabilirsiniz:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Solana Verify CLI'yi Kurun

Solana Verify CLI, yapıları doğrulamak için kullanılan ana araçtır. Solana Verify CLI şu anda [Ellipsis Labs](https://ellipsislabs.xyz/) tarafından sürdürülmektedir ve Cargo kullanılarak kurulabilir.

> Doğrulama süreci yakında [Anza](https://www.anza.xyz/) araç setine taşınacak. Ancak yapıları doğrulama genel yöntemi oldukça benzer kalacaktır.

Aşağıdaki komutu çalıştırarak kurabilirsiniz:

```bash
cargo install solana-verify
```

CLI'nin belirli bir versiyonuna ihtiyacınız varsa, versiyonu aşağıdaki gibi sabit tutabilirsiniz:

```bash
cargo install solana-verify --version $VERSION
```

İsterseniz, belirli bir commit'ten doğrudan bir versiyon kurabilirsiniz:

```bash
cargo install solana-verify --git https://github.com/Ellipsis-Labs/solana-verifiable-build --rev 13a1db2
```

### Projeyi Hazırlayın

Bir depoya karşı doğrulamak için, depoda kök dizinde bir `Cargo.lock` dosyasına ihtiyacı vardır. Depoda yalnızca bir program varsa ve kök dizinde bir `cargo.lock` dosyası varsa, bir sonraki adıma geçebilirsiniz ve programınızı inşa edebilirsiniz.

Programınız bir alt klasördeyse ve bir rust çalışma alanına sahipseniz, depo kök dizininde bir çalışma alanı `Cargo.toml` dosyası oluşturmanız gerekmektedir.

Bu `Cargo.toml` örneğini ön ayar olarak kullanabilirsiniz:

```toml filename="Cargo.toml"
[workspace]
members = ["program/programs/*"]
resolver = "2"

[profile.release]
overflow-checks = true
lto = "fat"
codegen-units = 1

[profile.release.build-override]
opt-level = 3
incremental = false
codegen-units = 1
```

Programınızın `workspace/members` dizisinde olduğunu ve programınızın `Cargo.toml` dosyasının doğru `lib` adının yapılandırıldığını kontrol edin.

> **Önemli Not:** `lib adı`, paket adı değil!

Şöyle bir şey:

```toml filename="waffle/Cargo.toml"
[package]
name = "waffle"
version = "0.1.0"
edition = "2021"

[lib]
name = "waffle"
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "2.1.0"
```

Bu [repo](https://github.com/solana-developers/verified-program) içinde, bir alt klasörde bir program ile bir çalışma alanı örneği görebilirsiniz. Ayrıca program bir alt klasörde olduğunda, daha sonra bu klasörü `--mount-path` olarak `verify-from-repo` komutuna eklemeniz gerekecektir.

Bu [repo](https://github.com/solana-developers/solana-game-preset) içinde bir anchor örneği bulabilirsiniz. Bu [repo](https://github.com/solana-developers/verified-program-root) içinde, native rust örneği bulabilirsiniz.

Bu `Cargo.toml` dosyası yerinde olduğunda, `cargo generate-lockfile` komutunu çalıştırarak bir lock dosyası oluşturabilir ve programınızı inşa etmeye devam edebilirsiniz.

### Doğrulanabilir Programlar İnşa Etme

Solana programınızı doğrulanabilir bir şekilde inşa etmek için, çalışma alanınızdaki `Cargo.toml` dosyasının bulunduğu dizine gidin ve şu komutu çalıştırın:

```bash
solana-verify build
```

Bu, ortamınızı bir docker konteynerine kopyalayacak ve belirleyici bir şekilde inşa edecektir.

> **Önemli Uyarı:** Doğrulanmış yapıyı gerçekten dağıttığınızdan emin olun ve onu `anchor build` ya da `cargo build-sbf` ile yanlışlıkla üzerine yazmayın, çünkü bunlar muhtemelen aynı hash'i üretemeyecek ve dolayısıyla doğrulamanız başarısız olacaktır.

Birden fazla program bulunan projelerde, belirli bir programı kütüphane adını (kütüphane adı, paket adı değil) kullanarak inşa edebilirsiniz:

```bash
solana-verify build --library-name $PROGRAM_LIB_NAME
```

Bu işlem, belirleyici yapılar sağlar ve özellikle belirli sistemlerde (örneğin, M1 MacBook) biraz zaman alabilir, çünkü işlem bir docker konteyneri içinde çalışmaktadır. Daha hızlı yapılar için, x86 mimarisine sahip bir Linux makinesi kullanılması önerilir.

Yapım tamamlandıktan sonra, yürütülebilir dosyanın hash'ini aşağıdaki komutla alabilirsiniz:

```bash
solana-verify get-executable-hash target/deploy/$PROGRAM_LIB_NAME.so
```

### Doğrulanabilir Programları Dağıtma

Programınızı inşa ettikten ve hash'ini aldıktan sonra, onu Solana ağına dağıtabilirsiniz. Güvenli dağıtımlar için [Squads Protocol](https://squads.so/protocol) gibi çok imzalı ya da yönetişim çözümleri kullanmanız önerilir, ancak şu komutla doğrudan da dağıtabilirsiniz:

```bash
solana program deploy -u $NETWORK_URL target/deploy/$PROGRAM_LIB_NAME.so --program-id $PROGRAM_ID --with-compute-unit-price 50000 --max-sign-attempts 100 --use-rpc
```

Örneğin [Quicknode](https://www.quicknode.com/gas-tracker/solana) gibi bir rpc sağlayıcınızdan talep edebileceğiniz uygun bir düşük öncelik ücreti.

Dağıtılan programın oluşturulan yürütülebilir dosya ile eşleştiğini doğrulamak için şu komutu çalıştırın:

```bash
solana-verify get-program-hash -u $NETWORK_URL $PROGRAM_ID
```

> **Uyarı:** Farklı `Solana kümelerinde` (yani devnet, testnet, mainnet) farklı sürümler dağıtılmış olabilir. Doğrulamak istediğiniz Solana kümesine uygun ağ URL'sini kullandığınızdan emin olun. Uzaktan doğrulama yalnızca mainnet'te çalışacaktır.

Artık programınızın hash'ini alabilir ve önceki ikili hash'inizle karşılaştırabilirsiniz:

```bash
solana-verify get-program-hash $PROGRAM_ID
```

### Depolarla Karşılaştırma

Bir programı kamu deposuna karşı doğrulamak için şu komutu kullanın:

```bash
solana-verify verify-from-repo -u $NETWORK_URL --program-id $PROGRAM_ID https://github.com/$REPO_PATH --commit-hash $COMMIT_HASH --library-name $PROGRAM_LIB_NAME --mount-path $MOUNT_PATH
```

> **Not:** Program dizininde doğrulanmış yapıyı çalıştırırken, `verify-from-repo` komutunu çalıştırırken `--mount-path` bayrağını eklemeniz gerektiğini unutmayın. Bu, programınızın kütüphane adını içeren `Cargo.toml` dosyasının bulunduğu klasörün yolu olacaktır.

Bu komut, on-chain program hash'ini belirtilen commit hash'indeki kaynak kodundan oluşturulan yürütücü hash'i ile karşılaştırır.

Komutun sonunda size doğrulama verilerinizi on-chain'de yüklemek isteyip istemediğiniz sorulacaktır. Eğer bunu yaparsanız, Solana Explorer programınızın doğrulama verilerini hemen gösterecektir. Uzaktan bir yapıyla doğrulanana kadar, doğrulanmamış olarak gözükecektir. Kamu API'sine karşı programınızı nasıl doğrulayacağınızı bir sonraki adımda öğrenebilirsiniz.

Belirli bir sürüme doğrulamayı kilitlemek isterseniz, komuta `--commit-hash` bayrağını ekleyebilirsiniz.

### Kamu API'sine karşı doğrulama

Son olarak, programı doğrulama API'sini uygulayan başka birine karşı doğrudan doğrulayabilirsiniz:

```bash
solana-verify verify-from-repo --remote -um --program-id PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY https://github.com/Ellipsis-Labs/phoenix-v1
```

> **Öneri:** Ücretsiz RPC'lerin oran sınırlamalarına takılmamak için bir ücretli RPC URL'si kullanmanız önerilir. Bu nedenle `-um` yerine `--url yourRpcUrl` kullanmanız daha güvenilir bir doğrulama için önerilir.

`--remote` bayrağı, OtterSec API'sine bir yapı talebi gönderir; bu, programınızın uzaktan inşa edilmesini tetikler. Yapım tamamlandığında, sistem on-chain program hash'inin, depo kaynağınızdan oluşturulan yapı nesnesinin hash'iyle eşleşip eşleşmediğini doğrular.

Varsayılan olarak [OtterSec API](https://github.com/otter-sec/solana-verified-programs-api) kullanılır.

Yapım tamamlandığında ve başarılı olduğunda programınızı [OtterSec API'de tekli programlar için](https://verify.osec.io/status/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY) görünür ve [Solana Explorer'de](https://explorer.solana.com/address/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY/verified-build), [SolanaFM](https://solana.fm/address/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY?cluster=mainnet-alpha), [SolScan](https://solscan.io/account/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY#programVerification) ve nihayet [0xDeep](https://x.com/0xDeep) ve [OtterSec doğrulanmış programlar API'si](https://verify.osec.io/verified-programs) tarafından sürdürülen topluluk destekli web sitesi [SolanaVerify.org](https://www.solanaverify.org/) ve nihayetinde [Doğrulanmış Programlar Dune Dashboard'unda](https://dune.com/jonashahn/verified-programs/dedf21e1-9b71-42c8-89f9-02ed94628657) görülebilir; bu, Solana ekosistemine daha sağlıklı katkıda bulunur.

---

## Docker görüntüsünden doğrulama

Programınızı bir docker görüntüsüne karşı doğrulamak için, aşağıdaki komutu çalıştırabilirsiniz:

```bash
solana-verify verify-from-image -e examples/hello_world/target/deploy/hello_world.so -i ellipsislabs/hello_world_verifiable_build:latest -p 2ZrriTQSVekoj414Ynysd48jyn4AX6ZF4TTJRqHfbJfn
```

Bu komut, `ellipsislabs/hello_world_verifiable_build:latest` olarak depolanan görüntüyü yükler ve konteynerdeki yürütülebilir dosya yolunun hash'inin, komuta verilen on-chain programın hash'iyle aynı olup olmadığını doğrular. Yapı, zaten bir görüntüye yüklendiğinden, çalıştırmasının uzun sürmemesi için tamamen yeniden inşa etmeye gerek yoktur.

`ellipsislabs/hello_world_verifiable_build:latest` görüntüsünü oluşturan Dockerfile, ellipsis labları deposunda [/examples/hello_world](https://github.com/Ellipsis-Labs/solana-verifiable-build/tree/master/examples/hello_world) bulunmaktadır.

Aşağıda beklenen çıktı yer almaktadır:

```bash
Verifying image: "ellipsislabs/hello_world_verifiable_build:latest", on network "https://api.mainnet-beta.solana.com" against program ID 2ZrriTQSVekoj414Ynysd48jyn4AX6ZF4TTJRqHfbJfn Executable path in container: "examples/hello_world/target/deploy/hello_world.so"

Executable hash: 08d91368d349c2b56c712422f6d274a1e8f1946ff2ecd1dc3efc3ebace52a760 Program hash: 08d91368d349c2b56c712422f6d274a1e8f1946ff2ecd1dc3efc3ebace52a760 Executable matches on-chain program data ✅
```

## Örnek doğrulanmış yapı

`FWEYpBAf9WsemQiNbAewhyESfR38GBBHLrCaU3MpEKWv` program kimliğine sahip bir örnek programı doğrulamanın bir örneği, bu [depo](https://github.com/solana-developers/verified-program) ile kaynak kodunu kullanarak:

```bash
solana-verify verify-from-repo https://github.com/solana-developers/verified-program --url YOUR-RPC-URL --program-id FWEYpBAf9WsemQiNbAewhyESfR38GBBHLrCaU3MpEKWv --mount-path waffle --library-name waffle --commit-hash 5b82b86f02afbde330dff3e1847bed2d42069f4e
```

Varsayılan olarak `verify-from-repo` komutu, ana dal üzerindeki son commit'i alır. Eğer depo üzerinde çalışmaya devam etmek isterseniz, belirli bir commit tanımlamak için `commit-hash` parametresini kullanabilirsiniz: `--commit-hash 5b82b86f02afbde330dff3e1847bed2d42069f4e`

Son olarak, programı doğrudan OtterSec API'si karşısında doğrulayabilirsiniz:

```bash
solana-verify verify-from-repo https://github.com/solana-developers/verified-program --url YOUR-RPC-URL --remote --program-id FWEYpBAf9WsemQiNbAewhyESfR38GBBHLrCaU3MpEKWv --mount-path waffle --library-name waffle --commit-hash 5b82b86f02afbde330dff3e1847bed2d42069f4e
```

`--remote` komutu, OtterSec API'sine bir yapı talebi gönderir; bu, programınızın uzaktan inşa edilmesini tetikler. Yapım tamamlandığında, sistem on-chain program hash'inin, depo kaynağınızdan oluşturulan yapı nesnesinin hash'iyle eşleşip eşleşmediğini doğrular.

# Sonuç

Solana'da `doğrulanmış yapılar kullanmak` ağdaki programlarınızın bütünlüğünü ve güvenilirliğini sağlar ve geliştiricilerin SDK'larını Solana Explorer'dan doğrudan bulmasına olanak tanır. Solana Verify CLI ve Docker gibi araçları kullanarak, kaynak kodunuzla uyumlu doğrulanabilir ve güvenli yapılar sürdürebilirsiniz. Tutarlı ortamlarda çalışmak için her zaman gerekli önlemleri alın ve güvenli yükseltmeler ve dağıtımlar için yönetişim çözümlerini göz önünde bulundurun.

## Güvenlik + Feragatname

Doğrulanmış yapılar, Solana programlarınızın bütünlüğünü sağlamak için güçlü bir araç olsa da, varsayılan kurulumda tamamen güvenilmez değildir. Docker görüntüleri Solana Vakfı tarafından inşa edilmekte ve barındırılmaktadır.

Projenizi indirilen bir docker görüntüsü içinde inşa ettiğinizi ve kurulumunuzun bir bütün olarak o docker görüntüsüne kopyalandığını, bu nedenle potansiyel olarak hassas bilgileri içerebileceğinden haberdar olun.

Tamamen güvenilir bir kurulum istiyorsanız, docker görüntülerini kendiniz oluşturabilir ve kendi altyapınızda barındırabilirsiniz. Bu şekilde, docker görüntülerinin oynanmadığından emin olabilirsiniz. Kendi docker görüntülerinizi oluşturmak için gereken betikleri [Doğrulanmış yapılar deposunda](https://github.com/Ellipsis-Labs/solana-verifiable-build) bulabilirsiniz ve bunu fork’layabilir, GitHub eylemlerini kendiniz çalıştırabilir ya da onların doğru olduğunu doğrulayabilirsiniz.

Ayrıca uzaktan doğrulama için OtterSec API'sine güveniyorsunuz ve [Solana Explorer](https://explorer.solana.com/address/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY) belirli bir dereceye kadar.

API veya Solana Explorer, tehlike altında olduğunda yanlış bilgi görüntüleyebilir.

Tamamen güvenilir bir kurulum istiyorsanız, [Doğrulama API'sini](https://github.com/otter-sec/solana-verified-programs-api) kendiniz çalıştırabilir veya program doğrulamasını yerel olarak `verify-from-repo` komutunu kullanarak gerçekleştirebilirsiniz. On-chain doğrulama verisi, programların dağıtım yetkisi ve [doğrulama programı](https://explorer.solana.com/address/verifycLy8mB96wd9wqq3WDXQwM4oU6r42Th37Db9fC) ile türetilen bir [PDA](https://explorer.solana.com/address/63XDCHrwZu3mXsw2RUFb4tbNpChuUHx4eA5aJMnHkpQQ/anchor-account) içinde saklanır.

Doğrulama programı [OtterSec ekibi](https://osec.io/) tarafından dağıtılmakta ve henüz dondurulmamış olduğundan her an güncellenebilir.

Solana Vakfı, OtterSec ve Ellipsis Labs ekibi, doğrulanmış yapılar hattını kullanırken oluşabilecek kayıplar veya hasarlardan sorumlu değildir.

# Solana programları için Security.txt

Doğrulanmış yapılar dışında, programınıza bir `security.txt` dosyası ekleyebilirsiniz. Gelecekte uygulandığında, `security.txt`, doğrulama verilerine kolay erişim sağlamak için doğrulayıcı public anahtarını bulunduracaktır. Programı inşa etmek ve doğrulamak için gerekli tüm bilgileri içeren PDA, programın adresinden ve doğrulayıcı pubkey'den türetilir. Varsayılan olarak bu, programı inşa eden ve dağıtan aynı pubkey'dir. Ancak, `security.txt` içinde belirtilebilecek başka bir pubkey de olabilir.

`security.txt` özelliği, geliştiricilerin güvenlik bilgilerini doğrudan Solana akıllı sözleşmeleri içinde gömmesine olanak tanır. [securitytxt.org](https://securitytxt.org) ilham alarak, bu yaklaşım, güvenlik araştırmacılarına proje yöneticileriyle iletişim kurmanın standart bir yolunu sunmaktadır, hatta sözleşmenin adresini biliyor olsalar bile.

## Neden security.txt Kullanmalıyım?

Birçok proje, özellikle küçük veya özel olanlar, geliştiricileri yalnızca sözleşme adresinden tanımlamak zor ve zaman alıcı olabilir. Programın içine bir `security.txt` dosyası gömerek, güvenlik araştırmacılarının doğru kişilerle kolayca iletişime geçmesini sağlamak, potansiyel istismarları önlemeye ve zamanında hata raporlarını güvence altına almaya yardımcı olabilir.

:::info
Bir `security.txt` dosyası, güvenlik iletişim bilgilerinizi merkezi bir yerde depolamanızı sağlar.
:::

## security.txt Nasıl Uygulanır

Solana programınıza bir `security.txt` eklemek için aşağıdaki adımları izleyin:

1. `Cargo.toml` dosyanıza `solana-security-txt` bağımlılığını ekleyin:

    ```toml filename="Cargo.toml"
    [dependencies]
    solana-security-txt = "1.1.1"
    ```

2. Güvenlik bilginizi tanımlamak için sözleşmeniz içinde `security_txt!` makrosunu kullanın. İletişim bilgilerini, proje URL'lerini ve hatta bir güvenlik politikası ekleyebilirsiniz. İşte bir örnek:

    ```rust
    #[cfg(not(feature = "no-entrypoint"))]
    use {default_env::default_env, solana_security_txt::security_txt};

    #[cfg(not(feature = "no-entrypoint"))]
    security_txt! {
        name: "MyProject",
        project_url: "https://myproject.com",
        contacts: "email:security@myproject.com,discord:security#1234",
        policy: "https://myproject.com/security-policy",
    
        // Opsiyonel Alanlar
        preferred_languages: "en,de",
        source_code: "https://github.com/solana-developers/solana-game-preset",
        source_revision: "5vJwnLeyjV8uNJSp1zn7VLW8GwiQbcsQbGaVSwRmkE4r",
        source_release: "",
        encryption: "",
        auditors: "Verifier pubkey: 5vJwnLeyjV8uNJSp1zn7VLW8GwiQbcsQbGaVSwRmkE4r",
        acknowledgements: "Hata ödülü avcılarımıza teşekkür ederiz!"
    }
    ```

:::note
`security.txt` bilgileri programınıza gömüldükten sonra, Solana Explorer gibi araçlar aracılığıyla kolayca sorgulanabilir, iletişim ve güvenlik bilgilerinizin potansiyel sorunları bildirmek isteyen herkes için erişilebilir olmasını sağlar.
:::

## En İyi Uygulamalar

- **Bağlantılar Kullanın**: Değişmesi muhtemel bilgiler (örneğin, iletişim bilgileri) için, bunları sözleşmeye sabit kodlamak yerine bir web sayfasına bağlantı vermeniz önerilir. Bu, sık program güncellemeleri gereksinimini ortadan kaldırır.

- **Doğrulama**: Yayınlamadan önce, `query-security-txt` aracı ile formatı ve içeriği doğrulayın; bu araç hem zincir üstü programları hem de yerel ikili dosyaları doğrulayabilir:

    ```bash
    query-security-txt target/bpfel-unknown-unknown/release/my_contract.so
    ```

Güvenlik iletişim bilgilerini doğrudan sözleşmenize gömerek, araştırmacıların size ulaşmasını kolaylaştırır ve Solana ekosisteminde daha iyi güvenlik ve iletişim sağlarsınız.

---

Bu, 
> "Solana Explorer'da security.txt'nin nasıl göründüğüne dair bir örnektir"  
> — [Solana Explorer](https://explorer.solana.com/address/HPxKXnBN4vJ8RjpdqDCU7gvNQHeeyGnSviYTJ4fBrDt4/security?cluster=devnet)

`security.txt` projesi 
> "Neodyme Labs tarafından sürdürülmektedir."  
> — [Neodyme Labs](https://github.com/neodyme-labs)