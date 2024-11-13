---
sidebar_position: 3
---

# Sanal Makine (VM) Oluşturma

## Giriş

Camino'nun temel özelliklerinden biri,  tarafından tanımlanan yeni, özel blok zincirleri oluşturmaya olanak sağlamasıdır.

Bu eğitimde, çok basit bir VM oluşturacağız. VM tarafından tanımlanan blok zinciri bir  dir. Blok zincirindeki her blok, yaratıldığı andaki zaman damgasını ve 32 baytlık bir veri parçasını (yük) içerir. Her bloğun zaman damgası, kendi üstü (ebeveyn) olan bloğun zaman damgasından daha sonradır.

Böyle bir sunucu, bir verinin, blok oluşturulduğunda mevcut olduğunu kanıtlamak için kullanılabilir. Farz edelim ki bir kitap el yazmanız var ve gelecekte bu el yazmasının bugün mevcut olduğunu kanıtlamak istiyorsunuz. Blok zincirine, blok yükünün el yazınızın bir hash’i olduğu bir blok ekleyebilirsiniz. Gelecekte, o bloğun yükünde el yazınızın hash’ini göstererek el yazmasının bugün mevcut olduğunu kanıtlayabilirsiniz (bu, bir hash’in ön görüntüsünü bulmanın imkansız olmasından kaynaklanmaktadır).

Bir blok zinciri, Camino-Node'dan ayrı bir süreçte çalışabilir ve Camino-Node ile gRPC üzerinden iletişim kurabilir. Bu, `rpcchainvm` adlı,  kullanan ve başka bir VM uygulamasını saran özel bir VM ile mümkün kılınmıştır.

Bir VM uygulamasına geçmeden önce, bir VM’nin CaminoGo’nun uzlaşma motoruyla uyumlu olması için uygulaması gereken arayüze bakalım. Tüm kod parçalarını göstereceğiz ve açıklayacağız. Eğer tüm kodu tek bir yerde görmek istiyorsanız,  inceleyebilirsiniz.

---

**NOTLAR**

- Blok Zincirleri, Alt Ağlar, İşlemler ve Adreslerin kimlikleri her çalıştırma/ağ için farklı olabilir. Bu, eğitimde bazı girişlerin, uç noktaların vb. denediğinizde değişebileceği anlamına geliyor.
- Bu sayfada sunulan kod, en son sürüm/dalda yer alanlardan farklı olabilir.

---

## Arabirimler

### `block.ChainVM`

Doğrusal blok zincirlerinde (DAG blok zincirlerine kıyasla) uzlaşma sağlamak için Camino, Snowman uzlaşma motorunu kullanır. Snowman ile uyumlu olmak için, bir VM’nin `block.ChainVM` arayüzünü uygulaması gerekir ki bu arayüze  erişilebilir.

Arayüz geniştir, ancak endişelenmeyin, her bir yöntemi açıklayacağız ve bir uygulama örneğini göreceğiz; ayrıca hemen her detayı anlamanız gerekli değildir. Kod içindeki yorumlar, arayüz yöntemleri hakkında daha fazla ayrıntı sağlar.

