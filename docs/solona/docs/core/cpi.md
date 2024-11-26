---
title: Çapraz Program Çağrısı (CPI)
sidebarLabel: Çapraz Program Çağrısı
sidebarSortOrder: 6
description:
  Solana'da Çapraz Program Çağrısı (CPI) hakkında bilgi edinin - programların
  diğer programlarda talimatları çağırma yetenekleri, PDA imzacılarını
  yönetmeleri ve Solana ağı boyunca işlevselliği birleştirmeleri.
---

Bir Çapraz Program Çağrısı (CPI), bir programın diğer bir programın
talimatlarını çağırdığı durumları ifade eder. Bu mekanizma, Solana
programlarının birleştirilebilirliğini sağlar.

Talimatları, bir programın ağa açtığı API uç noktaları gibi düşündüğünüzde, 
CPI'yi de bir API'nin diğer bir API'yi dahili olarak çağırması olarak
düşünebilirsiniz.

![Çapraz Program Çağrısı](../../images/solana/public/assets/docs/core/cpi/cpi.svg)

Bir program, başka bir programa Çapraz Program Çağrısı (CPI) başlattığında:

- İlk işlemden gelen imzacı yetkileri çağıran programdan (A) çağrılan
  (B) programa uzanır.
- Çağrılan (B) program başka programlara daha fazla CPI yapabilir, maksimum
  derinlik **4** ile sınırlıdır (örneğin B->C, C->D).
- Programlar, kendi program ID'lerinden türetilen `PDA'lar`
  adına "imza" atabilirler.

> **Not:** Solana program çalıştırma zamanı, 
> [`max_invoke_stack_height`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/program-runtime/src/compute_budget.rs#L31-L35) 
> adında bir sabit tanımlar ve bu sabit, 
> [5 değerine](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/program-runtime/src/compute_budget.rs#L138) 
> ayarlanmıştır. Bu, program talimat çağrısı yığınının maksimum yüksekliğini 
> temsil eder. Yığın yüksekliği, işlem talimatları için **1** olarak başlar, 
> her seferinde bir program başka bir talimat çağırdıkça **1** artar. Bu ayar, 
> CPI'ler için çağrı derinliğini etkili bir şekilde **4** ile sınırlar.

---

## Temel Noktalar

:::tip
CPI'ler, Solana program talimatlarının doğrudan başka bir programdaki 
talimatları çağırmasına olanak tanır.
:::

- Bir çağıran programdan gelen imzacı yetkileri, çağrılan programa uzanır.
- CPI yaparken, programlar kendi program ID'lerinden türetilen PDA'lar 
  adına "imza" atabilirler.
- Çağrılan program, diğer programlara ek CPI'ler yapabilir, maksimum 
  derinlik **4** ile sınırlıdır.

---

## CPI Yazma

CPI için bir talimat yazmak, bir işlemi eklemek için bir
`talimat` oluşturma ile aynı
deseni takip eder. Derinlerde, her CPI talimatı aşağıdaki bilgileri belirtmelidir:

- **Program adresi**: Çağrılan programı belirtir.
- **Hesaplar**: Talimatın okuduğu veya yazdığı, diğer programlar da dahil
  olmak üzere her hesabı listeler.
- **Talimat Verisi**: Programda hangi talimatın çağrılacağını belirtir,
  ayrıca talimatın gerektirdiği ek verileri (fonksiyon argümanları) içerir.

:::info
Çağrı yaptığınız programa bağlı olarak, talimatı oluşturmak için yardımcı
fonksiyonlar içeren kütüphaneler mevcut olabilir. Programlar daha sonra
`solana_program` kütüphanesinden aşağıdaki işlevlerden birini kullanarak CPI
uygular:
:::

- `invoke` - PDA imzacıları olmadığında kullanılır.
- `invoke_signed` - Çağıran programın program ID'sinden türetilen bir PDA
  ile imza atması gerektiğinde kullanılır.

### Temel CPI

[`invoke`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/program.rs#L132)
fonksiyonu, PDA imzacılarına ihtiyaç duymayan bir CPI yaparken kullanılır. 
CPI yaparken, çağıran programa sağlanan imzacılar otomatik olarak 
çağrılan programa uzanır.

```rust
pub fn invoke(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>]
) -> Result<(), ProgramError>
```

İşte 
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-invoke) 
üzerinde `invoke` fonksiyonunu kullanarak Sistem Programı üzerinde
transfer talimatını çağıran bir CPI yapan örnek program.

Ayrıca daha fazla bilgi için 
`Temel CPI kılavuzuna` 
başvurabilirsiniz.

### PDA İmzacısı ile CPI

[`invoke_signed`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/program.rs#L247)
fonksiyonu, PDA imzacılarına ihtiyaç duyan bir CPI yaparken kullanılır. 
İmzacı PDA'ları türetmek için kullanılan tohumlar `invoke_signed` fonksiyonuna 
`signer_seeds` olarak geçirilir.

:::note
PDA'ların nasıl türetildiği hakkında detaylar için 
`Program Türetilmiş Adres` sayfasına 
başvurabilirsiniz.
:::

```rust
pub fn invoke_signed(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>],
    signers_seeds: &[&[&[u8]]]
) -> Result<(), ProgramError>
```

Çalışma zamanı, çağıran programa verilen ayrıcalıkları kullanarak
çağrılan programa uzatılabilecek ayrıcalıkları belirler. Bu bağlamda 
ayrıcalıklar, imzacıları ve yazılabilir hesapları ifade eder. 
Örneğin, çağıran işlemin, bir imzacı veya yazılabilir hesap içeren bir 
talimatı işlemesi durumunda, çağıran imzacı ve/veya yazılabilir 
hesabı içeren bir talimatı çağırabilir.

PDA'lar `özel anahtarlara sahip olmadıkları için`, 
CPI aracılığıyla bir talimatta imzacı olarak işlev görebilirler. 
Bir PDA'nın çağıran programdan türetildiğini doğrulamak için, 
PDA'yı oluşturmak için kullanılan tohumlar `signers_seeds` olarak dahil 
edilmelidir.

CPI işlendiğinde, Solana çalışma zamanı 
[`create_program_address`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/programs/bpf_loader/src/syscalls/cpi.rs#L550) 
fonksiyonunu çağırarak `signers_seeds` ve çağıran programın 
`program_id`'sini kullanır. Geçerli bir PDA bulunursa, adres 
[geçerli bir imzacı olarak eklenir](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/programs/bpf_loader/src/syscalls/cpi.rs#L552).

İşte 
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-invoke-signed) 
üzerinde `invoke_signed` fonksiyonunu kullanarak Sistem Programı üzerindeki
transfer talimatını PDA imzacısıyla çağıran bir CPI yapan örnek program.

Daha fazla bilgi için 
`PDA İmzacısı ile CPI kılavuzuna` 
başvurabilirsiniz.