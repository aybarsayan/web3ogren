---
title: "Oyun Alanları"
description: Oyun alanları, Deno Deploy ile küçük projeler oluşturmanın kolay bir yolunu sunar. Kullanıcılar, kodlarını yazarak ve tarayıcı içinde çalıştırarak çıktıları anında görebilirler.
keywords: [Deno Deploy, oyun alanı, JavaScript, proje yönetimi, GitHub entegrasyonu, kod düzenleme, yazılım geliştirme]
---

**Oyun alanları**, Deno Deploy ile oynayabileceğiniz ve küçük projeler oluşturabileceğiniz kolay bir yoldur. Oyun alanlarını kullanarak kod yazabilir, çalıştırabilir ve çıktıyı tamamen tarayıcı içinde görebilirsiniz.

Oyun alanları, Deno Deploy'un tam gücüne sahiptir: normal bir proje ile aynı özellikleri destekler, bunlar arasında ortam değişkenleri, özel alan adları ve günlükler bulunmaktadır. 

> Oyun alanları, Deno Deploy'deki diğer tüm projeler kadar etkilidir: "kodunuzu kullanıcılara mümkün olan en yakın şekilde çalıştırmak için küresel ağımızı tam olarak kullanır." — Deno Deploy

- `Bir oyun alanı oluşturma`
- `Oyun alanı editörünü kullanma`
- `Bir oyun alanını kamuya açma`
- `Bir oyun alanını GitHub'a aktarma`

---

## Bir oyun alanı oluşturma

Yeni bir oyun alanı oluşturmak için [proje genel bakış sayfası](https://dash.deno.com/projects) sağ üst köşedeki **Yeni Oyun Alanı** butonuna basın.

Bu, rastgele üretilmiş bir isim ile yeni bir oyun alanı oluşturacaktır. **Bu ismi daha sonra proje ayarlarında değiştirebilirsiniz.**

---

## Oyun alanı editörünü kullanma

Oyun alanı editörü, yeni bir oyun alanı oluşturduğunuzda otomatik olarak açılır. Ayrıca, projenizin genel bakış sayfasına giderek **Düzenle** butonuna tıklayarak da açabilirsiniz.

### Editör Yapısı

Editör, iki ana alandan oluşmaktadır:
- **Sol taraf:** Kodunuzu yazdığınız alan
- **Sağ taraf:** Önizleme paneli, kodunuzun çıktısını tarayıcı penceresi aracılığıyla görebildiğiniz yerdir.

:::tip
Kodunuzu düzenledikten sonra, sağdaki önizlemenin güncellenmesi için kaydetmeniz ve dağıtmanız gerekir.
:::

Bunu, sağ üst köşedeki **Kaydet ve Dağıt** butonuna tıklayarak veya Ctrl + S tuşlarına basarak yapabilirsiniz.

---

## Bir oyun alanını kamuya açma

Oyun alanları, **kamuya açarak diğer kullanıcılarla paylaşılabilir.** Bu, herkesin oyun alanını ve önizlemesini görüntüleyebileceği anlamına gelir. 

Kamuya açık oyun alanları, kimse tarafından düzenlenemez: yalnızca siz düzenleyebilirsiniz. 

### Paylaşma İşlemi

Bir oyun alanını kamuya açmak için editörün üst araç çubuğundaki **Paylaş** butonuna basın. Oyun alanınızın URL'si otomatik olarak panonuza kopyalanacaktır.

**Ayrıca, Deno Deploy kontrol panelindeki oyun alanı ayarları sayfasından oyun alanının görünürlüğünü değiştirebilirsiniz.** 

---

## Bir oyun alanını GitHub'a aktarma

Oyun alanları GitHub'a aktarılarak dışa aktarılabilir. Bu, projeniz oyun alanı editörünün tek dosya sınırını aşmaya başladığında faydalıdır.

> **Bu işlem, oyun alanı kodunu içeren yeni bir GitHub deposu oluşturacaktır.** — Deno Deploy

Bir oyun alanını dışa aktardıktan sonra, bu proje için Deno Deploy oyun alanı editörünü kullanamazsınız. Bu tek yönlü bir işlem olarak çalışır.

Oyun alanını dışa aktarmak için, Deno Deploy kontrol panelindeki oyun alanı ayarları sayfasına gidin veya komut paletinden **Dağıt: GitHub'a Aktar** seçeneğini seçin (editörde F1 tuşuna basarak).


Yeni GitHub Deposunun Oluşturulması
Yeni GitHub deposu, kişisel hesabınızda oluşturulacak ve özel olarak ayarlanacaktır. Bu ayarları daha sonra GitHub depo ayarlarında değiştirebilirsiniz.


Oyun alanını GitHub'a aktarmak için **Dışa Aktar** butonuna basın.