---
title: opBNB Ölçümleri - opBNB Temel Kavramları
description: opBNB, diğer Ethereum L2 çözümlerine göre daha düşük gaz ücretleri ve yüksek blok gaz limitleri sunarak ağ tıkanıklığı sorunları için optimize edilmiş bir çözüm sağlar. Bu belge, opBNB'nin temel özelliklerini ve metriklerini diğer protokollerle karşılaştıran ayrıntılı bilgiler sunmaktadır.
keywords: [opBNB, Ethereum, gaz ücretleri, blok limiti, DeFi, Layer 2, BNB]
---

# opBNB Ölçümleri

**OP Mainnet** ve **Arbitrum** gibi Ethereum üzerindeki diğer L2 çözümleri ile karşılaştırıldığında, **opBNB** daha düşük gaz ücreti ve daha yüksek blok gaz limiti sunar; bu, Layer 2'nin trafiği arttığında gaz ücretinin daha istikrarlı olacağı anlamına gelir. Referans olarak Ethereum EIP-1559 parametrelerini listeledim. Arbitrum gaz mekanizması ArbOS'a dayanmaktadır, bu burada geçerli değildir.

**Gaz Parametresi Farklılıkları**

| **Parametre**                          | **opBNB değeri**     | **Optimism değeri** |
|----------------------------------------|----------------------|---------------------|
| Blok gaz limiti                        | **100.000.000 gaz**  | 30.000.000 gaz      |
| Blok gaz hedefi                       | **50.000.000 gaz**   | 5.000.000 gaz       |
| EIP-1559 elastikiyet çarpanı          | 2                    | 6                   |
| EIP-1559 paydası                       | 8                    | 50                  |
| Maksimum temel ücret artışı (blok başına) | 12.5%              | 10%                 |
| Maksimum temel ücret düşüşü (blok başına) | 12.5%              | 2%                  |

:::info
opBNB'nin gaz parametreleri, ağ üzerindeki işlem yoğunluğuna göre daha öngörülebilir bir maliyet yapısı sunar.
:::

**Metrik Farklılıkları**

|                        | **opBNB**             | **Optimism** | **Arbitrum** |
|------------------------|-----------------------|--------------|--------------|
| **Gaz Token**          | BNB                   | ETH          | ETH          |
| **VM**                 | EVM                   | EVM          | EVM          |
| **Gaz Ücreti**         | **$0.001**            | $0.05        | $0.1         |
| **Blok Gaz Limiti**    | **100M(150M 2024Q1)** | 30M          | 32M          |
| **Blok süresi**        | **1s**                | 2s           | 0.25s(Min)   |
| **Çekme/ Kesinlik**    | 7 gün                 | 7 gün        | 7 gün        |
| **TPS (Transfer)**     | **4500+**             | 700+         | 4000+        |

:::tip
Referans dokümanları üzerinden daha fazla bilgiye ulaşarak opBNB'nin özelliklerini daha iyi anlayabilirsiniz.
:::

OP Yığını bazı küçük farklılıklar içerir, opBNB de öyle. Burada farkları referansınız için listeledim, ayrıntılar için [OP Yığını belgeleri](https://stack.optimism.io/docs/releases/bedrock/differences/#opcode-differences) sayfasına başvurabilirsiniz.

Amacımız, DeFi, NFT'ler ve oyun gibi BSC üzerindeki çok aktif uygulamalar için ağ tıkanıklığı problemleri için bir ölçekleme çözümü sağlamaktır. opBNB, OP Yığını'na dayanır ve madencilik sürecinin ve önbellek verisi erişiminin optimizasyonları ile saniyede 100M gaz kapasitesine ulaşmayı hedefler, bu BSC'den çok daha yüksektir.

|                      | **opBNB**  | **BSC**                                             | **Ethereum** |
|----------------------|------------|-----------------------------------------------------|--------------|
| **Gaz Token**        | BNB        | BNB                                                 | ETH          |
| **VM**               | EVM        | EVM                                                 | EVM          |
| **Gaz Fiyat Modeli** | EIP-1559   | [Gaz Fiyatı Müzayedesi](https://bscscan.com/gastracker) | EIP-1559     |
| **Blok Gaz Limiti**  | **100M**   | [140M](https://www.bscscan.com/chart/gaslimit)      | 30M          |
| **Blok süresi**      | **1s**     | 3s                                                  | 12s          |
| **İşlem Maliyeti**   | **$0.001** | $0.03                                               | $1           |

> *opBNB ve OP Mainnet'in sabit blok sürelerine sahip olmasının aksine, Arbitrum'un blok süresi, bir blok içindeki işlem sayısına ve gazına bağlı olarak değişkendir. Bir blok ne kadar fazla işlem ve gaz içerirse, madenciliği o kadar uzun sürer. Arbitrum'daki minimum blok süresi 0.25 saniyedir, bu da en hızlı blokun bir çeyrek saniyede madenciliğinin yapılabileceği anlamına gelir.* — opBNB Teknik Dokümantasyonu