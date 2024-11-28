---
title: BSC Doğrulayıcıları için Anahtar Yönetimi
description: Bu belge, BNB Akıllı Zinciri (BSC) üzerinde doğrulayıcılar için anahtar yönetimi konusunda kapsamlı bilgiler sunmaktadır. Operatör, staking, konsensüs ve yönetişim oylama anahtarlarının nasıl kullanılacağını ve yönetileceğini açıklamaktadır.
keywords: [BSC, anahtar yönetimi, doğrulayıcılar, staking, yönetişim]
---

# BSC Doğrulayıcıları için Anahtar Yönetimi

[BEP-294](https://github.com/bnb-chain/BEPs/pull/294) ve [BEP-297](https://github.com/bnb-chain/BEPs/pull/297) BNB Akıllı Zinciri (BSC) için yerel staking ve yönetişim özelliklerini tanıtmaktadır. Bir doğrulayıcı için staking'e katıldığında (örneğin, bir doğrulayıcı oluşturmak, kendine delegasyon yapmak) ve yönetişimde, birkaç cüzdan anahtarı devreye girecektir. Doğrulayıcıların anahtarlarını ve fonlarını etkili ve güvenli bir şekilde yönetmelerine yardımcı olmak için aşağıdaki uygulamalar önerilmektedir.

## Operatör Anahtarı

Operatör anahtarı, bir doğrulayıcıyı işletmek için kullanılır; bu, bir doğrulayıcı oluşturmayı, bir doğrulayıcının bilgilerini düzenlemeyi ve delegasyon iptal etmeyi içerir. Bir doğrulayıcı oluştururken, operatör anahtarı ayrıca 2001 BNB'den fazla kendi delegasyonunu yapmak için de kullanılır. 

> **Dikkat:** Yeni BSC staking dApp ile etkileşimde bulunurken, operatör anahtarı genellikle devreye girer.

Operatör adresinin bir doğrulayıcı için değiştirilemeyeceğini unutmayın.

:::tip
**Öneri:** Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın; doğrulayıcı oluştururken, operatör hesabında 2001 BNB'den fazla olmalıdır.
:::

## Staking Anahtarı

Bir doğrulayıcı, gerekirse delegasyonunu yönetmek için operatör anahtarından farklı bir anahtar da kullanabilir. Bu durumda, böyle bir staking anahtarı, farklı doğrulayıcılara delegasyon yapmak/iptal etmek/yeni delegasyon yapmak ve ödülleri talep etmek için kullanılacaktır. 

:::info
Bu anahtar, bir doğrulayıcının delegasyonlarını ve ödüllerini nasıl yönettiğine bağlı olarak sıklıkla kullanılabilir. Bu anahtarın zorunlu olmadığını, bir doğrulayıcının ihtiyaçlarına bağlı olduğunu unutmayın.
:::

**Öneri:** Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın.

## Konsensüs Anahtarı

Konsensüs anahtarı, blokları madencilik yaparken önerilen blokları imzalamak için kullanılır. Bu hesap için fon gerekmemektedir.

:::note
**Öneri:** Kolayca bir doğrulayıcı düğümü tarafından erişilebilmesi için bir sıcak cüzdan kullanın.
:::

## Hızlı Nihai Oylama Anahtarı

Hızlı nihai oylama anahtarı (BLS oylama anahtarı), [hızlı nihai özellik](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md) kapsamında yeni madencilik yapılmış blokların oylarını imzalamak için kullanılır. Bu hesap için fon gerekmemektedir.

> **Not:** Kolayca bir doğrulayıcı düğümü tarafından erişilebilmesi için bir sıcak cüzdan kullanın.

## Yönetişim Oylama Anahtarı

[BEP-297](https://github.com/bnb-chain/BEPs/pull/297) yerel BSC staking özelliğini tanıtmaktadır. Bir delegatör (kendine delegasyon yapan doğrulayıcılar da dahil) başkalarını, kendi adına yönetişime katılmaları için delege edebilir. 

Yönetişim delegasyonu olduğunda, yönetişim oylama anahtarı BSC önerilerine oy vermek için kullanılacaktır. 

> **Önemli:** İlgili cüzdanın, oylama işlemi için gaz ücretlerini karşılayacak kadar BNB saklaması gerekmektedir.

:::warning
Bu anahtarın zorunlu olmadığını, bir doğrulayıcının ihtiyaçlarına bağlı olduğunu unutmayın.
:::

**Öneri:** Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın.