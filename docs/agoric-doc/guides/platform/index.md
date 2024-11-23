---
title: Agoric Platform
---

# Agoric Platform



Bu doküman, Zoe ve ERTP'nin altında yer alan katmanlara odaklanmaktadır; biz buna Agoric Platformu diyoruz. Bu platform, dağıtılmış bir JavaScript ortamı sağlayan ve "SwingSet" olarak adlandırılan sanal makinemizi içerir, ayrıca Cosmos SDK ve IBC'yi de kapsar.

## SwingSet

Tek bir blockchain üzerinde veya birden fazla kullanıcının bulunduğu tek bir makine üzerinde, bir kullanıcının diğer bir kullanıcının kodunu çalıştırmasını engelleyemediğinden emin olmak çok önemlidir ve kodların birbiriyle nasıl iç içe geçtiği, yeniden giriş gibi tehlikelere yol açmamalıdır. SwingSet, yürütme ortamını _vat_ olarak adlandırılan birimlere ayırarak bu problemi çözer. Bir , _eşzamanlılık birimi_dir. Bu, bir JavaScript vat içinde nesnelerin ve fonksiyonların birbirleriyle eşzamanlı olarak iletişim kurabileceği anlamına gelir. Vatlar arasında ise, nesneler ve fonksiyonlar tasarımı gereği asenkron bir şekilde iletişim kurar.

Bir fiziksel makine bir veya daha fazla vat çalıştırabilir. Bir blockchain, bir veya daha fazla iletişimde bulunan vat çalıştırabilir.

Bir vatın iç durumu, vat kapatıldığı zaman geri yüklenebilmesi için kalıcı bir bellek içinde saklanabilir. Bu, vatın kapatılıp daha sonra (aynı veya farklı bir fiziksel makinede) saklanan durumun yüklenmesiyle yeniden açılabileceği anlamına gelir.

Bir SwingSet örneği, sağladığı vatlar ve dış dünya arasındaki iletişimi de yönetir. Bir blockchain üzerinde bu, çıkış kutusu olarak hizmet verecek şekilde duruma yazmak anlamına gelir. Blockchain olmayan bir makinede ise, uzaktaki bir makineye mesaj gönderme anlamına gelebilir.

SwingSet,  sağlar.

## Cosmos SDK

Test ağımızda, Cosmos SDK'nın üzerinde çalışan birden fazla vat içeren tek bir SwingSet örneği var. SwingSet ve çoğu kodumuz JavaScript ile yazılmıştır, bu nedenle mevcut JavaScript ortamını başlatan, bir SwingSet örneği başlatan ve ardından Go üzerinden Cosmos SDK modüllerine, Tendermint'teki konsensüs algoritmasına ve tekrar geri bağlanan karmaşık bir sürecimiz var.

## Dinamik IBC

IBC,  protokolüdür. IBC, mesajların bir blockchain'den diğerine, aradaki aracılar kullanılarak gönderilmesine olanak tanır.

Dinamik IBC (dIBC), yeni bir protokolü bir platform yükseltmesi veya zincir yönetişi oylaması gerektirmeden yayma sorununa bir çözümdür.

Özünde, dIBC, mevcut bir zincir üzerinde yeni protokolleri destekleyen yeni sözleşmeleri dağıtmak için bir akıllı sözleşme veya sanal makine platformu kullanma fikridir; bu süreç, zincir yükseltmelerini beklemeden gerçekleşir.

Daha fazla bilgi için .

## Tendermint

Tendermint, blokların nasıl onaylandığını ve oluşturulduğunu tanımlayan bir konsensüs motorudur. Etkili bir şekilde, Tendermint blockchain'in tanımlandığı en düşük seviye katmandır.