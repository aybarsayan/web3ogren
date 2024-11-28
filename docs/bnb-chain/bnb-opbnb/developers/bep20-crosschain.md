---
title: BEP20 Cross-chain - opBNB Geliştir
description: Bu kılavuz, opBNB üzerinde L2 ayna token sözleşmenizi nasıl dağıtacağınızı ve BSC ile opBNB arasında token transferi yapmayı anlatmaktadır. Ek olarak, JS SDK kullanarak cross-chain transfer süreçlerini de detaylandırmaktadır.
keywords: [opBNB, BEP20, cross-chain, L2 token, JS SDK, token transfer, blockchain]
---

# Keyfi BEP20 Cross-chain

[BEP20 köprüsü](https://opbnb-bridge.bnbchain.org/deposit) veya [zkBridge](https://zkbridge.com/opbnb) ve [rhino.fi](https://app.rhino.fi/bridge?token=BNB&chainOut=OPBNB&chain=BINANCE) gibi üçüncü taraf köprüleri kullanarak, çoğu yaygın BEP20 token'ını BSC üzerinde kolayca yatırabilir ve çekebilirsiniz.

:::tip
Eğer bir token bu köprüler tarafından desteklenmiyorsa, kendi L2 ayna token sözleşmenizi opBNB üzerinde dağıtma seçeneğiniz vardır. Bu, bu token'ların izin gerekmeyen cross-chain transferini sağlar.
:::

Bu kılavuz, L2 ayna token sözleşmenizi opBNB üzerinde dağıtmanıza ve bu sözleşmeyi BSC ile opBNB arasında token transferi için nasıl kullanacağınızı gösterecektir.

## L2 Ayna Token Sözleşmesi Dağıtımı

opBNB üzerinde bir L2 token'ı dağıtmanıza olanak tanıyan, önceden dağıtılmış bir [OptimismMintableERC20Factory sözleşmesi](https://github.com/bnb-chain/opbnb/blob/develop/packages/contracts-bedrock/contracts/universal/OptimismMintableERC20Factory.sol) bulunmaktadır. Sözleşmenin adresi `0x4200000000000000000000000000000000000012`'dir.

Fonksiyon imzası ve yayımlanan olay aşağıdaki gibidir:

> 
> ```solidity
> /**
>     * @notice Yeni bir OptimismMintableERC20 yaratıldığında yayılır.
>     *
>     * @param localToken  Yerel ağda oluşturulan token'ın adresi.
>     * @param remoteToken Uzak ağda karşılık gelen token'ın adresi.
>     * @param deployer    Token'ı dağıtan hesabın adresi.
>     */
> event OptimismMintableERC20Created(
>     address indexed localToken,
>     address indexed remoteToken,
>     address deployer
> );
> ```
> 
> ```solidity
> /**
>     * @notice OptimismMintableERC20 sözleşmesinin bir örneğini oluşturur.
>     *
>     * @param _remoteToken Uzak ağdaki token'ın adresi.
>     * @param _name        ERC20 adı.
>     * @param _symbol      ERC20 sembolü.
>     *
>     * @return Yeni oluşturulan token'ın adresi.
>     */
> function createOptimismMintableERC20(
>     address _remoteToken,
>     string memory _name,
>     string memory _symbol
> ) public returns (address) {}
> ```

`_remoteToken`, bu durumda BSC'deki uzak ağdaki token'ın adresidir. `_name` ve `_symbol`, BSC'deki token'ın adı ve sembolü ile aynı olmalıdır. **opBNB'deki token'nın ondalık sayısı her zaman 18'dir.**

opBNB'de [FDUSD token'ını](https://opbnbscan.com/address/0x50c5725949a6f0c72e6c4a641f24049a917db0cb) üreten [işlem](https://opbnbscan.com/tx/0x4e3da7329cdf0ad67fb82a2a02978518f988125221229747afe90886f7e6512b) burada.

:::warning
Belirli BEP20 yapılandırmalarını desteklememektedir:
- [Transfer sırasında ücret alan token'lar](https://github.com/d-xo/weird-erc20#fee-on-transfer)
- [Transfer olayını yayımlamadan bakiye değiştiren token'lar](https://github.com/d-xo/weird-erc20#balance-modifications-outside-of-transfers-rebasingairdrops)
:::

## JS SDK ile Cross-chain Transfer

Kendi L2 ayna token sözleşmenizi dağıttıktan sonra, BSC ile opBNB arasında token transferi yapmak için JS SDK'yı kullanabilirsiniz.

Aşağıdaki script, TypeScript demo scriptidir. BSC ile opBNB arasında token transferi yapmak için `ethers.js` ve `@eth-optimism/sdk` kullanır.

Script'i `erc20CrosschainTransfer.ts` olarak kaydedebilir ve aşağıdaki komut ile çalıştırabilirsiniz (lütfen [deno'yu](https://docs.deno.com/runtime/manual#install-deno) kurduğunuzdan emin olun):

```bash
deno run -A erc20CrosschainTransfer.ts
```

Script'i ihtiyaçlarınıza göre değiştirmekten çekinmeyin.

```typescript
import { Contract, ethers, Signer, Wallet } from "npm:ethers@^5";
import "https://deno.land/x/dotenv/load.ts";
import { CrossChainMessenger, ETHBridgeAdapter } from "npm:@eth-optimism/sdk";
import * as optimismSDK from "npm:@eth-optimism/sdk";

const gwei = BigInt(1e9);
const BridgeConfigTestnet = {
  l1URL: "https://bsc-testnet.bnbchain.org",
  l2URL: "https://opbnb-testnet-rpc.bnbchain.org",
  l1ChainID: 97,
  l2ChainID: 5611,
  contracts: {
    AddressManager: "0x0000000000000000000000000000000000000000",
    StateCommitmentChain: "0x0000000000000000000000000000000000000000",
    CanonicalTransactionChain: "0x0000000000000000000000000000000000000000",
    BondManager: "0x0000000000000000000000000000000000000000",
    L1CrossDomainMessenger: "0xD506952e78eeCd5d4424B1990a0c99B1568E7c2C",
    L1StandardBridge: "0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840",
    OptimismPortal: "0x4386C8ABf2009aC0c263462Da568DD9d46e52a31",
    L2OutputOracle: "0xFf2394Bb843012562f4349C6632a0EcB92fC8810",
  },
  l1GasPrice: 5n * gwei,
  l1Explorer: "https://testnet.bscscan.com",
  l2Explorer: "https://testnet.opbnbscan.com",
};

const BridgeConfigMainnet = {
  l1URL: "https://bsc-dataseed.bnbchain.org",
  l2URL: "https://opbnb-mainnet-rpc.bnbchain.org",
  l1ChainID: 56,
  l2ChainID: 204,
  contracts: {
    AddressManager: "0x0000000000000000000000000000000000000000",
    StateCommitmentChain: "0x0000000000000000000000000000000000000000",
    CanonicalTransactionChain: "0x0000000000000000000000000000000000000000",
    BondManager: "0x0000000000000000000000000000000000000000",
    L1CrossDomainMessenger: "0xd95D508f13f7029CCF0fb61984d5dfD11b879c4f",
    L1StandardBridge: "0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea",
    OptimismPortal: "0x7e2419F79c9546B9A0E292Fd36aC5005ffed5495",
    L2OutputOracle: "0x0d61A015BAeF63f6740afF8294dAc278A494f6fA",
  },
  l1GasPrice: 3n * gwei,
  l1Explorer: "https://bscscan.com",
  l2Explorer: "https://opbnbscan.com",
};

const BridgeConfig = BridgeConfigTestnet;

const privateKey = Deno.env.get("PRIVATE_KEY")!;
const l1RpcProvider = new ethers.providers.JsonRpcProvider(BridgeConfig.l1URL);
const l2RpcProvider = new ethers.providers.JsonRpcProvider(BridgeConfig.l2URL);
const wallet = new Wallet(privateKey);
const l1Signer = wallet.connect(l1RpcProvider);
const l2Signer = wallet.connect(l2RpcProvider);
let crossChainMessenger: CrossChainMessenger;

const l1BUSDAddr = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const l2BUSDAddr = "0xa9aD1484D9Bfb27adbc2bf50A6E495777CC8cFf2";

function setup() {
  crossChainMessenger = new CrossChainMessenger({
    l1ChainId: BridgeConfig.l1ChainID,
    l2ChainId: BridgeConfig.l2ChainID,
    l1SignerOrProvider: l1Signer,
    l2SignerOrProvider: l2Signer,
    bedrock: true,
    contracts: {
      l1: BridgeConfig.contracts,
      l2: optimismSDK.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
  });
  const ethBridgeAdapter = new ETHBridgeAdapter(
    {
      messenger: crossChainMessenger,
      l1Bridge: BridgeConfig.contracts.L1StandardBridge,
      l2Bridge: "0x4200000000000000000000000000000000000010",
    },
  );
  crossChainMessenger.bridges.ETH = ethBridgeAdapter;
}

async function depositERC20() {
  const tx = await crossChainMessenger.depositERC20(l1BUSDAddr, l2BUSDAddr, 1, {
    overrides: {
      gasPrice: BridgeConfig.l1GasPrice,
    },
  });
  await tx.wait();
  console.log(
    `depositBNB İşlem hashu (L1 üzerinde): ${BridgeConfig.l1Explorer}/tx/${tx.hash}`,
  );
  console.log(
    `L2'deki yatırma işlemi için lütfen ${BridgeConfig.l2Explorer}/address/${l1Signer.address}?tab=deposit&p=1 adresini kontrol edin`,
  );
}

async function withdrawERC20(): Promise<string> {
  const tx = await crossChainMessenger.withdrawERC20(
    l1BUSDAddr,
    l2BUSDAddr,
    1,
    {
      overrides: {
        maxPriorityFeePerGas: 1,
        maxFeePerGas: 10000,
      },
    },
  );
  await tx.wait();
  console.log(
    `withdrawBNB İşlem hashu (L2 üzerinde): ${BridgeConfig.l2Explorer}/tx/${tx.hash}`,
  );
  return tx.hash;
}

async function proveWithdrawal(hash: string, wait: boolean = true) {
  while (true) {
    try {
      const tx = await crossChainMessenger.proveMessage(hash, {
        overrides: {
          gasPrice: BridgeConfig.l1GasPrice,
        },
      });
      await tx.wait();
      console.log(
        `proveWithdrawal İşlem hashu (L1 üzerinde): ${BridgeConfig.l1Explorer}/tx/${tx.hash}`,
      );
      break;
    } catch (error) {
      console.log(error.message);
      if (error.message.includes("state root for message not yet published")) {
        if (wait) {
          console.log(
            `READY_TO_PROVE durumu için bekleniyor, mevcut zaman: ${new Date()}`,
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
}

async function finalizeWithdrawal(hash: string, wait: boolean = true) {
  while (true) {
    try {
      const tx = await crossChainMessenger.finalizeMessage(hash, {
        overrides: {
          gasPrice: BridgeConfig.l1GasPrice,
        },
      });
      await tx.wait();
      console.log(
        `finalizeWithdrawal İşlem hashu (L1 üzerinde): ${BridgeConfig.l1Explorer}/tx/${tx.hash}`,
      );
      break;
    } catch (error) {
      if (
        error.message.includes(
          "Kanıtlanmış çekim sonlandırma süresi henüz dolmamıştır",
        )
      ) {
        if (wait) {
          console.log(
            `READY_TO_FINALIZE durumu için bekleniyor, mevcut zaman: ${new Date()}`,
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  console.log("opbnbBridge demo");

  setup();
  // ERC20 yatır
  await depositERC20();

  // ERC20 çek
  const hash = await withdrawERC20();
  await proveWithdrawal(hash);
  await finalizeWithdrawal(hash);
}

await main();