```go title="/snow/engine/snowman/block/vm.go"
// ChainVM, bir Snowman VM'sinin gerekli işlevselliğini tanımlar.
//
// Bir Snowman VM'si, durumun temsili,
// o duruma yapılan işlemlerin temsili, o duruma
// yapılan işlemlerin uygulanması ve
// işlemlerin oluşturulması ile sorumludur. Uzlaşma,
// işlemin yürütülüp yürütülmeyeceğine ve işlemlerin hangi sırayla
// yürütüleceğine karar verecektir.
//
// Örneğin, ağ tarafından kabul edilen bir
// artırılan sayıyı izleyen bir VM'ye sahip olduğumuzu varsayalım.
// Durum tek bir sayıdır.
// İşlem, sayıyı yeni ve daha yüksek bir değere ayarlamaktır.
// İşlemi uygulamak, yeni değeri veritabanına kaydedecektir.
// VM, istediği zaman daha yüksek bir değerde yeni bir sayı
// çıkarmaya çalışabilir.
// Uzlaşma, ağın her blok yüksekliğinde sayıda
// üzerinde mutabık kalmasını sağlayacaktır.
type ChainVM interface {
	common.VM
	Getter
	Parser

	// VM'de bulunan verilerden yeni bir blok oluşturmaya
	// çalışma girişimi.
	//
	// Eğer VM yeni bir blok yayınlamak istemiyorsa, bir hata döndürülmelidir.
	BuildBlock() (snowman.Block, error)

	// VM'ye şu anda tercih edilen bloğu bildirir.
	//
	// Bu, uzlaşıma göre bilinen hiç çocuk içermeyen bir blok olmalıdır.
	SetPreference(ids.ID) error

	// LastAccepted, son kabul edilen bloğun kimliğini döndürür.
	//
	// Eğer henüz uzlaşma tarafından kabul edilen blok yoksa, kabul edilmesi
	// kesin olan bir blok olduğu varsayılır; bu, Genesis bloğudur ve
	// döndürülecektir.
	LastAccepted() (ids.ID, error)
}

// Getter, bir bloğu kimliğine göre alma işlevselliğini tanımlar.
type Getter interface {
	// Bir bloğu yüklemeye çalışma.
	//
	// Eğer blok mevcut değilse, bir hata döndürülmelidir.
	//
	GetBlock(ids.ID) (snowman.Block, error)
}

// Parser, bir bloğu baytlarıyla alma işlevselliğini tanımlar.
type Parser interface {
	// Bir bayt akışından bir blok oluşturmaya çalışma.
	//
	// Blok, herhangi bir ekstra bayt olmadan, tam bayt dizisiyle
	// temsil edilmelidir.
	ParseBlock([]byte) (snowman.Block, error)
}
```

### `common.VM`

`common.VM`, her `VM`'nin, ister DAG ister doğrusal zincir olsun, uygulaması gereken bir türdür.

Tam dosyayı  görebilirsiniz.

```go title="/snow/engine/common/vm.go"
// VM, tüm uzlaşma VM'lerinin uygulaması gereken arayüzü tanımlar
type VM interface {
    // VM'den VM'ye özel mesajlar için işleyicileri içerir
	AppHandler

	// VM sağlıklıysa nil döner.
	// Düğümün Sağlık API'si aracılığıyla periyodik olarak çağrılır ve rapor edilir.
	health.Checkable

	// Bağlantı bağlantı/kapatma durumunda çağrılan bir işleyiciyi temsil eder.
	validators.Connector

	// Bu VM'yi başlat.
	// [ctx]: Bu VM'ye ait meta veriler.
	//     [ctx.networkID]: Bu VM'nin zincirinin çalıştığı ağın kimliği.
	//     [ctx.chainID]: Bu VM'nin çalıştığı zincirin benzersiz kimliği.
	//     [ctx.Log]: Mesajları günlüğe kaydetmek için kullanılır.
	//     [ctx.NodeID]: Bu düğümün benzersiz staker kimliği.
	//     [ctx.Lock]: Bu VM ile bu VM'yi yöneten uzlaşma
	//                 motoru arasında paylaşılan bir Okuma/Yazma kilidi.
	//                 Yazma kilidi, uzlaşma motorundaki kod
	//                 VM'yi çağırdığında tutulur.
	// [dbManager]: Bu VM'nin verilerini kalıcı hale getireceği veritabanı yöneticisi.
	// [genesisBytes]: Bu VM'nin başlangıç durumunu başlatmak için kullandığı
	//                 başlangıç bilgilerin bayt kodlaması.
	//                 Örneğin, bu VM bir hesap tabanlı ödeme
	//                 sistemi olsaydı, `genesisBytes`, muhtemelen bazı hesaplara
	//                 jeton veren bir Genesis işlemini içerir ve bu
	//                 işlem, genesis bloğunda olurdu.
	// [toEngine]: Uzlaşma motoruna mesaj göndermek için kullanılan kanal.
	// [fxs]: Bu VM'ye ekleyecek özellik uzantıları.
	Initialize(
		ctx *snow.Context,
		dbManager manager.Manager,
		genesisBytes []byte,
		upgradeBytes []byte,
		configBytes []byte,
		toEngine chan= time.Now().Add(time.Hour).Unix() {
		return errTimestampTooLate
	}

	// Bu bloğu bellekte onaylanmış bloklara ekle
	b.vm.verifiedBlocks[b.ID()] = b

	return nil
}
```

