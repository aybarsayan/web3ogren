---
title: Program Türetilmiş Adresi Nasıl Oluşturulur
sidebarSortOrder: 5
description:
  "Solana programında Program Türetilmiş Adresi (PDA) nasıl oluşturulur öğrenin."
---

Bir Program Türetilmiş Adresi, programın sahibi olduğu bir hesap olup,  
hiçbir özel anahtara sahip değildir. Bunun yerine imzası bir dizi tohum ve bir 
bump (geçersiz bir genel anahtar olmadığını güvence altına alan bir nonce) ile 
alınır. 

:::tip
**Bir Program Adresini oluşturmak**, onu **geliştirmekten** farklıdır. 
:::

Bir PDA, `Pubkey::find_program_address` kullanılarak oluşturulabilir. Bir 
PDA oluşturmak esasen adresi alan ile başlatmak ve ona durum atamak demektir. 
Normal bir Keypair hesabı programımız dışında oluşturulup, durumunu başlatmak 
için beslenebilir. Ne yazık ki, PDAs için, kendi adına imza atma yeteneğinden 
dolayı zincirde oluşturulması gerekmektedir. 

:::warning
Bu nedenle PDA'nın tohumlarını geçirmek için `invoke_signed` kullanarak, finansman 
hesabının imzası ile birlikte PDA'nın hesap oluşturulması sağlanır.
:::

```rust filename="create-pda.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct HelloState {
    is_initialized: bool,
}

// Gerekli hesaplar
/// 1. [imzacı, yazılabilir] Finansman hesabı
/// 2. [yazılabilir] PDA hesabı
/// 3. [] Sistem Programı
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    const ACCOUNT_DATA_LEN: usize = 1;

    let accounts_iter = &mut accounts.iter();
    // Gerekli hesapları alıyoruz
    let funding_account = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Talimat verilerinden PDA Bump'ı alma
    let (pda_bump, _) = instruction_data
        .split_first()
        .ok_or(ProgramError::InvalidInstructionData)?;

    // Geçen PDA ve beklenen PDA'nın eşit olup olmadığını kontrol etme
    let signers_seeds: &[&[u8]; 3] = &[
        b"customaddress",
        &funding_account.key.to_bytes(),
        &[*pda_bump],
    ];
    let pda = Pubkey::create_program_address(signers_seeds, program_id)?;

    if pda.ne(&pda_account.key) {
        return Err(ProgramError::InvalidAccountData);
    }

    // Gerekli lamportları değerlendirme ve işlem talimatı oluşturma
    let lamports_required = Rent::get()?.minimum_balance(ACCOUNT_DATA_LEN);
    let create_pda_account_ix = system_instruction::create_account(
        &funding_account.key,
        &pda_account.key,
        lamports_required,
        ACCOUNT_DATA_LEN.try_into().unwrap(),
        &program_id,
    );
    // Talimatı PDA'ları ek imzacı olarak içerecek şekilde çağırma
    invoke_signed(
        &create_pda_account_ix,
        &[
            funding_account.clone(),
            pda_account.clone(),
            system_program.clone(),
        ],
        &[signers_seeds],
    )?;

    // PDA için durumu ayarlama
    let mut pda_account_state = HelloState::try_from_slice(&pda_account.data.borrow())?;
    pda_account_state.is_initialized = true;
    pda_account_state.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}
```

Gerekli hesapları istemci aracılığıyla gönderebilirsiniz:

```typescript filename="create-pda-client.ts"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

const PAYER_KEYPAIR = Keypair.generate();

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const latestBlockHash = await connection.getLatestBlockhash();
  const programId = new PublicKey(
    "6eW5nnSosr2LpkUGCdznsjRGDhVb26tLmiM1P8RV1QQp",
  );

  // Ödeyiciye Airdrop
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await connection.requestAirdrop(
        PAYER_KEYPAIR.publicKey,
        LAMPORTS_PER_SOL,
      ),
    },
    "confirmed",
  );

  const [pda, bump] = await PublicKey.findProgramAddress(
    [Buffer.from("customaddress"), PAYER_KEYPAIR.publicKey.toBuffer()],
    programId,
  );

  console.log(`PDA Pubkey: ${pda.toString()}`);

  const createPDAIx = new TransactionInstruction({
    programId: programId,
    data: Buffer.from(Uint8Array.of(bump)),
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
    ],
  });

  const transaction = new Transaction();
  transaction.add(createPDAIx);

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    PAYER_KEYPAIR,
  ]);
  console.log(`PDA başarıyla oluşturuldu. Tx Hash: ${txHash}`);
})();
``` 