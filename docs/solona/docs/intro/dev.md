---
sidebarLabel: Geliştirmeye Giriş
title: "Solana Geliştirme ile Başlamak"
description: "Solana üzerine nasıl inşa edeceğinizi öğrenin"
sidebarSortOrder: 2
keywords:
  - solana temel bilgileri
  - eğitim
  - solana geliştirmeye giriş
  - blok zinciri geliştiricisi
  - web3 geliştiricisi
---

Solana geliştirici belgelerine hoş geldiniz!

Bu sayfa, Solana geliştirmeye başlamak için bilmeniz gereken her şeyi içermektedir; **temel gereksinimler**, **Solana geliştirmesinin nasıl çalıştığı** ve başlangıç için ihtiyaç duyacağınız araçlar dahil.

## Yüksek Seviye Geliştirici Genel Görünümü

Solana'da geliştirme, iki ana bölüme ayrılabilir:

1. **Onchain Program Geliştirme**: Burada özel programları doğrudan blok zincirine oluşturup dağıtıyorsunuz. Dağıtıldıktan sonra, bunlarla nasıl etkileşim kuracağını bilen herkes kullanabilir. Bu programları Rust, C veya C++ ile yazabilirsiniz. Günümüzde onchain program geliştirme için en iyi destek Rust'tadır.
2. **İstemci Geliştirme**: Burada onchain programlarla etkileşimde bulunan yazılımlar (dağıtılmış uygulamalar veya dApp'ler olarak adlandırılan) yazıyorsunuz. Uygulamalarınız, onchain işlemleri gerçekleştirmek için işlemler gönderebilir. İstemci geliştirme, herhangi bir programlama dilinde yazılabilir.

:::info
İstemci tarafı ile onchain tarafı arasındaki "bağ" [Solana JSON RPC API](https://solana.com/docs/rpc)'dir. İstemci tarafı, onchain programlarla etkileşim kurmak için Solana ağına RPC istekleri gönderir.
:::

Bu, frontend ve backend arasındaki normal geliştirmeye çok benzer. Solana üzerinde çalışmanın en büyük farkı, backend'in küresel, izinsiz bir blok zinciri olmasıdır. Bu, herkesin API anahtarları veya başka bir izin biçimi vermeden, onchain programınızla etkileşimde bulunabileceği anlamına gelir.

![Müşterilerin Solana blok zinciri ile nasıl çalıştığı](../../images/solana/public/assets/docs/intro/developer_flow.png)

Solana geliştirmesi, diğer blok zincirlerinden biraz farklıdır çünkü yüksek derecede birleştirilebilir onchain programlara sahiptir. Bu, zaten dağıtılmış herhangi bir programın üzerine inşa edebileceğiniz anlamına gelir ve genellikle özel onchain program geliştirmeye ihtiyaç duymadan bunu yapabilirsiniz. 

> **Önemli Not**: Örneğin, token'larla çalışmak istiyorsanız, ağda zaten dağıtılmış `Token Programı`'nı kullanabilirsiniz. Uygulamanız üzerindeki tüm geliştirme, seçim yaptığınız dilde istemci tarafında olacaktır.

Solana'da geliştirme yapmak isteyen geliştiriciler, geliştirme yığınlarının diğer herhangi bir geliştirme yığınıyla çok benzer olduğunu görecektir. Ana fark, bir blok zinciri ile çalışıyor olmanız ve kullanıcıların uygulamanızla nasıl etkileşimde bulunabileceğini düşünmeniz gerektiğidir; bu yalnızca frontend ile sınırlı değildir. Solana'da geliştirme, CI/CD hatları, test etme, hata ayıklama araçları, bir frontend ve backend ve normal bir geliştirme akışında bulacağınız her şeyi içerir.

---

## Başlamak için İhtiyacınız Olanlar

Solana geliştirmeye başlamak için, istemci tarafı, onchain programlar veya her ikisi için de farklı araçlara ihtiyacınız olacak.

### İstemci Tarafı Geliştirme

Eğer onchain uygulamalar geliştiriyorsanız, Rust bilmeli ve kullanabilmelisiniz.

Eğer istemci tarafında geliştiriyorsanız, rahat olduğunuz herhangi bir programlama dilinde çalışabilirsiniz. Solana, geliştiricilerin en popüler dillerde Solana ağı ile etkileşime geçmesine yardımcı olan topluluk katkılı SDK'lara sahiptir:

| Dil        | SDK                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| RUST       | [solana_sdk](https://docs.rs/solana-sdk/latest/solana_sdk/)                                              |
| Typescript | [@solana/web3.js](https://github.com/solana-labs/solana-web3.js)                                         |
| Python     | [solders](https://github.com/kevinheavey/solders)                                                        |
| Java       | [solanaj](https://github.com/skynetcap/solanaj) veya [solana4j](https://github.com/LMAX-Exchange/solana4j) |
| C++        | [solcpp](https://github.com/mschneider/solcpp)                                                           |
| Go         | [solana-go](https://github.com/gagliardetto/solana-go)                                                   |
| Kotlin     | [solanaKT](https://github.com/metaplex-foundation/SolanaKT) veya [sol4k](https://github.com/sol4k/sol4k)   |
| Dart       | [solana](https://github.com/espresso-cash/espresso-cash-public/tree/master/packages/solana)              |
| C#         | [solnet](https://github.com/bmresearch/Solnet)                                                           |
| GdScript   | [godot](https://github.com/Virus-Axel/godot-solana-sdk/)                                                 |

Ayrıca ağı kullanmak için bir RPC bağlantısına ihtiyacınız olacak. Ya bir [RPC altyapı sağlayıcısı](https://solana.com/rpc) ile çalışabilir ya da [kendi RPC düğümünüzü çalıştırabilirsiniz](https://docs.solanalabs.com/operations/setup-an-rpc-node).

:::tip
Uygulamanız için hızlı bir başlangıç yapmak üzere, CLI'nize aşağıdakini yazarak özelleştirilebilir bir Solana iskeleti oluşturabilirsiniz:

```bash
npx create-solana-dapp <project-name>
```

Bu, Solana üzerinde inşa etmeye başlamak için gerekli olan tüm dosyalar ve temel yapılandırmalarla yeni bir proje oluşturacaktır. İskelet, hem bir örnek frontend hem de bir onchain program şablonu (seçtiyseniz) içerecektir. Daha fazla bilgi için [`create-solana-dapp` belgelerini](https://github.com/solana-developers/create-solana-dapp?tab=readme-ov-file#create-solana-dapp) okuyabilirsiniz.
:::

### Onchain Program Geliştirme

Onchain program geliştirme Rust, C veya C++ ile program yazmaktan oluşur. Öncelikle bilgisayarınızda Rust'ın kurulu olduğundan emin olmalısınız. Bunu aşağıdaki komutla yapabilirsiniz:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Ayrıca programlarınızı derlemek ve dağıtmak için `Solana CLI yükenmiş olmalıdır`. Solana CLI'yi kurmak için aşağıdaki komutu çalıştırabilirsiniz:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Solana CLI kullanarak, programınızı test etmek için yerel bir onaylayıcı çalıştırmanız önerilir. Solana CLI'yi kurduktan sonra yerel bir onaylayıcıyı çalıştırmak için aşağıdaki komutu çalıştırın:

```bash
solana-test-validator
```

Bu, programlarınızı test etmek için kullanabileceğiniz bilgisayarınızda yerel bir onaylayıcı başlatacaktır. `Bu kılavuzda yerel gelişim hakkında daha fazla bilgi edinebilirsiniz`.

:::warning
Onchain programlar oluştururken, framework kullanmadan yerel Rust ile ya da Anchor framework'ü ile geliştirme yapma seçeneğiniz vardır. Anchor, geliştiricilere daha yüksek düzeyde bir API sağlayarak Solana üzerinde inşa etmeyi kolaylaştıran bir framework'tür. 
:::

Anchor'ı, web siteleriniz için ham JavaScript ve HTML yerine React ile inşa etmek gibi düşünün. JavaScript ve HTML, web siteniz üzerinde daha fazla kontrol sağlar, ancak React, geliştirme sürecinizi hızlandırır ve geliştirmeyi kolaylaştırır. Daha fazla bilgi için [Anchor](https://www.anchor-lang.com/) web sitesini ziyaret edebilirsiniz.

Programınızı test etmenin bir yoluna ihtiyacınız olacak. Dil tercihinize bağlı olarak programınızı test etmek için birkaç farklı yol bulunmaktadır:

- [solana-program-test](https://docs.rs/solana-program-test/latest/solana_program_test/) - Rust ile inşa edilmiş test framework'ü
- [solana-bankrun](https://kevinheavey.github.io/solana-bankrun/) - Typescript testleri yazmak için oluşturulmuş test framework'ü
- [bankrun](https://kevinheavey.github.io/solders/tutorials/bankrun.html) - Python testleri yazmak için oluşturulmuş test framework'ü

Programlarınızı yerel olarak geliştirmek istemiyorsanız, [çevrimiçi IDE Solana Playground](https://beta.solpg.io) da bulunmaktadır. Solana Playground, Solana üzerinde program yazmanızı, test etmenizi ve dağıtmanızı sağlar. Solana Playground ile başlamak için `hızlı başlangıç kılavuzumuzu takip edebilirsiniz`.

### Geliştirici Ortamları

Çalışmanıza dayalı olarak doğru ortamı seçmek çok önemlidir. Solana'da olgun test ve CI/CD uygulamalarını kolaylaştırmak için birkaç farklı ağ ortamı (kümeler olarak adlandırılır) bulunmaktadır:

- **Mainnet Beta**: Tüm işlemlerin gerçekleştiği üretim ağı. Burada işlemler gerçek para gerektirir.
- **Devnet**: Programlarınızı üretime dağıtılmadan önce test etmek için dağıttığınız kalite güvence ağı. "Staging ortamı" gibi düşünün.
- **Yerel**: Programlarınızı test etmek için bilgisayarınızda çalıştırdığınız yerel ağ. Bu, program geliştirmeye başlarken ilk tercihiniz olmalıdır.

## Örnekle İnşa Et

Solana üzerinde geliştirmeye başlarken, yolculuğunuzu hızlandırmak için daha fazla kaynak bulunmaktadır:

- [Solana Cookbook](https://solana.com/developers/cookbook): Solana üzerinde inşa etmenize yardımcı olacak referanslar ve kod parçacıklarının bir derlemesi.
- [Solana Program Örnekleri](https://github.com/solana-developers/program-examples): Programlarınızda farklı eylemler için yapı taşları sağlayan örnek programların bir deposu.
- [Kılavuzlar](https://solana.com/developers/guides): Solana üzerinde inşa etme süreçlerinizi geçiren öğreticiler ve kılavuzlar.

## Destek Alma

Bulabileceğiniz en iyi destek
[Solana StackExchange](https://solana.stackexchange.com/) üzerindedir. Öncelikle orada sorularınızı arayın; başka birinin sormuş olma ihtimali yüksektir ve bir yanıt almış olabilir. Eğer yoksa, yeni bir soru ekleyin! Soru sorduğunuzda mümkün olduğunca fazla detay eklemeyi unutmayın ve lütfen hata mesajlarını göstermek için metin kullanın (ekran görüntüleri değil) böylece aynı sorunu yaşayan diğer insanlar sorunuza ulaşabilir!

---

## Bir Sonraki Adımlar

`Artık Solana üzerinde inşa etmeye hazır olduğunuzu düşünüyorsunuz!`