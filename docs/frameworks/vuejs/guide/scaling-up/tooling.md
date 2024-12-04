---
title: Araçlar
seoTitle: Vue Araçları ve İskeletlendirme
sidebar_position: 4
description: Vue SFClerini deneyimlemek ve geliştirmek için önemli araçları ve iskeletlendirme yöntemlerini keşfedin. Vite ve Vue CLI gibi popüler seçeneklere göz atın.
tags: 
  - Vue
  - Vite
  - CLI
  - Geliştirme
  - Araçlar
keywords: 
  - Vue
  - Vite
  - CLI
  - Geliştirme
  - Araçlar
---

## Araçlar {#tooling}

## Çevrimiçi Deneyin {#try-it-online}

Vue SFC'lerini denemek için bilgisayarınıza hiçbir şey yüklemenize gerek yok - tarayıcıda bunu yapmanıza olanak tanıyan çevrimiçi oyun alanları vardır:

- [Vue SFC Oyun Alanı](https://play.vuejs.org)
  - Her zaman en son derlemeden dağıtılır
  - Bileşen derleme sonuçlarını incelemek için tasarlanmıştır
- [StackBlitz'te Vue + Vite](https://vite.new/vue)
  - Tarayıcıda gerçek Vite geliştirme sunucusu çalıştıran IDE benzeri bir ortam
  - Yerel kurulum için en yakın seçenek

Ayrıca hata raporlarınızda yeniden üretimler sağlamak için bu çevrimiçi oyun alanlarını kullanmanız önerilir.

## Proje iskeletleri {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) hafif ve hızlı bir derleme aracıdır ve birinci sınıf Vue SFC desteği sunar. Evan You tarafından oluşturulmuştur ve aynı zamanda Vue'nun yazarıdır!

Vite + Vue ile başlamak için, basit bir şekilde şu komutu çalıştırın:


  

  ```sh
  $ npm create vue@latest
  ```

  
  
  
  ```sh
  $ pnpm create vue@latest
  ```

  
  
  
  ```sh
  # Modern Yarn (v2+) için
  $ yarn create vue@latest
  
  # Yarn ^v4.11 için
  $ yarn dlx create-vue@latest
  ```

  
  
  
  ```sh
  $ bun create vue@latest
  ```

  


Bu komut, resmi Vue proje iskeletlendirme aracı olan [create-vue](https://github.com/vuejs/create-vue)'yi yükleyecek ve çalıştıracaktır.

- Vite hakkında daha fazla bilgi edinmek için [Vite belgelerine](https://vitejs.dev) göz atın.
- Vite projesinde Vue'ya özgü davranışları yapılandırmak için, örneğin Vue derleyicisine seçenekler geçmek, [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme) belgelerine göz atın.

Yukarıda bahsedilen her iki çevrimiçi oyun alanı da dosyaları Vite projesi olarak indirme desteği sunmaktadır.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) Vue için resmi webpack tabanlı araçtır. Şu anda bakım modundadır ve özel webpack'a özgü özelliklere bağlı olmadığınız sürece yeni projelere Vite ile başlamanızı öneririz. Vite, çoğu durumda daha iyi bir geliştirici deneyimi sunacaktır.

Vue CLI'den Vite'ye geçiş hakkında bilgi için:

- [Vue CLI -> Vite Geçiş Kılavuzu VueSchool.io'dan](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Otomatik geçişe yardımcı olan araçlar / eklentiler](https://github.com/vitejs/awesome-vite#vue-cli)

### Tarayıcıda Şablon Derleme Üzerine Not {#note-on-in-browser-template-compilation}

Vue'yu bir derleme adımı olmadan kullanırken, bileşen şablonları ya sayfanın HTML'sinde doğrudan ya da iç içe geçmiş JavaScript dizeleri olarak yazılır. Bu tür durumlarda, Vue'nun anında şablon derlemesi yapabilmesi için şablon derleyicisini tarayıcıya göndermesi gerekir. Öte yandan, şablonları bir derleme adımı ile önceden derlerseniz derleyici gereksiz hale gelecektir. İstemci paket boyutunu azaltmak için, Vue farklı kullanım senaryolarına yönelik optimize edilmiş [farklı "yapıları"](https://unpkg.com/browse/vue@3/dist/) sağlar.

- `vue.runtime.*` ile başlayan yapı dosyaları **sadece çalışma zamanı yapılarıdır**: bunlar derleyiciyi içermez. Bu yapılar kullanıldığında, tüm şablonların bir derleme adımı ile önceden derlenmesi gerekir.

- `.runtime` içermeyen yapı dosyaları **tam yapılar**dır: bunlar derleyiciyi içerir ve şablonları doğrudan tarayıcıda derleme desteği sunar. Ancak, yükü yaklaşık ~14kb artıracaktır.

Varsayılan araç kurulumlarımız, tüm SFC'lerdeki şablonların önceden derlenmesi nedeniyle sadece çalışma zamanı yapısını kullanır. Eğer bir derleme adımı ile bileşen şablonu derlemesine ihtiyacınız varsa, yapım aracını `vue`'yi `vue/dist/vue.esm-bundler.js` olarak takas edecek şekilde yapılandırarak bunu gerçekleştirebilirsiniz.

Herhangi bir derleme adımı olmadan kullanım için daha hafif bir alternatif arıyorsanız, [petite-vue](https://github.com/vuejs/petite-vue)'ye göz atın.

## IDE Desteği {#ide-support}

- Tavsiye edilen IDE kurulumu [VS Code](https://code.visualstudio.com/) + [Vue - Resmi uzantı](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (önceden Volar). Uzantı, sözdizimi vurgulama, TypeScript desteği ve şablon ifadeleri ve bileşen özellikleri için intellisense sağlar.

  :::tip
  Vue - Resmi uzantı, önceki resmi Vue 2 uzantımız olan [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)'un yerini alır. Eğer şu anda Vetur yüklüyse, Vue 3 projelerinde devre dışı bıraktığınızdan emin olun.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) da Vue SFC'leri için mükemmel yerleşik destek sağlamaktadır.

- [Dil Servisi Protokolü](https://microsoft.github.io/language-server-protocol/) (LSP) desteği sunan diğer IDE'ler, LSP aracılığıyla Volar'ın ana işlevlerini de kullanabilir:

  - Sublime Text desteği [LSP-Volar](https://github.com/sublimelsp/LSP-volar) aracılığıyla.

  - vim / Neovim desteği [coc-volar](https://github.com/yaegassy/coc-volar) ile.

  - emacs desteği [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/) ile.

## Tarayıcı Geliştirici Araçları {#browser-devtools}

Vue tarayıcı geliştirici araçları uzantısı, bir Vue uygulamasının bileşen ağaçlarını keşfetmenize, bireysel bileşenlerin durumunu denetlemenize, durum yönetimi olaylarını takip etmenize ve performansı profil çıkartmanıza olanak tanır.

![devtools screenshot](../../../images/frameworks/vuejs/guide/scaling-up/images/devtools.png)

- [Belgeler](https://devtools.vuejs.org/)
- [Chrome Uzantısı](https://chromewebstore.google.com/detail/vuejs-devtools-beta/ljjemllljcmogpfapbkkighbhhppjdbg)
- [Vite Eklentisi](https://devtools.vuejs.org/guide/vite-plugin)
- [Bağımsız Electron uygulaması](https://devtools.vuejs.org/guide/standalone)

## TypeScript {#typescript}

Ana makale: `TypeScript ile Vue Kullanımı`.

- [Vue - Resmi uzantı](https://github.com/vuejs/language-tools), `` bloklarını kullanarak SFC'ler için tür kontrolü sağlar; bunu şablon ifadeleri ve bileşenler arası özellik doğrulaması da dahil olmak üzere yapar.

- `vue-tsc` kullanarak aynı tür kontrolünü komut satırında gerçekleştirmek veya SFC'ler için `d.ts` dosyaları oluşturmak için kullanın. 

## Test Etme {#testing}

Ana makale: `Test Kılavuzu`.

- [Cypress](https://www.cypress.io/) E2E testler için önerilmektedir. Ayrıca [Cypress Bileşen Test Koşucusu](https://docs.cypress.io/guides/component-testing/introduction) aracılığıyla Vue SFC'leri için bileşen testleri yapımında da kullanılabilir.

- [Vitest](https://vitest.dev/), hız odaklı Vue / Vite ekip üyeleri tarafından oluşturulmuş bir test koşucusudur. Vite tabanlı uygulamalar için birim / bileşen testleri için aynı anlık geri bildirim döngüsünü sağlamak üzere tasarlanmıştır.

- [Jest](https://jestjs.io/) Vite ile [vite-jest](https://github.com/sodatea/vite-jest) aracılığıyla çalıştırılabilir. Ancak, bu yalnızca mevcut Jest tabanlı test takımınızı Vite tabanlı bir kuruluşa geçirmeniz gerekiyorsa önerilir, çünkü Vitest benzer işlevleri çok daha verimli bir entegrasyon ile sunar.

## Linting {#linting}

Vue ekibi, SFC'ye özgü linting kurallarını destekleyen [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) adlı bir [ESLint](https://eslint.org/) eklentisi tutmaktadır.

Daha önce Vue CLI kullanan kullanıcılar, linters'ların webpack yükleyicileri aracılığıyla yapılandırıldığını görmeye alışık olabilirler. Ancak Vite tabanlı bir yapılandırma kullanırken, genel önerimiz şudur:

1. `npm install -D eslint eslint-plugin-vue` yükleyin ve ardından `eslint-plugin-vue`'nin [yapılandırma kılavuzuna](https://eslint.vuejs.org/user-guide/#usage) göz atın.

2. IDE uzantılarını yükleyin, örneğin [VS Code için ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), böylece geliştirme sırasında düzenleyicinizde linter geri bildirim alırsınız. Bu, geliştirme sunucusunu başlatırken gereksiz linting maliyetini önlemeye de yardımcı olur.

3. Üretim derleme komutu sırasında ESLint'i çalıştırın, böylece üretime gitmeden önce tam linter geri bildirim alabilirsiniz.

4. (Opsiyonel) Git komutları ile değiştirilen dosyaları otomatik olarak lint etmek için [lint-staged](https://github.com/okonet/lint-staged) gibi araçlar ayarlayın.

## Biçimlendirme {#formatting}

- [Vue - Resmi](https://github.com/vuejs/language-tools) VS Code uzantısı, Vue SFC'leri için kutudan çıktığı gibi biçimlendirme sağlar.

- Alternatif olarak, [Prettier](https://prettier.io/) yerleşik Vue SFC biçimlendirme desteği sunar.

## SFC Özel Blok Entegrasyonları {#sfc-custom-block-integrations}

Özel bloklar, farklı istek sorguları ile aynı Vue dosyasına içe aktarımlar haline getirilir. Bu içe aktarma taleplerini işlemek için temel yapı aracına kalmıştır.

- Vite kullanıyorsanız, uyumlu özel blokları yürütülebilir JavaScript'e dönüştürmek için özel bir Vite eklentisi kullanılmalıdır. [Örnek](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Vue CLI veya düz webpack kullanıyorsanız, eşleşen blokları dönüştürmek için bir webpack yükleyicisi yapılandırılmalıdır. [Örnek](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Daha Düşük Seviye Paketler {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Belgeler](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Bu paket, Vue ana monorepo'sunun bir parçasıdır ve her zaman ana `vue` paketi ile aynı sürümde yayınlanır. Ana `vue` paketi tarafından bir bağımlılık olarak dahil edilmiştir ve `vue/compiler-sfc` altında yönlendirilmiştir, böylece bunu tek başına yüklemenize gerek yoktur.

Paket, Vue SFC'lerini işlemek için daha düşük seviyeli yardımcı programlar sunar ve yalnızca özel araçlarda Vue SFC'lerini desteklemek isteyen araç yazarları için tasarlanmıştır.

:::tip
Her zaman bu paketi `vue/compiler-sfc` derin içe aktarma yolu ile kullanmayı tercih edin; bu, sürümünün Vue çalışma zamanı ile senkronize olduğunu garanti eder.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Belgeler](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Vite'de Vue SFC desteği sağlayan resmi eklenti.

### `vue-loader` {#vue-loader}

- [Belgeler](https://vue-loader.vuejs.org/)

Webpack'te Vue SFC desteği sağlayan resmi yükleyici. Vue CLI kullanıyorsanız, [Vue CLI'de `vue-loader` seçeneklerini değiştirme belgelerine](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader) de göz atın.

## Diğer Çevrimiçi Oyun Alanları {#other-online-playgrounds}

- [VueUse Oyun Alanı](https://play.vueuse.org)
- [Repl.it'te Vue + Vite](https://replit.com/@templates/VueJS-with-Vite)
- [CodeSandbox'ta Vue](https://codesandbox.io/p/devbox/github/codesandbox/sandbox-templates/tree/main/vue-vite)
- [Codepen'de Vue](https://codepen.io/pen/editor/vue)
- [WebComponents.dev'de Vue](https://webcomponents.dev/create/cevue)