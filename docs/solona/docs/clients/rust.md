---
sidebarLabel: Rust
title: Rust Client for Solana
sidebarSortOrder: 1
description: Solana'nın Rust crate'lerini geliştirme için nasıl kullanacağınızı öğrenin.
---

Solana'nın Rust crate'leri
[published to crates.io](https://crates.io/search?q=solana-) adresinde yayınlanmıştır ve 
[on docs.rs](https://docs.rs/releases/search?query=solana-) adresinde `solana-` ön eki ile bulunabilir.



Solana geliştirmeye hızlı bir başlangıç yapmak ve ilk Rust programınızı oluşturmak için bu detaylı hızlı başlangıç kılavuzlarına göz atın:

- `Sadece tarayıcınızı kullanarak ilk Solana programınızı oluşturun ve dağıtın`. Kurulum gerekli değildir.
- `Yerel ortamınızı kurun` ve yerel test validator'ı kullanın.



## Rust Crates

Aşağıda Solana geliştirme için en önemli ve yaygın olarak kullanılan Rust crate'leri bulunmaktadır:

- [`solana-program`] &mdash; Solana üzerinde çalışan programlar tarafından içe aktarılan, SBF'ye derlenen. Bu crate birçok temel veri tipi içerir ve [`solana-sdk`] üzerinden yeniden dışa aktarılır; bu crate, bir Solana programından içe aktarılamaz.

  :::tip
  **Not:** `solana-program`, Solana programları için temel veri türlerini sağlar.
  :::

- [`solana-sdk`] &mdash; Temel offchain SDK, [`solana-program`] içe aktarır ve bunun üzerine daha fazla API ekler. Zincir üzerinde çalışmayan çoğu Solana programı bunu içe aktaracaktır.

- [`solana-client`] &mdash; Bir Solana düğümü ile etkileşimde bulunmak için
  `JSON RPC API` kullanır.

  > **Önemli:** `solana-client`, RPC API ile ağla etkileşim kurmanıza olanak tanır.  
  > — Solana Belgeleri

- [`solana-cli-config`] &mdash; Solana CLI yapılandırma dosyasını yükleme ve kaydetme.

- [`solana-clap-utils`] &mdash; Ana Solana CLI tarafından kullanılan [`clap`] ile bir CLI kurmak için rutinler. CLI tarafından desteklenen tüm imzacı türlerini yüklemek için fonksiyonlar içerir.


Ek bilgi: Solana Crate'leri

Bu crate'lerin kullanımı, Solana ekosisteminde farklı türden uygulamalar geliştirmenizi sağlar. Her bir crate, belirli bir işlevselliği sağlamak için tasarlanmıştır.



[`solana-program`]: https://docs.rs/solana-program
[`solana-sdk`]: https://docs.rs/solana-sdk
[`solana-client`]: https://docs.rs/solana-client
[`solana-cli-config`]: https://docs.rs/solana-cli-config
[`solana-clap-utils`]: https://docs.rs/solana-clap-utils
[`clap`]: https://docs.rs/clap