#### Kabul Et

`Accept`, konsensüs tarafından bu bloğun kabul edildiğini belirtmek için çağrılır.

```go title="/timestampvm/block.go"
// Accept, bu bloğun durumunu Accepted olarak ayarlar ve lastAccepted'ı bu bloğun ID'sine ayarlar
// ve bu bilgiyi b.vm.DB'ye kaydeder
func (b *Block) Accept() error {
	b.SetStatus(choices.Accepted) // Bu bloğun durumunu değiştir
	blkID := b.ID()

	// Verileri kalıcı hale getir
	if err := b.vm.state.PutBlock(b); err != nil {
		return err
	}

	// Son kabul edilen ID'yi bu blok ID'si olarak ayarla
	if err := b.vm.state.SetLastAccepted(blkID); err != nil {
		return err
	}

	// Bu bloğu kabul edildiğinden dolayı onaylanmış bloklardan sil
	delete(b.vm.verifiedBlocks, b.ID())

	// Veritabanına değişiklikleri kaydet
	return b.vm.state.Commit()
}
```

#### Reddet

`Reject`, konsensüs tarafından bu bloğun reddedildiğini belirtmek için çağrılır.

```go title="/timestampvm/block.go"
// Reject, bu bloğun durumunu Rejected olarak ayarlar ve durumu belleğe kaydeder
// b.vm.DB.Commit() çağrısının veritabanına kalıcı hale getirilmesi gerektiğini unutmayın
func (b *Block) Reject() error {
	b.SetStatus(choices.Rejected) // Bu bloğun durumunu değiştir
	if err := b.vm.state.PutBlock(b); err != nil {
		return err
	}
	// Bu bloğu reddedildiğinden dolayı onaylanmış bloklardan sil
	delete(b.vm.verifiedBlocks, b.ID())
	// Veritabanına değişiklikleri kaydet
	return b.vm.state.Commit()
}
```

#### Blok Alan Yöntemleri

Bunlar `snowman.Block` arayüzü tarafından gereksinim duyulan yöntemlerdir.

```go title="/timestampvm/block.go"
// ID, bu bloğun ID'sini döner
func (b *Block) ID() ids.ID { return b.id }

// ParentID, [b]'nin ebeveyninin ID'sini döner
func (b *Block) Parent() ids.ID { return b.PrntID }

// Height, bu bloğun yüksekliğini döner. Genesis bloğu yükseklikte 0'dır.
func (b *Block) Height() uint64 { return b.Hght }

// Timestamp, bu bloğun zamanını döner. Genesis bloğu zaman 0'a sahiptir.
func (b *Block) Timestamp() time.Time { return time.Unix(b.Tmstmp, 0) }

// Status, bu bloğun durumunu döner
func (b *Block) Status() choices.Status { return b.status }

// Bytes, bu bloğun byte temsiline döner
func (b *Block) Bytes() []byte { return b.bytes }
```

#### Yardımcı Fonksiyonlar

Bu yöntemler bloklar için kolaylık sağlayan yöntemlerdir, blok arayüzünün bir parçası değildir.

```go
// Initialize, [b.bytes] 'i [bytes]'e, [b.id]'yi hash([b.bytes]) 'e,
// [b.status]'i [status]'e ve [b.vm]'yi [vm]'ye ayarlar
func (b *Block) Initialize(bytes []byte, status choices.Status, vm *VM) {
	b.bytes = bytes
	b.id = hashing.ComputeHash256Array(b.bytes)
	b.status = status
	b.vm = vm
}

// SetStatus, bu bloğun durumunu ayarlar
func (b *Block) SetStatus(status choices.Status) { b.status = status }
```

