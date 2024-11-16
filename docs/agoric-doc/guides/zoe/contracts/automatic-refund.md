---
id: otomatik-iade-sozlesmesi
title: Otomatik İade Sözleşmesi
---



#####  (Son güncelleme: 31 Ocak 2022)

##### 

Bu, Zoe'yi açıklamak ve test etmek için oldukça basit bir sözleşmedir. `AutomaticRefund`, sadece yatırdığınız miktarı geri verir. `AutomaticRefund`, Zoe'ye yerinden çıkmasını söyler ve bu da kullanıcıya payout (ödeme) sağlar. Diğer sözleşmeler de bu aynı adımları kullanır, ancak daha karmaşık mantık ve arayüzlere sahiptirler.

Sözleşme yeniden tahsis etmeye çalışmadığı için, teklifin `give` ve `want` alanlarında herhangi bir şey içermesi mümkündür. `give` alanındaki miktarlar geri dönecek ve `want` alanı gözardı edilecektir.