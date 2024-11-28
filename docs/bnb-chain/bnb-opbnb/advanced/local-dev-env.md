---
title: Yerel Geliştirme - opBNB
description: Bu rehber, opBNB sisteminin yerel bir geliştirme ortamında nasıl kurulacağını açıklar ve ilgili yazılımların yüklenmesi, monoreposun klonlanması ve gerekli komutların çalıştırılması hakkında bilgi verir. Adım adım talimatlarla birlikte, L1 ve L2 nodları kurulumu hakkında detaylar sunulmaktadır.
keywords: [opBNB, yerel geliştirme, BNB Akıllı Zincir, L1, L2, geliştirme ortamı, docker]
---

# Yerel bir geliştirme ortamı çalıştırma

Tüm opbnb sistemini yerel olarak kurun ve başlatın; L1 (BNB Akıllı Zincir) ve L2 geliştirme düğümlerini de dahil edin. ***Yerel bir geliştirme ortamı oluşturmak***, kodunuzu ve sözleşmelerinizi test etmek için harika bir yoldur.

## Nasıl yapılır

1. Aşağıdaki yazılımların yüklü olduğundan emin olun: golang, nodejs 16+, make, pnpm, python3, docker, foundry, poetry, jq  
   :::tip
   Foundry'i [buradaki talimatları takip ederek](https://getfoundry.sh/) yükleyin.  
   Lütfen Foundry sürümünüzün opbnb/versions.json'da tanımlananla eşleştiğinden emin olun.  
   Eğer eşleşmiyorlarsa, `foundryup -C xxxxxx` gibi bir komut kullanarak bunu değiştirebilirsiniz.
   :::

2. opbnb monoreposunu klonlayın:

   ```shell
   git clone git@github.com:bnb-chain/opbnb.git
   cd opbnb
   ```

3. `pnpm install` komutunu çalıştırın ve ardından `pnpm build` komutunu çalıştırın.  
4. `make devnet-up` komutunu çalıştırın ve docker konteynerinin başlamasını bekleyin. (İlk çalışma görece yavaş olacaktır çünkü imajı indirmesi ve sözleşmeyi dağıtması gerekiyor, ardından hızlı olacaktır)  
5. `docker ps` komutuyla 5 konteynerin başlatıldığını görebilirsiniz: `ops-bedrock_l1_1`, `ops-bedrock_l2_1`, `ops-bedrock_op-node_1`, `ops-bedrock_op-batcher_1`, `ops-bedrock_op-proposer_1`

Artık L1 `http://localhost:8545` adresinden erişilebilir ve L2 `http://localhost:9545` adresinden erişilebilir.

## Durdur veya temizle

Durdurmak için, monorepo'nun kök dizininde `make devnet-down` komutunu çalıştırın.  
Her şeyi temizlemek için, monorepo'nun kök dizininde `make devnet-clean` komutunu çalıştırın.  
Logları görüntülemek için `make devnet-logs` komutunu çalıştırın.

---

# Notlar

1. İlk kez çalıştırırken "RPC sunucusu için bekleniyor..." mesajını görürseniz lütfen sabırlı olun; çünkü BSC ağı başlatılmak için zamana ihtiyaç duyar.
2. "Sözleşmeleri dağıtma" aşamasında bir hata ile karşılaşırsanız, lütfen tekrar deneyin çünkü genellikle kendini toparlar.

## Ek Bilgiler

L1 zincir ID'si `714`.  
L2 zincir ID'si `901`.

L1 test hesabı:

- Adres: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Özel anahtar: `ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

L2 test hesabı:

- Adres: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Özel anahtar: `ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`