---
date: 2024-03-18T00:00:00Z
difficulty: intro
title: "Solana'da CRUD dApp Nasıl Oluşturulur"
description:
  "Solana geliştirici başlangıç kılavuzu, basit bir günlük programı ile Solana blok zincirinde temel bir CRUD dApp oluşturmayı ve program ile bir kullanıcı arayüzü üzerinden etkileşimde bulunmayı öğrenmenizi sağlar."
tags:
  - quickstart
  - dApp
  - crud
  - anchor
  - rust
  - react
  - program
keywords:
  - solana dapp
  - on-chain
  - rust
  - anchor program
  - crud dapp
  - dapp oluştur
  - solana dapp oluştur
  - eğitim
  - solana geliştirmeye giriş
  - blok zincir geliştiricisi
  - blok zincir eğitimi
  - web3 geliştiricisi
  - web3 crud uygulaması
---

Bu kılavuzda, temel bir on-chain CRUD dApp için Solana programını ve UI'ını nasıl oluşturacağınızı ve dağıtacağınızı öğreneceksiniz. Bu dApp, günlük girişleri oluşturmanıza, güncellemenize, okumanıza ve tüm bunları on-chain işlemlerle silmenize olanak tanır.

## Ne Öğreneceksiniz

- Ortamınızı kurma
- `npx create-solana-dapp` kullanma
- Anchor program geliştirme
- Anchor PDA'ları ve hesaplar
- Bir Solana programını dağıtma
- On-chain bir programı test etme
- Bir on-chain programı React UI ile bağlama

## Ön Koşullar

Bu kılavuz için, birkaç araç ile yerel geliştirme ortamınızı ayarlamanız gerekiyor:

