---
title: Test Etme & Taklit Etme
seoTitle: Test Etme ve Taklit Üretme - Connect-Swift
sidebar_position: 6
description: Bu bölümde Connect-Swift APIlerini test etmek ve Protobuf tanımlarından taklit istemci uygulamaları üretmek için kullanılan yöntemler açıklanmaktadır.
tags: 
  - Connect-Swift
  - Test Etme
  - Taklit Üretme
  - Protobuf
  - Geliştirme
keywords: 
  - Connect-Swift
  - Test Etme
  - Taklit Üretme
  - Protobuf
  - Geliştirme
---
## Taklit Üretme

Oluşturulan Connect-Swift API'lerini test etmek, Protobuf tanımlarınızdan taklit istemci uygulamaları üretmek için [`connect-swift-mocks` eklentisi][connect-swift-mocks-plugin] kullanarak kolayca gerçekleştirilebilir. Bu eklenti, üretim [`connect-swift` eklentisi][connect-swift-plugin] ile aynı `seçenekleri` destekler.

Bu `buf.gen.yaml` dosyası, `Generated` klasörüne üretim arayüzleri ve uygulamaları ile birlikte `GeneratedMocks` klasörüne karşılık gelen bir taklit seti üretmeyi göstermektedir:

```yaml
version: v2
plugins:
  # Üretilen modeller
  - remote: buf.build/apple/swift
    out: Generated
    opt: Visibility=Public
  # Üretimden üretilen hizmetler/yöntemler
  - remote: buf.build/connectrpc/swift
    out: Generated
    opt:
      - GenerateAsyncMethods=true
      - GenerateCallbackMethods=true
      - Visibility=Public
  # Taklit üretilen hizmetler/yöntemler
  - remote: buf.build/connectrpc/swift-mocks
    out: GeneratedMocks
    opt:
      - GenerateAsyncMethods=true
      - GenerateCallbackMethods=true
      - Visibility=Public
```

**Belirttiğiniz `GenerateAsyncMethods` ve `GenerateCallbackMethods` `seçenekleri`, üretim istemcileri için kullandığınız seçenek(ler) ile eşleşmelidir.**

Örnek olarak, bu Protobuf dosyasını ele alalım:

```protobuf
syntax = "proto3";

package connectrpc.eliza.v1;

service ElizaService {
    rpc Say(SayRequest) returns (SayResponse) {}
    rpc Converse(stream ConverseRequest) returns (stream ConverseResponse) {}
}

message SayRequest {
    string sentence = 1;
}

message SayResponse {
    string sentence = 1;
}

message ConverseRequest {
    string sentence = 1;
}

message ConverseResponse {
    string sentence = 1;
}
```

Üretim `connect-swift` eklentisi çağrıldığında, her hizmet için **2 şey** üretir:

- `*ClientInterface` ile biten bir protokol arayüzü
- Protokole uyan ve `*Client` ile biten bir üretim uygulaması



Genişletmek için tıklayın eliza.connect.swift


```swift
import Connect
import Foundation
import SwiftProtobuf

public protocol Connectrpc_Eliza_V1_ElizaServiceClientInterface: Sendable {
    @discardableResult
    func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers, completion: @escaping @Sendable (ResponseMessage<Connectrpc_Eliza_V1_SayResponse>) -> Void) -> Cancelable

    func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers) async -> ResponseMessage<Connectrpc_Eliza_V1_SayResponse>

    func `converse`(headers: Headers, onResult: @escaping @Sendable (StreamResult<Connectrpc_Eliza_V1_ConverseResponse>) -> Void) -> any BidirectionalStreamInterface<Connectrpc_Eliza_V1_ConverseRequest>

    func `converse`(headers: Headers) -> any BidirectionalAsyncStreamInterface<Connectrpc_Eliza_V1_ConverseRequest, Connectrpc_Eliza_V1_ConverseResponse>
}

/// `Connectrpc_Eliza_V1_ElizaServiceClientInterface` için somut uygulama.
public final class Connectrpc_Eliza_V1_ElizaServiceClient: Connectrpc_Eliza_V1_ElizaServiceClientInterface, Sendable {
    private let client: ProtocolClientInterface

    public init(client: ProtocolClientInterface) {
        self.client = client
    }

    @discardableResult
    public func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers = [:], completion: @escaping @Sendable (ResponseMessage<Connectrpc_Eliza_V1_SayResponse>) -> Void) -> Cancelable {
        return self.client.unary(path: "connectrpc.eliza.v1.ElizaService/Say", request: request, headers: headers, completion: completion)
    }

    public func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers = [:]) async -> ResponseMessage<Connectrpc_Eliza_V1_SayResponse> {
        return await self.client.unary(path: "connectrpc.eliza.v1.ElizaService/Say", request: request, headers: headers)
    }

    public func `converse`(headers: Headers = [:], onResult: @escaping @Sendable (StreamResult<Connectrpc_Eliza_V1_ConverseResponse>) -> Void) -> any BidirectionalStreamInterface<Connectrpc_Eliza_V1_ConverseRequest> {
        return self.client.bidirectionalStream(path: "connectrpc.eliza.v1.ElizaService/Converse", headers: headers, onResult: onResult)
    }

    public func `converse`(headers: Headers = [:]) -> any BidirectionalAsyncStreamInterface<Connectrpc_Eliza_V1_ConverseRequest, Connectrpc_Eliza_V1_ConverseResponse> {
        return self.client.bidirectionalStream(path: "connectrpc.eliza.v1.ElizaService/Converse", headers: headers)
    }
}
```



