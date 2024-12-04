---
title: Test Etme
seoTitle: Node.js Uygulamalarında Test Etme Yöntemleri
sidebar_position: 7
description: Connect for Node.js uygulamanızda istemcileri ve arka uç hizmetlerini test etme yöntemlerini keşfedin. Bu içerik, her test yöntemi için avantajlar ve dezavantajları detaylandırmaktadır.
tags: 
  - Node.js
  - Test
  - İstemci
  - Hizmet
  - Connect
keywords: 
  - Node.js
  - test
  - istemci
  - hizmet
  - Connect
---
Connect for Node.js uygulamanız için test yazarken, yaklaşımınız istemcileri veya arka uç hizmetlerini test edip etmemeye bağlı olarak değişecektir. Her biri için kurulumda benzerlikler yanı sıra avantajlar ve dezavantajlar bulunmaktadır. Aşağıda, her ikisini de test etme için birkaç teknik listeleyeceğiz.

## İstemciler

Connect for Node.js istemcilerinizi test etme süreci, istemcinin beklenen istekleri gönderip çeşitli yanıtlara doğru tepki verip vermediğini doğrulamayı içerir. Dolayısıyla, istemcileriniz için test yazarken, testleriniz sırasında etkileşimde bulunmak için bir sunucu tanımlamanız gerekecektir.

### Çalışan bir sunucuya karşı test etme

Bu yaklaşımda, TCP üzerinde tam bir HTTP sunucusu çalıştırabilir ve testteki istemcilerinizi prosedürleri çağırmak için kullanarak sonuçların beklentilerle eşleştiğini doğrulayabilirsiniz. **Büyük yarar**, gerçek dağıtıma en yakın davranışı alıyorsunuz. Bu, bir üretim dağıtımına en yakın olmanızı sağlar ve sunucunuzun etkileşime girebileceği diğer süreçleri test etmeyi de içerir; middleware dahil. **Büyük dezavantajı** ise, testleriniz için çalışan bir sunucu kurmak için çok fazla çaba gerektirmesidir.

### Bellek içi sunucuya karşı test etme

Bellek içi bir sunucu ile, Connect istemcilerinizi bir rotaya karşı izole şekilde test edebilir ve sunucunuzun devreye alabileceği diğer rotaları veya middleware'i geçersiz kılabilirsiniz. Bunu başarmak için [`@connectrpc/connect`](https://www.npmjs.com/package/@connectrpc/connect) paketinden dışa aktarılan `createRouterTransport` fonksiyonunu kullanabilirsiniz. Bu bellek içi taşıma, ağ üzerinde HTTP istekleri yapmayan, ancak verilen Connect rotalarını doğrudan çağıran özel bir taşımadır. `createRouterTransport` işlevinden dönen `Transport`, istemciler oluşturmak ve prosedürleri çağırmak için kullanılabilir ve sonuçların beklentilerle eşleştiğini doğrulayabilirsiniz.

:::tip
Bellek içi sunucuya karşı istemcileri test etmenin faydalarından biri kurulumun kolaylığıdır. Örneğin, istek ve yanıt mesajları serileştirilir. Başlıklar, trailerlar, hatalar ve diğer Connect özellikleri de desteklenir. Ancak, test edilen davranış gerçek bir dağıtım kadar yakın değildir. İstekler ağa gitmediği için, testin içinde hesaba katılmayan birçok alan vardır ve bu, istemci kapsamanızın tamlığı hakkında yanıltıcı bir güven duygusuna neden olabilir.
:::

### Hizmetleri taklit etme

Gerçek bir API'ye karşı test etmenin her zaman mümkün veya arzu edilir olmadığı durumlar olabilir. Örneğin, her zaman bir hata döndüren veya her zaman boş bir yanıt döndüren belirli durumları sabit kodlamış bir test rotası yazmak isteyebilirsiniz. Bu gibi durumlarda, Connect'in `createRouterTransport` fonksiyonunu kullanarak uygulamanızı tekrar test etmek için sahte bir Connect arka ucu kullanabilirsiniz.

Bahsedildiği gibi, `@connectrpc/connect` paketinden `createRouterTransport` fonksiyonu sağlanan rotalarla bellek içi bir sunucu oluşturur. Böylece, yalnızca test amaçları için kendi RPC uygulamalarınızı sağlayabilirsiniz.

Basit bir ELIZA hizmeti kurmak için:

```ts
import { ElizaService } from "@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb";
import { createRouterTransport } from "@connectrpc/connect";

const mockTransport = createRouterTransport(({ service }) => {
  service(ElizaService, {
    say: () => ({ sentence: "Mutlu hissediyorum." }),
  });
});
```

Arka planda, bu sahte taşıma, Node.js üzerinde çalışan bir sunucuda çalışacak olan hemen hemen aynı kodu çalıştırır. Bu, `gerçek hizmetleri uygulama` ile tüm özelliklerin kullanılabilir olduğu anlamına gelir: İstek başlıklarına erişebilir, ayrıntılı hatalar yükseltebilir ve ayrıca akış yanıtlarını da sahteleyebilirsiniz. Dördüncü istek üzerine hata yükselten bir örnek:

