---
title: Programda saat almak
sidebarSortOrder: 2
description: "Bir Solana programında saati nasıl alacağınızı öğrenin."
---

Bir saat almak (yani, mevcut zamanı) iki şekilde yapılabilir:

1. `SYSVAR_CLOCK_PUBKEY`'i bir komuta geçirmek
2. Komut içinde Clock'a doğrudan erişmek.

Her iki yöntemi de bilmek güzel, çünkü bazı eski programlar hala `SYSVAR_CLOCK_PUBKEY`'i bir hesap olarak bekliyor.

## Komut içinde bir hesap olarak saat geçirme

Başlatma için bir hesap ve sysvar pubkey alan bir komut oluşturalım.

```rust filename="get-clock-sysvar.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct HelloState {
    is_initialized: bool,
}

// Gereken hesaplar
/// 1. [imzalayıcı, yazılabilir] Ödeyici
/// 2. [yazılabilir] Merhaba durumu hesabı
/// 3. [] Saat sys var
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    // Ödeyici hesabı
    let _payer_account = next_account_info(accounts_iter)?;
    // Merhaba durumu hesabı
    let hello_state_account = next_account_info(accounts_iter)?;
    // Saat sysvar
    let sysvar_clock_pubkey = next_account_info(accounts_iter)?;

    let mut hello_state = HelloState::try_from_slice(&hello_state_account.data.borrow())?;
    hello_state.is_initialized = true;
    hello_state.serialize(&mut &mut hello_state_account.data.borrow_mut()[..])?;
    msg!("Hesap başlatıldı :)");

    // [AccountInfo] türünü [Clock] olarak dönüştürme
    let clock = Clock::from_account_info(&sysvar_clock_pubkey)?;
    // Zaman damgasını alma
    let current_timestamp = clock.unix_timestamp;
    msg!("Güncel Zaman Damgası: {}", current_timestamp);

    Ok(())
}
```

:::tip
Şimdi saatin sysvar genel adresini istemci aracılığıyla geçiyoruz.
:::

```typescript filename="clock-sysvar-client.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

(async () => {
  const programId = new PublicKey(
    "77ezihTV6mTh2Uf3ggwbYF2NyGJJ5HHah1GrdowWJVD3",
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const latestBlockHash = await connection.getLatestBlockhash();

  // 1 SOL ödünç verme
  const feePayer = Keypair.generate();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await connection.requestAirdrop(
        feePayer.publicKey,
        LAMPORTS_PER_SOL,
      ),
    },
    "confirmed",
  );

  // Merhaba durumu hesabı
  const helloAccount = Keypair.generate();

  const accountSpace = 1; // çünkü sadece bir boolean değişken vardır
  const rentRequired =
    await connection.getMinimumBalanceForRentExemption(accountSpace);

  // Merhaba durumu hesabı için alan tahsis etme
  const allocateHelloAccountIx = SystemProgram.createAccount({
    fromPubkey: feePayer.publicKey,
    lamports: rentRequired,
    newAccountPubkey: helloAccount.publicKey,
    programId: programId,
    space: accountSpace,
  });

  // Saat Sys Var'ı geçirme
  const passClockIx = new TransactionInstruction({
    programId: programId,
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: feePayer.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: helloAccount.publicKey,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SYSVAR_CLOCK_PUBKEY,
      },
    ],
  });

  const transaction = new Transaction();
  transaction.add(allocateHelloAccountIx, passClockIx);

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    feePayer,
    helloAccount,
  ]);

  console.log(`İşlem başarılı. TxHash: ${txHash}`);
})();
```

## Saat'e doğrudan erişim

Aynı komutu oluşturalım, ancak istemci tarafından `SYSVAR_CLOCK_PUBKEY` beklemeyelim.

```rust filename="get-clock-directly.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct HelloState {
    is_initialized: bool,
}

// Gereken hesaplar
/// 1. [imzalayıcı, yazılabilir] Ödeyici
/// 2. [yazılabilir] Merhaba durumu hesabı
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    // Ödeyici hesabı
    let _payer_account = next_account_info(accounts_iter)?;
    // Merhaba durumu hesabı
    let hello_state_account = next_account_info(accounts_iter)?;

    // Saat'e doğrudan erişim
    let clock = Clock::get()?;

    let mut hello_state = HelloState::try_from_slice(&hello_state_account.data.borrow())?;
    hello_state.is_initialized = true;
    hello_state.serialize(&mut &mut hello_state_account.data.borrow_mut()[..])?;
    msg!("Hesap başlatıldı :)");

    // Zaman damgasını alma
    let current_timestamp = clock.unix_timestamp;
    msg!("Güncel Zaman Damgası: {}", current_timestamp);

    Ok(())
}
```

:::info
İstemci tarafındaki komut, artık sadece durumu ve ödeyici hesaplarını geçmesi gerekiyor.
:::

```typescript filename="clock-directly-client.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

(async () => {
  const programId = new PublicKey(
    "4ZEdbCtb5UyCSiAMHV5eSHfyjq3QwbG3yXb6oHD7RYjk",
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const latestBlockHash = await connection.getLatestBlockhash();

  // 1 SOL ödünç verme
  const feePayer = Keypair.generate();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await connection.requestAirdrop(
        feePayer.publicKey,
        LAMPORTS_PER_SOL,
      ),
    },
    "confirmed",
  );

  // Merhaba durumu hesabı
  const helloAccount = Keypair.generate();

  const accountSpace = 1; // çünkü sadece bir boolean değişken vardır
  const rentRequired =
    await connection.getMinimumBalanceForRentExemption(accountSpace);

  // Merhaba durumu hesabı için alan tahsis etme
  const allocateHelloAccountIx = SystemProgram.createAccount({
    fromPubkey: feePayer.publicKey,
    lamports: rentRequired,
    newAccountPubkey: helloAccount.publicKey,
    programId: programId,
    space: accountSpace,
  });

  const initIx = new TransactionInstruction({
    programId: programId,
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: feePayer.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: helloAccount.publicKey,
      },
    ],
  });

  const transaction = new Transaction();
  transaction.add(allocateHelloAccountIx, initIx);

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    feePayer,
    helloAccount,
  ]);

  console.log(`İşlem başarılı. TxHash: ${txHash}`);
})();