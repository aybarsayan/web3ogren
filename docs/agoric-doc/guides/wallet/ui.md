---
title: Cüzdan Arayüzü
---

# Cüzdan Arayüzü

Bir shell penceresinden `agoric open` komutunu çalıştırarak Cüzdan Arayüzü'nü bir tarayıcı sekmesinde açabilirsiniz.

Cüzdan, Agoric ekosisteminde birkaç temel kullanıcı etkileşimini kolaylaştırmaktadır; bu etkileşimler aşağıdaki bölümlerde açıklanmaktadır.

## Dapps

Bir dapp ile etkileşimde bulunabilmek için öncelikle cüzdanda bağlantı kurulması gerekir. Dapp, https://wallet.agoric.app/locator/ adresinde kayıtlı olan cüzdan örneğine bağlanmaya çalışacaktır.

Dapp, tekliflerde bulunabilmeden önce cüzdan tarafından bağlantının kabul edilmesi gerekmektedir. Gelen dapp bağlantıları, Dashboard görünümünden yönetilebilir:



Kabul edildikten sonra, Dapps görünümünden görüntülenebilir ve yönetilebilir:



Petname, dapp'i kişisel olarak tanımlamak için kullanılan bir string olup, benzersiz olmalıdır. İstenildiği gibi metin alanı ile değiştirilebilir. Bu, bir cep telefonundaki bir kişi adını düşünmek gibi bir şeydir.

Dapps, teklifler önerme yetkisini kaybetmeleri amacıyla kaldırılabilir.

## Teklifler

Bir dapp ile bağlandıktan sonra, kullanıcının cüzdanında teklifler önerme yetkisi doğmaktadır. Teklifler, Agoric'in Zoe framework'üne özgü bir kavramdır. Kullanıcılar, bir teklifte talep ettiklerini alma garantisine sahiptir veya tam bir geri ödeme alır (bu özellik “**Teklif Güvenliği**” olarak adlandırılır - ).

Bir teklif önerildiğinde (genellikle bir dapp içindeki bir etkileşimden kaynaklanır) dashboard görünümünde belirecektir:



Eğer teklif onaylanırsa, pending (bekliyor) olarak gösterilecektir:



Etkileşimde bulunulan akıllı sözleşmenin koşullarına bağlı olarak, bazı teklifler tamamlanmadan “çıkılabilir”. Bir tekliften çıkmak, daha önce gerçekleşen varlık transferlerini geri almaz, ancak aklın gelecekteki planlı transferlerinin gerçekleştirilmesini engelleyebilir (örneğin, bir kullanıcı, sona erme tarihinden önce bir ihaleden çıkarak teklifi geri çekebilir).

Tamamlanan teklifler ya kabul edilen ya da reddedilen durumlarda görünecek ve kullanıcı tarafından reddedilebilecektir:



## Transferler

Cüzdan, diğer cüzdanlara para transferi yapmanın yanı sıra aynı cüzdan içinde cüzdanlar arasında transfer yapmak için de kullanılabilir.

Her türlü varlık, benzersiz bir "Marka" ile tanımlanabilir ve her Marka için bir global İhraççı bulunmaktadır. Kullanıcı, belirli bir Markanın token'larını göndermek veya almak istiyorsa, onun İhraççısı "Varlık İhraççıları" görünümünden içe aktarılmalıdır:



Bazı ihraççılar yukarıda gösterildiği gibi cüzdanda varsayılan olarak içe aktarılmıştır. Kullanıcı, her ihraççı için istediği kadar cüzdan oluşturabilir. Cüzdanlar, gerçek token'ların tutulduğu yerlerdir ve "Dashboard" görünümünden yönetilebilir:



Token'lar, aynı cüzdan içindeki cüzdanlar arasında serbestçe gönderilebilir. Diğer bir cüzdana token göndermek için, o cüzdanın Board ID'sinin "Kişiler" görünümünde içe aktarılması gerekir:



Sonra, bir kullanıcı "Geri Alınamaz tek yönlü" transfer seçeneğini seçerek token'larını kişileri arasındaki başka bir cüzdana gönderebilir:

