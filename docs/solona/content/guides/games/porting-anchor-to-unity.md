---
date: 2024-04-25T00:00:00Z
difficulty: beginner
title: Unity'ye Anchor Taşıma
description:
  Anchor IDL kullanarak programınıza doğrudan unity'den etkileşimde bulunabilirsiniz
tags:
  - oyunlar
  - anchor
  - program
  - unity
  - rust
keywords:
  - öğretici
  - blockchain geliştirici
  - blockchain öğretici
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

Eğer bir Solana programı yazdıysanız, bunu bir Anchor IDL'yi (Solana programının JSON temsili) C#'a dönüştüren bir kod jeneratörü kullanarak Unity oyun motorunda kullanabilirsiniz.

## İstemci Oluşturma

Anchor kullanırken programınızın JSON temsilini oluşturan bir IDL dosyası oluşturabileceksiniz. Bu IDL ile farklı istemciler oluşturabilirsiniz. Örneğin, JavaScript veya Unity için C#.

:::tip
IDL'den C#'a dönüşüm için kullanabileceğiniz en iyi araçlardan biridir.
:::

[IDL'den C#'a Dönüştürücü](https://github.com/magicblock-labs/Solana.Unity.Anchor)

Bu iki satır, oyun için bir C# istemcisi oluşturacaktır.

```bash
dotnet tool install Solana.Unity.Anchor.Tool
dotnet anchorgen -i idl/file.json -o src/ProgramCode.cs
```

Bu, programınızın C# temsiline sahip olmanızı sağlayacak; veriyi serileştirmek ve programa kolayca talimatlar oluşturmak için kullanabileceksiniz.

## Unity C#'da İşlemi Oluşturma

Unity oyun motorunda, programa etkileşimde bulunmak için
[Solana Unity SDK](https://assetstore.unity.com/packages/decentralization/infrastructure/solana-sdk-for-unity-246931)'yı kullanabiliriz.

1. Öncelikle, oyunun veri hesabının onchain adresini TryFindProgramAddress ile buluyoruz. Bu hesabı işleme geçmemiz gerekiyor, **böylece Solana çalışma zamanı bu hesabı değiştirmek istediğimizi bilir.**
2. Sonra, oluşturulan istemciyi kullanarak bir MoveRight talimatı oluşturuyoruz.
3. Daha sonra, bir RPC düğümünden bir blok hash isteğinde bulunuyoruz. Bu, **Solana'nın işlemin ne kadar süre geçerli olacağını bilmesi için gereklidir.**
4. Ardından, ücret ödeyen kişiyi oyuncunun cüzdanı olacak şekilde ayarlıyoruz.
5. Daha sonra, işlemi MoveRight talimatını ekliyoruz. **Gerekirse tek bir işleme birden fazla talimat da ekleyebiliriz.**
6. Daha sonra işlem imzalanır ve işlenmesi için RPC düğümüne gönderilir. Solana'nın farklı Taahhüt seviyeleri vardır. Taahhüt seviyesini Onaylı olarak ayarlarsak, bir sonraki 500 ms içinde yeni durumu alabiliriz.

:::info
Bir Anchor programı ile etkileşimde bulunan bir Unity oyununun tam örneğini Solana Oyun Preseti'nde bulabilirsiniz.
:::

7. [Unity İstemcisi](https://github.com/solana-developers/solana-game-examples/tree/main/seven-seas/unity/Assets/SolPlay/Examples/TinyAdventure)

```c#
public async void MoveRight()
{
    PublicKey.TryFindProgramAddress(new[]
    {
        Encoding.UTF8.GetBytes("level1")
    },
    ProgramId, out gameDataAccount, out var bump);

    MoveRightAccounts account = new MoveRightAccounts();
    account.GameDataAccount = gameDataAccount;
    TransactionInstruction moveRightInstruction = TinyAdventureProgram.MoveRight(account, ProgramId);

    var walletHolderService = ServiceFactory.Resolve<WalletHolderService>();
    var result = await walletHolderService.BaseWallet.ActiveRpcClient.GetRecentBlockHashAsync(Commitment.Confirmed);

    Transaction transaction = new Transaction();
    transaction.FeePayer = walletHolderService.BaseWallet.Account.PublicKey;
    transaction.RecentBlockHash = result.Result.Value.Blockhash;
    transaction.Signatures = new List<SignaturePubKeyPair>();
    transaction.Instructions = new List<TransactionInstruction>();
    transaction.Instructions.Add(moveRightInstruction);

    Transaction signedTransaction = await walletHolderService.BaseWallet.SignTransaction(transaction);

    RequestResult<string> signature = await walletHolderService.BaseWallet.ActiveRpcClient.SendTransactionAsync(
        Convert.ToBase64String(signedTransaction.Serialize()),
        true, Commitment.Confirmed);
}
```

Bir Anchor programı ile etkileşimde bulunan bir Unity oyununun tam örneğini Solana Oyun Preseti'nde bulabilirsiniz, bu gönderi `burada` bulunmaktadır.