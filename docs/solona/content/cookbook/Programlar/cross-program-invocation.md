---
title: Çapraz Program Çağrısı Nasıl Yapılır
sidebarSortOrder: 4
description: "Solana programlarında Çapraz Program Çağrısını nasıl yapacağınızı öğrenin."
---

Bir çapraz program çağrısı, basitçe başka bir programın talimatını iç programımız içerisinde çağırmak demektir. En iyi örneklerden biri **Uniswap'ın** `swap` işlevselliğidir. `UniswapV2Router` sözleşmesi, takas işlemi için gerekli mantığı çağırır ve `ERC20` sözleşmesinin transfer işlevini çağırarak bir kişiden diğerine takas yapar. Aynı şekilde, bir programın talimatını çağırarak çok çeşitli amaçlar gerçekleştirebiliriz.

:::tip
Çapraz program çağrıları, bir programın başka bir programın işlevselliğini doğrudan kullanmasını sağlar. Bu, geliştirme sürecini büyük ölçüde kolaylaştırır.
:::

İlk örneğimize bakalım; bu `SPL Token Programının transfer` talimatıdır. Bir transferin gerçekleşmesi için gerekli olan hesaplar şunlardır:

1. **Kaynak Token Hesabı** (Tokenlerimizi tuttuğumuz hesap)
2. **Hedef Token Hesabı** (Tokenlerimizi aktaracağımız hesap)
3. **Kaynak Token Hesabı'nın Sahibi** (İmza atacağımız cüzdan adresimiz)

```rust filename="cpi-transfer.rs"
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use spl_token::instruction::transfer;

entrypoint!(process_instruction);

// Hesaplar
/// 1. [yazılabilir] Kaynak Token Hesabı
/// 2. [yazılabilir] Hedef Token Hesabı
/// 3. [imzacı] Kaynak Token Hesabı sahibinin PubKey’i
/// 4. [] Token Programı
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Token transferi için gerekli hesaplar

    // 1. Sahip olduğumuz token hesabı
    let source_token_account = next_account_info(accounts_iter)?;
    // 2. Gönderilecek token hesabı
    let destination_token_account = next_account_info(accounts_iter)?;
    // 3. Cüzdan adresimiz
    let source_token_account_holder = next_account_info(accounts_iter)?;
    // 4. Token Programı
    let token_program = next_account_info(accounts_iter)?;

    // Talimat verilerinden token transfer miktarını ayıklama
    // a. u8 byte dizisinin 0'dan 8. indekse kadar olan kısmını alma
    // b. elde edilen sıfırdan farklı u8'yi uygun bir u8'e (küçük endian tamsayılar olarak) dönüştürme
    // c. küçük endian tamsayıları bir u64 numarasına dönüştürme
    let token_transfer_amount = instruction_data
        .get(..8)
        .and_then(|slice| slice.try_into().ok())
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidAccountData)?;

    msg!(
        "{} token {}'dan {}'ya aktarılıyor",
        token_transfer_amount,
        source_token_account.key.to_string(),
        destination_token_account.key.to_string()
    );

    // Yeni bir TransactionInstruction oluşturma
    /*
        Talimatın dönüş değerinin içsel temsili (Result<Instruction, ProgramError>)

        Ok(Instruction {
            program_id: *token_program_id, // KULLANICIDAN GEÇİYOR
            accounts,
            data,
        })
    */

    let transfer_tokens_instruction = transfer(
        &token_program.key,
        &source_token_account.key,
        &destination_token_account.key,
        &source_token_account_holder.key,
        &[&source_token_account_holder.key],
        token_transfer_amount,
    )?;

    let required_accounts_for_transfer = [
        source_token_account.clone(),
        destination_token_account.clone(),
        source_token_account_holder.clone(),
    ];

    // Göndermek için TransactionInstruction'ı geçirme
    invoke(
        &transfer_tokens_instruction,
        &required_accounts_for_transfer,
    )?;

    msg!("Transfer başarılı");

    Ok(())
}
```

İlgili istemci talimatı şu şekilde olacaktır. Mint ve token oluşturma talimatlarını bilmek için lütfen yanındaki tam kodu inceleyin.

