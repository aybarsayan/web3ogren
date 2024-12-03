---
title: Ödeme Kanalları
seoTitle: Ödeme Kanalları Asenkron XRP İstekleri
sidebar_position: 4
description: Ödeme Kanalları, asenkron XRP ödemelerini hızlı ve etkili bir şekilde göndermek için kullanılan bir yöntemdir. Bu doküman, ödeme kanallarının işleyişini ve kullanımını detaylandırmaktadır.
tags: 
  - Ödeme Kanalları
  - XRP
  - asenkron ödemeler
  - dijital ürünler
  - blockchain
keywords: 
  - Ödeme Kanalları
  - XRP
  - asenkron ödemeler
  - dijital ürünler
  - blockchain
---

## Ödeme Kanalları

Ödeme Kanalları, "asenkron" XRP ödemelerini göndermek için bir ileri düzey özelliktir; bu ödemeler çok küçük parçalara bölünebilir ve daha sonra çözümlenebilir.

Bir ödeme kanalı için **XRP geçici olarak ayrılır**. Gönderen, kanala karşı _Talepler_ oluşturur; bu talepler, alıcı tarafından herhangi bir XRP Ledger işlemi göndermeden veya yeni bir defter sürümünün `konsensüs` tarafından onaylanmasını beklemeden doğrulanır. (Bu, tipik olarak konsensüs ile işlemlerin onaylanması sürecinden ayrı gerçekleştiği için _asenkron_ bir süreçtir.) Alıcı, herhangi bir zamanda bir Talebi _itleyerek_ o Talep tarafından yetkilendirilmiş bir XRP miktarını alabilir. Bu şekilde bir Talebi çözmek, normal konsensüs sürecinin bir parçası olarak standart bir XRP Ledger işlemi kullanır. Bu tek işlem, daha küçük Taleplerin garantilediği herhangi bir sayıda işlemi kapsayabilir.

> Talepler bireysel olarak doğrulanabilir, ancak daha sonra toplu olarak çözümlenebilir; bu nedenle ödeme kanalları, işlemlerin yalnızca katılımcıların bu Taleplerin dijital imzalarını oluşturma ve doğrulama yeteneği ile sınırlı bir hızda gerçekleştirilmesini sağlar.  
> — Ödeme Kanalları

Bu limit esasen katılımcıların donanım hızına ve imza algoritmalarının karmaşıklığına bağlıdır. **Maksimum hız** için, XRP Ledger'ın varsayılan secp256k1 ECDSA imzalarından daha hızlı olan Ed25519 imzalarını kullanın. Araştırmalar, [2011 yılında ticari donanımda saniyede 100.000'den fazla Ed25519 imzası oluşturma ve 70.000'den fazla doğrulama yeteneğini göstermiştir](https://ed25519.cr.yp.to/ed25519-20110926.pdf).

---

## Neden Ödeme Kanalları Kullanılır

Ödeme kanalı kullanma süreci her zaman bir ödeyici ve bir alıcı olmak üzere iki tarafı içerir. **Ödeyici**, XRP Ledger'ı kullanan bir birey veya kuruluştur ve alıcının müşterisidir. Alıcı, ürün veya hizmetler için XRP alan bir kişi veya işletmedir.

Ödeme Kanalları, ne alıp satabileceğiniz hakkında hiçbir şey belirtmez. Ancak, ödeme kanallarına uygun olan ürün ve hizmet türleri şunlardır:

- Anında iletilebilecek şeyler, örneğin dijital ürünler
- İşlem maliyetinin, fiyatın önemli bir kısmını oluşturduğu düşük maliyetli şeyler
- Tam olarak istenen miktarın önceden bilinmediği toplu olarak satın alınan şeyler

---

## Ödeme Kanalı Yaşam Döngüsü

Aşağıdaki diyagram, bir ödeme kanalının yaşam döngüsünü özetlemektedir:

---

## Ayrıca Bakınız

- **İlgili Kavramlar:**
    - `İpotek`, daha yüksek değerli, daha düşük hızlı koşullu XRP ödemeleri için benzer bir özellik.
- **Kılavuzlar ve Kullanım Örnekleri:**
    - `Ödeme Kanallarını Kullan`, bir ödeme kanalı kullanma sürecini adım adım anlatan bir kılavuz.
    - `Bir Ara-Borsa Ağı Oluşturmak İçin Ödeme Kanalı Açın`
- **Referanslar:**
    - [channel_authorize method][]
    - [channel_verify method][]
    - `PayChannel nesnesi`
    - [PaymentChannelClaim işlemi][]
    - [PaymentChannelCreate işlemi][]
    - [PaymentChannelFund işlemi][]

