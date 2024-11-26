---
title: Programlar
sidebarLabel: Solana'daki Programlar
sidebarSortOrder: 4
description:
  Solana programları (akıllı sözleşmeler) hakkında bilgi edinin ve bunları Rust veya Anchor çerçevesini kullanarak nasıl geliştireceğinizi öğrenin. Program dağıtımı, güncellemeleri ve Solana ağı üzerindeki doğrulamayı anlayın.
---

Solana ekosisteminde, "akıllı sözleşmeler" programlar olarak adlandırılır. Her
`program`, belirli işlevler olarak adlandırılan yürütülebilir mantığı depolayan bir zincir içi hesap
dır. Bu işlevler `talimatlar` olarak anılır.

## Temel Noktalar

- Programlar, yürütülebilir kod içeren zincir içi hesaplardır. Bu kod, talimatlar
  olarak bilinen ayrık işlevlere düzenlenmiştir.

- Programlar durum bilgisizdir, ancak program durumunu depolamak ve yönetmek için kullanılan yeni hesaplar oluşturma talimatları içerebilir.

- Programlar, bir güncelleme yetkilisi tarafından güncellenebilir. Bir program, güncelleme yetkilisi `null` olarak ayarlandığında değiştirilemez hale gelir.

> **Anahtar Nokta:** Doğrulanabilir derlemeler, kullanıcıların zincir içi programların kamuya açık kaynak kodu ile eşleşip eşleşmediğini doğrulamasını sağlar.  
> — Solana Geliştirici Topluluğu

## Solana Programları Yazma

Solana programları çoğunlukla
[Rust](https://doc.rust-lang.org/book/) programlama dilinde yazılmaktadır ve geliştirme için iki yaygın yaklaşım vardır:

- `Anchor`: Solana program geliştirme için tasarlanmış bir çerçevedir. Rust makrolarını kullanarak programları yazmanın daha hızlı ve daha basit bir yolunu sağlar ve gereksiz kodları önemli ölçüde azaltır. Yeni başlayanlar için Anchor çerçevesi ile başlamaları önerilir.

- `Native Rust`: Bu yaklaşım, herhangi bir çerçeve kullanmadan Rust dilinde Solana programları yazmayı içerir. Daha fazla esneklik sunar, ancak karmaşıklığı artırır.

## Solana Programlarını Güncelleme

Zincir içi programlar, "güncelleme yetkilisi" olarak belirlenen bir hesap tarafından
[d doğrudan değiştirilebilir](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/programs/bpf_loader/src/lib.rs#L675), genellikle programı ilk kez dağıtan hesaptır.

Eğer
[güncelleme yetkilisi](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/programs/bpf_loader/src/lib.rs#L865)
iptal edilip `None` olarak ayarlanırsa, program değiştirilemez hale gelir ve daha fazla güncellenemez.

> **Uyarı:** Güncelleme yetkilisinin iptali programın değiştirilemez olmasına neden olur. Değişiklik yapmak istiyorsanız yetkilinin ayarını dikkatli değiştirin.  
> — Solana Geliştirici Kılavuzu

## Doğrulanabilir Programlar

Zincir içi kodun bütünlüğünü ve doğrulanabilirliğini sağlamak esastır. Doğrulanabilir bir derleme, zincir üzerinde dağıtılan yürütülebilir kodun, herhangi bir üçüncü şahıs tarafından kendi kamuya açık kaynak kodu ile eşleşip eşleşmediğini bağımsız olarak doğrulamak için kullanılabileceğini garanti eder. Bu süreç, kaynak kodu ile dağıtılan program arasında tutarsızlıkları tespit etme olanağı sağlar.

Solana geliştirici topluluğu, doğrulanabilir derlemeleri desteklemek için araçlar sunmuştur ve geliştiricilerin ve kullanıcıların zincir içi programların kamuya paylaşılan kaynak kodunu doğru bir şekilde yansıttığını doğrulamalarını sağlar.

- **Doğrulanmış Programları Arama**: Doğrulanmış programları hızlıca kontrol etmek için, kullanıcılar bir program adresini [SolanaFM](https://solana.fm/)
  Gezgini'nde arayabilir ve "Doğrulama" sekmesine gidebilir. Doğrulanmış bir programın örneğini
  [buradan](https://solana.fm/address/PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY) görüntüleyin.

- **Doğrulama Araçları**: 
  [Solana Doğrulanabilir Derleme CLI](https://github.com/Ellipsis-Labs/solana-verifiable-build)
  tarafından Ellipsis Labs, kullanıcıların yayımlanan kaynak koda karşı zincir içi programları bağımsız olarak doğrulamalarına olanak tanır.

- **Anchor'da Doğrulanabilir Derlemeler İçin Destek**: Anchor, doğrulanabilir derlemeler için yerleşik destek sağlar. Ayrıntılara
  [Anchor belgelerinde](https://www.anchor-lang.com/docs/verifiable-builds) ulaşabilirsiniz.

## Berkeley Paket Filtre (BPF)

Solana, programları
[Çalıştırılabilir ve Bağlanabilir Format (ELF)](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)
dosyalarına derlemek için [LLVM derleyici altyapısını](https://llvm.org/) kullanır. Bu dosyalar, Solana programları için "Solana Bytecode Formatı" (sBPF) olarak bilinen değiştirilen bir
[Berkeley Paket Filtrei (eBPF)](https://en.wikipedia.org/wiki/EBPF) bayt kodunu içerir.


LLVM Kullanımının Avantajları
  
LLVM kullanımı, Solana'nın derleyebilen herhangi bir programlama dilini desteklemesini sağlar. Bu, Solana'nın bir geliştirme platformu olarak esnekliğini önemli ölçüde artırır.
  
