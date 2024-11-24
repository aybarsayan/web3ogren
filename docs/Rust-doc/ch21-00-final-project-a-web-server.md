# Final Proje: Çoklu İletim Erişimi Olan Bir Web Sunucusu

Uzun bir yolculuktu, ama kitabın sonuna ulaştık. Bu bölümde, son bölümlerde ele aldığımız bazı kavramları göstermek ve daha önceki dersleri gözden geçirmek amacıyla bir proje daha birlikte inşa edeceğiz.

**Son projemiz için**, "merhaba" diyen ve bir web tarayıcısında **Şekil 20-1** gibi görünen bir web sunucusu yapacağız.

![rust'tan merhaba](images/rust/img/trpl20-01.png)

Şekil 20-1: Son paylaşılan projemiz

Web sunucusunu inşa etmek için planımız şöyle:

1. TCP ve HTTP hakkında biraz bilgi edinmek.
2. Bir sokette TCP bağlantılarını dinlemek.
3. Az sayıda HTTP isteğini analiz etmek.
4. Uygun bir HTTP yanıtı oluşturmak.
5. Sunucumuzun verimliliğini bir iş parçacığı havuzu ile artırmak.

---

:::info
**Başlamadan önce, iki detayı belirtmeliyiz:**
:::

İlk olarak, kullanacağımız yöntem, Rust ile bir web sunucusu inşa etmenin en iyi yolu olmayacak. Topluluk üyeleri, [crates.io](https://crates.io/) adresinde daha tamamlayıcı web sunucusu ve iş parçacığı havuzu uygulamaları sunan bir dizi üretime hazır crate yayımladılar. Ancak, bu bölümdeki amacımız öğrenmenize yardımcı olmaktır, kolay bir yolu seçmek değil. Rust, bir sistem programlama dili olduğu için, çalışmak istediğimiz soyutlama düzeyini seçebiliriz ve diğer dillerde mümkün veya pratik olanın altındaki bir seviyeye geçebiliriz.

İkinci olarak, burada async ve await kullanmayacağız. Bir iş parçacığı havuzu inşa etmek başlı başına yeterince büyük bir zorluktur, async çalışma zamanı eklemeden! Ancak, bu bölümde göreceğimiz bazı sorunlara async ve await'in nasıl uygulanabileceğini belirteceğiz. **Sonuçta**, Bölüm 17'de belirttiğimiz gibi, birçok async çalışma zamanı, işlerini yönetmek için iş parçacığı havuzları kullanır.

:::tip
**Bu nedenle**, size gelecekte kullanabileceğiniz crate'lerin arkasındaki genel fikirleri ve teknikleri öğrenebilmeniz için temel HTTP sunucusunu ve iş parçacığı havuzunu manuel olarak yazacağız.
:::