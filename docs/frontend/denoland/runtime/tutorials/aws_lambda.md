---
title: "Deno'yu AWS Lambda'ya Nasıl Dağıtırsınız"
description: "Bu rehber, Deno uygulamasını Docker ile AWS Lambda'ya dağıtmanın adımlarını sunmaktadır. AWS'in sunucusuz hesaplama imkânlarını kullanarak verimli bir dağıtım süreci gerçekleştirmenize yardımcı olur."
keywords: [Deno, AWS Lambda, Docker, sunucusuz, dağıtım, hesaplama, rehber]
---

AWS Lambda, Amazon Web Services tarafından sunulan bir sunucusuz hesaplama hizmetidir. Sunucuları tahsis etmeden veya yönetmeden kod çalıştırmanıza olanak tanır.

İşte bir Deno uygulamasını Docker kullanarak AWS Lambda'ya dağıtmak için adım adım bir kılavuz.

:::info
Bunun için ön koşullar şunlardır:

- [`docker` CLI](https://docs.docker.com/reference/cli/docker/)
- bir [AWS hesap](https://aws.amazon.com)
- [`aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
:::

## Adım 1: Bir Deno Uygulaması Oluşturun

Aşağıdaki kodu kullanarak yeni bir Deno uygulaması oluşturun:

```ts title="main.ts"
Deno.serve((req) => new Response("Merhaba Dünya!"));
```

Bu kodu `main.ts` adında bir dosyaya kaydedin.

---

## Adım 2: Bir Dockerfile Oluşturun

Aşağıdaki içeriği içeren `Dockerfile` adında yeni bir dosya oluşturun:

```Dockerfile
# Temel resmi ayarla
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS aws-lambda-adapter
FROM denoland/deno:bin-1.45.2 AS deno_bin
FROM debian:bookworm-20230703-slim AS deno_runtime
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=deno_bin /deno /usr/local/bin/deno
ENV PORT=8000
EXPOSE 8000
RUN mkdir /var/deno_dir
ENV DENO_DIR=/var/deno_dir

# Fonksiyon kodunu kopyala
WORKDIR "/var/task"
COPY . /var/task

# Önbellekleri ısıtma
RUN timeout 10s deno run -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "run", "-A", "main.ts"]
```

:::note
Bu Dockerfile, [`aws-lambda-adapter`](https://github.com/awslabs/aws-lambda-web-adapter) projesini kullanarak Deno'nun `Deno.serve` gibi normal HTTP sunucularını AWS Lambda çalışma zamanı API'sine uyarlamak için kullanılır. 

Ayrıca, Deno ikili dosyasını almak için `denoland/deno:bin-1.45.2` resmini ve temel resim olarak `debian:bookworm-20230703-slim` kullanıyoruz.
:::

`PORT` çevresel değişkeni, AWS Lambda adaptörüne `8000` portunda dinlediğimizi bildirmek için `8000` olarak ayarlanmıştır.

Önbelleğe alınmış Deno kaynak kodunu ve dönüştürülmüş modülleri `/var/deno_dir` dizininde saklamak için `DENO_DIR` çevresel değişkenini `/var/deno_dir` olarak ayarlıyoruz.

:::tip
Önbellekleri ısıtma adımı, işlev çağrılmadan önce Deno önbelleğini ısıtmak için kullanılır. Bu, işlevin soğuk başlatma süresini azaltmak için yapılır. Bu önbellekler, işlev kodunuzun derlenmiş kodunu ve bağımlılıklarını içerir. Bu adım, sunucunuzu 10 saniye çalıştırır ve ardından çıkar.
:::

Bir package.json kullanıyorsanız, önbellekleri ısıtmadan veya işlevi çalıştırmadan önce `node_modules` yüklemek için `deno install` komutunu çalıştırmayı unutmayın.

---

## Adım 3: Docker Resmini Oluşturun

Aşağıdaki komutu kullanarak Docker resmini oluşturun:

```bash
docker build -t hello-world .
```

---

## Adım 4: Bir ECR Docker deposu oluşturun ve resmi yükleyin

AWS CLI kullanarak, bir ECR deposu oluşturun ve Docker resmini buna yükleyin:

```bash
aws ecr create-repository --repository-name hello-world --region us-east-1 | grep repositoryUri
```

Bu, `".dkr.ecr.us-east-1.amazonaws.com/hello-world"` gibi bir depo URI'si çıkarmalıdır.

Önceki adımdan alınan depo URI'sini kullanarak ECR ile Docker'ı kimlik doğrulaması yapın:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com
```

Docker resmini, yine önceki adımlardan alınan depo URI'si ile etiketleyin:

```bash
docker tag hello-world:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

Son olarak, Docker resmini ECR deposuna yükleyin, önceden alınan depo URI'sini kullanarak:

```bash
docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

---

## Adım 5: Bir AWS Lambda işlevi oluşturun

Artık AWS Yönetim Konsolu'ndan yeni bir AWS Lambda işlevi oluşturabilirsiniz.

1. AWS Yönetim Konsolu'na gidin ve
   [Lambda hizmetine gidin](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1).
2. "Fonksiyon oluştur" butonuna tıklayın.
3. "Konteyner resmi"ni seçin.
4. "hello-world" gibi bir isim girin.
5. "Resimleri Gözat" butonuna tıklayın ve ECR'ye yüklediğiniz resmi seçin.
6. "Fonksiyon oluştur" butonuna tıklayın.
7. Fonksiyon oluşturulmasını bekleyin.
8. "Yapılandırma" sekmesinde "Fonksiyon URL'si" bölümüne gidin ve "Fonksiyon URL'si oluştur" butonuna tıklayın.
9. Kimlik doğrulama türü için "YOK" seçeneğini seçin (bu, lambda fonksiyonunu herkese açık erişilebilir hale getirir).
10. "Kaydet" butonuna tıklayın.

---

## Adım 6: Lambda işlevini test edin

Artık Deno uygulamanızdan gelen yanıtı görmek için Lambda işlevinizin URL'sini ziyaret edebilirsiniz.

> 🦕 Docker kullanarak AWS Lambda'ya başarıyla Deno uygulaması dağıttınız. Artık bu kurulumu, daha karmaşık Deno uygulamalarını AWS Lambda'ya dağıtmak için kullanabilirsiniz. — Deno Dağıtım Rehberi