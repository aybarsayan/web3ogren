---
title: "Next.js Uygulaması Oluşturma"
description: Bu kapsamlı rehberde, Deno kullanarak basit bir Next.js uygulaması oluşturmanın adımlarını öğreneceksiniz. Uygulama, dinozorlar listesi gösterirken, her dinozora tıklanıldığında daha fazla ayrıntı sunacaktır.
keywords: [Next.js, Deno, Dinozor, Uygulama Geliştirme, API]
---

[Next.js](https://nextjs.org/) sunucu tarafında işlenen uygulamalar oluşturmak için popüler bir çerçevedir. React'ın üzerine inşa edilmiştir ve kutudan çıktığı gibi birçok özellik sunar.

:::tip
Bu eğitimde, basit bir Next.js uygulaması oluşturarak onu Deno ile çalıştıracağız. Uygulama, bir dinozorlar listesi gösterecek. Birine tıkladığınızda, sizi daha fazla ayrıntı içeren bir dinozor sayfasına yönlendirecek.
:::

![uygulamanın demosu](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/next/dinoapp.gif)

Öncelikle, en son Deno sürümünün yüklü olduğunu doğrulayın, en az Deno 1.46.0'a ihtiyacınız olacak:

```sh
deno --version
```

## Deno ile Next.js Uygulaması Oluşturma

Next, yeni bir Next.js uygulaması hızlıca oluşturmak için bir CLI aracı sağlar. Terminalinizde, Deno ile yeni bir Next.js uygulaması oluşturmak için aşağıdaki komutu çalıştırın:

```sh
deno run -A npm:create-next-app@latest
```

İstendiğinde, TypeScript ile yeni bir Next.js uygulaması oluşturmak için varsayılan seçenekleri seçin.

Ardından, yeni oluşturulan proje klasörüne `cd` yapın ve bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

```sh
deno install
```

Artık yeni Next.js uygulamanızı hizmete alabilirsiniz:

```sh
deno task dev
```

Bu, Next.js sunucusunu başlatacak, tarayıcıda uygulamanızı görmek için localhost üzerindeki çıkış bağlantısına tıklayın.

## Bir arka uç ekleyin

Bir sonraki adım, bir arka uç API eklemektir. Dinozorlarla ilgili bilgiler döndüren çok basit bir API oluşturacağız.

Dinozor API'mizi kurmak için Next.js'nin
[built in API route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) özelliklerini kullanacağız. Next.js, klasör yapısının doğrudan yolları tanımladığı dosya sistemi tabanlı bir yönlendirici kullanır.

Üç yol tanımlayacağız. İlk yol `/api` üzerinde "Dinozor API'sine Hoş Geldiniz" dizesini döndürecek, ardından `/api/dinosaurs` yolunu tüm dinozorları döndürmek için ayarlayacağız, son olarak `/api/dinosaur/[dinosaur]` yolunu URL'deki isme göre belirli bir dinozoru döndürmek için ayarlayacağız.

### /api/

Yeni projenizin `app` klasöründe bir `api` klasörü oluşturun. Bu klasörde, `/api/`'ye yapılan istekleri yöneten bir `route.ts` dosyası oluşturun.

Aşağıdaki kodu `api/route.ts` dosyasına kopyalayın ve yapıştırın:

```ts title="route.ts"
export async function GET() {
  return Response.json("dinozor API'sine hoş geldiniz");
}
```

Bu kod, "dinozor API'sine hoş geldiniz" dizesiyle bir JSON yanıtı döndüren basit bir yol yöneticisi tanımlar.

### /api/dinosaurs

`api` klasöründe `dinosaurs` adında bir klasör oluşturun. Bu klasörde, hard coded dinozor verilerini içerecek bir `data.json` dosyası oluşturun. Aşağıdaki
[json dosyasını](https://raw.githubusercontent.com/denoland/deno-vue-example/main/api/data.json) `data.json` dosyasına kopyalayın.

`dinosaurs` dizininde, `/api/dinosaurs` yoluna yapılan istekleri yönetecek bir `route.ts` dosyası oluşturun. Bu yol içinde `data.json` dosyasını okuyacağız ve dinozorları JSON olarak döndüreceğiz:

```ts title="route.ts"
import data from "./data.json" with { type: "json" };

export async function GET() {
  return Response.json(data);
}
```

### /api/dinosaurs/[dinosaur]

Son yol için, `/api/dinosaurs/[dinosaur]`, `dinosaurs` dizininde `[dinosaur]` adında bir klasör oluşturacağız. Orada bir `route.ts` dosyası oluşturun. Bu dosyada `data.json` dosyasını okuyacağız, URL'deki isimle dinozoru bulacağız ve JSON olarak döndüreceğiz:

```ts title="route.ts"
import { NextRequest } from "next/server";
import data from "../data.json" with { type: "json" };

type RouteParams = { params: Promise<{ dinosaur: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { dinosaur } = await params;

  if (!dinosaur) {
    return Response.json("Dinozor ismi sağlanmadı.");
  }

  const dinosaurData = data.find((item) =>
    item.name.toLowerCase() === dinosaur.toLowerCase()
  );

  return Response.json(dinosaurData ? dinosaurData : "Dinozor bulunamadı.");
};
```

Artık uygulamayı `deno task dev` ile çalıştırırsanız ve tarayıcıda `http://localhost:3000/api/dinosaurs/brachiosaurus` adresine giderseniz, brachiosaurus dinozorunun ayrıntılarını göreceksiniz.

## Ön yüzü oluşturun

Artık arka uç API'mizi kurduğumuza göre, dinozor verilerini görüntülemek için ön yüzü oluşturalım.

### Dinozor türünü tanımlayın

Öncelikle, dinozor verilerinin şeklini tanımlamak için yeni bir tür tanımlayacağız. `app` dizininde bir `types.ts` dosyası oluşturun ve aşağıdaki kodu ekleyin:

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### Anasayfayı güncelleyin

`app` dizinindeki `page.tsx` dosyasını güncelleyerek, dinozor verilerini API'mizden alıp bağlantılar olarak listeleyeceğiz.

Next.js'in istemci tarafı kodunu çalıştırmak için dosyanın en üstünde `use Client` direktifini kullanmamız gerekiyor. Ardından bu sayfada ihtiyacımız olan modülleri içe aktaracak ve sayfayı render edeceğimiz varsayılan fonksiyonu dışa aktaracağız:

```tsx title="page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "./types";
import Link from "next/link";

export default function Home() {
}
```

`Home` fonksiyonunun gövdesinde, dinozor verilerini depolamak için bir durum değişkeni tanımlayacağız ve bileşen yüklendiğinde API'den verileri almak için bir `useEffect` kancası yazacağız:

```tsx title="page.tsx"
const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

useEffect(() => {
  (async () => {
    const response = await fetch(`/api/dinosaurs`);
    const allDinosaurs = await response.json() as Dino[];
    setDinosaurs(allDinosaurs);
  })();
}, []);
```

Bunun hemen altında, `Home` fonksiyonu gövdesinde, her biri dinozorların sayfasına bağlantı veren bağlantılar listesini döndüreceğiz:

```tsx title="page.tsx"
return (
  <main>
    <h1>Dinozor uygulamasına hoş geldiniz</h1>
    <p>Aşağıdaki dinozora tıklayarak daha fazla bilgi edinin.</p>
    <ul>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <li key={dinosaur.name}>
            <Link href={`/${dinosaur.name.toLowerCase()}`}>
              {dinosaur.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </main>
);
```

### Dinozor sayfasını oluşturun

`app` dizininde `[dinosaur]` adında yeni bir klasör oluşturun. Bu klasörde bir `page.tsx` dosyası oluşturun. Bu dosya, API'den belirli bir dinozorun ayrıntılarını alacak ve sayfada gösterecek.

Ana sayfada olduğu gibi, istemci tarafı koduna ihtiyacımız olacak, bu nedenle gerekli modülleri içe aktaracak ve varsayılan fonksiyonu dışa aktaracağız. Fonksiyona gelen parametreyi geçirecek ve bu parametre için bir tür oluşturacağız:

```tsx title="[dinosaur]/page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "../types";
import Link from "next/link";

type RouteParams = { params: Promise<{ dinosaur: string }> };

export default function Dinosaur({ params }: RouteParams) {
}
```

`Dinosaur` fonksiyonu gövdesinde, istekte seçilen dinozoru alacağız, dinozor verilerini depolamak için bir durum değişkeni oluşturacağız ve bileşen yüklendiğinde API'den verileri almak için bir `useEffect` kancası yazacağız:

```tsx title="[dinosaur]/page.tsx"
const selectedDinosaur = params.then((params) => params.dinosaur);
const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

useEffect(() => {
  (async () => {
    const resp = await fetch(`/api/dinosaurs/${await selectedDinosaur}`);
    const dino = await resp.json() as Dino;
    setDino(dino);
  })();
}, []);
```

Son olarak, yine `Dinosaur` fonksiyon gövdesinin içinde, dinozorun ismini ve açıklamasını içeren bir paragraf elementi döndüreceğiz:

```tsx title="[dinosaur]/page.tsx"
return (
  <main>
    <h1>{dinosaur.name}</h1>
    <p>{dinosaur.description}</p>
    <Link href="/">🠠 Tüm dinozorlara geri dön</Link>
  </main>
);
```

## Uygulamayı Çalıştırın

Artık uygulamayı `deno task dev` ile çalıştırabilir ve tarayıcınızda `http://localhost:3000` adresine giderek dinozorlar listesini görebilirsiniz. Bir dinozora tıklayarak daha fazla ayrıntıyı görebilirsiniz!

![uygulamanın demosu](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/next/dinoapp.gif)

🦕 Artık Deno ile bir Next.js uygulaması oluşturup çalıştırabilirsiniz! Uygulamanızı geliştirmek için `data.json` dosyanızı değiştirmek amacıyla `bir veritabanı eklemeyi` değerlendirebilir ya da uygulamanızı güvenilir ve üretime uygun hale getirmek için `bazı testler yazmayı` düşünebilirsiniz.