### Sanal Makine

Şimdi zaman damgası VM uygulamamıza bakalım, bu uygulama `block.ChainVM` arayüzünü uygular.

Açıklama şu şekildedir:

```go title="/timestampvm/vm.go"
// Bu Sanal Makine, bir zaman damgası sunucusu olarak işlev gören bir blok zincirini tanımlar
// Her blok, oluşturulduğu zaman damgası ile birlikte veri (bir yük) içerir

const (
  dataLen = 32
	Name    = "timestampvm"
)

// VM, snowman.VM arayüzünü uygular
// Bu zincirdeki her blok, bir Unix zaman damgası
// ve bir veri parçası (bir string) içerir
type VM struct {
	// Bu vm'nin bağlamı
	ctx       *snow.Context
	dbManager manager.Manager

	// Bu VM'nin durumu
	state State

	// Tercih edilen bloğun ID'si
	preferred ids.ID

	// Konsensüs motoruna mesaj göndermek için kanal
	toEngine chan Blok
	// Her eleman, doğrulamayı geçmiş ancak henüz kabul edilmemiş/red edilmeyen bir bloktur
	verifiedBlocks map[ids.ID]*Block
}
```

#### Başlat

Bu yöntem, yeni bir VM örneği başlatıldığında çağrılır. Bu yöntem altında Genesis bloğu oluşturulur.

```go title="/timestampvm/vm.go"
// Bu vm'yi başlat
// [ctx], bu vm'nin bağlamıdır
// [dbManager], bu vm'nin veritabanı yöneticisidir
// [toEngine], konsensüs motoruna yeni blokların eklenmeye hazır olduğunu bildirmek için kullanılır
// Genesis bloğundaki veriler [genesisData]'dır
func (vm *VM) Initialize(
	ctx *snow.Context,
	dbManager manager.Manager,
	genesisData []byte,
	upgradeData []byte,
	configData []byte,
	toEngine chan dataLen {
		return errBadGenesisBytes
	}

	// genesisData bir byte kesidi ama her blok bir bayt dizisi içerir
	// genesisData'nın ilk [dataLen] baytını al ve bir diziye koy
	var genesisDataArr [dataLen]byte
	copy(genesisDataArr[:], genesisData)

	// Genesis bloğunu oluştur
	// Genesis bloğunun zaman damgası 0'dır. Ebeveyni yoktur.
	genesisBlock, err := vm.NewBlock(ids.Empty, 0, genesisDataArr, time.Unix(0, 0))
	if err != nil {
		log.Error("Genesis bloğu oluşturulurken hata: %v", err)
		return err
	}

	// Genesis bloğunu duruma koy
	if err := vm.state.PutBlock(genesisBlock); err != nil {
		log.Error("Genesis bloğu kaydedilirken hata: %v", err)
		return err
	}

	// Genesis bloğunu kabul et
	// [vm.lastAccepted] ve [vm.preferred] değerlerini ayarlar
	if err := genesisBlock.Accept(); err != nil {
		return fmt.Errorf("genesis bloğunu kabul ederken hata: %w", err)
	}

	// Bu vm'nin durumunu başlatıldığına işaret et, böylece ilerideki başlangıçlarda initGenesis'ı atlayabiliriz
	if err := vm.state.SetInitialized(); err != nil {
		return fmt.Errorf("veritabanını başlatılmış olarak ayarlarken hata: %w", err)
	}

	// VM'nin veritabanasını temel veritabanasına aktar
	return vm.state.Commit()
}
```

#### CreateHandlers

Service'de tanımlı işleyicilere kaydeder. API'ler hakkında daha fazlası için  bakın.

