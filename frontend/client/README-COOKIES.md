# 🍪 Sistema de Cookies - SmartFiles

## 🚀 Instalação Automática

O sistema de cookies já está **automaticamente integrado** no seu site! Não é necessário fazer nada adicional.

## ✨ Como Funciona

1. **Primeira visita**: Banner aparece na parte inferior da tela
2. **Usuário clica "Aceitar"**: Cookies são salvos, banner desaparece
3. **Ícone flutuante**: Aparece no canto inferior direito (🍪)
4. **Clique no ícone**: Abre configurações para alterar preferências

## 🎯 Funcionalidades

- ✅ **Banner automático** para novos visitantes
- ✅ **Configurações granulares** (essenciais, analytics, marketing)
- ✅ **Ícone flutuante** sempre acessível
- ✅ **Responsivo** para mobile e desktop
- ✅ **Conforme LGPD/GDPR**
- ✅ **Persistência** das preferências

## 🔧 Uso em Outras Páginas

### Importar o Componente
```vue
<script>
import CookieManager from '@/components/CookieManager.vue'

export default {
  components: {
    CookieManager
  }
}
</script>
```

### Verificar Status dos Cookies
```vue
<script setup>
import { useCookies } from '@/composables/useCookies'

const { cookiesAccepted, isAnalyticsActive, isMarketingActive } = useCookies()

// Exemplo: só carregar analytics se aceito
if (isAnalyticsActive()) {
  // Carregar Google Analytics
}
</script>
```

## 📱 Personalização

### Cores
```css
:root {
  --cookie-primary: #667eea;    /* Cor principal */
  --cookie-secondary: #764ba2;  /* Cor secundária */
  --cookie-accent: #ffd700;     /* Cor de destaque */
}
```

### Posição do Ícone
```css
.cookie-icon-float {
  bottom: 30px;  /* Distância do fundo */
  right: 30px;   /* Distância da direita */
}
```

## 🧪 Testar

1. **Limpar localStorage** no DevTools
2. **Recarregar a página** - banner deve aparecer
3. **Clicar "Aceitar"** - banner desaparece, ícone aparece
4. **Clicar no ícone** - modal de configurações abre

## 📋 Estrutura de Arquivos

```
src/
├── components/
│   ├── CookieBanner.vue      # Banner inicial
│   ├── CookieIcon.vue        # Ícone flutuante
│   ├── CookieManager.vue     # Componente wrapper
│   └── examples/
│       └── CookieUsageExample.vue  # Exemplo de uso
├── composables/
│   └── useCookies.js         # Lógica de negócio
└── App.vue                   # Já integrado!
```

## 🔍 Troubleshooting

| Problema | Solução |
|----------|---------|
| Banner não aparece | Limpar localStorage |
| Ícone não aparece | Verificar se cookies foram aceitos |
| Modal não abre | Verificar z-index e eventos |

## 📚 Documentação Completa

Veja `COOKIES.md` para documentação detalhada e exemplos avançados.

## 🎉 Pronto!

Seu site agora tem um sistema de cookies profissional e conforme à lei! 🚀

---

**SmartFiles** - Simplificando sua vida digital 💻✨