Taklit `connect-swift-mocks` eklentisi çağrıldığında, üretim istemcisi ile aynı arayüze uyan `*ClientMock` ile biten bir uygulama içeren bir `.mock.swift` dosyası üretir:



Genişletmek için tıklayın eliza.mock.swift


```swift
import Combine
import Connect
import ConnectMocks
import Foundation
import SwiftProtobuf

/// `Connectrpc_Eliza_V1_ElizaServiceClientInterface` için taklit uygulaması.
open class Connectrpc_Eliza_V1_ElizaServiceClientMock: Connectrpc_Eliza_V1_ElizaServiceClientInterface, @unchecked Sendable {
    private var cancellables = [Combine.AnyCancellable]()

    /// `say()` için taklit edildi.
    public var mockSay = { (_: Connectrpc_Eliza_V1_SayRequest) -> ResponseMessage<Connectrpc_Eliza_V1_SayResponse> in .init(result: .success(.init())) }
    /// Asenkron `say()` çağrıları için taklit edildi.
    public var mockAsyncSay = { (_: Connectrpc_Eliza_V1_SayRequest) -> ResponseMessage<Connectrpc_Eliza_V1_SayResponse> in .init(result: .success(.init())) }
    /// `converse()` için taklit edildi.
    public var mockConverse = MockBidirectionalStream<Connectrpc_Eliza_V1_ConverseRequest, Connectrpc_Eliza_V1_ConverseResponse>()
    /// Asenkron `converse()` çağrıları için taklit edildi.
    public var mockAsyncConverse = MockBidirectionalAsyncStream<Connectrpc_Eliza_V1_ConverseRequest, Connectrpc_Eliza_V1_ConverseResponse>()

    public init() {}

    @discardableResult
    open func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers = [:], completion: @escaping @Sendable (ResponseMessage<Connectrpc_Eliza_V1_SayResponse>) -> Void) -> Cancelable {
        completion(self.mockSay(request))
        return Cancelable {}
    }

    open func `say`(request: Connectrpc_Eliza_V1_SayRequest, headers: Headers = [:]) async -> ResponseMessage<Connectrpc_Eliza_V1_SayResponse> {
        return self.mockAsyncSay(request)
    }

    open func `converse`(headers: Headers = [:], onResult: @escaping @Sendable (StreamResult<Connectrpc_Eliza_V1_ConverseResponse>) -> Void) -> any BidirectionalStreamInterface<Connectrpc_Eliza_V1_ConverseRequest> {
        self.mockConverse.$inputs.first { !$0.isEmpty }.sink { _ in self.mockConverse.outputs.forEach(onResult) }.store(in: &self.cancellables)
        return self.mockConverse
    }

    open func `converse`(headers: Headers = [:]) -> any BidirectionalAsyncStreamInterface<Connectrpc_Eliza_V1_ConverseRequest, Connectrpc_Eliza_V1_ConverseResponse> {
        return self.mockAsyncConverse
    }
}
```



## Üretilen taklitleri kullanma

`Öğreticide` belirtildiği gibi, uygulamanızın doğrudan somut türler yerine `*ClientInterface` protokollerini kullanmasını öneririz. Bu, somut uygulamaları üretilen taklit uygulamaları ile değiştirmeyi kolaylaştırır:

```swift
final class MessagingViewModel: ObservableObject {
    //highlight-next-line
    private let elizaClient: Connectrpc_Eliza_V1_ElizaServiceClientInterface

    //highlight-next-line
    init(elizaClient: Connectrpc_Eliza_V1_ElizaServiceClientInterface) {
        self.elizaClient = elizaClient
    }

    @Published private(set) var messages: [Message] {...}

    func send(_ sentence: String) async {
        let request = Connectrpc_Eliza_V1_SayRequest.with { $0.sentence = sentence }
        let response = await self.elizaClient.say(request: request, headers: [:])
        ...
    }
}
```

`Kullanılan taklitleri` kullanmak için `ConnectMocks` kütüphanesini dahil etmeniz gerekecektir. Bu kütüphane, `Connect` kütüphanesi ile birlikte [Connect-Swift repo][connect-swift] içinde mevcuttur.

Bu, aşağıdaki gibi entegre edilebilir:

