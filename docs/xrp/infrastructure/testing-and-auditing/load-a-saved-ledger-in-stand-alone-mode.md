---
title: Kaydedilmiş Bir Defteri Bağımsız Modda Yükleme
seoTitle: Bağımsız Modda Kaydedilmiş Defter Yükleme Rehberi
sidebar_position: 4
description: Bu doküman, bir rippled sunucusunu bağımsız modda bir tarihi defter sürümünü kullanarak nasıl başlatacağınızı ve işlemleri nasıl ilerleteceğinizi açıklar.
tags: 
  - rippled
  - bağımsız mod
  - defter sürümü
  - XRP Ledger
  - işlem tekrar oynatma
keywords: 
  - rippled
  - bağımsız mod
  - defter sürümü
  - XRP Ledger
  - işlem tekrar oynatma
---

## Kaydedilmiş Bir Defteri Bağımsız Modda Yükleme

Bir `rippled` sunucusunu, daha önce diske kaydedilmiş bir `tarihi defter sürümü` kullanarak `Bağımsız Modda` başlatabilirsiniz. Örneğin, `rippled` sunucunuz daha önce `üretim Mainnet, Testnet veya Devnet` dahil olmak üzere herhangi bir XRP Ledger eşler arası ağ ile senkronize ise, sunucunuzun erişimi olan herhangi bir defter sürümünü yükleyebilirsiniz.

Tarihi bir defter sürümünü yüklemek, işlemlerin ağ kurallarına göre işlendiğini doğrulamak amacıyla bir defteri "tekrar oynatma" için veya farklı `değişiklikler` etkinleştirilmiş işlem kümelerinin işlenme sonuçlarını karşılaştırmak için yararlıdır. XRP Ledger'ın konsensüs mekanizmasına yönelik `bir saldırının` paylaşılan defter durumunda istenmeyen etkilere neden olması durumunda, doğrulayıcıların konsensüsü bu süreçle bilinen iyi bir ağ durumuna "geri dönebilir".

:::warning 
`rippled` daha yeni sürümlere güncellenirken, değişiklikler emekli edilir ve defterin temel işlevleri haline gelir, bu da işlemlerin işlenme şeklini etkileyebilir. Tarihi olarak doğru sonuçlar üretmek için, işlemin işlendiği `rippled` sürümünü kullanarak defterleri tekrar oynatmalısınız.
:::

## 1. `rippled`’i normal şekilde başlatın.

Mevcut bir defteri yüklemek için önce o defteri ağdan almanız gerekir. `rippled`'i çevrimiçi modda normal şekilde başlatın:

```
rippled --conf=/path/to/rippled.cfg
```

## 2. `rippled`’in ağ ile senkronize olmasını bekleyin.

Sunucunuzun durumunu ağ ile karşılaştırmak için [server_info yöntemini][] kullanın. `server_state` değeri aşağıdaki değerlerden herhangi birini gösterdiğinde sunucunuz senkronizedir:

* `full`
* `proposing`
* `validating`

Daha fazla bilgi için `Olası Sunucu Durumları` sayfasına bakın.

## 3. (İsteğe Bağlı) Belirli defter sürümlerini alın.

En son defteri almak istiyorsanız, bu adımı atlayabilirsiniz.

Belirli bir tarihi defter sürümünü yüklemek istiyorsanız, `rippled`'in onu almasını sağlamak için [ledger_request yöntemini][] kullanın. Eğer `rippled` zaten defter sürümüne sahip değilse, defteri almak tamamlanana kadar `ledger_request` komutunu birden fazla kez çalıştırmanız gerekebilir.

Belirli bir tarihi defter sürümünü tekrar oynamak istiyorsanız, hem tekrar oynatacağınız defter sürümünü hem de ondan önceki defter sürümünü almanız gerekir. (Önceki defter sürümü, geri uyguladığınız defter sürümünde tanımlanan değişiklikleri uygulamak için başlangıç durumunu ayarlar.)

## 4. `rippled`’i kapatın.

[stop yöntemini][] kullanın:

```
rippled stop --conf=/path/to/rippled.cfg
```

## 5. `rippled`’i bağımsız modda başlatın.

En son defter sürümünü yüklemek için sunucuyu `-a` ve `--load` seçenekleriyle başlatın:

```
rippled -a --load --conf=/path/to/rippled.cfg
```

Belirli bir tarihi defteri yüklemek için sunucuyu, yüklemek istediğiniz defter sürümüne ait indeks veya tanımlayıcı hash'i sağlayarak `--ledger` parametresi ile birlikte `--load` parametresiyle başlatın:

```
rippled -a --load --ledger 19860944 --conf=/path/to/rippled.cfg
```

Bu, kaydedilmiş defter sürümünü sunucu açıldığında "geçerli" (açık) defter haline getirir.

`rippled`'i bağımsız modda başlatırken kullanabileceğiniz seçenekler hakkında daha fazla bilgi için `Komut Satırı Kullanımı: Bağımsız Modda Seçenekler` sayfasına bakın.

## 6. Defteri manuel olarak ilerletin.

Kaydedilmiş defteri işlemek için onu `ledger_accept` yöntemi ile manuel olarak ilerletin:

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

Bu, işlemleri kanonik sıraya koyar ve onları kapalı bir defter oluşturmak için işler.

## Ayrıca Bakınız

- **Referanslar:**
    - [ledger_accept yöntemi][]
    - [server_info yöntemi][]
    - `rippled` Komut Satırı Kullanımı`
- **Kullanım Durumları:**
    - `XRP Ledger'a Kod Katkı Sağlayın`

