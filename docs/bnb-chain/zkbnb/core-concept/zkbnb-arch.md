---
title: zkBNB Mimarisi - zkBNB
description: zkBNB, basit token işlemlerine odaklanarak BNB Akıllı Zinciri için ölçeklenebilirlik sunan bir sıfır bilgi çözümüdür. Bu içerik, zk-Rollup mimarisinin nasıl çalıştığını ve işlem güvenliğini ele almaktadır. 
keywords: [zkBNB, sıfır bilgi, ölçeklenebilirlik, L2, BNB Akıllı Zinciri, zk-Rollup]
---

# zkBNB Mimarisi

zkBNB, basit token işlemlerine ve Oyun ile Sosyal kullanım senaryoları için yerleşik pazar yerlerine odaklanan bir sıfır bilgi ölçeklenebilirlik çözümüdür veya L2 olarak bilinir. Birden fazla işlemi tek bir işlemde birleştirerek, on-chain işlemler için maliyetleri azaltarak BNB Akıllı Zinciri için bir ölçeklenebilirlik çözümü olarak hizmet eder. zkBNB'de kullanılan Sıfır Bilgi kanıt sistemi, L2 işlemlerinin çok daha hızlı bir kesinlik süresi sağlamasını ve böylece kullanıcı deneyimini iyileştirmesini sağlar. zkBNB esasen zk-Rollup mimarisine dayanır.

## zk-Rollup Mimarisi

![Framework](../../images/bnb-chain/zkbnb/static/Frame_work.png)

- **Taahhüt eden**. Taahhüt eden, işlemleri yürütür ve ardışık bloklar üretir.
- **İzleyici**. İzleyici, BSC üzerindeki olayları izler ve bunları zkBNB üzerindeki **işlemlere** dönüştürür.
- **Tanık**. Tanık, blok içindeki işlemleri yeniden yürütür ve tanık malzemeleri üretir.
- **Kanıtlayıcı**. Kanıtlayıcı, tanık malzemelerine dayanarak kriptografik kanıtlar üretir.
- **Gönderen**. Gönderen, sıkıştırılmış L2 bloklarını L1'e toplar ve bunu doğrulamak için kanıt sunar.
- **Api sunucusu**. Api sunucusu, çoğu kullanıcı için erişim uç noktalarıdır, dijital varlıklar, bloklar, işlemler, gaz ücretleri dahil zengin veriler sağlar.
- **Kurtarma**. PostgreSQL'deki durum dünyasına dayalı olarak kv-rocks'da seyrek merkle ağacını kurtarmak için bir araçtır.

## Maksimum verimlilik

Bekleyen kıyaslama...

## Veri Erişilebilirliği

zkBNB, BSC üzerinde işlenen her işlem için durum verilerini yayınlar. Bu veriler ile bireylerin veya işletmelerin, rollup’ın durumunu yeniden üretmeleri ve zinciri kendilerinin doğrulamaları mümkündür. BSC, bu verileri ağın tüm katılımcılarına çağrı verisi olarak sunar.

> "zkBNB'nin on-chain üzerinde çok fazla işlem verisi yayınlamasına gerek yoktur çünkü geçerlilik kanıtları zaten durum geçişlerinin otantik olduğunu doğrular."  
> — zkBNB Belgesi

Ancak, verilerin on-chain'de depolanması hala önemlidir çünkü bu, L2 zincirinin durumunun izinsiz, bağımsız doğrulanmasını sağlar; bu da herkesin işlem gruplarını sunmasına izin verir, kötü niyetli taahhüt edenlerin zinciri sansürleme veya dondurma olasılığını önler.

zkBNB, bu çağrı verilerine dayanarak Layer2 üzerinde tüm durumu yeniden oynamak için bir varsayılan istemci sağlayacaktır.

## İşlem Kesinliği

BSC, zkBNB için bir uzlaşma katmanı olarak işlev görür: L2 işlemleri yalnızca L1 sözleşmesi geçerlilik kanıtını kabul edip tx'leri yürüttüğünde kesinleşir. Bu, kötü niyetli operatörlerin zinciri bozma riskini ortadan kaldırır (örneğin, rollup fonlarını çalma) çünkü her işlem ana ağda onaylanmak zorundadır. Ayrıca, BSC, kullanıcı işlemlerinin L1'de kesinleştirildiğinde geri alınamayacağını garanti eder.

zkBNB, 10 dakika içinde oldukça hızlı bir kesinlik hızı sağlar.

## Anlık onay ZkBS

Kesinlik süresi 10 dakika olmasına rağmen, bu ağın kullanılabilirliğini etkilemez. Durum geçişi, blok zkBNB üzerinde önerildiği anda hemen gerçekleşir. Rollup işlemleri, çoğu kullanıcı için tamamen şeffaftır; kullanıcılar beklemeden daha fazla transfer yapabilirler.

## Sansür direnci

Taahhüt eden, işlemleri gerçekleştirecek ve gruplar üretecektir. Bu verimliliği sağlasa da, sansür riskini artırır: kötü niyetli zk-rollup taahhüt eden, kullanıcıların işlemlerini gruplara dahil etmemeyi reddederek sansürleyebilir.

:::warning
Bir güvenlik önlemi olarak, zkBNB, kullanıcıların, operatör tarafından sansürlendiklerini düşündüklerinde işlemleri doğrudan ana ağdaki rollup sözleşmesine sunmalarına izin verir.
:::

Bu, kullanıcıların taahhüt edenin iznine ihtiyaç duymadan zk-rollup'tan BSC'ye zorla çıkış yapmalarını sağlar.