- Swift Paket Yöneticisi, ana `Connect` kütüphanesi ile aynı [GitHub URL'si][connect-swift] ve `talimatlar` kullanılarak.
- CocoaPods, `Connect-Swift-Mocks` CocoaPod'u kullanarak.

Daha sonra, üretim uygulamaları yerine taklit uygulamalarını enjekte eden birim testleri yazabilirsiniz; bu, istekleri doğrulamayı ve taklit edilen yanıt verilerini sağlamayı kolaylaştırır:

```swift
import Connect
import ConnectMocks
@testable import ElizaApp // Uygulama mantığınızı içeren hedef
import SwiftProtobuf
import XCTest

final class ElizaAppTests: XCTestCase {
    /// Taklit üretilmiş bir istemcinin birunary view modeline enjekte edildiği örnek test.
    @MainActor
    func testUnaryMessagingViewModel() async {
        let client = Connectrpc_Eliza_V1_ElizaServiceClientMock()
        client.mockAsyncSay = { request in
            XCTAssertEqual(request.sentence, "hello!")
            return ResponseMessage(result: .success(.with { $0.sentence = "hi, i'm eliza!" }))
        }

        let viewModel = MessagingViewModel(elizaClient: client)
        await viewModel.send("hello!")

        XCTAssertEqual(viewModel.messages.count, 2)
        XCTAssertEqual(viewModel.messages[0].message, "hello!")
        XCTAssertEqual(viewModel.messages[0].author, .user)
        XCTAssertEqual(viewModel.messages[1].message, "hi, i'm eliza!")
        XCTAssertEqual(viewModel.messages[1].author, .eliza)
    }
}
```

Benzer testler, üretilen `asenkron` versiyonunu kullanan bir `BidirectionalStreamingMessagingViewModel` varsayılarak yazılabilir:

```swift
/// Taklit üretilmiş bir istemcinin bidirectional stream view modeline enjekte edildiği örnek test.
@MainActor
func testBidirectionalStreamMessagingViewModel() async {
    let client = Connectrpc_Eliza_V1_ElizaServiceClientMock()
    client.mockAsyncConverse.outputs = [.message(.with { $0.sentence = "hi, i'm eliza!" })]

    let viewModel = BidirectionalStreamingMessagingViewModel(elizaClient: client)
    await viewModel.send("hello!")
    await viewModel.send("hello again!")

    XCTAssertEqual(viewModel.messages[0].message, "hello!")
    XCTAssertEqual(viewModel.messages[0].author, .user)

    XCTAssertEqual(viewModel.messages[1].message, "hi, i'm eliza!")
    XCTAssertEqual(viewModel.messages[1].author, .eliza)

    XCTAssertEqual(viewModel.messages[2].message, "hello again!")
    XCTAssertEqual(viewModel.messages[2].author, .user)
}
```

## `@Sendable` kapanışları ile test etme

Kodu henüz `asenkron`/`bekleme` kullanmayan bir kod tabanınız varsa ve bunun yerine `@Sendable` ile işaretli tamamlanma/sonuç kapanışları sağlayan üretilen istemcileri tüketiyorsanız, test yazmak zor olabilir. Örneğin:

```swift
func testGetUser() {
    let client = Users_V1_UsersMock()
    client.mockGetUserInfo = { request in
        return ResponseMessage(result: .success(...))
    }

    var receivedMessage: Users_V1_UserInfoResponse?
    client.getUserInfo(request: Users_V1_UserInfoRequest()) { response in
        //highlight-next-line
        // HATA: Eşzamanlı çalışan kodda 'receivedMessage' değişkeninin değiştirilmesi
        //highlight-next-line
        receivedMessage = response.message
    }
    XCTAssertEqual(receivedMessage?.name, "jane")
}
```

Bu hatanın üstesinden gelmek için, yakalanan türü `Sendable`'a uyum sağlayan bir sınıfla sarmalamak bir çözümdür. Örneğin:

```swift
public final class Locked<T>: @unchecked Sendable {
    private let lock = NSLock()
    private var wrappedValue: T

    /// Temel değere iptal edici erişim.
    public var value: T {
        get {
            self.lock.lock()
            defer { self.lock.unlock() }
            return self.wrappedValue
        }
        set {
            self.lock.lock()
            self.wrappedValue = newValue
            self.lock.unlock()
        }
    }

    public init(_ value: T) {
        self.wrappedValue = value
    }
}
```

Yukarıdaki hata, testin bu sarmalayıcıyı kullanacak şekilde güncellenmesiyle çözülebilir:

```swift
func testGetUser() {
    let client = Users_V1_UsersMock()
    client.mockGetUserInfo = { request in
        return ResponseMessage(result: .success(...))
    }

    //highlight-next-line
    let receivedMessage = Locked<Users_V1_UserInfoResponse?>(nil)
    client.getUserInfo(request: Users_V1_UserInfoRequest()) { response in
        //highlight-next-line
        receivedMessage.value = response.message
    }
    //highlight-next-line
    XCTAssertEqual(receivedMessage.value?.name, "jane")
}
```

[connect-swift]: https://github.com/connectrpc/connect-swift
[connect-swift-plugin]: https://buf.build/connectrpc/connect-swift
[connect-swift-mocks-plugin]: https://buf.build/connectrpc/connect-swift-mocks