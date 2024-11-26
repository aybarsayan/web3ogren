---
featured: true
date: 2024-03-15T00:00:00Z
difficulty: intermediate
title: "Solana'da Hesaplama Kullanımını Optimize Etme"
description:
  "Bir programın kullandığı hesaplama miktarını en aza indirmek, işlemlerin
  yürütülmesi için hem performans hem de maliyet açısından kritik öneme sahiptir.
  Bu kılavuz, Solana'daki programlarınızda hesaplama kullanımını nasıl optimize
  edeceğinizi gösterecektir."
tags:
  - rust
  - hesaplama
keywords:
  - öğretici
  - öncelikli ücretler
  - hesaplama kullanımı
  - çevrimdışı imza
  - işlemler
  - solana geliştirmeye giriş
  - blok zincir geliştiricisi
  - blok zincir öğreticisi
  - web3 geliştiricisi
---

Solana'da geliştirirken, programlarınızın hesaplama kullanımını göz önünde bulundurmak önemlidir. Programın hesaplama kullanımı, kullanıcılarınızın sahip olabileceği maksimum performansı etkilemenin yanı sıra, öncelikli ücretlerle birlikte işlemlerin yürütülmesinin maliyetini artırır.

:::tip
Hesaplama Birimi (CU) kullanımınızı optimize etmenin aşağıdaki avantajları vardır:
:::

1. Daha küçük bir işlemin bir bloğa dahil olma olasılığı daha yüksektir.
2. Daha ucuz talimatlar, programınızı daha birleşik hale getirir.
3. Genel blok kullanım miktarını azaltarak, bir bloğa daha fazla işlemin dahil edilmesini sağlar.

Bu kılavuzda, programınızın hesaplama kullanımını optimize etmenin yollarını ele alacağız ve bunun mümkün olduğunca verimli olmasını sağlamak için gereken adımları gözden geçireceğiz.

## Mevcut Hesaplama Kısıtlamaları Nedir?

Solana programlarının farkında olunması gereken birkaç hesaplama kısıtlaması vardır:

- **Bir blok başına maksimum hesaplama**: 48 milyon CU
- **Bir blok başına hesap başına maksimum hesaplama**: 12 milyon CU
- **Bir işlem başına maksimum hesaplama**: 1.4 milyon CU

:::warning
Programınızın hesaplama kullanımını bu sınırlar içinde tutmak, programınızın zamanında ve makul bir maliyetle yürütülebilmesini sağlamak için önemlidir.
:::

Özellikle programınız çok sayıda kullanıcı tarafından kullanılmaya başlandığında, programınızın hesaplama kullanımının mümkün olduğunca verimli olmasını sağlamak istersiniz, bu sayede hesap başına maksimum hesaplama sınırına ulaşmaktan kaçınabilirsiniz.

## Hesaplama Kullanımını Nasıl Ölçersiniz?

Solana programınızı geliştirirken, programınızın farklı bölümlerinin ne kadar hesaplama kullandığını kontrol etmek isteyeceksiniz. Farklı kod parçalarının hesaplama birimi kullanımını ölçmek için `compute_fn` makrosunu kullanabilirsiniz.

:::note
Hesaplama kullanımınızı ölçmek için aşağıdaki kodu kullanabilirsiniz:
:::

```rust
compute_fn!("Mesajım" => {
    // Buraya kodunuzu yazın
});
```

