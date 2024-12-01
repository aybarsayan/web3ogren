---
description: Node.js uygulamalarının performansını artırmak için profil oluşturma yöntemlerini keşfedin. Bu kılavuz, uygulamaların profilini çıkarmak, optimizasyon ipuçları, Chrome'da inceleme yapma gibi temel konuları ele almaktadır.
keywords: [Node.js, profil oluşturma, optimizasyon, performans, bellek sızıntısı]
---

# Profiling in NodeJS

1. Uygulamayı profilleme modunda çalıştır
	```
	$ node --prof main.js
	```

2. İzolasyon dosyasını metne çevir
	```
	$ node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
	```

[Daha fazla bilgi](https://nodejs.org/en/docs/guides/simple-profiling/)

---

## Yazdırma optimizasyonu

```
$ node --trace-opt index.js > trace.txt
```

De-optimizasyon ile
```
$ node --trace-opt --trace-deopt index.js > trace.txt
```

:::info
Daha fazla bilgi için [bu bağlantıya](https://community.risingstack.com/how-to-find-node-js-performance-optimization-killers/) bakın.

---

## Chrome'da İnceleme ve Profil Oluşturma

`node --inspect --expose-gc benchmark/perf-runner.js`

---

## IR Hydra

http://mrale.ph/irhydra/2/

```
$ node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm index.js
```

---

## JSON ayrıştırma/stringify

https://github.com/douglascrockford/JSON-js

---

## Alev grafiği

http://www.brendangregg.com/blog/2014-09-17/node-flame-graphs-on-linux.html  
https://www.slideshare.net/brendangregg/blazing-performance-with-flame-graphs

Windows için: https://github.com/google/UIforETW/releases

---

### 0x

https://github.com/davidmarkclements/0x

Kurulum:
```
npm install -g 0x
```
Kullanım:
```
0x -o index.js
```

> pwsh kullanıcıları için, önce CMD'ye geçin ya da `npx` ile çalıştırın 
> 
```
npx 0x -o index.js
```

---

## Diğerleri

http://mrale.ph/blog/2011/12/18/v8-optimization-checklist.html  
http://stackoverflow.com/a/31549736/129346  
https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#52-the-object-being-iterated-is-not-a-simple-enumerable  
https://jsperf.com/let-compound-assignment  
https://gist.github.com/trevnorris/f0907b010c9d5e24ea97

---

## Bellek sızıntısı

https://www.youtube.com/watch?v=taADm6ndvVo&list=PLz6xH_GrBpquZgdVzEX4Bix0oxHQlZfwm&index=8