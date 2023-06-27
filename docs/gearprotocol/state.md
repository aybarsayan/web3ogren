---
sidebar_position: 8
sidebar_label: Gear Network State Nedir?
---

# Durum Bileşenleri (State Components)

Herhangi bir blok zinciri sistemi gibi, Gear da dağıtılmış durumu korur. Runtime kodu WebAssembly'ye derlendiğinde, blok zincirinin depolama durumunun bir parçası haline gelir.

Gear, tanımlayıcı özelliklerden biri olan **çatal olmadan çalışma zamanı güncellemelerini** sağlar. Durum ayrıca, bir kesinlik mekanizması kullanılıyorsa kesinleşmiş olarak garanti edilir.

Depolama durumu aşağıdaki bileşenlerden oluşur:

- **Programlar ve bellek** (Programs and Memory)
- **Mesaj kuyruğu** (Message Queue)
- **Hesaplar** (Accounts)

### Programlar (Programs)

Programlar, Gear ağ durumunda birinci sınıf varlıklardır.

Program kodu, değiştirilemez bir Wasm blogu olarak depolanır. Her programın sabit bir belleği vardır ve mesaj işlemeleri arasında kalıcıdır (buna statik alan denir).

Programlar, Gear örneğinin sağladığı bellek havuzundan daha fazla bellek ayırabilir. Bir program, yalnızca kendi bellek alanı içinde okuma ve yazma yapabilir.

### Bellek (Memory)

Gear örneği, her program için ayrı bir bellek alanı tutar ve bu alanın kalıcı olmasını sağlar. Bir program, sadece kendi bellek alanı içinde okuma ve yazma yapabilir ve diğer programların bellek alanına erişemez. Bellek alanı, bir program başlatıldığında tahsis edilir ve ek bir ücret gerektirmez (program başlatma ücretine dahildir).

Bir program, 64KB'lık bloklar halinde gereken belleği ayırabilir. Her bellek bloğu tahsisi bir gaz ücreti gerektirir. Her bir sayfa (64KB), dağıtılmış veritabanı altyapısında ayrı ayrı depolanır, ancak Gear düğümü, çalışma zamanında sürekli bellek oluşturur ve programların yeniden yükleme yapmadan üzerinde çalışmasına olanak sağlar.

### Mesaj kuyruğu (Message Queue)

Gear örneği, genel bir mesaj kuyruğunu tutar. Gear düğümünü kullanarak, kullanıcılar belirli bir programa veya programlara bir veya birden fazla mesaj içeren işlemler gönderebilir. Bu, mesaj kuyruğunu doldurur. Blok oluşturulurken, mesajlar sırayla işlenir ve ilgili programa yönlendirilir.

### Hesaplar (Accounts)

Genel bir ağ için, DOS saldırılarına karşı koruma her zaman işlem işleme için gaz/ücret gerektirir

. Gear, kullanıcı ve program bakiyelerini depolamaya ve bir işlem ücreti ödemeye izin veren bir denge modülü sağlar.

Genel olarak, belirli bir Gear ağ örneği hem izinli hem de izinsiz, genel bir blok zinciri olarak tanımlanabilir. İzinli senaryoda denge modülü gerekli değildir.