Bu makronun çıktısı, kodunuzdan önce ve sonra hesaplama kullanımınızı verecek ve programınızın hangi parçalarının en fazla hesaplama kullandığını anlamanıza yardımcı olacaktır. Bu makronun nasıl kullanılacağına dair bir örneği [cu_optimizations deposunda](https://github.com/solana-developers/cu_optimizations/blob/main/anchor/counter/anchor/programs/counter/src/lib.rs#L18) bulabilirsiniz.

## Programınızı Optimize Etmek

### Günlük Kaydı

Günlük kaydı, programınızın içindeki olayları anlamanın harika bir yoludur, ancak günlük kaydı aynı zamanda oldukça maliyetlidir. Programlarınızdaki gereksiz bilgileri günlüğe kaydetmekten kaçınmalısınız, böylece program kullanımınızı azaltabilirsiniz.

:::danger
Örneğin, hem base58 kodlama hem de birleştirme pahalı işlemlerdir:
:::

```rust
// 11962 CU !!
// Base58 kodlama pahalıdır, birleştirme pahalıdır
compute_fn! { "Bir pubkey'i hesap bilgisine kaydet" =>
    msg!("Bir dize {0}", ctx.accounts.counter.to_account_info().key());
}

// 357 CU - dize birleştirme pahalıdır
compute_fn! { "Bir pubkey basit birleştirme ile kaydet" =>
    msg!("Bir dize {0}", "5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ");
}
```

Eğer bir pubkey'i günlüğe kaydetmek istiyorsanız, `.key()` ve `.log()` kullanarak bunu daha düşük hesaplama kullanımıyla verimli bir şekilde kaydedebilirsiniz:

```rust
// 262 cu
compute_fn! { "Bir pubkey'i kaydet" =>
    ctx.accounts.counter.to_account_info().key().log();
}
```

### Veri Tipleri

Daha büyük veri tipleri genel olarak daha fazla Hesaplama Birimi kullanır. Kullanımınızın çok daha yüksek hesaplama kullanımına neden olabileceği için, `u64` gibi daha büyük bir veri tipine gerçekten ihtiyaç duyduğunuzdan emin olun, aksi takdirde daha küçük bir veri tipi olan `u8` gibi kullanmak daha faydalı olacaktır.

:::info
Örnekler:
:::

```rust
// 357
compute_fn! { "Vector u64 ekle" =>
    let mut a: Vec<u64> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}

// 211 CU
compute_fn! { "Vector u8 ekle" =>
    let mut a: Vec<u8> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}
```

Genel olarak, bu veri tipi farkları programınız boyunca toplamda daha fazla maliyete neden olabilir.

### Serileştirme

Serileştirme ve tersine serileştirme, hesap yapılarına bağlı olarak pahalı işlemlerdir. Mümkünse, bu pahalı işlemlerden kaçınmak için sıfır kopya kullanın ve doğrudan hesap verileriyle etkileşime geçin.

```rust
// 6302 CU
pub fn initialize(_ctx: Context<InitializeCounter>) -> Result<()> {
    Ok(())
}

// 5020 CU
pub fn initialize_zero_copy(_ctx: Context<InitializeCounterZeroCopy>) -> Result<()> {
    Ok(())
}
```

```rust
// 108 CU - serileştirme dahil toplam CU 2600
let counter = &mut ctx.accounts.counter;
compute_fn! { "Borsh Serileştir" =>
    counter.count = counter.count.checked_add(1).unwrap();
}

// 151 CU - serileştirme dahil toplam CU 1254
let counter = &mut ctx.accounts.counter_zero_copy.load_mut()?;
compute_fn! { "Sıfır Kopya Serileştir" =>
    counter.count = counter.count.checked_add(1).unwrap();
}
```

Yukarıdaki örnekleri kullanarak, programınız içinde sıfır kopya kullanarak toplam CU kullanımınızdan yarısını veya daha fazlasını tasarruf edebilirsiniz.

### Program Türetilmiş Adresleri

Program Türetilmiş Adresler (PDA'lar) kullanmak programınız içinde yaygın bir uygulamadır, ancak `find_program_address` yönteminin hesaplama kullanımını ve bunu nasıl optimize edebileceğinizi bilmek önemlidir.

:::tip
Eğer `find_program_address` geçerli bir adres bulmak için uzun bir süre harcamak zorundaysa, bu yüksek bir bump anlamına gelir ve genel hesaplama birimi kullanımı daha yüksek olacaktır.
:::

İhtiyaç duyduğunuz PDA'ları bulmayı, bump'ı bir hesapta saklayarak ve gelecekte kullanarak optimize edebilirsiniz.

```rust
pub fn pdas(ctx: Context<PdaAccounts>) -> Result<()> {
    let program_id = Pubkey::from_str("5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ").unwrap();

    // 12,136 CUs
    compute_fn! { "PDA Bul" =>
        Pubkey::find_program_address(&[b"counter"], ctx.program_id);
    }

    // 1,651 CUs
    compute_fn! { "PDA Bul" =>
        Pubkey::create_program_address(&[b"counter", &[248_u8]], &program_id).unwrap();
    }

    Ok(())
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // bump tanımlanmadığında 12,136 CUs
    #[account(
        seeds = [b"counter"],
        bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // counter_checked hesabında saklanmış bump kullanıldığında yalnızca 1600
    #[account(
        seeds = [b"counter"],
        bump = counter_checked.bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}
```

## Daha Fazla Hesaplama Optimizasyonu

Programınızın hesaplama kullanımını optimize etmenin birçok yolu vardır, örneğin, sarmalayıcı yerine yerel kod yazmak, ancak bunun hepsi bir maliyetle gelir. Programınızda en iyi hesaplama kullanımını istiyorsanız, farklı yöntemleri değerlendirmeli ve test etmelisiniz, böylece belirli kullanım durumunuza en uygun olanı bulabilirsiniz.