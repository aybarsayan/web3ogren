## Sürümleri Profil Kullanarak Özelleştirme

Rust'ta, *sürüm profilleri*, bir programcının kodu derlemek için çeşitli seçenekler üzerinde daha fazla kontrol sahibi olmasına olanak tanıyan, önceden tanımlanmış ve özelleştirilebilir profillerdir. Her bir profil, diğerlerinden bağımsız olarak yapılandırılmıştır.

Cargo'nun iki ana profili vardır: `cargo build` çalıştırıldığında kullanılan `dev` profili ve `cargo build --release` çalıştırıldığında kullanılan `release` profili. `dev` profili, geliştirme için iyi varsayılanlarla tanımlanmıştır ve `release` profili, sürüm derlemeleri için iyi varsayılanlara sahiptir.

:::info
Bu profil adları, derleme çıktınızdan aşina olduğunuz şeyler olabilir.
:::



```console
$ cargo build
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.00s
$ cargo build --release
    Finished `release` profile [optimized] target(s) in 0.32s
```

`dev` ve `release`, derleyici tarafından kullanılan farklı profillerdir.

Cargo'nun, proje içindeki *Cargo.toml* dosyasında açıkça herhangi bir `[profile.*]` bölümü eklemediğinizde uygulanan her bir profil için varsayılan ayarları vardır. Özelleştirmek istediğiniz herhangi bir profil için `[profile.*]` bölümleri ekleyerek varsayılan ayarların herhangi bir alt kümesini geçersiz kılabilirsiniz. Örneğin, `dev` ve `release` profilleri için `opt-level` ayarının varsayılan değerleri şunlardır:

Filename: Cargo.toml

```toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

:::note
`opt-level` ayarı, Rust'ın kodunuza uygulayacağı optimizasyon sayısını kontrol eder ve 0'dan 3'e kadar bir aralık sunar. Daha fazla optimizasyon uygulamak, derleme süresini uzatır; bu nedenle geliştirme aşamasındaysanız ve kodunuzu sık sık derliyorsanız, daha hızlı derleme için daha az optimizasyon istemeniz gerekir, bu durumda üretilen kod daha yavaş çalışsa bile.
:::

Bu nedenle, `dev` profili için varsayılan `opt-level` `0`'dır. Kodunuzu yayımlamaya hazır olduğunuzda, derleme için daha fazla zaman harcamanız en iyisidir. Yalnızca bir kez sürüm modunda derleyeceksiniz, ancak derlenmiş programı birçok kez çalıştıracaksınız, bu nedenle sürüm modu, daha hızlı çalışan bir kod için daha uzun derleme süresini değiş tokuş eder. Bu yüzden, `release` profili için varsayılan `opt-level` `3`'tür.

Varsayılan bir ayarı, *Cargo.toml* dosyasında ona farklı bir değer ekleyerek geçersiz kılabilirsiniz. Örneğin, geliştirme profilinde optimizasyon düzeyi 1 kullanmak istiyorsak, projemizin *Cargo.toml* dosyasına bu iki satırı ekleyebiliriz:

Filename: Cargo.toml

```toml
[profile.dev]
opt-level = 1
```

:::tip
Bu kod, varsayılan `0` ayarını geçersiz kılar. Artık `cargo build` çalıştırdığımızda, Cargo, `dev` profili için varsayılanların yanı sıra `opt-level` için özelleştirmemizi de kullanacaktır. `opt-level`'i `1` olarak ayarladığımız için, Cargo daha fazla optimizasyon uygulayacak ama bir sürüm derlemesindekinden daha az uygulayacaktır.
:::

Her profil için yapılandırma seçeneklerinin ve varsayılanların tam listesini görmek için [Cargo’nun belgelerine](https://doc.rust-lang.org/cargo/reference/profiles.html) bakabilirsiniz.