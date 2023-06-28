// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Web3 Teknolojileri Derneği',
  tagline: 'Öğren, Geliştir, Eğit',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://web3ogren.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'web3ogren', // Usually your GitHub org/user name.
  projectName: '  web3ogren', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Web3 Öğren',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Öğren',
            items: [
              { 
                to: '/docs/ogren/temelblokzincir/Blokzincir%20ve%20Web3%20Ekosistemi',
                label: 'Temel Blokzincir Eğitimi'
              },
              { 
                to: '/docs/category/algoritmalar-1',
                label: 'Bilgisayar Bilimleri'
              },
              {
                
                to: '/docs/ogren/otuzsoru/Ag',
                label: '30 Soruda Öğren'
              },
            ]
          },
          {
            type: 'dropdown',
            label: 'Programlama Dilleri',
            items: [
              { 
                to: '/docs/rust/Rust%20ile%20Programlamaya%20Giriş',
                label: 'Rust'
              },
              {
                
                to: '/docs/solidity/Solidty%20Nedir',
                label: 'Solidity'
              },
              {
                
                to: '/docs/algo/Pyteal/Akıllı%20Kontrat',
                label: 'Pyteal'
              },
              {
                
                to: '/docs/bilgisayar/Nesne%20Yönelimli%20Programlama/Java%20Dili%20İle%20Tanışma',
                label: 'Java'
              },
              {
                to: '/docs/bilgisayar/Veritabanı%20Yönetimi/SQL%20Komutları/SQL%20Nedir',
                label: 'SQL'
              },
              {
                to: '/docs/category/pseudo-kod-giri%C5%9F-1',
                label: 'Pseudo Kod'
              },
            ]
          },
          {
            type: 'dropdown',
            label: 'Blokzincir Projeleri',
            items: [
              {
                to: '/docs/algo/Algorand%20Nedir',
                label: 'Algorand'
              },
              {
                to: '/docs/gearprotocol/intro',
                label: 'Gear Technologies'
              },
              {
            
                to: '/docs/agoric/Agoric%20Nedir',
                label: 'Agoric'
              },
              {
                
                to: '/docs/connext/Nedir',
                label: 'Connext'
              },
              {
                to: '/docs/covalent/Covelent%20Nedir',
                label: 'Covalent API'
              },
              {
                
                to: '/docs/polygon/Polygon%20Nedir',
                label: 'Polygon'
              },
              {
                
                to: '/docs/starknet/Starnet%20Nedir',
                label: 'StarkNet'
              },
              {
                
                to: '/docs/scilla/Scilla%20Nedir',
                label: 'Scilla'
              },
              {
                
                to: '/docs/robonomics/Robonomics%20Nedir',
                label: 'Robonomics'
              },
              {
                
                to: '/docs/manta/Manta%20Nedir/Manta%20Network%20Nedir',
                label: 'Manta Network'
              },
              {
                
                to: '/docs/solona/Solana%20Nedir',
                label: 'Solana'
              },
              {
                
                to: '/docs/inter/Inter%20Protocol%20System%20Overview',
                label: 'Inter Protocol'
              },
              {
                
                to: '/docs/ton/introduction',
                label: 'The Open Network (TON)'
              },
            ]
          },
          {
            href: '/ucretsiz/egitim',
            label: 'Ücretsiz Eğitim Materyalleri',
            position: 'left',
          },

          {to: '/blog', label: 'İş İlanı', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/category/rust',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Web3 Teknolojileri Derneği',
                href: 'http://www.web3dernegi.com/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/yAhXDDPZ',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/web3dernegi',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'İş İlanları',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/WidgetVRP',
              },
            ],
          },
        ],
        copyright: `Copyright © Web3 Teknolojileri Derneği Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell','rust','sql','java','python'],
      },
    }),
};

module.exports = config;