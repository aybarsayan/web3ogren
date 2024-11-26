---
date: 2024-04-07T00:00:00Z
difficulty: intermediate
title: "Solana'da Öncelik Ücretlerini Kullanma"
description:
  "Öncelik Ücretleri, Solana'da işlemlerinize ek bir ücret belirtmenizi
  sağlayan yeni bir özelliktir. Bu ücretler, işleminizin bir blokta
  dahil edilmesi için ekonomik olarak daha cazip hale gelmesine yardımcı olur."
tags:
  - web3js
keywords:
  - öğretici
  - öncelik ücretleri
  - çevrimdışı imzalama
  - işlemler
  - solana geliştirmeye giriş
  - blok zinciri geliştirici
  - blok zinciri öğreticisi
  - web3 geliştirici
---

Bu kılavuz, Solana'daki işlemlerine öncelik ücretleri eklemek isteyen geliştiriciler için bir referans olarak hazırlanmıştır. Öncelik ücretlerini, nasıl kullanılacağını, özel dikkate alınması gereken noktaları ve bunları tahmin etmek için en iyi uygulamaları ele alacağız.

## Öncelik Ücretleri Nedir?

**Öncelik Ücretleri**, işlemi ağ üzerindeki bloklara dahil etmek için doğrulayıcı düğümlerinin ekonomik açıdan cazip hale gelmesini sağlamak amacıyla, mikro-lamport başına `Hesaplama Birimi` (örn. küçük SOL miktarları) olarak fiyatlandırılan isteğe bağlı bir ücrettir. Bu ek ücret, işleminizde zaten belirlenmiş olan temel `İşlem Ücreti` olan 5000 lamportun üzerine eklenir.

## Öncelik Ücretlerini Neden Kullanmalıyım?

Bir işlem bir doğrulayıcıdan geçerken, doğrulayıcının kritik aşamalarından biri işlemi planlamaktır. Bir doğrulayıcı, ilişkili en yüksek ücretli işlemleri planlamak için ekonomik olarak teşvik edilir; bu, kullanıcıların kaynakları en iyi şekilde kullanmalarını garanti eder. 

:::info
Bir kullanıcı, bağlı bir öncelik ücreti olmadan işleminin gerçekleştirilmesini sağlayabilir fakat bu durumda daha az bir garanti olacaktır. 
:::

Bloklar, öncelik ücretleri olan işlemlerle doygun hale geldiğinde, doğrulayıcılar öncelik ücreti olmayan işlemleri bırakacaktır.

## Öncelik Ücretlerini Nasıl Uygularım?

İşleminize öncelik ücretleri eklerken, işleminiz için kullanılan hesaplama birimleri (CU) miktarını göz önünde bulundurun. İşlem için gereken CU ne kadar yüksek olursa, öncelik ücretleri eklediğinizde ödemeniz gereken ücretler de o kadar yüksek olur.

`Hesaplama Bütçesi Programı` kullanarak, işleminiz için talep edilen CU miktarını değiştirebilir ve ek olarak gereken herhangi bir öncelik ücretini ekleyebilirsiniz. CU talebinizin, işleminiz için gereken CU kadar veya daha büyük olması gerektiğini unutmayın; aksi takdirde işlem başarısız olur.

Basit bir SOL transfer işlemi alalım ve öncelik ücretleri ekleyelim. Bir [SOL transfer işlemi 300 CU alır](https://explorer.solana.com/tx/5scDyuiiEbLxjLUww3APE9X7i8LE3H63unzonUwMG7s2htpoAGG17sgRsNAhR1zVs6NQAnZeRVemVbkAct5myi17). İşlemimizi en iyi şekilde optimize etmek için, ek öncelik ücretleri eklerken Hesaplama Bütçesi Programı ile tam olarak 300 CU talep edin.

```typescript
// import { ... } from "@solana/web3.js"

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300,
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 20000,
});

const transaction = new Transaction()
  .add(modifyComputeUnits)
  .add(addPriorityFee)
  .add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 10000000,
    }),
  );
```

Solana Explorer'da [bu işlemi](https://explorer.solana.com/tx/5scDyuiiEbLxjLUww3APE9X7i8LE3H63unzonUwMG7s2htpoAGG17sgRsNAhR1zVs6NQAnZeRVemVbkAct5myi17) görüntülediğinizde, Hesaplama Birimi Limitini 300 CU olarak ayarlamak için `ComputeBudgetProgram.setComputeUnitLimit` kullandığımızı ve `ComputeBudgetProgram.setComputeUnitPrice` ile 20000 mikro-lamportluk bir öncelik ücreti eklediğimizi görebilirsiniz.

## Öncelik Ücretlerini Nasıl Tahmin Ederim?

Belirli bir işlem için öncelik ücretlerini tahmin etmenin en iyi yolu, doğru hesaplarla bir işlemi gerçekleştirmek için gereken tarihsel öncelik ücretlerini sorgulamaktır. `getRecentPrioritizationFees` JSON RPC API yöntemi, bir blokta bir işlemi gerçekleştirmek için yakın zamanda kullanılan en düşük öncelik ücretlerini alacaktır.

:::tip
`getRecentPrioritizationFees` kullanırken, işleminizde kullanılan hesapları sağlamanız gerekir; aksi takdirde, genel olarak bir işlemi gerçekleştirmek için gereken en düşük ücreti bulursunuz. Bir bloktaki hesap içeriği önceliği belirler ve doğrulayıcılar buna göre planlama yapar.
:::

Bu RPC yöntemi, sağlanan hesaplarla ilişkili en yüksek ücreti döndürecektir; bu, öncelik ücretleri eklerken göz önünde bulundurulacak temel ücret haline gelir.

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
  {
    "jsonrpc":"2.0", "id":1,
    "method": "getRecentPrioritizationFees",
    "params": [
      ["CxELquR1gPP8wHe33gZ4QxqGB3sZ9RSwsJ2KshVewkFY"]
    ]
  }
'
```

Öncelik Ücretlerini belirlemek için farklı yaklaşımlar mevcuttur ve en iyi ücreti uygulamak için bazı [üçüncü taraf API'leri](https://docs.helius.dev/solana-rpc-nodes/alpha-priority-fee-api) mevcuttur. Ağın dinamik doğası göz önüne alındığında, öncelik ücretlerini belirlemenin "mükemmel" bir yolu olmayacaktır ve ilerlemek için dikkatli bir analiz yapılmalıdır.

## Özel Dikkat Edilmesi Gerekenler

Bir `Kalıcı Nonce` İşlemi ile öncelik ücretleri kullanıyorsanız, `AdvanceNonce` talimatının işleminizin ilk talimatı olduğundan emin olmalısınız. Bu, işleminizin başarılı olmasını sağlamak için kritik öneme sahiptir; aksi takdirde işlem başarısız olacaktır.

```typescript
const advanceNonce = SystemProgram.nonceAdvance({
  noncePubkey: nonceAccountPubkey,
  authorizedPubkey: nonceAccountAuth.publicKey,
});

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300,
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 20000,
});

const transaction = new Transaction()
  .add(advanceNonce)
  .add(modifyComputeUnits)
  .add(addPriorityFee)
  .add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 10000000,
    }),
  );