```go title="/timestampvm/vm.go"
// CreateHandlers, bir harita döner:
// Anahtarlar: Bu blok zincirinin API'si için yol uzantısı (bu durumda boş)
// Değerler: API için işleyici
// Bu durumda, blok zincirimizin yalnızca bir API'si vardır, buna zaman damgası adını veriyoruz,
// ve yol uzantısı yoktur, bu nedenle API uç noktası:
// [Düğüm IP]/ext/bc/[bu blok zincirinin ID'si]
// Daha fazla bilgi için belgelerde API bölümüne bakın
func (vm *VM) CreateHandlers() (map[string]*common.HTTPHandler, error) {
	server := rpc.NewServer()
	server.RegisterCodec(json.NewCodec(), "application/json")
	server.RegisterCodec(json.NewCodec(), "application/json;charset=UTF-8")
    // Adı "timestampvm"
	if err := server.RegisterService(&Service{vm: vm}, Name); err != nil {
		return nil, err
	}

	return map[string]*common.HTTPHandler{
		"": {
			Handler: server,
		},
	}, nil
}
```

#### CreateStaticHandlers

StaticService'de tanımlı statik işleyicileri kaydeder. Statik API'ler için daha fazlası için  bakın.

```go title="/timestampvm/vm.go"
// CreateStaticHandlers, bir harita döner:
// Anahtarlar: Bu VM'nin statik API'si için yol uzantısı
// Değerler: O statik API için işleyici
func (vm *VM) CreateStaticHandlers() (map[string]*common.HTTPHandler, error) {
	server := rpc.NewServer()
	server.RegisterCodec(json.NewCodec(), "application/json")
	server.RegisterCodec(json.NewCodec(), "application/json;charset=UTF-8")
	if err := server.RegisterService(&StaticService{}, Name); err != nil {
		return nil, err
	}

	return map[string]*common.HTTPHandler{
		"": {
			LockOptions: common.NoLock,
			Handler:     server,
		},
	}, nil
}
```

#### BuildBlock

`BuildBlock`, yeni bir blok oluşturur ve geri döner. Bu, çoğunlukla konsensüs motoru tarafından talep edilir.

```go title="/timestampvm/vm.go"
// BuildBlock, bu vm'nin konsensüse eklemek istediği bir bloğu döner
func (vm *VM) BuildBlock() (snowman.Block, error) {
	if len(vm.mempool) == 0 { // Oluşturulacak blok yok
		return nil, errNoPendingBlocks
	}

	// Yeni blokta yerleştirilecek değeri al
	value := vm.mempool[0]
	vm.mempool = vm.mempool[1:]

	// Bloğu oluşturduktan sonra önbellek katmanındaki daha fazla bekleyen veri olduğu takdirde
	// (bunu yaptığı durumda) konsensüs motoruna bildir
	if len(vm.mempool) > 0 {
		defer vm.NotifyBlockReady()
	}

	// Tercih edilen Bloku al
	preferredBlock, err := vm.getBlock(vm.preferred)
	if err != nil {
		return nil, fmt.Errorf("tercih edilen bloğu alamadı: %w", err)
	}
	preferredHeight := preferredBlock.Height()

	// Tercih edilen yükseklik ile bloğu oluştur
	newBlock, err := vm.NewBlock(vm.preferred, preferredHeight+1, value, time.Now())
	if err != nil {
		return nil, fmt.Errorf("blok oluşturulamadı: %w", err)
	}

	// Bloğu doğrula
	if err := newBlock.Verify(); err != nil {
		return nil, err
	}
	return newBlock, nil
}
```

#### NotifyBlockReady

`NotifyBlockReady`, konsensüs motoruna bir yeni bloğun hazır olduğu bilgisini gönderen yardımcı bir yöntemdir.

```go title="/timestampvm/vm.go"
// NotifyBlockReady, konsensüs motoruna yeni bir blok
// hazır olduğunun bilgisini verir
func (vm *VM) NotifyBlockReady() {
	select {
	case vm.toEngine  0 {
        argBytes = make([]byte, args.Length)
        copy(argBytes, args.Data)
    } else {
        argBytes = []byte(args.Data)
    }

    bytes, err := formatting.EncodeWithChecksum(args.Encoding, argBytes)
    if err != nil {
        return fmt.Errorf("veriyi dize olarak kodlamak mümkün olmadı: %s", err)
    }
    reply.Bytes = bytes
    reply.Encoding = args.Encoding
    return nil
}
```

