---
title: Akıllı Sözleşme Yayını
---

# Akıllı Sözleşme Yayını

`dapp-offer-up` eğitimi sırasında, `yarn start:contract` komutunu kullanarak Agoric'te bir sözleşme yayınlamanın ne kadar hızlı ve kolay olduğunu gördünüz. Şimdi bu komutun nasıl çalıştığını ve arka planda neler olduğunu inceleyelim.

## Çalışma Şekli

Eğitimde `yarn start:contract` komutunu çalıştırmak, birkaç şeyi başaran bir betiği çalıştırır:

- Betik, sözleşmeyi `agoric run` komutu ile paketler.
- Betik, `agd tx bank send` komutunu kullanarak bazı ATOM toplar.
- Betik daha sonra, bunları kullanarak bir vault açar. Bu vault, `agops vaults open` komutu ile zincirdeki paketleri kurmak için yeterli IST mint etmek için kullanıldı.
- Betik, daha sonra `agd tx swingset install-bundle` komutunu kullanarak paketleri zincire kurar.
- Sonrasında, betik bir yönetim teminatı için yeterli BLD toplar ve bunu `agd tx bank send` komutu ile yapar.
- Ardından, betik `agd tx gov submit-proposal swingset-core-eval` komutunu kullanarak sözleşmeyi başlatmak için bir yönetim önerisi yapar.
- Son olarak, betik öneri için oy kullanır ve önerinin geçmesini bekler.

Bir kez daha, projenin `package.json` dosyasına başvurarak `yarn start:contract` komutunun arka planda neler yaptığını öğrenebiliriz.

```json
  "scripts": {
    "start:docker": "cd contract && docker compose up -d",
    "docker:logs": "cd contract; docker compose logs --tail 200 -f",
    "docker:bash": "cd contract; docker compose exec agd bash",
    "docker:make": "cd contract; docker compose exec agd make -C /workspace/contract",
    "make:help": "make -C contract list",
    "start:contract": "cd contract && yarn start",
    "start:ui": "cd ui && yarn dev",
    "lint": "yarn workspaces run lint",
    "test": "yarn workspaces run test",
    "test:e2e": "yarn workspace offer-up-ui test:e2e",
    "build": "yarn workspaces run build"
  }
```

Dikkat edin ki `yarn start:contract` komutu, sözleşme dizininden `yarn start` çalıştırmakla aynı şeyi ifade eder. Daha fazlasını öğrenmek için `contract` dizinindeki `package.json` dosyasına göz atabiliriz:

```json
 "scripts": {
    "start:docker": "docker compose up -d",
    "docker:logs": "docker compose logs --tail 200 -f",
    "docker:bash": "docker compose exec agd bash",
    "docker:make": "docker compose exec agd make -C /workspace/contract",
    "make:help": "make list",
    "start": "yarn docker:make clean start-contract",
    "build": "agoric run scripts/build-contract-deployer.js",
    "test": "ava --verbose",
    "lint": "eslint '**/*.js'",
    "lint:fix": "eslint --fix '**/*.js'"
  },
```

Yukarıdaki JSON kesitinde, `start` komutunun `yarn docker:make clean start-contract` çalıştırdığını unutmayın.

::: tip Video Geçişi

Bu açıklamayı incelerken, bu video geçişini izlemek faydalı olabilir.




:::`