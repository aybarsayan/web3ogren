---
title: Hızlı Kılavuz - BNB Greenfield Geliştir
description: BNB Greenfield geliştiricileri için hızlı bir kılavuz. Projenizi inşa etmek için gerekenleri anlayacaksınız.
keywords: [BNB Greenfield geliştirme, veri depolama geliştirme, programlanabilirlik, geliştirici kılavuzu, akıllı sözleşmeler]
order: 8
---

İşte sizi sıfırdan kahramana götürecek hızlı bir kılavuz. Bu belge, aşağıdaki fikirlere yönelik bir kılavuz sunmaktadır:

* **Greenfield ve Programlanabilirlik kavramları**
* **Projenizi inşa etmek için gerekenleri anlayın**
* **Başlamak için kaynaklara erişim**

## Greenfield ve Programlanabilirlik Kavramları

### Greenfield 101

Greenfield Genel Bakışı `burada` okuyun.

### Standart Adres Formatı

Greenfield, `hesap` tanımını BSC ve Ethereum ile aynı formatta tanımlar. Anahtarlar için ECDSA secp256k1 eğrisi ile başlar ve [EIP84](https://github.com/ethereum/EIPs/issues/84) ile tam [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) yollarına uygundur.

### Hesap İşlemi

Bir greenfield hesabı oluşturun, **BNB yatırın** ve `token transferlerini` programlayın.

* [GO-SDK Örneği](https://github.com/bnb-chain/greenfield-go-sdk/blob/master/examples/basic.go)
* [JS-SDK Örneği](https://docs.bnbchain.org/greenfield-js-sdk/api/account)

### Veri depolama

Nesneleri yüklemek ve paylaşmak için bir genel kova oluşturun.

* `Greenfield CLI Örneği`
* `GO-SDK Örneği 1` ve [GO-SDK Örneği 2](https://github.com/bnb-chain/greenfield-go-sdk/blob/v1.1.1/examples/storage.go)
* [JS-SDK Kova API'si](https://docs.bnbchain.org/greenfield-js-sdk/api/bucket) ve [JS-SDK Nesne API'si](https://docs.bnbchain.org/greenfield-js-sdk/api/object)

### İzin kontrolü

Ayrıcalıkları belirli kişilerle paylaşmak için özel bir kova oluşturun.

:::tip
Bu bölümde ayrıcalıkları doğru şekilde yönetmek için en iyi uygulamaları göz önünde bulundurun.
:::

* `Greenfield CLI Örneği`
* [GO-SDK Örneği](https://github.com/bnb-chain/greenfield-go-sdk/blob/v1.1.1/examples/permission.go)
* [JS-SDK Örneği](https://docs.bnbchain.org/greenfield-js-sdk/api/bucket#putbucketpolicy-) ve [JS-SDK API'si](https://docs.bnbchain.org/greenfield-js-sdk/api/object#putobjectpolicy-)

### Gelişmiş izin kontrolü

- Bir grup oluşturun, üyeler ekleyin ve özel kovayı paylaşın.

	* [GO-SDK Örneği](https://github.com/bnb-chain/greenfield-go-sdk/blob/v1.1.1/examples/group.go)
	* [JS-SDK Grup API'si](https://docs.bnbchain.org/greenfield-js-sdk/api/group)

- Akıllı sözleşmeler ile kaynak yönetimi: `kaynak yansıtma` kavramlarını anlayın.

### Çapraz zincir Programlanabilirliği

- `programlanabilirlik kavramlarını` anlayın.
- Greenfield'dan EVM zincirlerine `ayna kaynaklarını` anlayın.
- Kaynağı `Akıllı Sözleşme aracılığıyla` programlayın.
- Akıllı Sözleşme SDK `kılavuzunu` takip edin.
- Gösterim: `Veri Pazar Yeri`

## Geliştirici Başlangıç Kiti

### API

- [Greenfield Zincir API Belgeleri](https://greenfield.bnbchain.org/openapi)
- [Greenfield SP API Belgeleri](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/docs/storage-provider-rest-api)

### SDK

- `Greenfield Go SDK`, daha fazla detay için [Go SDK Belgeleri](https://pkg.go.dev/github.com/bnb-chain/greenfield-go-sdk) referans alın.
- `Greenfield Javascript SDK`, daha fazla detay için [JS SDK Belgeleri](https://docs.bnbchain.org/greenfield-js-sdk/) referans alın.

## Kurulum

- `Anahtar yönetimi`
- Greenfield adresi arasında `Transfer`
- [Token köprüsü](https://dcellar.io/wallet)

### Geliştirici Kaynağı

- [Geliştirici Araçları](https://www.bnbchain.org/en/dev-tools?chain=greenfield)

- Veri kümesini [explorer](https://greenfieldscan.com/) veya [dcellar.io](https://dcellar.io/) ile keşfedin.

- `RPC listesi`

- [Paket servisi](https://docs.nodereal.io/docs/greenfield-bundle-service)

- [Web barındırma](https://docs.4everland.org/hositng/what-is-hosting/greenfield-hosting#id-4everland-greenfield-hosting)

- Veri Pazar Yeri ön şablonu
  	- [Frontend](https://github.com/bnb-chain/greenfield-data-marketplace-frontend)
    - [Akıllı Sözleşmeler](https://github.com/bnb-chain/greenfield-data-marketplace-contracts)

### Depolama geçidi

[https://dcellar.io/](https://dcellar.io/)