```ts
const mockTransport = createRouterTransport(({ service }) => {
  const sentences: string[] = [];
  service(ElizaService, {
    say(request: SayRequest) {
      sentences.push(request.sentence);
      // highlight-next-line
      if (sentences.length > 3) {
      // highlight-next-line
        throw new ConnectError(
      // highlight-next-line
          "Artık kelimem kalmadı.",
      // highlight-next-line
          Code.ResourceExhausted,
      // highlight-next-line
        );
      // highlight-next-line
      }
      return new SayResponse({
        sentence: `Toplam ${sentences.length} cümle söylediniz.`,
      });
    },
  });
});
```

Bu sahte ile, istemcinin ardışık yanıtlar sonrası dönen hatalara nasıl tepki vereceğini test edebilirsiniz. Ayrıca, istemcinin istekleri beklenen şekilde gönderdiğini doğrulamak için beklentiler kullanabilirsiniz:

```ts
const mockTransport = createRouterTransport(({ service }) => {
  service(ElizaService, {
    say(request) {
      // highlight-next-line
      expect(request.sentence).toBe("nasıl hissediyorsun?");
      return new SayResponse({ sentence: "Mutlu hissediyorum." });
    },
  });
});
```

`createRouterTransport` fonksiyonu ayrıca, `interceptors` gibi seçenekler geçmenizi sağlayan isteğe bağlı bir ikinci argümanı da kabul eder.

### Örnekler

Vanilla Node.js'de tüm bu üç yaklaşım için çalışan bir örnek için [client.test.ts dosyasını](https://github.com/connectrpc/examples-es/blob/main/vanilla-node/client.test.ts) `vanilla-node` projesinde bulunan [examples-es](https://github.com/connectrpc/examples-es) repomuzda inceleyebilirsiniz.

## Hizmetler

İstemcilerde olduğu gibi, Connect-Node hizmetlerinizi test etmenin çeşitli yolları vardır ve her birinin avantajları vardır. Yaklaşımlar, hangi şeyi test ettiğiniz dışında, istemcilerdekiyle aynı kavramları takip eder.

### Çalışan bir sunucu ile test etme

Bu yaklaşım, `yukarıda açıklanan` çalışan bir sunucu kullanma ile aynı kavramdır. Bu yaklaşımla, test istemcileri kurarak çeşitli istek konfigürasyonları gönderebilir ve rotalarınızın planlandığı gibi çalıştığını doğrulayabilirsiniz. Bu yaklaşım, düz Node.js, Fastify ve Express ile iyi çalışır.

:::note
[`fastify.inject()`](https://fastify.dev/docs/v1.14.x/Documentation/Testing/#testing-with-http-injection) ile Connect rotalarını test etmenizi önermiyoruz. `fastify.inject()` harika bir araçtır, ancak bunu kullanmak, `Content-Type` başlıkları ve durum kodları gibi protokol ayrıntılarını kendiniz yönetmeniz gerektiği anlamına gelir. Bu, Connect unary için oldukça basittir, ancak akış RPC'leri veya gRPC ya da gRPC-Web protokolleri için çok daha azdır.
:::

### Bellek içi sunucu ile test etme

Aynı şekilde, bu yukarıda belirtilen `istemci karşılığı ile aynı kavramı` izler. Amaç, yan hizmetler veya middleware'leri göz önünde bulundurmadan rotalarınızı izole bir şekilde test etmektir. Kurulum yukarıdaki gibidir ve `createRouterTransport` kullanılarak kolaylaştırılabilir.

Bu yaklaşım, Next.js ile iyi çalışır; çünkü testlerde tam bir sunucu başlatmak kolay değildir.

### Bir hizmete birim testi

Bir hizmetin birim testi, TCP ve HTTP'yi tamamen atlar ve hizmet yöntemlerini doğrudan çağırır, istemcilere, taşımalara ve gerçek bir sunucu ile etkileşimde kullanılan diğer süreçlere gerek duymadan. Bu yöntem birim testi için idealdir, ancak hizmetlerinizi [yardımcı türler](https://connectrpc.com/docs/node/implementing-services#helper-types) kullanarak sınıflar olarak uygulamanızı gerektirir. Bu sayede, hizmet sınıfınızı doğrudan örneklendirip, yöntemleri doğrudan çağırabilirsiniz.

### Örnekler

examples-es repomuz, [Fastify](https://github.com/connectrpc/examples-es/blob/b5d3f6822330f6b7816fac697b64ed4214aabafe/fastify/test/connect.test.ts), [Express](https://github.com/connectrpc/examples-es/blob/b5d3f6822330f6b7816fac697b64ed4214aabafe/express/connect.test.ts) ve [vanilla Node.js](https://github.com/connectrpc/examples-es/blob/b5d3f6822330f6b7816fac697b64ed4214aabafe/vanilla-node/connect.test.ts) için tüm üç yaklaşım için örnekler sunmaktadır.

Ayrıca, [Next.js](https://github.com/connectrpc/examples-es/blob/6e80c5677bf650b4c40bb26e8220bcac53adb585/nextjs/__tests__/connect.test.ts) projesini inceleyerek bellek içi sunucu ile test etme ve hizmet yöntemlerini doğrudan birim test etme örneğine bakabilirsiniz.