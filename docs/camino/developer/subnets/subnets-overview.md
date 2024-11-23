---
sidebar_position: 1
title: Alt Ağı Özeti
---

# Alt Ağı Özeti

**Alt Ağ** (Subnet), bir veya birden fazla blok zincirinin durumunda konsensüs sağlamak amacıyla birlikte çalışan Camino doğrulayıcılarının dinamik bir alt kümesidir. Her blok zinciri tam olarak bir Alt Ağ tarafından doğrulanır. Bir Alt Ağ, birçok blok zincirini doğrulayabilir ve üye kabulü ve token ekonomisi ile ilgili kendi kurallarını belirleyebilir. Bir doğrulayıcı birçok Alt Ağ'ın üyesi olabilir.

Camino'nun üç yerleşik blok zinciri: Değişim Zinciri (X-Chain), Platform Zinciri (P-Chain) ve Sözleşme Zinciri (C-Chain), özel bir Alt Ağ'ı oluşturan tüm Camino doğrulayıcıları tarafından doğrulanır ve güvence altına alınır ve "Ana Ağ" olarak adlandırılır.



Alt Ağlar bağımsızdır ve diğer Alt Ağlar ya da Ana Ağ ile yürütme işlemi, depolama veya ağ paylaşımında bulunmaz; bu da ağın daha kolay ölçeklenmesine olanak tanırken, daha düşük gecikme süresi, daha yüksek işlem sayısı (TPS) ve daha düşük işlem maliyetleri sağlar.

Alt Ağlar, bazı Camino doğrulayıcılarının güvence altına aldığı etkili bir 'Blockchain-as-a-Service' (Blockchain Hizmeti Olarak) modelidir.

## Avantajlar

Bir Alt Ağ, kendi üye kayıtlarını yönetir ve kendi kurallarını oluşturabilir; dolayısıyla, bileşen doğrulayıcılarının belirli özelliklere sahip olmasını talep edebilir. Bu çok yararlıdır ve aşağıda daha derinlemesine sonuçlarını ele alacağız:

### Uyum

Camino'nun Alt Ağ mimarisi, düzenleyici uyumu yönetilebilir hale getirir. Yukarıda belirtildiği gibi, bir Alt Ağ, doğrulayıcıların belirli gereklilikleri karşılamasını talep edebilir.

Gerekliliklere örnekler şunları içerebilir:

- Doğrulayıcılar belirli bir ülkede bulunmalıdır
- Doğrulayıcılar KYC/AML kontrollerini geçmelidir
- Doğrulayıcılar belirli bir lisansa sahip olmalıdır

### Özel Blok Zincirlerine Destek

Sadece belirli ön tanımlı doğrulayıcıların katılabileceği bir Alt Ağ oluşturabilirsiniz ve blok zincirinin içerikleri yalnızca o doğrulayıcılara görünür olacak şekilde özel bir Alt Ağ yaratabilirsiniz. Bu, bilgilerini gizli tutmak isteyen organizasyonlar için idealdir.

### Endişelerin Ayrılması

Heterojen bir blok zinciri ağında, bazı doğrulayıcılar belirli blok zincirlerini doğrulamak istemeyeceklerdir çünkü bu blok zincirlerine karşı ilgileri yoktur. Alt Ağ modeli, doğrulayıcıların yalnızca ilgilendikleri blok zincirleri ile ilgili olmalarına olanak tanır. Bu, doğrulayıcılar üzerindeki yükü azaltır.

### Uygulama-Özgü Gereklilikler

Farklı blok zincirine dayalı uygulamalar, doğrulayıcıların belirli özelliklere sahip olmasını gerektirebilir. Diyelim ki, büyük miktarda RAM veya CPU gücü gerektiren bir uygulama var. Bir Alt Ağ, doğrulayıcıların belirli  karşılamasını talep edebilir, böylece uygulama yavaş doğrulayıcılar nedeniyle düşük performans göstermez.

## Doğrulayıcılar

Camino doğrulayıcıları, Alt Ağ sahipleri tarafından kendi Alt Ağlarını doğrulamaları için teşvik edilir. Teşvik her Alt Ağ tarafından özelleştirilebilir. Doğrulayıcıların, bir Alt Ağ'a katılmadan önce güvenlik ve kaynak endişelerini dikkate alması gerekir.