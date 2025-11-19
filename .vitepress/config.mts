import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'IBA Event Management System',
  description: 'API Documentation for the IBA Event Management System',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Guide', link: '/guide/installation' }
    ],

    sidebar: {
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Library Functions', link: '/api/libs' },
            { text: 'Components', link: '/api/components' },
            { text: 'Test Suites', link: '/api/tests' }
          ]
        }
      ],
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Documentation Standards', link: '/guide/documentation-standards' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hamna-Sajid/event-management-system' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 IBA Event Management System'
    }
  },

  srcDir: 'docs',
  outDir: 'docs/.vitepress/dist',
  
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