- [Rust](https://www.rust-lang.org/tools/install)
- [Node JS](https://nodejs.org/en/download)
- [Solana CLI & Anchor](https://solana.com/docs/intro/installation)

## Projeyi Kurma

```shell
npx create-solana-dapp
```

Bu CLI komutu, hızlı Solana dApp oluşturulmasını sağlayacaktır. Kaynak kodunu [buradan](https://github.com/solana-developers/create-solana-dapp) bulabilirsiniz.

Şimdi, aşağıdaki gibi yanıt verin:

- **Proje adı girin:** `my-journal-dapp`
- **Şablon seçin:** `Next.js`
- **UI kütüphanesi seçin:** `Tailwind`
- **Anchor şablonu seçin:** `counter` programı

:::tip
`counter` şablonunu seçerek, Rust ile Anchor çerçevesi kullanılarak yazılmış basit bir sayıcı `programı` sizin için oluşturulacaktır. 
:::

Bu oluşturulan şablon programı düzenlemeye başlamadan önce, her şeyin beklenildiği gibi çalıştığından emin olalım:

```shell
cd my-journal-dapp

npm install

npm run dev
```

## Anchor ile Solana Programı Yazma

Eğer Anchor ile yeniyseniz,
[The Anchor Book](https://book.anchor-lang.com/introduction/introduction.html)
ve [Anchor Examples](https://examples.anchor-lang.com/) öğrenmenize yardımcı olacak harika referanslardır.

`my-journal-dapp` içinde `anchor/programs/journal/src/lib.rs` dizinine gidin. Bu klasörde zaten oluşturulmuş şablon kodu olacaktır. Bunu silip sıfırdan başlayalım ve her adımı birlikte inceleyelim.

### Anchor Programınızı Tanımlayın

```rust
use anchor_lang::prelude::*;

// Bu, programınızın genel anahtarıdır ve proje derlendiğinde otomatik olarak güncellenecektir.
declare_id!("7AGmMcgd1SjoMsCcXAAYwRgB9ihCyM8cZqjsUqriNRQt");

#[program]
pub mod journal {
    use super::*;
}
```

### Program Durumunuzu Tanımlayın

Durum, hesaba kaydetmek istediğiniz bilgileri tanımlamak için kullanılan veri yapısıdır. Solana on-chain programlarının depolama alanı olmadığından, veriler blok zincirinde yaşayan hesaplarda saklanır.

Anchor kullanırken, program durumunuzu tanımlamak için `#[account]` nitelik makrosu kullanılır.

```rust
#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
```

Bu günlük dApp için saklayacağımız veriler:

- **Günlüğün sahibi**
- **Her günlük girişinin başlığı**
- **Her günlük girişinin mesajı**

:::note
Bir hesabı başlatırken alan tanımlanmalıdır. Yukarıdaki kodda kullanılan `InitSpace` makrosu, bir hesabı başlatırken gerekli alanı hesaplamaya yardımcı olacaktır. Alan hakkında daha fazla bilgi için [buraya](https://www.anchor-lang.com/docs/space#the-init-space-macro) bakın.
:::

### Bir Günlük Girişi Oluşturun

Şimdi, bu programa yeni bir günlük girişi oluşturan bir `talimat işleyici` ekleyelim. Bunu yapmak için, daha önce tanımladığımız `#[program]` kodunu `create_journal_entry` talimatını eklemek üzere güncellememiz gerekecek.

Bir günlük girişi oluştururken, kullanıcı günlük girişinin `title` ve `message` değerlerini sağlamalıdır. Bu nedenle bu iki değişkeni ek argümanlar olarak eklememiz gerekecek.

Bu talimat işleyici fonksiyonunu çağırdığımızda, hesabın `owner` değerini, günlük girişinin `title` değerini ve günlük girişinin `message` değerini `JournalEntryState` hesabına kaydetmek istiyoruz.

```rust
#[program]
mod journal {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Günlük Girişi Oluşturuldu");
        msg!("Başlık: {}", title);
        msg!("Mesaj: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }
}
```

Anchor çerçevesiyle, her talimat ilk argüman olarak bir `Context` türü alır. `Context` makrosu, belirli bir talimat işleyiciye geçirilecek hesapları kapsayan bir yapıyı tanımlamak için kullanılır. Bu nedenle, her `Context`, talimat işleyicisine göre belirtilmiş bir tür içermelidir. Bizim durumumuzda, `CreateEntry` için bir veri yapısı tanımlamamız gerekiyor:

```rust
#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
    #[account(
        init_if_needed,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + JournalEntryState::INIT_SPACE
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

Yukarıdaki kodda, şu makroları kullandık:

- `#[derive(Accounts)]` makrosu, yapı içinde belirtilen hesapların seri hale getirilmesi ve doğrulaması için kullanılır.
- `#[instruction(...)]` nitelik makrosu, talimat işleyicisine geçirilen talimat verilerine erişmek için kullanılır.
- `#[account(...)]` nitelik makrosu ise hesaplara ek kısıtlamalar belirtir.

Her günlük girişi, on-chain durumu saklayan Bir Program Türetilmiş Adrestir ( `PDA`). Burada yeni bir günlük girişi oluşturduğumuz için, `init_if_needed` kısıtlamasını kullanarak başlatılmalıdır.

Anchor ile bir PDA, `seeds`, `bumps` ve `init_if_needed` kısıtlamaları ile başlatılır. `init_if_needed` kısıtlaması ayrıca, bu hesabın verilerini on-chain tutmak için kimin [kira](https://docs.solana.com/terminology.md#rent) ödeyeceği ve o veriler için ne kadar alan ayrılması gerektiğini tanımlayan `payer` ve `space` kısıtlamalarını gerektirir.

:::warning
Not: `JournalEntryState` içindeki `InitSpace` makrosunu kullanarak, gerekli alanı `INIT_SPACE` sabitini kullanarak hesaplayabiliyoruz ve Anchor'ın içsel ayırtıcısı için alan kısıtlamasına `8` ekliyoruz.
:::

### Bir Günlük Girişini Güncelleme

Artık yeni bir günlük girişi oluşturabiliyoruz, şimdi bir `update_journal_entry` talimat işleyici ekleyelim ve bir `UpdateEntry` türünde bir bağlam tanımlayalım.

Bunu yapmak için, talimat, `JournalEntryState` hesabına kaydedilen belirli bir PDA'nın verilerini yeniden yazacak/güncelleyerek güncellemelidir.

```rust
#[program]
mod journal {
    use super::*;

    ...

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Günlük Girişi Güncellendi");
        msg!("Başlık: {}", title);
        msg!("Mesaj: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + 32 + 1 + 4 + title.len() + 4 + message.len(),
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

Yukarıdaki kodda, `günlük girişi` oluşturmayla çok benzer olduğunu fark etmelisiniz, ancak birkaç önemli fark var. `update_journal_entry`, zaten var olan bir PDA'yı düzenlediğinden, onu başlatmamıza gerek yok. Ancak, talimat işleyiciye geçirilen mesaj, saklamak için gereken alan boyutunda farklılık gösterebileceğinden (örneğin `message` daha kısa veya daha uzun olabilir), hesabın on-chain alanını yeniden tahsis etmek için birkaç belirli `realloc` kısıtlaması kullanmamız gerekecektir:

- `realloc` - gerekli yeni alanı belirler
- `realloc::payer` - yeni alan gereksinimlerine göre hesaplanacak ödemeyi yapacak hesabı tanımlar
- `realloc::zero` - `true` olarak ayarlandığında, hesabın birden fazla kez güncellenebileceğini belirtir

`seeds` ve `bump` kısıtlamaları da güncellenmek istenen belirli PDA'yı bulabilmek için gereklidir.

`mut` kısıtlaması, hesap içindeki verileri değiştirmemize/mutasyon yapmamıza izin verir. Solana blok zincirinin, hesaplardan okuma ve yazma işlemlerini farklı şekilde ele alması nedeniyle, Solana runtime'ının bunları doğru şekilde işlemesi için hangi hesapların değiştirilebilir olduğunu açıkça belirtmemiz gerekir.

:::warning
Not: Solana'da, boyutunu değiştiren bir yeniden tahsis edildiğinde, işlemin yeni hesap boyutunun kirasını karşılaması gerekir. `realloc::payer = owner` niteliği, sahip hesabının kirayı ödeyeceğini gösterir. Bir hesabın kira ödemesini karşılayabilmesi için genellikle bir imzacı olması gerekir (fonların düşürülmesine izin vermek için) ve Anchor içinde, aynı zamanda mutasyon geçirebilmesi için değiştirilebilir olması gerekmektedir, böylece runtime, kirayı karşılamak için gereken lamportları bu hesaptan düşebilir.
:::

### Bir Günlük Girişini Silme

Son olarak, `DeleteEntry` türünde bir bağlam ile bir `delete_journal_entry` talimat işleyici ekleyeceğiz.

Bunu yapmak için, belirli bir günlük girişi için hesabı kapatmamız gerekiyor.

```rust
#[program]
mod journal {
    use super::*;

    ...

    pub fn delete_journal_entry(_ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        msg!("{} başlıklı günlük girişi silindi", title);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

Yukarıdaki kodda, `close` kısıtlamasını kullanarak on-chain'de hesabı kapatır ve kira bedelini günlük girişinin sahibine iade eder.

Hesabı doğrulamak için `seeds` ve `bump` kısıtlamaları gereklidir.

### Anchor Programınızı Derleyin ve Yayınlayın

```shell
npm run anchor build
npm run anchor deploy
```

## Bir Solana Programını UI ile Bağlama

`create-solana-dapp` zaten sizin için bir cüzdan bağlantılı UI ayarlamaktadır. Tek yapmamız gereken, yeni oluşturduğunuz programla uyumlu hale getirmek için ufak değişiklikler yapmak.

Bu günlük programında üç talimat olduğundan, UI'da bu talimatların her birini çağırmak için bileşenlere ihtiyacımız olacak:

- **Giriş oluşturma**
- **Giriş güncelleme**
- **Giriş silme**

Projenizin reposunda, günlük girişlerini çağırmak için kod eklemek üzere `web/components/journal/journal-data-access.tsx` dosyasını açın.

Giriş oluşturmak için `useJournalProgram` fonksiyonunu güncelleyin:

```typescript
const createEntry = useMutation<string, Error, CreateEntryArgs>({
  mutationKey: ["journalEntry", "create", { cluster }],
  mutationFn: async ({ title, message, owner }) => {
    const [journalEntryAddress] = await PublicKey.findProgramAddress(
      [Buffer.from(title), owner.toBuffer()],
      programId,
    );

    return program.methods
      .createJournalEntry(title, message)
      .accounts({
        journalEntry: journalEntryAddress,
      })
      .rpc();
  },
  onSuccess: signature => {
    transactionToast(signature);
    accounts.refetch();
  },
  onError: error => {
    toast.error(`Günlük girişi oluşturulamadı: ${error.message}`);
  },
});
```

Ardından, girişleri güncellemek ve silmek için `useJournalProgramAccount` fonksiyonunu güncelleyin:

```typescript
const updateEntry = useMutation<string, Error, CreateEntryArgs>({
  mutationKey: ["journalEntry", "update", { cluster }],
  mutationFn: async ({ title, message, owner }) => {
    const [journalEntryAddress] = await PublicKey.findProgramAddress(
      [Buffer.from(title), owner.toBuffer()],
      programId,
    );

    return program.methods
      .updateJournalEntry(title, message)
      .accounts({
        journalEntry: journalEntryAddress,
      })
      .rpc();
  },
  onSuccess: signature => {
    transactionToast(signature);
    accounts.refetch();
  },
  onError: error => {
    toast.error(`Günlük girişi güncellenemedi: ${error.message}`);
  },
});

const deleteEntry = useMutation({
  mutationKey: ["journal", "deleteEntry", { cluster, account }],
  mutationFn: (title: string) =>
    program.methods
      .deleteJournalEntry(title)
      .accounts({ journalEntry: account })
      .rpc(),
  onSuccess: tx => {
    transactionToast(tx);
    return accounts.refetch();
  },
});
```

Sonra, bir günlük girişini oluştururken başlık ve mesaj için kullanıcı girdi değerini almak üzere UI'ı `web/components/journal/journal-ui.tsx` dosyasında güncelleyin:

```tsx
export function JournalCreate() {
  const { createEntry } = useJournalProgram();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Cüzdanınızı bağlayın</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="textarea textarea-bordered w-full max-w-xs"
      />
      <br></br>
      <button
        type="button"
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
      >
        Günlük Girişi Oluştur {createEntry.isPending && "..."}
      </button>
    </div>
  );
}
```

Son olarak, bir günlük girişini güncellerken mesaj için kullanıcı girdi değerini almak üzere `journal-ui.tsx` dosyasını güncelleyin:

```tsx
function JournalCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useJournalProgramAccount({
    account,
  });
  const { publicKey } = useWallet();
  const [message, setMessage] = useState("");
  const title = accountQuery.data?.title;

  const isFormValid = message.trim() !== "";

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Cüzdanınızı bağlayın</p>;
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.title}
          </h2>
          <p>{accountQuery.data?.message}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Mesajı güncelleyin"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updateEntry.isPending || !isFormValid}
            >
              Günlük Girişini Güncelle {updateEntry.isPending && "..."}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Bu hesabı kapatmak istediğinize emin misiniz?",
                  )
                ) {
                  return;
                }
                const title = accountQuery.data?.title;
                if (title) {
                  return deleteEntry.mutateAsync(title);
                }
              }}
              disabled={deleteEntry.isPending}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Kaynaklar

- Günlük dApp:  
  [solana-journal-eight.vercel.app](https://solana-journal-eight.vercel.app)
- Örnek kod:  
  [https://github.com/solana-foundation/CRUD-dApp](https://github.com/solana-foundation/CRUD-dApp)