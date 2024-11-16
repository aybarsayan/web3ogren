import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import LogoSlider from './logoslider';

const FeatureList1 = [

  {
    title: 'Gear Technologies',
    Svg: require('@site/static/img/gear.svg').default,
    description: (
      <>
        Gear Protocol, herkesin bir dApp'i birkaç dakika
        içinde geliştirmesini ve çalıştırmasını sağlayan Substrate tabanlı Rust destekleyen bir akıllı sözleşme platformudur.
      </>
    ),
    href: '/docs/gearprotocol/intro'
  },
  {
    title: 'The Open Network (TON)',
    Svg: require('@site/static/img/Tonlogo.svg').default,
    description: (
      <>
        TON, merkezi olmayan bir internet platformudur.
        Bileşenleri arasında TON Blok Zinciri, TON DNS, TON Depolama ve TON Siteleri bulunur. TON, temel protokolüdür.
      </>
    ),
    href: '/docs/ton/introduction'
  },
  {
    title: 'StarkNet',
    Svg: require('@site/static/img/starknet.svg').default,
    description: (
      <>
        Starknet, Ethereum'un güvenli bir şekilde ölçeklenmesini ve hesaplama için
        ölçeksiz dapp'ler oluşturmasını sağlayan merkezi olmayan bir katman-2 ağıdır.
      </>
    ),
    href: '/docs/starknet/Starnet%20Nedir'
  },
  {
    title: 'Polygon',
    Svg: require('@site/static/img/polygon.svg').default,
    description: (
      <>
        Polygon, blockchain ağlarının bağlanmasını ve ölçeklenmesini
        sağlayan bir blockchain platformudur. Ethereum ile uyumlu çok zincirli ekosistem hedefler.
      </>
    ),
    href: '/docs/polygon/Polygon%20Nedir'
  },
  {
    title: 'Covalent API',
    Svg: require('@site/static/img/covalent.svg').default,
    description: (
      <>
        Covalent, farklı blok zinciri ağlarındaki verilere gerek şeffaf erişilebilirlik,
        gerekse kullanım kolaylığı getirmek için ortak bir API sağlar.
      </>
    ),
    href: '/docs/covalent/Covelent Nedir'
  },
  {
    title: 'Algorand',
    Svg: require('@site/static/img/algorand.svg').default,
    description: (
      <>
        Algorand blokzincir üçgeni adını verdiğimiz hız, güvenlik ve merkeziyetsizlik
        konularını tek başına en verimli şekilde çözmeyi hedefleyen merkeziyetsiz ağdır.
      </>
    ),
    href: '/docs/algo/Algorand%20Nedir'
  },
  {
    title: 'Agoric',
    Svg: require('@site/static/img/agoric.svg').default,
    description: (
      <>
        Agoric, güvenli akıllı sözleşmeleri Hardened JavaScript
        ile yürütme platformudur. Modüler sözleşmeler oluşturma ve işlemlerin güvenliğini artırma imkanı sağlar.
      </>
    ),
    href: '/docs/agoric-doc/what-is-agoric'
  },
  {
    title: 'Solana',
    Svg: require('@site/static/img/solana.svg').default,
    description: (
      <>
        Solana, enerji verimli, yıldırım hızında ve son derece ucuz olmasıyla
        yaygın, ana akım kullanım için tasarlandı. Blockchain'i insanlara getirin.
      </>
    ),
    href: '/docs/solona/Solana%20Nedir'
  },
  {
    title: 'Robonomics',
    Svg: require('@site/static/img/robonomics.svg').default,
    description: (
      <>
        Robonomics, kullanıcı uygulamaları, IoT ve karmaşık robotlar arasında
        atomik işlemler ile bilgi alışverişini sağlayan IoT için açık kaynaklı bir platformdur.
      </>
    ),
    href: '/docs/robonomics/Robonomics%20Nedir'
  },
  {
    title: 'Connext',
    Svg: require('@site/static/img/connext.svg').default,
    description: (
      <>
        Connext, geliştiricilerin tam anlamıyla anlamlı, güvenli etki alanları
        arası uygulamalar oluşturmasını sağlayan merkezi olmayan bir protokoldür.
      </>
    ),
    href: '/docs/connext/Nedir'
  },
  {
    title: 'Manta Network',
    Svg: require('@site/static/img/manta.svg').default,
    description: (
      <>
        Manta Network, Ethereum ve Polkadot gibi farklı blockchain ağları ile
        entegre olabilen veri güvenliği çözümleri sunan bir protokol olarak tasarlanmıştır.
      </>
    ),
    href: '/docs/manta/Manta%20Nedir/Manta%20Network%20Nedir'
  },
  {
    title: 'Scilla',
    Svg: require('@site/static/img/scilla.svg').default,
    description: (
      <>
        Scilla, Zilliqa ağındaki akıllı sözleşmelerin programlanmasında kullanılan bir dildir.
        Scilla dili, Haskell, OCaml ve Python gibi dillerden ilham almıştır.
      </>
    ),
    href: '/docs/scilla/Scilla%20Nedir'
  },
  {
    title: 'Inter Protocol',
    Svg: require('@site/static/img/inter.svg').default,
    description: (
      <>
        Inter Stable Token (IST), Agoric zincirindeki zincirler arası ekosistem için gelişen,
        kripto para birimi destekli, merkezi olmayan, istikrarlı bir belirteçtir.
      </>
    ),
    href: '/docs/inter/Inter%20Protocol%20System%20Overview'
  },

];

const FeatureList2 = [
  {
    title: 'Bilgisayar Bilimleri',
    Svg: require('@site/static/img/network.svg').default,
    description: (
      <>
        Bilgisayar biliminin temel alanları hesaplama, otomasyon ve bilgi çalışmasıdır.
        Bilgisayar bilimi, teorik disiplinlerden pratik disiplinlere kadar uzanır.
      </>
    ),
    href: '/docs/bilgisayar/Algoritmalar/Algoritmalara%20Giriş'
  },
  {
    title: 'Rust',
    Svg: require('@site/static/img/rust.svg').default,
    description: (
      <>
        Rust son derece hızlı ve bellek açısından verimlidir: çalışma zamanı
        veya çöp toplayıcı olmadan, performans açısından kritik hizmetlere güç
        sağlayabilir.
      </>
    ),
    href: '/docs/rust/Rust%20ile%20Programlamaya%20Giriş'
  },
  {
    title: 'Solidity',
    Svg: require('@site/static/img/solidity.svg').default,
    description: (
      <>
        Solidity, çeşitli blockchain platformlarında, en önemlisi Ethereum'da akıllı
        sözleşmeler uygulamak için nesne yönelimli bir programlama dilidir.
      </>
    ),
    href: '/docs/solidity/Solidty%20Nedir'
  },

]




function Feature({ Svg, title, description, href }) {
  return (

    <div className={clsx('col col--4')}>
      <div className={styles.eleman}>
        <div className={styles.card}>
          <div className="text--center">

            <Svg className={styles.featureSvg} role="img" />
          </div>
          <div className="text--center padding-horiz--md">
            <a href={href} >
              <h3>{title}</h3>
              <p>{description}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2>
          Temel Kavramlar & Blokzincir Geliştirme Teknolojileri
        </h2>
        <div className="row">
          {FeatureList2.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <br></br>
        <h2>
          Blokzincir Projeleri
        </h2>
        <div className="row">
          {FeatureList1.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
