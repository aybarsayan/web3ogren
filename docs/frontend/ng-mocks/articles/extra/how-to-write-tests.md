---
title: Angular'da test yazma önerisi
description: Angular'da test yazma sürecine dair öneriler ve en iyi uygulamalar. Testlerin nasıl daha sürdürülebilir ve yönetilebilir hale getirileceği üzerine kapsamlı bir kılavuz.
keywords: [Angular, test yazma, birim testleri, sürdürülebilir öneriler, ng-mocks, yazılım geliştirme]
---

Yıllar boyunca kod yazıp bunu birim testleri ile kapsadıktan sonra, kapsamsız değişkenler ile yapılan varsayılan önerinin, zamanla eklemek istediğimiz bir testi eskiden yazılmış bir spesifikasyona veya bir şeyi yeniden düzenlemek gerektiğinde daha fazla probleme yol açtığını fark ettim.

:::info
Varsayılan önerinin bir örneğine bakalım, fakat daha gerçekçi hale getirmek için bazı casusları ekleyelim:
:::

```ts
describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  
  // casuslar için eklendi
  let userService: UserService;
  let userSaveSpy: Spy<UserService['save']>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [UserService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    
    // bazı casuslar    
    userService = TestBed.inject(UserService);
    userSaveSpy = spyOn(userService, 'save');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

Testi gözden geçirelim. Sadece 1 bileşen, 1 fixture, 1 servis ve yalnızca 1 casus için bile yaklaşık 15 satır kodumuz var.

:::warning
Daha fazla metodu casuslamak ve daha fazla servise erişmek gerekirse ne olur? Cevap: gereksiz kod o kadar büyüyecek ki bir noktada her kapsamlı değişken arasında kaybolacağız.
:::

Ayrıca durumu daha da kötüleştirmek için, bazı casuslar kesinlikle özelleştirilmiş olacak, oysa özelleştirme bizim biraz farklı gereksinimlerimize uygun değil. Ve tabii ki, eğer onlara dokunursak, diğer testler başarısız olacaktır.

Bunun çözümü, "Kurulumu azaltmak" ve her testi izole etmektir. Neyse ki, Angular belgeleri zaten bu öneriye sahiptir, ancak ne yazık ki, bu pek vurgulanmamıştır; oysa bu, sürdürülebilir spesifikasyonlar için anahtardır.

## Sürdürülebilir Öneri

Öneri, kapsamlı değişkenler olmadan ve aşağıdaki yapıyla test yazmaktır:

```ts
describe('suite', () => {
  beforeEach(() => {
    // 1. tüm testler için TestBed'i yapılandırma
  });

  it('test', () => {
    // 2. mockları özelleştirme, girdileri yapılandırma, vb.
    // 3. bir fixture oluşturma
    // 4. beklentileri doğrulama
  });
});
```

Bu yaklaşım ile test şöyle görünecek:

```ts
describe('BannerComponent', () => {
  beforeEach(waitForAsync(() => {
    // 1. tüm testler için TestBed'i yapılandırma
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [UserService],
    }).compileComponents();
  }));

  it('should create', () => {    
    // 2. mockları özelleştirme, girdileri yapılandırma, vb.
    // yapılacak bir şey yok
    
    // 3. bir fixture oluşturma
    const fixture = TestBed.createComponent(BannerComponent);
    fixture.detectChanges();

    // 4. beklentileri doğrulama
    expect(fixture.componentInstance).toBeDefined();
  });
  
  it('should do something with a service', () => {
    // 2. mockları özelleştirme, girdileri yapılandırma, vb.
    const userService = TestBed.inject(UserService);
    const userSaveSpy = spyOn(userService, 'save');

    // 3. bir fixture oluşturma
    const fixture = TestBed.createComponent(BannerComponent);
    const component = fixture.componentInstance;
    component.action = 'save-user';
    fixture.detectChanges();
    
    // 4. beklentileri doğrulama
    expect(userSaveSpy).toHaveBeenCalled();
  });
});
```

Artık her test bağımsız ve kapsamlı değişkenlere bağlı değil. "should create" artık casuslar içermiyor, çünkü bu gereksiz. "should do something with a service" yalnızca kendi test durumu için geçerli olan casusları ve özelleştirmeleri tanımlıyor.

:::note
Şimdi `ng-mocks` kullanarak kodu daha da azaltalım:
:::

```ts
describe('BannerComponent', () => {
  // 1. tüm testler için TestBed'i yapılandırma
  beforeEach(() => MockBuilder(BannerComponent, BannerModule));

  it('should create', () => {    
    // 2. mockları özelleştirme, girdileri yapılandırma, vb.
    // yapılacak bir şey yok
    
    // 3. bir fixture oluşturma
    const fixture = MockRender(BannerComponent);

    // 4. beklentileri doğrulama
    expect(fixture.point.componentInstance).toBeDefined();
  });
  
  it('should do something with a service', () => {
    // 2. mockları özelleştirme, girdileri yapılandırma, vb.
    const userSaveSpy = MockInstance(UserService, 'save', jasmine.createSpy());

    // 3. bir fixture oluşturma
    const fixture = MockRender(BannerComponent, {
      action: 'save-user',
    });
    
    // 4. beklentileri doğrulama
    expect(userSaveSpy).toHaveBeenCalled();
  });
});
```

Gördüğünüz gibi, testler artık doğrulama için daha az kod gerektiriyor ve en önemlisi: şimdi okumaları gerçekten kolay, çünkü her test bir hikaye gibi; yukarıdan aşağıya doğru okuyarak ne olacağını anlamak için dışarı çıkmam gerekmiyor.

Ne yazık ki, diğer `ng-mocks` belgelerindeki testlerin hepsi bu yaklaşımı takip etmiyor. Bu, geliştiricilerin yeni yapının karmaşasına kapılmamaları için `ng-mocks` özelliklerini tanımayı basitleştirmek amacıyla yapılmıştır.

Bu nedenle tavsiyem: her zaman yukarıdaki yapıyı takip edin ve kalan belgeleri `ng-mocks` özellikleri için bir referans olarak okuyun. Ayrıca, `ng-mocks ile yardım ihtiyacınız varsa` topluluğumuzla iletişime geçmekte özgürsünüz.