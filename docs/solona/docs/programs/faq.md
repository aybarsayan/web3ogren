---
title: "SSS"
sidebarSortOrder: 7
---

Sorularınızı 
[StackExchange](https://solana.stackexchange.com/questions/ask) üzerinde paylaşın.

## Berkeley Paket Filtre (BPF)

Solana onchain programları, 
[LLVM derleyici altyapısı](https://llvm.org/) aracılığıyla 
[Gerçekleştirilebilir ve Bağlanabilir Format (ELF)](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)
için düzenlenir ve bu format, 
[Berkeley Paket Filtre (BPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter)
byte kodlarının bir varyasyonunu içerir.

Solana, LLVM derleyici altyapısını kullandığı için, bir program herhangi bir programlama diliyle yazılabilir ve bu dil LLVM'nin BPF arka ucuna hedeflenebilir.

BPF, bir yorumlanmış sanal makinede veya etkili bir just-in-time derlenmiş yerel talimatlar olarak çalıştırılabilen verimli bir 
[talimat seti](https://github.com/iovisor/bpf-docs/blob/master/eBPF.md) sağlar.

---

## Bellek Haritası

Solana SBF programları tarafından kullanılan sanal adres bellek haritası sabit olup, şu şekilde düzenlenmiştir:

- Program kodu 0x100000000'den başlar
- Yığın verileri 0x200000000'den başlar
- Yığın verileri 0x300000000'den başlar
- Program girdisi parametreleri 0x400000000'den başlar

Yukarıdaki sanal adresler başlangıç adresleridir, ancak programlara bellek haritasının bir alt kümesine erişim sağlanır. Program, erişim verilmediği bir sanal adrese okumaya veya yazmaya çalışırsa paniğe geçer ve erişim ihlali içeren adres ve boyutu içeren bir `AccessViolation` hatası döner.

> **Uyarı:** Bellek alanına erişim ihlalleri, programın sonlanmasına neden olabilir. Bu nedenle bellek yönetimi dikkatlice yapılmalıdır. — Solana Geliştirici Kılavuzu

---

## GeçersizHesapVerisi

Bu program hatası birçok nedenden dolayı meydana gelebilir. Genellikle, programın beklemediği bir hesabın programa geçirilmesinden kaynaklanır; ya talimatın yanlış bir konumunda ya da yürütülmekte olan talimatla uyumsuz bir hesap söz konusudur.

Bir programın uygulaması, bir çapraz program talimatı gerçekleştirirken ve çağırdığınız program için hesabı sağlamayı unuttuğunda bu hatayı da tetikleyebilir.

---

## GeçersizTalimatVerisi

Bu program hatası, talimatı deseralize etmeye çalışırken meydana gelebilir; geçirilen yapının tam olarak talimatla eşleştiğinden emin olun. Alanlar arasında bazı dolgu yer alabilir. Program Rust `Pack` trait'ini uyguluyorsa, programın beklediği tam kodlamayı belirlemek için talimat türü `T`'yi paketlemeyi ve açmayı deneyin.

---

## GerekliİmzaEksik

Bazı talimatlar hesabın imza veren olmasını gerektirir; bir hesabın imzalanması beklenirken imzalanmadıysa bu hata döner.

Bir programın uygulanması, imzalı bir program adresi gerektiren bir
`çapraz program çağrısı` gerçekleştirdiğinde bu hatayı da tetikleyebilir, ancak `invoke_signed` için geçirilen imza tohumları, program adresini oluşturmak için kullanılan imza tohumlarıyla uyuşmaz.

---

## Yığın

SBF, değişken bir yığın işaretçisi yerine yığın çerçevelerini kullanır. Her yığın çerçevesi 4KB boyutundadır.

Bir program bu yığın çerçevesi boyutunu ihlal ederse, derleyici aşımı bir uyarı olarak bildirir.

Örneğin:

```text
Hata: Function _ZN16curve25519_dalek7edwards21EdwardsBasepointTable6create17h178b3d2411f7f082E Yığın kaybı -30728, -4096'lık maksimum kaybı 26632 byte aşarak aşıldı, büyük yığın değişkenlerini en aza indirin
```

Mesaj, hangi sembolün yığın çerçevesini aştığını tanımlar, ancak ismi bozulmuş olabilir.

> Bir Rust sembolünü bozulmadan çözmek için [rustfilt](https://github.com/luser/rustfilt) kullanın.

Yukarıdaki uyarı bir Rust programından geldi, bu yüzden bozulmadan çözülmüş sembol ismi:

```shell
rustfilt _ZN16curve25519_dalek7edwards21EdwardsBasepointTable6create17h178b3d2411f7f082E
curve25519_dalek::edwards::EdwardsBasepointTable::create
```

Bir uyarının hata olarak değil, neden bildirildiği, bazı bağımlı paketlerin, program bu işlevselliği kullanmasa bile, yığın çerçevesi kısıtlamalarını ihlal eden işlevsellik içerebilmesidir. Eğer program çalışma zamanı sırasında yığın boyutunu ihlal ederse, `AccessViolation` hatası bildirilir.

SBF yığın çerçeveleri, `0x200000000`'den başlayarak bir sanal adres aralığını kaplar.

---

## Yığın Boyutu

Programlar, Rust `alloc` API'leri aracılığıyla çalışma zamanı yığınına erişim sağlarlar. Hızlı tahsisleri kolaylaştırmak için basit bir 32KB artırılmış yığın kullanılmaktadır. Yığın `free` veya `realloc` desteklemez.

Dahili olarak, programlar, sanal adres 0x300000000'den başlayan 32KB'lık bir bellek alanına erişim sağlar ve programın özel ihtiyaçlarına göre özelleştirilmiş bir yığın uygulayabilirler.

Rust programları, özel bir 
[`global_allocator`](https://github.com/solana-labs/solana/blob/d9b0fc0e3eec67dfe4a97d9298b15969b2804fab/sdk/program/src/entrypoint.rs#L72) tanımlayarak yığını doğrudan uygularlar.

---

## Yükleyiciler

Programlar, çalışma zamanı yükleyicileriyle dağıtılır ve yürütülür; şu anda iki desteklenen yükleyici vardır: 
[BPF Yükleyici](https://github.com/solana-labs/solana/blob/7ddf10e602d2ed87a9e3737aa8c32f1db9f909d8/sdk/program/src/bpf_loader.rs#L17) ve
[BPF yükleyici devre dışı](https://github.com/solana-labs/solana/blob/7ddf10e602d2ed87a9e3737aa8c32f1db9f909d8/sdk/program/src/bpf_loader_deprecated.rs#L14) 

Yükleyiciler farklı uygulama ikili arayüzlerini destekleyebileceğinden, geliştiricilerin programlarını hedefleyip aynı yükleyiciye dağıtması gerekmektedir. Bir yükleyiciye yazılmış bir program farklı birine dağıtıldığı takdirde, genellikle programın giriş parametrelerinin uyumsuz serileştirilmesi nedeniyle `AccessViolation` hatası meydana gelir.

---

Pratik açıdan programlar, her zaman en son BPF yükleyiciyi hedef alacak şekilde yazılmalıdır ve en son yükleyici komut satırı arayüzü ve javascript API'leri için varsayılan yükleyicidir. 

- `Rust program giriş noktaları`

### Dağıtım

SBF program dağıtımı, bir BPF paylaşılan nesnesinin bir program hesabının verilerine yüklenmesi ve hesabın yürütülebilir olarak işaretlenmesi işlemidir. Bir istemci, SBF paylaşılan nesneyi daha küçük parçalara ayırır ve bunları 
[`Write`](https://github.com/solana-labs/solana/blob/bc7133d7526a041d1aaee807b80922baa89b6f90/sdk/program/src/loader_instruction.rs#L13) 
talimatlarının yükleyiciye gönderilen talimat verisi olarak gönderir; yükleyici verileri programın hesap verisine yazar. Tüm parçalar alındıktan sonra istemci, yükleyiciye 
[`Finalize`](https://github.com/solana-labs/solana/blob/bc7133d7526a041d1aaee807b80922baa89b6f90/sdk/program/src/loader_instruction.rs#L30) 
talimatı gönderir, yükleyici ardından SBF verisinin geçerli olduğunu doğrular ve program hesabını _yürütülebilir_ olarak işaretler. Program hesabı yürütülebilir olarak işaretlendikten sonra, sonraki işlemler, programın işleyebilmesi için talimatlar verebilir.

Yürütülebilir bir SBF programa yönlendirilmiş bir talimat olduğunda, yükleyici programın yürütme ortamını yapılandırır, programın giriş parametrelerini serileştirir, programın giriş noktasını çağırır ve karşılaşılan hataları bildirir.

Daha fazla bilgi için `programların dağıtılması` sayfasına bakın.

---

### Giriş Parametrelerinin Serileştirilmesi

SBF yükleyicileri program giriş parametrelerini bir bayt dizisine serileştirir ve ardından bu dizi programın giriş noktasına geçirilir; burada program, kaynağa göre deseralize etmekten sorumludur. Devre dışı bırakılan yükleyici ile mevcut yükleyici arasındaki değişikliklerden biri, giriş parametrelerinin, hizalanmış bayt dizisi içinde farklı parametrelerin hizalanmış kayıtlara düşmesine neden olacak şekilde serileştirilmesidir. Bu, deseralizasyon uygulamalarının doğrudan bayt dizisine başvurmasına ve programa hizalanmış göstericiler sağlamasına olanak tanır.

- `Rust program parametrelerinin deseralizasyonu`

En son yükleyici, program giriş parametrelerini aşağıdaki gibi serileştirir (tüm kodlama küçük endian'dır):

- 8 baytlık işaretsiz hesap sayısı
- Her hesap için:
  - Bu bir kopya hesap olduğunu gösteren 1 bayt; eğer bir kopya değilse, değer 0xff'dir, aksi takdirde değer, kopya olduğu hesabın indeksidir.
  - Eğer kopya: 7 bayt dolgu
  - Eğer kopya değilse:
    - 1 bayt boolean, eğer hesap bir imza veren ise doğru
    - 1 bayt boolean, eğer hesap yazılabilirse doğru
    - 1 bayt boolean, eğer hesap yürütülebilirse doğru
    - 4 bayt dolgu
    - 32 bayt hesap açık anahtarı
    - 32 bayt hesabın sahip açık anahtarı
    - 8 bayt işaretsiz lamport sayısı
    - 8 bayt işaretsiz hesap verisi boyutu
    - x bayt hesap verisi
    - 10k bayt dolgu, realloc için kullanılır
    - offset'i 8 bayta hizalamak için yeterli dolgu.
    - 8 bayt kira dönemi
- 8 bayt işaretsiz talimat verisi sayısı
- x bayt talimat verisi
- 32 bayt program kimliği