```typescript filename="cpi-transfer-client.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AccountLayout,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";

import * as BN from "bn.js";

// Kullanıcılar
const PAYER_KEYPAIR = Keypair.generate();
const RECEIVER_KEYPAIR = Keypair.generate().publicKey;

// Mint ve token hesapları
const TOKEN_MINT_ACCOUNT = Keypair.generate();
const SOURCE_TOKEN_ACCOUNT = Keypair.generate();
const DESTINATION_TOKEN_ACCOUNT = Keypair.generate();

// Sayılar
const DEFAULT_DECIMALS_COUNT = 9;
const TOKEN_TRANSFER_AMOUNT = 50 * 10 ** DEFAULT_DECIMALS_COUNT;
const TOKEN_TRANSFER_AMOUNT_BUFFER = Buffer.from(
  Uint8Array.of(...new BN(TOKEN_TRANSFER_AMOUNT).toArray("le", 8))
);

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const programId = new PublicKey(
    "EfYK91eN3AqTwY1C34W6a33qGAtQ8HJYVhNv7cV4uMZj"
  );

  const mintDataSpace = MintLayout.span;
  const mintRentRequired = await connection.getMinimumBalanceForRentExemption(
    mintDataSpace
  );

  const tokenDataSpace = AccountLayout.span;
  const tokenRentRequired = await connection.getMinimumBalanceForRentExemption(
    tokenDataSpace
  );

  // 1 SOL airdrop
  const feePayer = Keypair.generate();
  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL),
    },
    'confirmed',
  );


  // Mint hesabı için alan ve kira ayırma
  const createMintAccountIx = SystemProgram.createAccount({
    fromPubkey: PAYER_KEYPAIR.publicKey,
    lamports: mintRentRequired,
    newAccountPubkey: TOKEN_MINT_ACCOUNT.publicKey,
    programId: TOKEN_PROGRAM_ID,
    space: mintDataSpace,
  });

  // Decimals ve yetkililerle mint'i başlatma
  const initializeMintIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    TOKEN_MINT_ACCOUNT.publicKey,
    DEFAULT_DECIMALS_COUNT,
    PAYER_KEYPAIR.publicKey, // mintAuthority
    PAYER_KEYPAIR.publicKey // freezeAuthority
  );

  // Kaynak token hesabı için alan ve kira ayırma
  const createSourceTokenAccountIx = SystemProgram.createAccount({
    fromPubkey: PAYER_KEYPAIR.publicKey,
    newAccountPubkey: SOURCE_TOKEN_ACCOUNT.publicKey,
    lamports: tokenRentRequired,
    programId: TOKEN_PROGRAM_ID,
    space: tokenDataSpace,
  });

  // Mint ve sahibi ile token hesabını başlatma
  const initializeSourceTokenAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    TOKEN_MINT_ACCOUNT.publicKey,
    SOURCE_TOKEN_ACCOUNT.publicKey,
    PAYER_KEYPAIR.publicKey
  );

  // Hedef hesap için gönderilecek tokenler için minting
  const mintTokensIx = Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    TOKEN_MINT_ACCOUNT.publicKey,
    SOURCE_TOKEN_ACCOUNT.publicKey,
    PAYER_KEYPAIR.publicKey,
    [PAYER_KEYPAIR],
    TOKEN_TRANSFER_AMOUNT
  );

  // Hedef token hesabı için alan ve kira ayırma
  const createDestinationTokenAccountIx = SystemProgram.createAccount({
    fromPubkey: PAYER_KEYPAIR.publicKey,
    newAccountPubkey: DESTINATION_TOKEN_ACCOUNT.publicKey,
    lamports: tokenRentRequired,
    programId: TOKEN_PROGRAM_ID,
    space: tokenDataSpace,
  });

  // Mint ve sahibi ile token hesabını başlatma
  const initializeDestinationTokenAccountIx =
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      TOKEN_MINT_ACCOUNT.publicKey,
      DESTINATION_TOKEN_ACCOUNT.publicKey,
      RECEIVER_KEYPAIR
    );

  // Programımızın CPI talimatı (transfer)
  const transferTokensIx = new TransactionInstruction({
    programId: programId,
    data: TOKEN_TRANSFER_AMOUNT_BUFFER,
    keys: [
      {
        isSigner: false,
        isWritable: true,
        pubkey: SOURCE_TOKEN_ACCOUNT.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: DESTINATION_TOKEN_ACCOUNT.publicKey,
      },
      {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: TOKEN_PROGRAM_ID,
      },
    ],
  });

  const transaction = new Transaction();
  // Yukarıdaki tüm talimatları ekleme
  transaction.add(
    createMintAccountIx,
    initializeMintIx,
    createSourceTokenAccountIx,
    initializeSourceTokenAccountIx,
    mintTokensIx,
    createDestinationTokenAccountIx,
    initializeDestinationTokenAccountIx,
    transferTokensIx
  );

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    PAYER_KEYPAIR,
    TOKEN_MINT_ACCOUNT,
    SOURCE_TOKEN_ACCOUNT,
    DESTINATION_TOKEN_ACCOUNT,
  ]);

  console.log(`Token transfer CPI başarısı: ${txHash}`);
})();
```

