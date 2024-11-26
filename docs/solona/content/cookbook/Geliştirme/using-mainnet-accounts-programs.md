---
title: Mainnet Hesapları ve Programları Kullanma
sidebarSortOrder: 5
description:
  Yerel geliştirme ortamınızda Mainnet hesaplarını ve programlarını nasıl kullanacağınızı öğrenin.
---

Çoğu zaman, yerel testler varsayılan olarak yerel doğrulayıcıda mevcut olmayan programlar ve hesaplar üzerine dayanır.  
Solana CLI, hem şu işlemleri yapmanıza olanak tanır:

- Programları ve Hesapları İndirmek
- Programları ve Hesapları yerel doğrulayıcıya Yüklemek

### Hesapları mainnet'ten nasıl yükleyebilirim

JUP token mint hesabını bir dosyaya indirmek mümkündür:

```shell
# solana account -u <source cluster> --output <output format> --output-file <destination file name/path> <address of account to fetch>
solana account -u m --output json-compact --output-file jup.json JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
```

:::tip
**İpucu:** Bu komut, JUP token mint hesabını JSON formatında yerel dosyaya indirmenizi sağlar.
:::

Yerel ağına yüklemek, doğrulayıcıyı başlatırken hesabın dosyasını ve hedef adresini (yerel küme üzerinde) geçerek yapılır:

```shell
# solana-test-validator --account <address to load the account to> <path to account file> --reset
solana-test-validator --account JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN jup.json --reset
```

:::info
Bu işlem sırasında, hesabın doğru biçimde yüklendiğinden emin olun; aksi takdirde doğrulayıcı hatalı çalışabilir.
:::

Benzer şekilde, Openbook programını indirmek mümkündür:

```shell
# solana program dump -u <source cluster> <address of account to fetch> <destination file name/path>
solana program dump -u m srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX openbook.so
```

:::note
**Not:** Openbook programını yerel ağınıza yüklemeden önce, doğru adresi ve dosya adına sahip olduğunuzdan emin olun.
:::

Yerel ağına yüklemek, programın dosyasını ve hedef adresini (yerel küme üzerinde) geçerek doğrulayıcıyı başlatırken yapılır:

```shell
# solana-test-validator --bpf-program <address to load the program to> <path to program file> --reset
solana-test-validator --bpf-program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX openbook.so --reset
```

:::warning
**Dikkat:** Program yüklemesi sırasında bir hata oluşursa, yerel veritabanınızı kontrol edin ve gerekirse sıfırlayın.
:::

---