#### Çözme

Bu API metodu, `Encode` metodunun tersidir.

```go title="/timestampvm/static_service.go"
// DecoderArgs, Çözmek için argümanlardır
type DecoderArgs struct {
    Bytes    string              `json:"bytes"`
    Encoding formatting.Encoding `json:"encoding"`
}

// DecoderReply, Decoder'dan gelen yanıttır
type DecoderReply struct {
    Data     string              `json:"data"`
    Encoding formatting.Encoding `json:"encoding"`
}

// Decoder, Çözülmüş veriyi döndürür
func (ss *StaticService) Decode(_ *http.Request, args *DecoderArgs, reply *DecoderReply) error {
    bytes, err := formatting.Decode(args.Encoding, args.Bytes)
    if err != nil {
        return fmt.Errorf("veriyi dize olarak çözmek mümkün olmadı: %s", err)
    }
    reply.Data = string(bytes)
    reply.Encoding = args.Encoding
    return nil
}
```

### API

Bir VM, ayrıca istemcilerin blok zincirinin durumunu sorgulamasına ve güncellemesine izin veren statik olmayan bir HTTP API'sine de sahip olabilir.

`Service`'ın bildirimi şöyledir:

```go title="/timestampvm/service.go"
// Service, bu VM için API hizmetidir
type Service struct{ vm *VM }
```

Bu yapının VM'ye referansı olduğunu ve böylece durumu sorgulayıp güncelleyebildiğini unutmayın.

Bu VM'nin API'si iki metoda sahiptir. Birincisi, bir istemcinin bir blok almasına olanak tanırken, diğeri istemcinin bu blok zincirinin bir sonraki bloğunu önermesine olanak tanır. Endpoint'teki blok zinciri kimliği değişir çünkü her blok zinciri benzersiz bir kimliğe sahiptir.

#### timestampvm.getBlock

ID'si ile bir blok alır. Eğer ID verilmemişse, en son bloğu alır.

**İmza**

```sh
timestampvm.getBlock({id: string}) ->
    {
        id: string,
        data: string,
        timestamp: int,
        parentID: string
    }
```

- `id`, getirilen bloğun kimliğidir. Eğer argümanlardan çıkarılmışsa, en son bloğu alır.
- `data`, bloğun 32 byte yükünün base 58 (checksum ile) temsilidir.
- `timestamp`, bu bloğun oluşturulduğu Unix zaman damgasıdır.
- `parentID`, bloğun ebeveynidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "timestampvm.getBlock",
    "params":{
        "id":"xqQV1jDnCXDxhfnNT7tDBcXeoH2jC3Hh7Pyv4GXE1z1hfup5K"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/sw813hGSWH8pdU9uzaYy9fCtYFfY7AjDd2c9rm64SbApnvjmk
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "timestamp": "1581717416",
    "data": "11111111111111111111111111111111LpoYY",
    "id": "xqQV1jDnCXDxhfnNT7tDBcXeoH2jC3Hh7Pyv4GXE1z1hfup5K",
    "parentID": "22XLgiM5dfCwTY9iZnVk8ZPuPe3aSrdVr5Dfrbxd3ejpJd7oef"
  },
  "id": 1
}
```

**Uygulama**

```go title="/timestampvm/service.go"
// GetBlockArgs, GetBlock için argümanlardır
type GetBlockArgs struct {
	// Alınan bloğun ID'si.
	// Boş bırakılırsa, en son bloğu alır
	ID *ids.ID `json:"id"`
}

// GetBlockReply, GetBlock'dan gelen yanıttır
type GetBlockReply struct {
	Timestamp json.Uint64 `json:"timestamp"` // En son bloğun zaman damgası
	Data      string      `json:"data"`      // En son bloka ait veri. 5 byte'in base 58 temsili.
	ID        ids.ID      `json:"id"`        // En son bloğun ID'sinin string temsili
	ParentID  ids.ID      `json:"parentID"`  // En son bloğun ebeveyninin string temsili
}