Şimdi bir başka örneğe bakalım; bu da `Sistem Programının create_account` talimatıdır. Yukarıda bahsedilen talimat ile burada bir farklılık var. Orada, `invoke` fonksiyonu içindeki hesaplardan birisi olarak `token_program`'ı geçmek zorunda kalmamıştık. Ancak, bazen çağrılan talimatın `program_id`'sini geçirmeniz gereken istisnalar vardır. Bizim durumumuzda bu, `Sistem Programının` program_id'sidir. ("11111111111111111111111111111111"). Şimdi gerekli hesaplar şunlardır:

1. **Kiranın finansmanını sağlayan hesap**
2. **Oluşturulacak hesap**
3. **Sistem Program hesabı**

```rust filename="cpi-create-account.rs"
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction::create_account,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

// Hesaplar
/// 1. [imzacı, yazılabilir] Payer Hesabı
/// 2. [imzacı, yazılabilir] Genel Durum Hesabı
/// 3. [] Sistem Programı
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Hesaplar oluşturma için gerekenler

    // 1. Durum hesabı oluşturmada harcayacak olan hesap
    let payer_account = next_account_info(accounts_iter)?;
    // 2. Token hesabı
    let general_state_account = next_account_info(accounts_iter)?;
    // 3. Sistem Programı
    let system_program = next_account_info(accounts_iter)?;

    msg!(
        "{} için hesap oluşturuluyor",
        general_state_account.key.to_string()
    );

    // Talimat verilerinden account span miktarını ayıklama
    // a. u8 byte dizisinin 0'dan 8. indekse kadar olan kısmını alma
    // b. elde edilen sıfırdan farklı u8'yi uygun bir u8'e (küçük endian tamsayılar olarak) dönüştürme
    // c. küçük endian tamsayıları bir u64 numarasına dönüştürme
    let account_span = instruction_data
        .get(..8)
        .and_then(|slice| slice.try_into().ok())
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidAccountData)?;

    let lamports_required = (Rent::get()?).minimum_balance(account_span as usize);

    // Yeni bir TransactionInstruction oluşturma
    /*
        Talimatın dönüş değerinin içsel temsili (Instruction)

        Instruction::new_with_bincode(
            system_program::id(), // KULLANICIDAN GEÇİYOR
            &SystemInstruction::CreateAccount {
                lamports,
                space,
                owner: *owner,
            },
            account_metas,
        )
    */

    let create_account_instruction = create_account(
        &payer_account.key,
        &general_state_account.key,
        lamports_required,
        account_span,
        program_id,
    );

    let required_accounts_for_create = [
        payer_account.clone(),
        general_state_account.clone(),
        system_program.clone(),
    ];

    // Gönderilecek TransactionInstruction'ı geçiş (verilen program_id ile)
    invoke(&create_account_instruction, &required_accounts_for_create)?;

    msg!("Transfer başarılı");

    Ok(())
}
```

İlgili istemci tarafı kodu şu şekilde görünecektir:

```typescript filename="cpi-create-account-client.ts"
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import * as BN from "bn.js";

// Kullanıcılar
const PAYER_KEYPAIR = Keypair.generate();
const GENERAL_STATE_KEYPAIR = Keypair.generate();

const ACCOUNT_SPACE_BUFFER = Buffer.from(
  Uint8Array.of(...new BN(100).toArray("le", 8)),
);

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const latestBlockHash = await connection.getLatestBlockhash();
  const programId = new PublicKey(
    "DkuQ5wsndkzXfgqDB6Lgf4sDjBi4gkLSak1dM5Mn2RuQ",
  );

  // 1 SOL airdrop
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

  // Programımızın CPI talimatı (create_account)
  const createAccountIx = new TransactionInstruction({
    programId: programId,
    data: ACCOUNT_SPACE_BUFFER,
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
      },
      {
        isSigner: true,
        isWritable: true,
        pubkey: GENERAL_STATE_KEYPAIR.publicKey,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
    ],
  });

  const transaction = new Transaction();
  // Yukarıdaki tüm talimatları ekleme
  transaction.add(createAccountIx);

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    PAYER_KEYPAIR,
    GENERAL_STATE_KEYPAIR,
  ]);

  console.log(`Hesap Oluşturma CPI Başarısı: ${txHash}`);
})();