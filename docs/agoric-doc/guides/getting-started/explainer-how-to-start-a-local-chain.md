---
title: Yerel Zincir Başlatma
---

# Yerel Zincir Başlatma

Bu öğreticide gördüğünüz gibi, yerel bir zincir başlatmak oldukça kolay!

## Nasıl Çalışır

`dapp-offer-up` örnek dapp'inde, Agoric konteynerleri için yapılandırma `package.json` dosyasında belirtilmiştir. Aşağıdaki `package.json` içindeki `script` bölümünde Docker'a özgü parametreleri dikkate alın:

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

Öğretide önce `yarn create` komutunu kullanarak dapp'i klonladınız. Ardından, gerekli tüm bağımlılıkları yüklemek için `yarn install` komutunu çalıştırdınız. Son olarak, yerel bir zincir başlatmak için `yarn start:docker` komutunu çalıştırdınız. Yukarıdaki JSON kod parçasından görebileceğiniz gibi, bu komut `contract` klasöründen `docker compose up -d` çalıştırıyor.

::: tip Video Geçişi

Bu açıklamayı incelerken, bu video geçişini izlemeniz faydalı olabilir.




:::