// GetBlock, [args.ID] olan bloğu alır
// [args.ID] boşsa, en son bloğu alır
func (s *Service) GetBlock(_ *http.Request, args *GetBlockArgs, reply *GetBlockReply) error {
	// Eğer bir ID verilmişse, string temsilini bir ids.ID olarak ayrıştır
	// Eğer ID verilmemişse, ID, son kabul edilen bloğun ID'si olur
	var (
		id  ids.ID
		err error
	)

	if args.ID == nil {
		id, err = s.vm.state.GetLastAccepted()
		if err != nil {
			return errCannotGetLastAccepted
		}
	} else {
		id = *args.ID
	}

	// Veritabanından bloğu al
	block, err := s.vm.getBlock(id)
	if err != nil {
		return errNoSuchBlock
	}

	// Yanıtı bloğun verileri ile doldur
	reply.ID = block.ID()
	reply.Timestamp = json.Uint64(block.Timestamp().Unix())
	reply.ParentID = block.Parent()
	data := block.Data()
	reply.Data, err = formatting.EncodeWithChecksum(formatting.CB58, data[:])

	return err
}
```

#### timestampvm.proposeBlock

Bu blok zincirinin bir sonraki bloğunu önermektedir.

**İmza**

```sh
timestampvm.proposeBlock({data: string}) -> {success: bool}
```

- `data`, önerilen bloğun 32 byte yükünün base 58 (checksum ile) temsilidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "timestampvm.proposeBlock",
    "params":{
        "data":"SkB92YpWm4Q2iPnLGCuDPZPgUQMxajqQQuz91oi3xD984f8r"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/sw813hGSWH8pdU9uzaYy9fCtYFfY7AjDd2c9rm64SbApnvjmk
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "Success": true
  },
  "id": 1
}
```

**Uygulama**

```go title="/timestampvm/service.go"
// ProposeBlockArgs, ProposeValue için argümanlardır
type ProposeBlockArgs struct {
    // Yeni blok için veri. 32 byte'ların base 58 kodlaması (checksum ile) olmalı.
    Data string
}

// ProposeBlockReply, ProposeBlock işlevinden gelen yanıttır
type ProposeBlockReply struct{
    // İşlemin başarılı olup olmadığını belirtir
    Success bool
}

// ProposeBlock, [args].Data olan yeni bir bloğu önermek için bir API metodudur.
// [args].Data, 32 byte'lık bir dizinin string temsili olmalıdır
func (s *Service) ProposeBlock(_ *http.Request, args *ProposeBlockArgs, reply *ProposeBlockReply) error {
	bytes, err := formatting.Decode(formatting.CB58, args.Data)
	if err != nil || len(bytes) != dataLen {
		return errBadData
	}

	var data [dataLen]byte         // Veriler bir byte dizisi olarak
	copy(data[:], bytes[:dataLen]) // Verileri dataSlice'dan data'ya kopyala

	s.vm.proposeBlock(data)
	reply.Success = true
	return nil
}
```

### Eklenti

Bu VM'nin `go-plugin` ile uyumlu olabilmesi için, gRPC üzerinden VM'mizi sunacak bir `main` paketi ve metot tanımlanmalıdır.

`main.go`'nun içeriği:

```go title="/main/main.go"
func main() {
    log.Root().SetHandler(log.LvlFilterHandler(log.LvlDebug, log.StreamHandler(os.Stderr, log.TerminalFormat())))
    plugin.Serve(&plugin.ServeConfig{
        HandshakeConfig: rpcchainvm.Handshake,
        Plugins: map[string]plugin.Plugin{
            "vm": rpcchainvm.New(&timestampvm.VM{}),
        },

        // Burada bir değer belirlenmişse, bu eklenti için gRPC sunumunu etkinleştirir...
        GRPCServer: plugin.DefaultGRPCServer,
    })
}
```

