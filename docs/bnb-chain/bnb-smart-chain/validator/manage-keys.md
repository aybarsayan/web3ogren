---
title: BSC Doğrulayıcıları için Anahtar Yönetimi - BNB Akıllı Zinciri
description: BSC Doğrulayıcılarının anahtar yönetimi süreçlerini ve önerilen yöntemleri detaylandıran bir rehber. Operatör, staking, konsensüs, hızlı nihai oylama ve yönetişim anahtarlarının kullanımı hakkında bilgi verilmektedir.
keywords: [BSC, Doğrulayıcılar, Anahtar Yönetimi, staking, yönetişim, BNB, BEP-294, BEP-297]
---

# BSC Doğrulayıcıları için Anahtar Yönetimi

[BEP-294](https://github.com/bnb-chain/BEPs/pull/294) ve [BEP-297](https://github.com/bnb-chain/BEPs/pull/297) BNB Akıllı Zinciri (BSC) için yerel staking ve yönetişim özelliklerini tanıtmaktadır. Bir doğrulayıcı için staking'e katılırken (örneğin, bir doğrulayıcı oluşturmak, kendini delegasyona almak) ve yönetişimde, birkaç cüzdan anahtarı meydana gelecektir. Doğrulayıcıların anahtarlarını ve fonlarını etkili ve güvenli bir şekilde yönetmelerine yardımcı olmak için aşağıdaki uygulamalar önerilmektedir.

## Operatör Anahtarı

Operatör anahtarı, bir doğrulayıcıyı işletmek için kullanılır; bu, bir doğrulayıcı oluşturma, doğrulayıcı bilgilerini düzenleme ve delegasyondan çıkma işlemlerini içerir. Bir doğrulayıcı oluştururken, operatör anahtarı 2001'den fazla BNB ile kendini delegasyona almak için de kullanılır. Yeni BSC staking dApp'i ile etkileşimde bulunurken, operatör anahtarı genellikle kullanılır.

> **Not:** Operatör adresinin bir doğrulayıcı için değiştirilemeyeceğini unutmayın.  
> — BSC Anahtar Yönetimi Ekibi

**Öneri:** 
:::tip
Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın. Yeni bir doğrulayıcı oluşturduğunuzda, operatör hesabında 2001'den fazla BNB olmalıdır.
:::

## Staking Anahtarı

Bir doğrulayıcı, delegasyonunu yönetmek için ihtiyaç duyulursa operatör anahtarından farklı başka bir anahtar da kullanabilir. Bu durumda, böyle bir staking anahtarı farklı doğrulayıcılara delegasyona almak, delegasyondan çıkmak/yeni delegasyona almak için kullanılacak ve ödülleri talep edecektir. Bu anahtar, bir doğrulayıcının delegasyonlarını ve ödüllerini nasıl yönettiğine bağlı olarak sıklıkla kullanılabilir.

> **Önemli:** Bu anahtar isteğe bağlıdır ve bir doğrulayıcının ihtiyaçlarına bağlı olarak kullanılır.  
> — BSC Staking Rehberi

**Öneri:** 
:::tip
Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın.
:::

## Konsensüs Anahtarı

Konsensüs anahtarı, blokları madencilik yaparken önerilen blokları imzalamak için kullanılır. Bu hesap için herhangi bir fon gereklidir.

**Öneri:** 
:::tip
Bir sıcak cüzdan kullanın, böylece bir doğrulayıcı düğümü tarafından kolayca erişilebilir.
:::

## Hızlı Nihai Oylama Anahtarı

Hızlı nihai oylama anahtarı (BLS oylama anahtarı), yakın zamanda madencilik yapılmış blokların oylarını imzalamak için [hızlı nihai özellikte](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP126.md) kullanılır. Bu hesap için herhangi bir fon gereklidir.

**Öneri:** 
:::tip
Bir sıcak cüzdan kullanın, böylece bir doğrulayıcı düğümü tarafından kolayca erişilebilir.
:::

## Yönetişim Oylama Anahtarı

[BEP-297](https://github.com/bnb-chain/BEPs/pull/297) yerel BSC staking özelliğini tanıtmaktadır. Bir delegatör (kendini delegasyona alan doğrulayıcılar dahil) biri adına yönetişime katılması için bir başka kişiyi delegasyona alabilir. Yönetişim delegasyonu olduğunda, yönetişim oylama anahtarı BSC tekliflerindeki oylara katılmak için kullanılacaktır. İlgili cüzdan, oylama işleminin gaz ücretleri için biraz BNB depolamalıdır.

> **Hatırlatma:** Bu anahtar isteğe bağlıdır ve bir doğrulayıcının ihtiyaçlarına bağlı olarak kullanılmalıdır.  
> — BSC Yönetişim Takımı

**Öneri:** 
:::tip
Bir donanım cüzdanı, bir Safe cüzdan veya bir MPC cüzdan kullanın.
:::