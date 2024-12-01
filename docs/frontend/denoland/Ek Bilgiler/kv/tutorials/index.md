---
title: "Deno KV Eğitici ve Örnekler"
description: Deno KV'nin çeşitli örnekleri, gerçek dünya kullanım senaryolarını ve nasıl uygulanacağını gösteriyor. Web kancalarını işlemekten, CRUD uygulamalarına kadar geniş bir yelpazeyi kapsar.
keywords: [Deno KV, webhooks, CRUD, SaaS, oyun, OAuth, örnek projeler]
oldUrl:
  - /kv/tutorials/
---

Deno KV'nin gerçek dünya kullanımını gösteren bu örneklere göz atın.

## Gelen web kancalarını işlemek için kuyrukları kullanın

Kuyrukları kullanarak görevleri arka planda işlemenizi öğrenmek için `bu eğitimi` izleyin, böylece web uygulamanız yanıt vermeye devam edebilir. Bu örnek, [GitHub](https://www.github.com) üzerinden gelen web kancası isteklerini işleyen görevlerin nasıl kuyruklanacağını göstermektedir.

:::tip
Web kancalarını kuyruklar aracılığıyla işlemek, uygulamanızın yanıt verebilirliğini artırır.
:::

## Gelecekteki bir bildirimi planlamak için kuyrukları kullanın

Gelecekte bir zamanda kodu çalıştırmayı planlamak için kuyrukları nasıl kullanacağınızı öğrenmek için `bu eğitimi` takip edin. Bu örnek, [Courier](https://www.courier.com/) ile bir bildirimi nasıl planlayacağınızı göstermektedir.

## Deno KV'de CRUD - YAPILACAKLAR Listesi

- Zod şema doğrulaması
- Fresh kullanılarak oluşturulmuştur
- BroadcastChannel kullanarak gerçek zamanlı işbirliği
- [Kaynak kodu](https://github.com/denoland/showcase_todo)
- [Canlı önizleme](https://showcase-todo.deno.dev/)

:::info
Deno KV ile CRUD işlemleri yaparken Zod şemaları kullanmak, veri doğrulama sürecini kolaylaştırır.
:::

## Deno SaaSKit

- Fresh üzerine inşa edilmiş modern SaaS şablonu.
- KV üzerinde tamamen inşa edilmiş [Product Hunt](https://www.producthunt.com/) benzeri şablon.
- GitHub OAuth 2.0 kimlik doğrulaması için Deno KV OAuth kullanır.
- Bir sonraki uygulama projenizi daha hızlı başlatmak için kullanın.
- [Kaynak kodu](https://github.com/denoland/saaskit)
- [Canlı önizleme](https://hunt.deno.land/)

## Çok oyunculu XOX oyun

Bu oyun, GitHub kimlik doğrulaması ile kullanıcıların kaydedilmiş durumlarını yönetir ve gerçek zamanlı senkronizasyon sağlamak için BroadcastChannel kullanır.

- [Kaynak kodu](https://github.com/denoland/tic-tac-toe)
- [Canlı önizleme](https://tic-tac-toe-game.deno.dev/)

:::note
Bu örnek, çok oyunculu uygulamalarda gerçek zamanlı senkronizasyonun önemini gözler önüne seriyor.
:::

## Çok kullanıcılı piksel sanatı çizimi

- Kalıcı tuval durumu
- Çok kullanıcı işbirliği
- BroadcastChannel kullanarak gerçek zamanlı senkronizasyon
- [Kaynak kodu](https://github.com/denoland/pixelpage)
- [Canlı önizleme](https://pixelpage.deno.dev/)

## GitHub kimlik doğrulaması ve KV

- Çizimleri KV'de saklar
- GitHub kimlik doğrulaması
- [Kaynak kodu](https://github.com/hashrock/kv-sketchbook)
- [Canlı önizleme](https://hashrock-kv-sketchbook.deno.dev/)

:::danger
GitHub kimlik doğrulaması kullanırken, kullanıcı verilerini güvenli bir şekilde saklamanın önemini unutmayın.
:::

## Deno KV oAuth 2

- Deno KV tarafından güçlendirilmiş yüksek düzey OAuth 2.0
- [Kaynak kodu](https://github.com/denoland/deno_kv_oauth)
- [Canlı önizleme](https://kv-oauth.deno.dev/)