Artık CaminoGo'nun `rpcchainvm` bu eklentiye bağlanabilir ve yöntemlerini çağırabilir.

### Çalıştırılabilir İkili

Bu VM, bir  ile çalıştırılabilir bir dosya oluşturur (çağrıldığında, yukarıdaki `main` metodunu çalıştırır).

İkili dosyanın yolu ve adı, derleme betiğine argümanlar aracılığıyla sağlanabilir. Örneğin:

```text
./scripts/build.sh ../camino-node/build/plugins timestampvm
```

Eğer hiçbir argüman verilmezse, yol varsayılan olarak aşağıdaki gibi adlandırılan bir ikili ile ayarlanır: `$GOPATH/src/github.com/chain4travel/camino-node/build/plugins/tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`

Bu isim `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`, VM için CB58 kodlu 32 byte kimliktir. Zaman damgası vm için bu, "timestampvm" dizesinin 32 byte dizisi içinde sıfır uzatması ve CB58'de kodlanmasıdır.

### VM Takma Adları

Her VM'nin önceden tanımlanmış, statik bir kimliği vardır. Örneğin, Zaman DamgasıVM'nin varsayılan kimliği: `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`.

Bu kimlikler için bir takma ad vermek mümkündür. Örneğin, Zaman DamgasıVM'yi, `~/.caminogo/configs/vms/aliases.json` dosyasını oluşturarak takma adlandırabiliriz:

```json
{
  "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": [
    "timestampvm",
    "timestamp"
  ]
}
```

### VM Kurulumu

Camino-Node, eklentileri  altındaki `plugins` dizininde arar ve kaydeder.

Blok zincirini düğümünüze kurmak için, derlenmiş sanal makine ikilisini bu dizin altına taşımanız gerekmektedir. Sanal makine çalıştırılabilir adları tam sanal makine kimliği (CB58 kodlu) veya bir VM takma adı olmalıdır.

İkili dosyasını eklenti dizinine kopyalayın.

```bash
cp -n  $GOPATH/src/github.com/chain4travel/camino-node/build/plugins/
```

#### Düğüm çalışmıyor

Eğer düğümünüz henüz çalışmıyorsa, düğümü başlatarak tüm sanal makineleri `plugin` dizinine kurabilirsiniz.

#### Düğüm zaten çalışıyor

İkili dosyayı `loadVMs` API'si ile yükleyin. Düğüm üzerindeki Yöneticinin API'sinin etkinleştirildiğinden emin olun, `--api-admin-enabled` bayrağını uygulayın.

```bash
curl -sX POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.loadVMs",
    "params" :{}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

`loadVMs` yanıtının yeni kurulan sanal makineyi `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH` içerdiğinden emin olun. Bu sanal makineyi ve daha önce kurulu olmayan diğerlerini yanıt içinde göreceksiniz.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "newVMs": {
      "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": [
        "timestampvm",
        "timestamp"
      ],
      "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ": []
    }
  },
  "id": 1
}
```

Artık bu VM'nin statik API'si `/ext/vm/timestampvm` ve `/ext/vm/timestamp` uç noktalarından erişilebilir. VM konfigürasyonu hakkında daha fazla bilgi için  bakabilirsiniz.

Bu eğiticide, süreci basitleştirmek için çalıştırılabilir isim olarak VM'nin kimliğini kullandık. Ancak, Camino-Node, bu adı bir önceki adımda kaydedilen takma ad `timestampvm` veya `timestamp` olarak da kabul edecektir.

## Sonuç

Hepsi bu kadar! Bu, blok zinciri tabanlı bir zaman damgası sunucusunu tanımlayan bir VM'nin tüm uygulamasıdır.

Bu eğitimde şunları öğrendik:

- Tüm VM'lerin uygulaması gereken `block.ChainVM` arayüzü.
- Tüm blokların uygulaması gereken `snowman.Block` arayüzü.
- Blok zincirlerinin kendi süreçlerinde çalışmasına izin veren `rpcchainvm` tipi.
- `block.ChainVM` ve `snowman.Block` realitesinin gerçek uygulaması.