# `dapp-agoric-basics` Eğitimi

## Giriş

Bu eğitimde, `dapp-agoric-basics` dapp'ini kuracaksınız. Bu dapp, Agoric akıllı sözleşmeleri için temel kullanım senaryolarının bir koleksiyonudur.

- 
- 
- 

Başlamak için,  kılavuzunda belirtilen ön koşul bileşenleri ile birlikte bir ortam oluşturmalısınız. Eğer Başlarken eğitimini zaten tamamladıysanız, aynı ortamı kullanabilirsiniz.

## Dapp'in İndirilmesi

Dapp'i Github'dan indirin:

```bash
yarn create @agoric/dapp --dapp-template dapp-agoric-basics agoric-basics
```

## Dapp Bileşenlerinin Kurulumu

Sonra, `agoric-basics` dizininde `yarn install` komutunu çalıştırın:

```bash
cd agoric-basics
yarn install
```

## Docker Konteynerinin Başlatılması

Docker konteynerini başlatın:

```bash
yarn start:docker
```

Birkaç dakika sonra, blokların üretildiğinden emin olmak için Docker günlüklerini kontrol edin:

```bash
yarn docker:logs
```

## Dapp'in Başlatılması

`dapp-agoric-basics` sözleşmesini başlatın:

```bash
yarn start:contract
```

Kullanıcı arayüzünü başlatın:

```bash
yarn start:ui
```

Sonra bir tarayıcı açın ve `localhost:5173` adresine gidin:


Kullanıcı arayüzünden 'Cüzdanı Bağla' seçeneğini seçin. 'Cüzdanınızı Seçin' ekranından 'Keplr'ı seçin:


Keplr'de bağlantıyı onaylayın:


Satın almak için bir bilet seçin ve bir bileti mintlemek için 'Mint' butonuna tıklayın. Keplr'de işlemi onaylayın:


İşlem tamamlandıktan sonra, cüzdanınızdaki biletleri göreceksiniz:
