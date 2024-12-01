---
title: NestJSte Önbellekleme İçin Keyv Kullanımı Adım Adım Kılavuz'
description: Bu kılavuzda, NestJS uygulamanızda önbellekleme uygulamak için Keyv'in nasıl kullanılacağına dair adım adım bir rehber sunulmaktadır. Keyv, verilerinizi hızlı bir şekilde depolamanıza ve almanıza yardımcı olacak etkili bir anahtar-değer deposudur. 
keywords: [NestJS, Keyv, önbellekleme, CacheService, uygulama performansı]
---

# NestJS'te Önbellekleme İçin Keyv Kullanımı: Adım Adım Kılavuz

Önbellekleme, uygulamanızın performansını artırmak için sık kullanılan verilerin geçici olarak depolanmasını sağlayan önemli bir tekniktir; böylece bu veriler daha sonra hızlı bir şekilde geri alınabilir. Bu blog yazısında, bir NestJS uygulamasında önbellekleme uygulamak için Node.js için basit ama güçlü bir anahtar-değer deposu olan Keyv'in nasıl kullanılacağını keşfedeceğiz. Keyv'in NestJS ile nasıl kurulacağını öğrenecek ve verileri etkili bir şekilde önbelleğe almayı gösteren bazı örnekler sunacağız.

---

## 1. Projeyi Kurma

Öncelikle, Nest CLI kullanarak yeni bir NestJS projesi oluşturalım:

```bash
$ npm i -g @nestjs/cli
$ nest new nestjs-keyv-cache
$ cd nestjs-keyv-cache
```

---

## 2. Keyv ve Bağımlılıklarını Kurma

Başlamak için, Keyv'i ve tercih ettiğiniz bir depolama adaptörünü yükleyin. Bu örnekte, SQLite kullanacağız:
```bash
$ npm install cacheable @keyv/redis --save
```

---

## 3. Keyv'i NestJS ile Entegre Etme

Keyv entegrasyonunu yönetmek için 'CacheModule' adında yeni bir modül oluşturun:
```bash
$ nest generate module cache
```

Ardından, `cache.module.ts` dosyasını Keyv'i içe aktarmak ve yapılandırmak için güncelleyin:

```javascript
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
  ],
  exports: ['CACHE_INSTANCE'],
})
export class CacheModule {}
```

`app.module.ts` dosyasında CacheModule'u içe aktarmayı unutmayın:
```javascript
import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule],
})
export class AppModule {}
```

---

## 4. Keyv ile Önbellek Yönetimi için Bir Hizmet Oluşturma

Şimdi, Keyv kullanarak önbelleği yönetmek için bir hizmet oluşturalım:

```bash
$ nest generate service cache
```

`cache.service.ts` dosyasını önbellekleme yöntemleri ile güncelleyin:
```javascript
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T> {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number | string): Promise<void> {
    await this.cache.set<T>(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}
```

---

## 5. Örnek Bir Denetleyici İçinde Önbelleklemenin Uygulanması

Önbellek kullanımını göstermek için bir örnek denetleyici oluşturun:

```bash
$ nest generate controller sample
```

`sample.controller.ts` dosyasını önbellek hizmetini kullanacak şekilde güncelleyin:
```javascript
import { Controller, Get } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  async getData() {
    const cacheKey = 'sample-data';
    let data = await this.cacheService.get<string>(cacheKey);

    if (!data) {
      // Harici bir API'den veri çekme simülasyonu
      data = 'Harici API\'den örnek veri';
      await this.cacheService.set(cacheKey, data, '1m'); // 1 dakika boyunca önbellekle
    }

    return {
      data,
      source: data === 'Harici API\'den örnek veri' ? 'API' : 'Önbellek',
    };
  }
}
```

> Bu `SampleController`, CacheService kullanarak verileri önbellekleme ve geri alma yöntemini gösterir. /sample uç noktasına bir istek yapıldığında, getData() yöntemi önce verilerin önbellekte mevcut olup olmadığını kontrol eder. Eğer veri önbelleklenmemişse, harici bir API'den veri çekme simülasyonu yapar, veriyi 1 dakika boyunca önbelleğe alır ve ardından veriyi ve kaynağını (ya "API" ya da "Önbellek") geri döner.