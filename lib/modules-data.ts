// Tipos detalhados para módulos profissionais
export interface Resource {
  id: string
  title: string
  type: "documentation" | "video" | "forum" | "github" | "article" | "tool"
  url: string
  description: string
}

export interface Exercise {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  completed: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  videoUrl?: string
  content: string
  objectives: string[]
  resources: Resource[]
  exercises: Exercise[]
  tips: string[]
  completed: boolean
}

export interface ModuleDetailed {
  id: number
  slug: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  icon: string
  color: string
  lessons: Lesson[]
  totalDuration: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  prerequisites: number[]
  skills: string[]
  projects: string[]
  resources: Resource[]
  completed: boolean
  unlocked: boolean
  progress: number
}

// Recursos globais para estudo
export const globalResources: Resource[] = [
  {
    id: "unreal-docs",
    title: "Documentação Oficial Unreal Engine",
    type: "documentation",
    url: "https://docs.unrealengine.com",
    description: "Documentação completa e oficial da Epic Games"
  },
  {
    id: "unreal-forums",
    title: "Fórum Oficial Unreal",
    type: "forum",
    url: "https://forums.unrealengine.com",
    description: "Comunidade oficial com milhares de desenvolvedores"
  },
  {
    id: "unreal-learning",
    title: "Unreal Online Learning",
    type: "video",
    url: "https://dev.epicgames.com/community/learning",
    description: "Cursos gratuitos oficiais da Epic Games"
  },
  {
    id: "blueprint-docs",
    title: "Blueprint Visual Scripting",
    type: "documentation",
    url: "https://docs.unrealengine.com/5.3/en-US/blueprints-visual-scripting-in-unreal-engine/",
    description: "Documentação específica de Blueprints"
  },
  {
    id: "unreal-reddit",
    title: "Reddit r/unrealengine",
    type: "forum",
    url: "https://reddit.com/r/unrealengine",
    description: "Comunidade ativa com dicas e projetos"
  },
  {
    id: "unreal-slackers",
    title: "Unreal Slackers Discord",
    type: "forum",
    url: "https://unrealslackers.org",
    description: "Maior servidor Discord de Unreal Engine"
  },
  {
    id: "github-examples",
    title: "Epic Games GitHub",
    type: "github",
    url: "https://github.com/EpicGames",
    description: "Repositórios oficiais com exemplos e código fonte"
  },
  {
    id: "marketplace",
    title: "Unreal Marketplace",
    type: "tool",
    url: "https://www.unrealengine.com/marketplace",
    description: "Assets, plugins e exemplos de projetos"
  }
]

// Módulos profissionais completos
export const professionalModules: ModuleDetailed[] = [
  // MÓDULO 1 - FUNDAMENTOS
  {
    id: 1,
    slug: "fundamentos-unreal",
    title: "Fundamentos do Unreal Engine",
    subtitle: "Dominando a Interface e Conceitos Básicos",
    description: "Conheça a engine mais poderosa do mercado e aprenda a navegar com confiança",
    longDescription: "Este módulo introdutório foi projetado para dar a você uma base sólida no Unreal Engine. Você aprenderá a navegar pela interface, entender a estrutura de projetos, configurar seu ambiente de desenvolvimento e dominar os conceitos fundamentais que serão utilizados ao longo de toda sua jornada como desenvolvedor de jogos.",
    icon: "Gamepad2",
    color: "from-blue-500 to-cyan-500",
    difficulty: "beginner",
    totalDuration: "4h 30min",
    prerequisites: [],
    skills: ["Navegação na Interface", "Gerenciamento de Projetos", "Content Browser", "Viewport", "World Outliner"],
    projects: ["Projeto de Setup Inicial", "Cena de Teste"],
    completed: false,
    unlocked: true,
    progress: 0,
    resources: [
      { id: "ue5-quickstart", title: "UE5 Quick Start", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/quick-start-guide-for-unreal-engine/", description: "Guia oficial de início rápido" },
      { id: "ue5-interface", title: "Editor Interface", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/unreal-editor-interface/", description: "Documentação da interface do editor" }
    ],
    lessons: [
      {
        id: "1-1",
        title: "Instalação e Configuração do Ambiente",
        description: "Configure seu computador para desenvolvimento com Unreal Engine",
        duration: "25min",
        content: "Aprenda a instalar o Epic Games Launcher, baixar o Unreal Engine 5, configurar as melhores opções de performance e preparar seu ambiente para desenvolvimento profissional.",
        objectives: [
          "Instalar Epic Games Launcher corretamente",
          "Baixar e configurar Unreal Engine 5.3+",
          "Configurar opções de editor para melhor performance",
          "Criar seu primeiro projeto de teste"
        ],
        resources: [
          { id: "install-guide", title: "Guia de Instalação", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/installing-unreal-engine/", description: "Guia oficial de instalação" }
        ],
        exercises: [
          { id: "ex-1-1-1", title: "Instalar UE5", description: "Baixe e instale a versão mais recente do Unreal Engine", difficulty: "beginner", estimatedTime: "30min", completed: false },
          { id: "ex-1-1-2", title: "Criar Projeto Blank", description: "Crie um projeto em branco para testes", difficulty: "beginner", estimatedTime: "10min", completed: false }
        ],
        tips: [
          "Use SSD para instalação - a diferença de velocidade é enorme",
          "Deixe pelo menos 100GB livres para projetos",
          "Configure o Visual Studio antes de começar com C++"
        ],
        completed: false
      },
      {
        id: "1-2",
        title: "Navegação na Interface do Editor",
        description: "Domine todos os painéis e ferramentas do editor",
        duration: "35min",
        content: "Explore cada painel do Unreal Editor: Viewport, Content Browser, World Outliner, Details Panel. Aprenda atalhos de teclado essenciais e como personalizar seu workspace.",
        objectives: [
          "Navegar fluentemente pelo Viewport em 3D",
          "Usar o Content Browser para organizar assets",
          "Entender hierarquia no World Outliner",
          "Manipular propriedades no Details Panel"
        ],
        resources: [
          { id: "viewport-nav", title: "Viewport Navigation", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/viewport-basics-in-unreal-engine/", description: "Navegação no viewport" }
        ],
        exercises: [
          { id: "ex-1-2-1", title: "Navegação WASD", description: "Pratique navegação pelo viewport por 10 minutos", difficulty: "beginner", estimatedTime: "15min", completed: false },
          { id: "ex-1-2-2", title: "Organizar Assets", description: "Crie uma estrutura de pastas profissional", difficulty: "beginner", estimatedTime: "20min", completed: false }
        ],
        tips: [
          "F foca no objeto selecionado",
          "Segure Alt + LMB para orbitar ao redor de objetos",
          "G esconde/mostra elementos do editor no viewport"
        ],
        completed: false
      },
      {
        id: "1-3",
        title: "Estrutura de Projetos Unreal",
        description: "Entenda como projetos são organizados internamente",
        duration: "30min",
        content: "Aprenda a estrutura de pastas de um projeto Unreal, convenções de nomenclatura usadas na indústria, e como organizar seu projeto para escalar sem problemas.",
        objectives: [
          "Entender estrutura de pastas padrão",
          "Aplicar convenções de nomenclatura profissionais",
          "Configurar .gitignore para Unreal",
          "Organizar assets por tipo e funcionalidade"
        ],
        resources: [
          { id: "project-structure", title: "Project Structure", type: "article", url: "https://github.com/Allar/ue5-style-guide", description: "Guia de estilo e organização" }
        ],
        exercises: [
          { id: "ex-1-3-1", title: "Criar Estrutura", description: "Monte uma estrutura de pastas profissional", difficulty: "beginner", estimatedTime: "15min", completed: false }
        ],
        tips: [
          "Nunca renomeie assets fora do Unreal",
          "Use Redirectors Fix para limpar referências",
          "Prefixe assets: BP_ para Blueprints, M_ para Materials"
        ],
        completed: false
      },
      {
        id: "1-4",
        title: "Actors, Components e World",
        description: "Conceitos fundamentais da arquitetura Unreal",
        duration: "40min",
        content: "Entenda os blocos de construção do Unreal: Actors são objetos no mundo, Components são funcionalidades reutilizáveis, e o World é onde tudo existe. Domine esses conceitos para criar qualquer sistema.",
        objectives: [
          "Diferenciar Actors de Components",
          "Criar Actors com múltiplos Components",
          "Entender hierarquia de objetos",
          "Usar Transform para posicionamento"
        ],
        resources: [
          { id: "actors-docs", title: "Actors Documentation", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/actors-in-unreal-engine/", description: "Documentação de Actors" }
        ],
        exercises: [
          { id: "ex-1-4-1", title: "Criar Actor Composto", description: "Crie um Actor com Static Mesh, Light e Particle", difficulty: "beginner", estimatedTime: "20min", completed: false }
        ],
        tips: [
          "Actors podem conter outros Actors (Child Actors)",
          "Components podem ser adicionados dinamicamente",
          "Use SceneComponent como root para hierarquia limpa"
        ],
        completed: false
      },
      {
        id: "1-5",
        title: "Sistemas de Coordenadas e Transform",
        description: "Posição, rotação e escala no espaço 3D",
        duration: "30min",
        content: "Domine o sistema de coordenadas do Unreal (Z-up, Left-handed), aprenda sobre World Space vs Local Space, e como manipular transforms com precisão.",
        objectives: [
          "Entender sistema de coordenadas Unreal",
          "Diferenciar World Space de Local Space",
          "Usar Pivot Points corretamente",
          "Aplicar transforms relativos e absolutos"
        ],
        resources: [],
        exercises: [
          { id: "ex-1-5-1", title: "Transform Practice", description: "Posicione 10 objetos usando apenas valores numéricos", difficulty: "beginner", estimatedTime: "15min", completed: false }
        ],
        tips: [
          "1 Unreal Unit = 1 centímetro",
          "Rotação é em graus (0-360)",
          "Use snapping para alinhamento preciso"
        ],
        completed: false
      },
      {
        id: "1-6",
        title: "Levels e Level Streaming",
        description: "Gerenciamento de mapas e carregamento dinâmico",
        duration: "35min",
        content: "Aprenda a criar e gerenciar Levels, usar sublevels para organização, e implementar Level Streaming para jogos de mundo aberto.",
        objectives: [
          "Criar e configurar Levels",
          "Usar Persistent Level com Sublevels",
          "Configurar Level Streaming básico",
          "Entender World Composition"
        ],
        resources: [
          { id: "level-streaming", title: "Level Streaming", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/level-streaming-in-unreal-engine/", description: "Documentação de streaming" }
        ],
        exercises: [
          { id: "ex-1-6-1", title: "Multi-Level Setup", description: "Crie um level com 3 sublevels", difficulty: "intermediate", estimatedTime: "30min", completed: false }
        ],
        tips: [
          "Divida seu mundo em chunks de 500-1000m",
          "Use streaming volumes para carregamento automático",
          "Mantenha o Persistent Level leve"
        ],
        completed: false
      },
      {
        id: "1-7",
        title: "Game Mode e Game State",
        description: "Arquitetura de regras e estado do jogo",
        duration: "40min",
        content: "Entenda como o Unreal gerencia regras do jogo (Game Mode), estado global (Game State), e como configurar diferentes modos de jogo.",
        objectives: [
          "Configurar Game Mode personalizado",
          "Usar Game State para dados globais",
          "Entender Player Controller vs Pawn",
          "Criar setup de jogo completo"
        ],
        resources: [
          { id: "gamemode-docs", title: "Game Mode", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/game-mode-and-game-state-in-unreal-engine/", description: "Documentação de Game Mode" }
        ],
        exercises: [
          { id: "ex-1-7-1", title: "Custom Game Mode", description: "Crie um Game Mode com spawn personalizado", difficulty: "intermediate", estimatedTime: "25min", completed: false }
        ],
        tips: [
          "Game Mode só existe no servidor em multiplayer",
          "Use Game Instance para dados persistentes entre níveis",
          "Player State guarda dados específicos do jogador"
        ],
        completed: false
      },
      {
        id: "1-8",
        title: "Debug e Logging",
        description: "Ferramentas essenciais para encontrar bugs",
        duration: "25min",
        content: "Aprenda a usar Print String, Visual Logger, Debug Drawing, e o Output Log para identificar e resolver problemas rapidamente.",
        objectives: [
          "Usar Print String efetivamente",
          "Desenhar debug shapes no mundo",
          "Navegar pelo Output Log",
          "Usar breakpoints em Blueprint"
        ],
        resources: [],
        exercises: [
          { id: "ex-1-8-1", title: "Debug Challenge", description: "Encontre 3 bugs propositais em um Blueprint", difficulty: "beginner", estimatedTime: "20min", completed: false }
        ],
        tips: [
          "Adicione categoria aos logs para filtrar",
          "Use cores diferentes para tipos de mensagem",
          "Debug Draw persiste com duração configurável"
        ],
        completed: false
      }
    ]
  },

  // MÓDULO 2 - BLUEPRINT CORE
  {
    id: 2,
    slug: "blueprint-visual-scripting",
    title: "Blueprint Visual Scripting",
    subtitle: "A Arte da Programação Visual",
    description: "Domine o sistema de programação visual mais poderoso do mercado",
    longDescription: "Blueprint é o sistema de visual scripting do Unreal Engine que permite criar jogos completos sem escrever código. Neste módulo, você dominará desde variáveis simples até sistemas complexos, preparando você para criar qualquer mecânica de gameplay.",
    icon: "Workflow",
    color: "from-green-500 to-emerald-500",
    difficulty: "beginner",
    totalDuration: "6h",
    prerequisites: [1],
    skills: ["Variáveis", "Funções", "Eventos", "Macros", "Event Graph", "Construction Script"],
    projects: ["Sistema de Contador", "Porta Interativa"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "bp-basics", title: "Blueprint Basics", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/introduction-to-blueprints-visual-scripting-in-unreal-engine/", description: "Introdução a Blueprints" }
    ],
    lessons: [
      {
        id: "2-1",
        title: "Criando seu Primeiro Blueprint",
        description: "Do zero ao Hello World em Blueprint",
        duration: "30min",
        content: "Crie seu primeiro Blueprint Actor, entenda o Event Graph, e faça seu primeiro Print String funcionar. Este é o início da sua jornada em visual scripting.",
        objectives: [
          "Criar Blueprint Actor do zero",
          "Entender Event Graph",
          "Usar BeginPlay e Tick",
          "Fazer Print String funcionar"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-1-1", title: "Hello World", description: "Crie um BP que printa mensagem ao iniciar", difficulty: "beginner", estimatedTime: "10min", completed: false }
        ],
        tips: [
          "Compile sempre após mudanças importantes",
          "Nomes claros economizam horas de debug",
          "Comente seu código com Comment nodes"
        ],
        completed: false
      },
      {
        id: "2-2",
        title: "Variáveis: Tipos e Uso",
        description: "Armazene e manipule dados no seu jogo",
        duration: "45min",
        content: "Aprenda todos os tipos de variáveis: Boolean, Integer, Float, String, Vector, Rotator, Transform, e tipos customizados. Entenda referências e como expor variáveis.",
        objectives: [
          "Criar variáveis de todos os tipos básicos",
          "Usar Get e Set corretamente",
          "Expor variáveis para o editor",
          "Entender diferença entre valor e referência"
        ],
        resources: [
          { id: "bp-variables", title: "Blueprint Variables", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/blueprint-variables-in-unreal-engine/", description: "Documentação de variáveis" }
        ],
        exercises: [
          { id: "ex-2-2-1", title: "Sistema de Vida", description: "Crie variáveis de HP e MaxHP com interface", difficulty: "beginner", estimatedTime: "20min", completed: false }
        ],
        tips: [
          "Use Categories para organizar variáveis",
          "Private bloqueia acesso externo",
          "Instance Editable permite editar por instância"
        ],
        completed: false
      },
      {
        id: "2-3",
        title: "Funções Custom",
        description: "Organize e reutilize sua lógica",
        duration: "40min",
        content: "Crie funções para encapsular lógica, use inputs e outputs, entenda Pure vs Impure functions, e aplique boas práticas de organização.",
        objectives: [
          "Criar funções com inputs/outputs",
          "Diferenciar Pure de Impure",
          "Usar Local Variables em funções",
          "Aplicar Single Responsibility Principle"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-3-1", title: "Calculadora de Dano", description: "Crie função que calcula dano com crítico", difficulty: "intermediate", estimatedTime: "25min", completed: false }
        ],
        tips: [
          "Funções Pure não têm execution pin",
          "Use Description para documentar",
          "Funções const não modificam estado"
        ],
        completed: false
      },
      {
        id: "2-4",
        title: "Eventos e Event Dispatchers",
        description: "Comunicação assíncrona entre sistemas",
        duration: "50min",
        content: "Domine Custom Events, Event Dispatchers para broadcast, e entenda o fluxo de eventos no Unreal. Essencial para sistemas desacoplados.",
        objectives: [
          "Criar Custom Events",
          "Usar Event Dispatchers",
          "Bind e Unbind eventos dinamicamente",
          "Passar parâmetros por eventos"
        ],
        resources: [
          { id: "event-dispatchers", title: "Event Dispatchers", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/event-dispatchers-in-unreal-engine/", description: "Documentação de dispatchers" }
        ],
        exercises: [
          { id: "ex-2-4-1", title: "Sistema de Notificação", description: "Crie um dispatcher que notifica UI de mudanças", difficulty: "intermediate", estimatedTime: "30min", completed: false }
        ],
        tips: [
          "Unbind eventos quando o objeto for destruído",
          "Event Dispatchers são multicast",
          "Use para desacoplar sistemas"
        ],
        completed: false
      },
      {
        id: "2-5",
        title: "Fluxo de Controle",
        description: "Branch, Switch, Loops e Sequence",
        duration: "45min",
        content: "Controle o fluxo da sua lógica com Branch (if/else), Switch, ForLoop, WhileLoop, Sequence, Gate, e DoOnce.",
        objectives: [
          "Usar Branch para decisões",
          "Implementar Switch on Enum/String/Int",
          "Criar loops eficientes",
          "Usar Sequence para execução paralela"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-5-1", title: "State Machine Simples", description: "Crie lógica de estados com Switch", difficulty: "intermediate", estimatedTime: "35min", completed: false }
        ],
        tips: [
          "Avoid While loops infinitos",
          "ForLoop com Break para saída antecipada",
          "Gate controla fluxo de execução"
        ],
        completed: false
      },
      {
        id: "2-6",
        title: "Arrays e Maps",
        description: "Coleções de dados para sistemas complexos",
        duration: "50min",
        content: "Trabalhe com Arrays (listas ordenadas), Sets (conjuntos únicos), e Maps (dicionários). Aprenda operações de busca, filtro, e ordenação.",
        objectives: [
          "Criar e manipular Arrays",
          "Usar Find, Filter, Sort",
          "Implementar Maps para lookup",
          "Iterar sobre coleções eficientemente"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-6-1", title: "Inventário Array", description: "Crie inventário usando Arrays", difficulty: "intermediate", estimatedTime: "40min", completed: false }
        ],
        tips: [
          "Arrays são passados por referência",
          "Use Contains para verificar existência",
          "Maps são O(1) para lookup"
        ],
        completed: false
      },
      {
        id: "2-7",
        title: "Structs e Enums",
        description: "Tipos de dados customizados",
        duration: "40min",
        content: "Crie Structs para agrupar dados relacionados e Enums para estados definidos. Fundamento para sistemas organizados e escaláveis.",
        objectives: [
          "Criar Structs customizados",
          "Definir Enums para estados",
          "Break e Make Structs",
          "Usar em Arrays e Maps"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-7-1", title: "Item Struct", description: "Crie struct para itens com todas propriedades", difficulty: "intermediate", estimatedTime: "25min", completed: false }
        ],
        tips: [
          "Structs são copiados por valor",
          "Use Data Tables com Structs",
          "Enums podem ter Display Names"
        ],
        completed: false
      },
      {
        id: "2-8",
        title: "Macros e Collapsed Graphs",
        description: "Simplificando código repetitivo",
        duration: "30min",
        content: "Use Macros para lógica reutilizável com múltiplos execution pins, e Collapsed Graphs para organização visual.",
        objectives: [
          "Criar Macros funcionais",
          "Diferença entre Macro e Function",
          "Usar Collapsed Graphs",
          "Macro Libraries"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-8-1", title: "Macro de Validação", description: "Crie macro que valida e retorna sucesso/falha", difficulty: "intermediate", estimatedTime: "20min", completed: false }
        ],
        tips: [
          "Macros são inlined no compile",
          "Podem ter múltiplos outputs",
          "Use para padrões repetitivos"
        ],
        completed: false
      },
      {
        id: "2-9",
        title: "Construction Script",
        description: "Lógica de inicialização no editor",
        duration: "35min",
        content: "Use Construction Script para configurar Actors no editor, criar variações procedurais, e validar configurações antes do jogo rodar.",
        objectives: [
          "Entender quando Construction Script executa",
          "Criar setups procedurais",
          "Validar configurações",
          "Diferença para BeginPlay"
        ],
        resources: [],
        exercises: [
          { id: "ex-2-9-1", title: "Modular Wall", description: "Crie parede que escala baseado em variável", difficulty: "intermediate", estimatedTime: "30min", completed: false }
        ],
        tips: [
          "Executa no editor - cuidado com performance",
          "Não spawn actors no Construction Script",
          "Use para preview e validação"
        ],
        completed: false
      },
      {
        id: "2-10",
        title: "Timelines",
        description: "Animações e interpolações em código",
        duration: "45min",
        content: "Domine Timelines para criar animações suaves, interpolar valores, e sincronizar eventos com precisão temporal.",
        objectives: [
          "Criar Timelines básicas",
          "Usar curvas Float e Vector",
          "Events em pontos específicos",
          "Play, Reverse, e Loop"
        ],
        resources: [
          { id: "timelines-doc", title: "Timelines", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/timelines-in-unreal-engine/", description: "Documentação de Timelines" }
        ],
        exercises: [
          { id: "ex-2-10-1", title: "Porta Animada", description: "Crie porta que abre/fecha suavemente", difficulty: "intermediate", estimatedTime: "35min", completed: false }
        ],
        tips: [
          "Timelines são mais performáticas que Tick",
          "Use curvas para easing",
          "Combine com lerp para transições"
        ],
        completed: false
      }
    ]
  },

  // MÓDULO 3 - CHARACTER E MOVIMENTO
  {
    id: 3,
    slug: "character-movement",
    title: "Character e Sistema de Movimento",
    subtitle: "Controle de Personagem Profissional",
    description: "Crie personagens responsivos com movimentação AAA",
    longDescription: "O movimento do personagem é a fundação de qualquer jogo. Neste módulo você dominará o Character Movement Component, aprenderá a criar sistemas de input modernos com Enhanced Input, e implementará mecânicas como dash, wall run, e animações procedurais.",
    icon: "User",
    color: "from-purple-500 to-pink-500",
    difficulty: "intermediate",
    totalDuration: "8h",
    prerequisites: [1, 2],
    skills: ["Character Movement", "Enhanced Input", "Animation Blueprint", "Root Motion", "IK"],
    projects: ["Third Person Character", "First Person Controller"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "character-docs", title: "Character Movement", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/setting-up-character-movement-in-unreal-engine/", description: "Documentação de movimento" }
    ],
    lessons: [
      {
        id: "3-1",
        title: "Character vs Pawn",
        description: "Entendendo as diferenças fundamentais",
        duration: "30min",
        content: "Aprenda quando usar Character (com CharacterMovementComponent) vs Pawn genérico, e como o sistema de Possession funciona.",
        objectives: ["Diferenciar Character de Pawn", "Entender Possession", "Configurar Default Pawn Class"],
        resources: [],
        exercises: [{ id: "ex-3-1-1", title: "Setup Character", description: "Configure um Character básico", difficulty: "beginner", estimatedTime: "15min", completed: false }],
        tips: ["Character já vem com movimento built-in", "Use Pawn para veículos ou controles especiais"],
        completed: false
      },
      {
        id: "3-2",
        title: "Enhanced Input System",
        description: "Sistema de input moderno do UE5",
        duration: "50min",
        content: "Configure Input Actions, Input Mapping Contexts, e aprenda a criar controles rebindáveis e responsivos para qualquer plataforma.",
        objectives: ["Criar Input Actions", "Configurar Mapping Context", "Implementar input para movimento", "Suporte a gamepad e teclado"],
        resources: [{ id: "enhanced-input", title: "Enhanced Input", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/enhanced-input-in-unreal-engine/", description: "Documentação Enhanced Input" }],
        exercises: [{ id: "ex-3-2-1", title: "Setup Completo", description: "Configure input para movimento, pulo e ação", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Modifiers alteram valores do input", "Triggers definem quando o input dispara"],
        completed: false
      },
      {
        id: "3-3",
        title: "Character Movement Component Deep Dive",
        description: "Dominando todas as configurações",
        duration: "60min",
        content: "Explore todas as opções do CMC: velocidades, aceleração, fricção, modos de movimento, física, e como criar movimento customizado.",
        objectives: ["Configurar velocidades e aceleração", "Entender Movement Modes", "Ajustar física do pulo", "Criar feeling responsivo"],
        resources: [],
        exercises: [{ id: "ex-3-3-1", title: "Tuning de Movimento", description: "Ajuste movimento para sentir como Mario", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Ground Friction afeta paradas", "Jump Z Velocity controla altura", "Teste em diferentes framerates"],
        completed: false
      },
      {
        id: "3-4",
        title: "Câmera e Spring Arm",
        description: "Sistemas de câmera profissionais",
        duration: "45min",
        content: "Implemente câmeras third person e first person, use Spring Arm para colisão automática, e crie transições suaves.",
        objectives: ["Configurar Spring Arm", "Implementar colisão de câmera", "Criar camera lag", "Transições entre câmeras"],
        resources: [],
        exercises: [{ id: "ex-3-4-1", title: "Câmera Cinematográfica", description: "Crie sistema de câmera com múltiplos modos", difficulty: "intermediate", estimatedTime: "35min", completed: false }],
        tips: ["Camera Lag suaviza movimento", "Use sockets para attach", "Target Arm Length define distância"],
        completed: false
      },
      {
        id: "3-5",
        title: "Animation Blueprint Fundamentals",
        description: "Conectando movimento a animações",
        duration: "55min",
        content: "Crie seu primeiro Animation Blueprint, use State Machines, e conecte variáveis de movimento a blend spaces.",
        objectives: ["Criar Animation Blueprint", "Configurar State Machine", "Usar Blend Spaces 1D e 2D", "Conectar com Character"],
        resources: [{ id: "anim-bp", title: "Animation Blueprints", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/animation-blueprints-in-unreal-engine/", description: "Documentação de Anim BP" }],
        exercises: [{ id: "ex-3-5-1", title: "Locomotion Setup", description: "Crie locomotion com idle, walk, run", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Event Graph para lógica, Anim Graph para poses", "Cache variáveis no Event Graph"],
        completed: false
      },
      {
        id: "3-6",
        title: "Custom Movement Modes",
        description: "Dash, Climb, Slide e mais",
        duration: "70min",
        content: "Implemente movimentos customizados: dash com invincibility frames, wall climbing, sliding, e swimming avançado.",
        objectives: ["Criar Dash com cooldown", "Implementar Wall Detection", "Criar Slide mechanic", "Gerenciar Movement Modes"],
        resources: [],
        exercises: [{ id: "ex-3-6-1", title: "Dash System", description: "Implemente dash com i-frames e cooldown", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Use Launch Character para impulsos", "Custom modes permitem física própria"],
        completed: false
      },
      {
        id: "3-7",
        title: "Root Motion e Montages",
        description: "Animações que controlam movimento",
        duration: "50min",
        content: "Use Root Motion para animações que movem o personagem, crie Montages para ataques e ações especiais.",
        objectives: ["Entender Root Motion", "Configurar Animation Montages", "Notifies e Notify States", "Blend in/out"],
        resources: [],
        exercises: [{ id: "ex-3-7-1", title: "Attack Montage", description: "Crie combo de ataque com root motion", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["Root Motion pode ser velocity ou transform", "Notifies disparam eventos precisos"],
        completed: false
      },
      {
        id: "3-8",
        title: "Inverse Kinematics (IK)",
        description: "Pés no chão e mãos em objetos",
        duration: "60min",
        content: "Implemente Foot IK para terrenos irregulares, Hand IK para interação com objetos, e Look At para cabeça/olhos.",
        objectives: ["Configurar Two Bone IK", "Implementar Foot Placement", "Hand IK para objetos", "Look At targets"],
        resources: [{ id: "ik-docs", title: "IK in UE5", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/ik-rig-in-unreal-engine/", description: "Documentação IK" }],
        exercises: [{ id: "ex-3-8-1", title: "Foot IK System", description: "Implemente foot placement em terreno", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Use line traces para detectar chão", "Virtual Bones ajudam no setup"],
        completed: false
      }
    ]
  },

  // MÓDULO 4 - SISTEMAS DE COMBATE E ARMAS
  {
    id: 4,
    slug: "combat-weapons-system",
    title: "Sistemas de Combate e Armas",
    subtitle: "Do Melee ao Shooter Profissional",
    description: "Implemente sistemas de combate dignos de jogos AAA",
    longDescription: "Combate é o core de muitos jogos. Neste módulo você criará sistemas completos de combate melee e ranged, incluindo detecção de hits, dano, armas equipáveis, munição, recarga, e feedback visual/sonoro que faz o combate sentir impactante.",
    icon: "Swords",
    color: "from-red-500 to-orange-500",
    difficulty: "advanced",
    totalDuration: "12h",
    prerequisites: [1, 2, 3],
    skills: ["Damage System", "Hit Detection", "Weapon Framework", "Projectiles", "Aim Assist"],
    projects: ["Sistema Melee Completo", "Shooter Framework"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "gameplay-ability", title: "Gameplay Ability System", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/gameplay-ability-system-for-unreal-engine/", description: "GAS Documentation" }
    ],
    lessons: [
      {
        id: "4-1",
        title: "Sistema de Dano Universal",
        description: "Apply Damage e Damage Types",
        duration: "50min",
        content: "Implemente o sistema de dano do Unreal usando Apply Damage, crie Damage Types customizados, e processe dano em Actors.",
        objectives: ["Usar Apply Damage", "Criar Damage Types", "Implementar Any Damage event", "Tipos de dano: físico, fogo, etc"],
        resources: [],
        exercises: [{ id: "ex-4-1-1", title: "Damage System", description: "Crie sistema com múltiplos tipos de dano", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Point Damage tem localização", "Radial Damage tem falloff"],
        completed: false
      },
      {
        id: "4-2",
        title: "Health Component",
        description: "Componente reutilizável de vida",
        duration: "45min",
        content: "Crie um Actor Component de saúde reutilizável com HP, regeneração, morte, e eventos para UI e gameplay.",
        objectives: ["Criar Health Component", "Implementar Take Damage", "Sistema de regeneração", "Eventos de morte"],
        resources: [],
        exercises: [{ id: "ex-4-2-1", title: "Health Reutilizável", description: "Crie component usável em player e inimigos", difficulty: "intermediate", estimatedTime: "35min", completed: false }],
        tips: ["Use Event Dispatchers para notificar", "Clamp HP entre 0 e Max"],
        completed: false
      },
      {
        id: "4-3",
        title: "Melee Combat: Hit Detection",
        description: "Detectando hits com precisão",
        duration: "60min",
        content: "Implemente detecção de hits para combate melee usando collision, traces, e animation notifies. Aprenda a evitar hits duplicados.",
        objectives: ["Collision vs Line Trace", "Animation Notify para timing", "Evitar multi-hits", "Hit stop e camera shake"],
        resources: [],
        exercises: [{ id: "ex-4-3-1", title: "Sword Combo", description: "Crie combo de espada com 3 hits", difficulty: "advanced", estimatedTime: "70min", completed: false }],
        tips: ["Use arrays para track de hits", "Clear array no início de cada swing"],
        completed: false
      },
      {
        id: "4-4",
        title: "Melee Combat: Combos e Input Buffer",
        description: "Sistemas de combo fluidos",
        duration: "55min",
        content: "Crie sistemas de combo com input buffering, cancels, e windows. Faça o combate sentir responsivo e satisfatório.",
        objectives: ["Implementar combo chains", "Input buffering", "Cancel windows", "Combo finishers"],
        resources: [],
        exercises: [{ id: "ex-4-4-1", title: "Combo System", description: "Sistema de 5 hits com finisher", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Buffer deve ter timeout", "Notifies marcam windows"],
        completed: false
      },
      {
        id: "4-5",
        title: "Sistema de Armas: Framework",
        description: "Arquitetura escalável de armas",
        duration: "70min",
        content: "Crie um framework de armas com classe base, interface, e sistema de equip/unequip que funciona para qualquer tipo de arma.",
        objectives: ["Weapon Base Class", "Weapon Interface", "Equip/Unequip system", "Socket attachment"],
        resources: [],
        exercises: [{ id: "ex-4-5-1", title: "Weapon Framework", description: "Crie base para espada, arco e arma de fogo", difficulty: "advanced", estimatedTime: "80min", completed: false }],
        tips: ["Use interfaces para ações genéricas", "Sockets no skeleton para attach"],
        completed: false
      },
      {
        id: "4-6",
        title: "Ranged: Projectiles",
        description: "Projéteis físicos e rápidos",
        duration: "55min",
        content: "Implemente projéteis com física, homing missiles, e projéteis rápidos usando prediction. Otimize para muitos projéteis.",
        objectives: ["Projectile Movement Component", "Homing projectiles", "Prediction para fast projectiles", "Pooling de projéteis"],
        resources: [{ id: "projectile-docs", title: "Projectile Movement", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/projectile-movement-component-in-unreal-engine/", description: "Projectile Component" }],
        exercises: [{ id: "ex-4-6-1", title: "Projectile System", description: "Crie projétil com gravidade e bounce", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Initial Speed vs Max Speed", "Use Object Pooling para performance"],
        completed: false
      },
      {
        id: "4-7",
        title: "Ranged: Hitscan Weapons",
        description: "Raycasts para armas instantâneas",
        duration: "50min",
        content: "Implemente armas hitscan usando line traces, com spread, penetração, e feedback de hit markers.",
        objectives: ["Line Trace para hits", "Spread patterns", "Penetração de materiais", "Hit markers e feedback"],
        resources: [],
        exercises: [{ id: "ex-4-7-1", title: "Assault Rifle", description: "Crie rifle com spread e recoil", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["Multi Line Trace para penetração", "Random spread com seed para replay"],
        completed: false
      },
      {
        id: "4-8",
        title: "Ammo e Reload System",
        description: "Gerenciamento de munição profissional",
        duration: "45min",
        content: "Crie sistema completo de munição com magazine, reserva, tipos de munição, e animações de recarga.",
        objectives: ["Magazine system", "Ammo reserve", "Reload com animação", "Ammo types"],
        resources: [],
        exercises: [{ id: "ex-4-8-1", title: "Ammo System", description: "Sistema completo com reload parcial", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Reload parcial vs completo", "Interrupt reload para feedback"],
        completed: false
      },
      {
        id: "4-9",
        title: "Recoil e Weapon Sway",
        description: "Fazendo armas sentirem reais",
        duration: "50min",
        content: "Implemente recoil com padrões, recovery, e weapon sway para movimento e respiração. Essencial para shooters.",
        objectives: ["Recoil patterns", "Recoil recovery", "Weapon sway", "ADS mechanics"],
        resources: [],
        exercises: [{ id: "ex-4-9-1", title: "Recoil Pattern", description: "Crie padrão de recoil controlável", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["Curvas para recoil patterns", "Interp para recovery suave"],
        completed: false
      },
      {
        id: "4-10",
        title: "Combat Feel: Juice",
        description: "Feedback que faz diferença",
        duration: "60min",
        content: "Adicione camera shake, hit stop, slow motion, particles, e sons para fazer o combate sentir impactante e satisfatório.",
        objectives: ["Camera shake on hit", "Hit stop/freeze frame", "Slow motion em kills", "VFX e SFX feedback"],
        resources: [],
        exercises: [{ id: "ex-4-10-1", title: "Combat Juice", description: "Adicione feedback completo a um ataque", difficulty: "advanced", estimatedTime: "50min", completed: false }],
        tips: ["Menos é mais - não exagere", "Layered feedback: visual + audio + haptic"],
        completed: false
      }
    ]
  },

  // MÓDULO 5 - AI E COMPORTAMENTO
  {
    id: 5,
    slug: "ai-behavior",
    title: "Inteligência Artificial",
    subtitle: "Criando Inimigos Inteligentes",
    description: "Behavior Trees, Perception, e EQS para NPCs convincentes",
    longDescription: "IA é o que dá vida aos seus jogos. Domine Behavior Trees para lógica de decisão, AI Perception para sentidos, e Environment Query System para decisões espaciais inteligentes. Crie inimigos que desafiam e engajam jogadores.",
    icon: "Brain",
    color: "from-yellow-500 to-amber-500",
    difficulty: "advanced",
    totalDuration: "10h",
    prerequisites: [1, 2, 3],
    skills: ["Behavior Trees", "Blackboard", "AI Perception", "EQS", "Navigation"],
    projects: ["Inimigo Patrulheiro", "Boss AI"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "ai-docs", title: "AI System Overview", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/artificial-intelligence-in-unreal-engine/", description: "Documentação de AI" }
    ],
    lessons: [
      {
        id: "5-1",
        title: "AI Controller e Possession",
        description: "Fundamentos de controle de AI",
        duration: "35min",
        content: "Entenda como AI Controllers controlam Pawns, configure auto possession, e crie a base para qualquer sistema de AI.",
        objectives: ["Criar AI Controller", "Auto Possess AI", "Run Behavior Tree", "Diferença de Player Controller"],
        resources: [],
        exercises: [{ id: "ex-5-1-1", title: "AI Setup", description: "Configure AI Controller básico", difficulty: "beginner", estimatedTime: "20min", completed: false }],
        tips: ["AI Controller persiste entre respawns", "Use interfaces para comunicação"],
        completed: false
      },
      {
        id: "5-2",
        title: "Behavior Trees Fundamentals",
        description: "A linguagem da AI",
        duration: "60min",
        content: "Domine Behavior Trees: Composites (Selector, Sequence), Tasks, Decorators, e Services. A ferramenta principal para AI.",
        objectives: ["Entender flow de BT", "Usar Selector vs Sequence", "Criar Tasks customizados", "Decorators para condições"],
        resources: [{ id: "bt-docs", title: "Behavior Trees", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/behavior-trees-in-unreal-engine/", description: "Documentação BT" }],
        exercises: [{ id: "ex-5-2-1", title: "Patrol Behavior", description: "Crie AI que patrulha pontos", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Selector = OR (primeira que sucede)", "Sequence = AND (todas devem suceder)"],
        completed: false
      },
      {
        id: "5-3",
        title: "Blackboard: Memória da AI",
        description: "Armazenando dados para decisões",
        duration: "40min",
        content: "Use Blackboard para armazenar dados que a AI usa para tomar decisões: targets, localizações, estados, e variáveis customizadas.",
        objectives: ["Criar Blackboard Asset", "Definir Keys", "Set/Get values", "Object vs Vector keys"],
        resources: [],
        exercises: [{ id: "ex-5-3-1", title: "Blackboard Setup", description: "Configure blackboard para combate AI", difficulty: "intermediate", estimatedTime: "30min", completed: false }],
        tips: ["Keys podem ter tipos específicos", "Services atualizam blackboard periodicamente"],
        completed: false
      },
      {
        id: "5-4",
        title: "AI Perception System",
        description: "Visão, audição e sentidos",
        duration: "55min",
        content: "Implemente AI Perception para dar sentidos aos NPCs: visão com cone e distância, audição para sons, e sensing customizado.",
        objectives: ["AI Perception Component", "Sight Configuration", "Hearing Configuration", "On Perception Updated"],
        resources: [{ id: "perception-docs", title: "AI Perception", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/ai-perception-in-unreal-engine/", description: "Documentação Perception" }],
        exercises: [{ id: "ex-5-4-1", title: "Stealth AI", description: "AI que detecta por visão e som", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Use Stimulus Source para gerar eventos", "Affiliation filtra amigo/inimigo"],
        completed: false
      },
      {
        id: "5-5",
        title: "Navigation e Pathfinding",
        description: "Movendo AI pelo mundo",
        duration: "50min",
        content: "Configure Nav Mesh para pathfinding, use Move To, e lide com obstáculos dinâmicos e áreas de custo variável.",
        objectives: ["Nav Mesh Bounds Volume", "Move To Behavior", "Nav Modifiers", "Dynamic obstacles"],
        resources: [],
        exercises: [{ id: "ex-5-5-1", title: "Smart Navigation", description: "AI que navega evitando áreas perigosas", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Rebuild Nav Mesh após mudanças", "Nav Links para jumps/drops"],
        completed: false
      },
      {
        id: "5-6",
        title: "Environment Query System (EQS)",
        description: "Decisões espaciais inteligentes",
        duration: "65min",
        content: "Use EQS para encontrar posições ideais: cobertura, flanking, spawn points, e qualquer query espacial complexa.",
        objectives: ["Criar EQS Queries", "Generators e Tests", "Scoring system", "Run EQS Query"],
        resources: [{ id: "eqs-docs", title: "EQS", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/environment-query-system-in-unreal-engine/", description: "Documentação EQS" }],
        exercises: [{ id: "ex-5-6-1", title: "Cover System", description: "EQS para encontrar cobertura", difficulty: "advanced", estimatedTime: "70min", completed: false }],
        tips: ["Debug para visualizar queries", "Combine múltiplos tests com weights"],
        completed: false
      },
      {
        id: "5-7",
        title: "Combat AI Patterns",
        description: "Comportamentos de combate",
        duration: "70min",
        content: "Implemente padrões de combate: aggro, range detection, attack cooldowns, retreat, e coordenação entre múltiplos inimigos.",
        objectives: ["Aggro system", "Attack patterns", "Retreat behavior", "Squad coordination"],
        resources: [],
        exercises: [{ id: "ex-5-7-1", title: "Combat AI", description: "AI que ataca, recua e reagrupa", difficulty: "advanced", estimatedTime: "80min", completed: false }],
        tips: ["Use influence maps para coordenação", "Cooldowns previnem spam de ataques"],
        completed: false
      },
      {
        id: "5-8",
        title: "Boss AI Design",
        description: "Criando encontros memoráveis",
        duration: "75min",
        content: "Design e implemente boss fights com fases, padrões de ataque, tells, e mecânicas únicas que testam habilidades do jogador.",
        objectives: ["Multi-phase bosses", "Attack telegraphing", "Vulnerability windows", "Phase transitions"],
        resources: [],
        exercises: [{ id: "ex-5-8-1", title: "Boss Fight", description: "Boss com 3 fases distintas", difficulty: "expert", estimatedTime: "90min", completed: false }],
        tips: ["Tells devem ser claros mas não óbvios", "Cada fase deve mudar a dinâmica"],
        completed: false
      }
    ]
  },

  // MÓDULO 6 - UI/UX COM UMG
  {
    id: 6,
    slug: "ui-umg-system",
    title: "UI/UX com UMG",
    subtitle: "Interfaces Profissionais",
    description: "Crie interfaces bonitas e funcionais com Widget Blueprints",
    longDescription: "Uma boa UI faz toda diferença na experiência do jogador. Aprenda a criar interfaces responsivas, HUDs dinâmicos, menus navegáveis por gamepad, e sistemas de UI reutilizáveis seguindo padrões da indústria.",
    icon: "Layout",
    color: "from-cyan-500 to-blue-500",
    difficulty: "intermediate",
    totalDuration: "8h",
    prerequisites: [1, 2],
    skills: ["Widget Blueprints", "Anchors", "Data Binding", "Animations", "Gamepad Navigation"],
    projects: ["HUD Completo", "Menu System"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "umg-docs", title: "UMG Documentation", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/umg-ui-designer-for-unreal-engine/", description: "Documentação UMG" }
    ],
    lessons: [
      {
        id: "6-1",
        title: "Widget Blueprint Basics",
        description: "Criando sua primeira interface",
        duration: "40min",
        content: "Aprenda a criar Widget Blueprints, usar Canvas Panel, e entender o sistema de hierarquia de widgets.",
        objectives: ["Criar Widget Blueprint", "Canvas Panel layout", "Adicionar a viewport", "Widget hierarchy"],
        resources: [],
        exercises: [{ id: "ex-6-1-1", title: "Simple HUD", description: "Crie HUD com HP bar", difficulty: "beginner", estimatedTime: "30min", completed: false }],
        tips: ["Widgets são renderizados em ordem de hierarquia", "Use containers para organização"],
        completed: false
      },
      {
        id: "6-2",
        title: "Anchors e Responsividade",
        description: "UI que funciona em qualquer resolução",
        duration: "45min",
        content: "Domine o sistema de anchors para criar interfaces que se adaptam a diferentes resoluções e aspect ratios.",
        objectives: ["Entender Anchors", "Anchor presets", "Margins vs Alignment", "Safe Zone"],
        resources: [],
        exercises: [{ id: "ex-6-2-1", title: "Responsive HUD", description: "HUD que funciona de 720p a 4K", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Stretch anchors para elementos que escalam", "Use Safe Zone para TVs"],
        completed: false
      },
      {
        id: "6-3",
        title: "Data Binding e Updates",
        description: "Conectando UI aos dados do jogo",
        duration: "50min",
        content: "Aprenda diferentes formas de atualizar UI: binding, eventos, e polling. Crie UIs reativas e performáticas.",
        objectives: ["Property Binding", "Event-driven updates", "Widget references", "Performance considerations"],
        resources: [],
        exercises: [{ id: "ex-6-3-1", title: "Dynamic Stats", description: "UI que atualiza HP, Stamina, XP", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Bindings executam todo frame", "Prefira eventos para performance"],
        completed: false
      },
      {
        id: "6-4",
        title: "Widget Animations",
        description: "Dando vida à interface",
        duration: "45min",
        content: "Crie animações de UI com o sistema de animação de widgets: fade, scale, movement, e sequências complexas.",
        objectives: ["Widget Animation", "Keyframes e curves", "Play Animation in Blueprint", "Animation Events"],
        resources: [],
        exercises: [{ id: "ex-6-4-1", title: "Animated Menu", description: "Menu com transições suaves", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Animations podem ter events em keyframes", "Use Animation Finished para sequências"],
        completed: false
      },
      {
        id: "6-5",
        title: "Menus Navegáveis",
        description: "Input de mouse e gamepad",
        duration: "55min",
        content: "Crie menus que funcionam com mouse, teclado, e gamepad. Implemente focus navigation e feedback visual.",
        objectives: ["Button focus", "Navigation rules", "Gamepad input", "Focus visual feedback"],
        resources: [],
        exercises: [{ id: "ex-6-5-1", title: "Gamepad Menu", description: "Menu navegável por D-pad", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Set focus inicial ao abrir menu", "Explicit navigation para layouts complexos"],
        completed: false
      },
      {
        id: "6-6",
        title: "Inventory UI",
        description: "Grids, slots e drag-drop",
        duration: "70min",
        content: "Implemente UI de inventário com grid layout, slots interativos, drag and drop, e tooltips de itens.",
        objectives: ["Grid Panel/Uniform Grid", "Slot widgets", "Drag and Drop operations", "Tooltips"],
        resources: [],
        exercises: [{ id: "ex-6-6-1", title: "Inventory Grid", description: "Grid de inventário com drag-drop", difficulty: "advanced", estimatedTime: "80min", completed: false }],
        tips: ["Use User Widget para slots reutilizáveis", "Drag Visual mostra o que está sendo arrastado"],
        completed: false
      },
      {
        id: "6-7",
        title: "Dialog e Notification Systems",
        description: "Popups e feedback ao jogador",
        duration: "50min",
        content: "Crie sistemas de diálogo/confirmação, notificações toast, e feedback visual para ações do jogador.",
        objectives: ["Modal dialogs", "Toast notifications", "Confirmation prompts", "Timed popups"],
        resources: [],
        exercises: [{ id: "ex-6-7-1", title: "Notification System", description: "Sistema de toasts empilháveis", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Use widget pool para notificações", "Animate entrada e saída"],
        completed: false
      },
      {
        id: "6-8",
        title: "3D World UI",
        description: "UI no espaço do jogo",
        duration: "45min",
        content: "Crie UI no mundo 3D: health bars acima de inimigos, interação prompts, e billboards.",
        objectives: ["Widget Component", "Screen vs World space", "Billboard widgets", "Scaling com distância"],
        resources: [],
        exercises: [{ id: "ex-6-8-1", title: "Enemy Health Bars", description: "Health bars que seguem inimigos", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Widget Component tem Draw Size", "Face camera para billboards"],
        completed: false
      }
    ]
  },

  // MÓDULO 7 - SISTEMAS DE JOGO
  {
    id: 7,
    slug: "game-systems",
    title: "Sistemas de Jogo",
    subtitle: "Inventário, Save, Quest e Mais",
    description: "Os sistemas que fazem um jogo completo",
    longDescription: "Todo jogo precisa de sistemas core: inventário para gerenciar itens, save/load para persistência, quests para objetivos, e diálogos para narrativa. Aprenda a criar cada um de forma modular e escalável.",
    icon: "Package",
    color: "from-emerald-500 to-teal-500",
    difficulty: "advanced",
    totalDuration: "14h",
    prerequisites: [1, 2, 6],
    skills: ["Inventory System", "Save System", "Quest System", "Dialog System", "Data Tables"],
    projects: ["RPG Systems Pack"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [],
    lessons: [
      {
        id: "7-1",
        title: "Data Tables e Data Assets",
        description: "Dados configuráveis para designers",
        duration: "50min",
        content: "Use Data Tables para dados tabulares e Data Assets para objetos configuráveis. Fundamento para todos os sistemas de jogo.",
        objectives: ["Criar Data Tables", "Row Structs", "Data Assets", "Lookup em runtime"],
        resources: [{ id: "datatable-docs", title: "Data Tables", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/data-driven-gameplay-elements-in-unreal-engine/", description: "Data Driven Gameplay" }],
        exercises: [{ id: "ex-7-1-1", title: "Item Database", description: "Data Table com 20 itens", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["CSV import para Data Tables", "Data Assets para objetos complexos"],
        completed: false
      },
      {
        id: "7-2",
        title: "Inventory System: Core",
        description: "Estrutura base do inventário",
        duration: "70min",
        content: "Crie a lógica core de inventário: array de itens, adicionar, remover, stack, e weight limits.",
        objectives: ["Inventory Component", "Add/Remove items", "Stacking logic", "Weight system"],
        resources: [],
        exercises: [{ id: "ex-7-2-1", title: "Inventory Core", description: "Sistema de inventário funcional", difficulty: "advanced", estimatedTime: "80min", completed: false }],
        tips: ["Use structs para item instances", "Separate data de instances"],
        completed: false
      },
      {
        id: "7-3",
        title: "Inventory System: Advanced",
        description: "Equipamento, categorias e uso",
        duration: "65min",
        content: "Expanda o inventário com equipment slots, item categories, consumables, e item usage.",
        objectives: ["Equipment slots", "Item categories", "Use item logic", "Drop/Pickup"],
        resources: [],
        exercises: [{ id: "ex-7-3-1", title: "Equipment System", description: "Sistema de equipar armas e armor", difficulty: "advanced", estimatedTime: "70min", completed: false }],
        tips: ["Slots podem ter restrictions", "Use interfaces para item usage"],
        completed: false
      },
      {
        id: "7-4",
        title: "Save System: Fundamentals",
        description: "Persistência de dados",
        duration: "55min",
        content: "Implemente save/load usando Save Game objects, serialização, e slots de save.",
        objectives: ["Save Game class", "Save slots", "Async save/load", "Serialize actors"],
        resources: [{ id: "savegame-docs", title: "Save Game", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/saving-and-loading-your-game-in-unreal-engine/", description: "Save Game Docs" }],
        exercises: [{ id: "ex-7-4-1", title: "Save System", description: "Save/Load posição e inventário", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Async para saves grandes", "Versioning para compatibilidade"],
        completed: false
      },
      {
        id: "7-5",
        title: "Save System: World State",
        description: "Salvando estado do mundo",
        duration: "60min",
        content: "Salve estado de actors no mundo: portas abertas, inimigos mortos, itens coletados, e spawns dinâmicos.",
        objectives: ["Actor serialization", "Spawn save data", "Level state", "Soft references"],
        resources: [],
        exercises: [{ id: "ex-7-5-1", title: "World State Save", description: "Salve estado de 10 objetos diferentes", difficulty: "advanced", estimatedTime: "65min", completed: false }],
        tips: ["GUIDs para identificação única", "Spawn records para actors dinâmicos"],
        completed: false
      },
      {
        id: "7-6",
        title: "Quest System: Structure",
        description: "Arquitetura de quests",
        duration: "65min",
        content: "Crie sistema de quests com objectives, states, tracking, e rewards. Estrutura escalável para qualquer tipo de quest.",
        objectives: ["Quest data structure", "Objective tracking", "Quest states", "Completion logic"],
        resources: [],
        exercises: [{ id: "ex-7-6-1", title: "Quest Framework", description: "Sistema com 5 quests funcionais", difficulty: "advanced", estimatedTime: "75min", completed: false }],
        tips: ["Quests podem ter múltiplos objectives", "Use Data Assets para quest definitions"],
        completed: false
      },
      {
        id: "7-7",
        title: "Quest System: Dynamic Objectives",
        description: "Objetivos que respondem ao mundo",
        duration: "55min",
        content: "Implemente objectives que trackam eventos do jogo: kills, coletas, localizações, e timers.",
        objectives: ["Kill objectives", "Collection objectives", "Location triggers", "Time limits"],
        resources: [],
        exercises: [{ id: "ex-7-7-1", title: "Dynamic Objectives", description: "Quest com 3 tipos de objective", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Event-driven para performance", "Listeners registram com Game Mode"],
        completed: false
      },
      {
        id: "7-8",
        title: "Dialog System",
        description: "Conversas e escolhas",
        duration: "75min",
        content: "Crie sistema de diálogo com nodes, escolhas, condições, e consequências. Fundamento para narrativas interativas.",
        objectives: ["Dialog tree structure", "Speaker system", "Choices with conditions", "Dialog events"],
        resources: [],
        exercises: [{ id: "ex-7-8-1", title: "Dialog System", description: "Sistema de diálogo com branches", difficulty: "advanced", estimatedTime: "85min", completed: false }],
        tips: ["Use Data Tables para localização", "Conditions podem checar quest state"],
        completed: false
      },
      {
        id: "7-9",
        title: "Interaction System",
        description: "Interagindo com o mundo",
        duration: "50min",
        content: "Crie sistema genérico de interação: detectar interactables, prompts, e executar ações.",
        objectives: ["Interaction interface", "Detection methods", "Interaction prompts", "Context actions"],
        resources: [],
        exercises: [{ id: "ex-7-9-1", title: "Interaction System", description: "Sistema genérico de interação", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Interface permite qualquer actor ser interactable", "Overlap vs Line Trace detection"],
        completed: false
      },
      {
        id: "7-10",
        title: "Economy System",
        description: "Dinheiro, lojas e trading",
        duration: "55min",
        content: "Implemente economia de jogo: currency, shops, buy/sell, e pricing dynamics.",
        objectives: ["Currency management", "Shop interface", "Buy/Sell logic", "Price modifiers"],
        resources: [],
        exercises: [{ id: "ex-7-10-1", title: "Shop System", description: "Loja funcional com UI", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Base prices em Data Tables", "Modifiers para economia dinâmica"],
        completed: false
      }
    ]
  },

  // MÓDULO 8 - MULTIPLAYER
  {
    id: 8,
    slug: "multiplayer-networking",
    title: "Multiplayer e Networking",
    subtitle: "Jogos Online com Blueprint",
    description: "Crie experiências multiplayer robustas",
    longDescription: "Multiplayer adiciona complexidade mas também possibilidades infinitas. Aprenda replicação, RPCs, ownership, e como criar sistemas multiplayer que funcionam de forma suave e justa para todos os jogadores.",
    icon: "Users",
    color: "from-indigo-500 to-purple-500",
    difficulty: "expert",
    totalDuration: "12h",
    prerequisites: [1, 2, 3, 4],
    skills: ["Replication", "RPCs", "Network Prediction", "Session Management"],
    projects: ["Multiplayer Shooter Prototype"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "network-docs", title: "Networking Overview", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/networking-overview-for-unreal-engine/", description: "Documentação de Network" }
    ],
    lessons: [
      {
        id: "8-1",
        title: "Networking Fundamentals",
        description: "Server-Client Architecture",
        duration: "50min",
        content: "Entenda a arquitetura server-authoritative do Unreal, roles (Authority, Autonomous, Simulated), e o fluxo de dados na rede.",
        objectives: ["Server-Client model", "Network roles", "Authority concept", "Listen vs Dedicated server"],
        resources: [],
        exercises: [{ id: "ex-8-1-1", title: "Network Setup", description: "Configure projeto para multiplayer", difficulty: "intermediate", estimatedTime: "30min", completed: false }],
        tips: ["Server é autoridade sobre game state", "Teste sempre com PIE multiplayer"],
        completed: false
      },
      {
        id: "8-2",
        title: "Replication Basics",
        description: "Sincronizando dados",
        duration: "60min",
        content: "Aprenda a replicar variáveis e actors entre server e clients usando Replicated e ReplicatedUsing.",
        objectives: ["Replicated variables", "RepNotify", "Replication conditions", "Net Update Frequency"],
        resources: [{ id: "replication-docs", title: "Replication", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/actor-replication-in-unreal-engine/", description: "Actor Replication" }],
        exercises: [{ id: "ex-8-2-1", title: "Replicated Health", description: "Sistema de HP replicado", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Minimize dados replicados", "RepNotify para efeitos visuais"],
        completed: false
      },
      {
        id: "8-3",
        title: "Remote Procedure Calls (RPCs)",
        description: "Comunicação direta na rede",
        duration: "55min",
        content: "Use RPCs para ações que precisam executar em locais específicos: Server, Client, Multicast.",
        objectives: ["Server RPCs", "Client RPCs", "Multicast RPCs", "Reliable vs Unreliable"],
        resources: [],
        exercises: [{ id: "ex-8-3-1", title: "RPC System", description: "Implemente ação com Server e Multicast RPC", difficulty: "advanced", estimatedTime: "50min", completed: false }],
        tips: ["Server RPC para ações do jogador", "Multicast para efeitos visuais"],
        completed: false
      },
      {
        id: "8-4",
        title: "Ownership e Relevancy",
        description: "Quem controla e quem vê",
        duration: "50min",
        content: "Entenda ownership para RPCs, e relevancy para otimização de bandwidth.",
        objectives: ["Actor ownership", "Connection ownership", "Network Relevancy", "Always Relevant"],
        resources: [],
        exercises: [{ id: "ex-8-4-1", title: "Ownership Setup", description: "Configure ownership correto para player actions", difficulty: "advanced", estimatedTime: "40min", completed: false }],
        tips: ["Owned actors podem chamar Server RPCs", "Relevancy economiza bandwidth"],
        completed: false
      },
      {
        id: "8-5",
        title: "Movement Replication",
        description: "Sincronizando movimento suave",
        duration: "65min",
        content: "Aprenda como Character Movement Component replica, e como lidar com prediction e correction.",
        objectives: ["CMC replication", "Client prediction", "Server correction", "Smoothing"],
        resources: [],
        exercises: [{ id: "ex-8-5-1", title: "Smooth Movement", description: "Configure movimento sem stuttering", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["CMC tem prediction built-in", "Ajuste Net Update Frequency"],
        completed: false
      },
      {
        id: "8-6",
        title: "Multiplayer Combat",
        description: "Hits, dano e validação",
        duration: "70min",
        content: "Implemente combate multiplayer com server validation, hit registration, e feedback para todos os players.",
        objectives: ["Server-side hit validation", "Lag compensation", "Kill feed replication", "Fair hit detection"],
        resources: [],
        exercises: [{ id: "ex-8-6-1", title: "Network Combat", description: "Sistema de tiro com validação server", difficulty: "expert", estimatedTime: "80min", completed: false }],
        tips: ["Server valida todos os hits", "Client prediction para feedback imediato"],
        completed: false
      },
      {
        id: "8-7",
        title: "Session Management",
        description: "Lobbies e matchmaking",
        duration: "55min",
        content: "Crie e gerencie sessões: host, join, server browser, e integração com Online Subsystems.",
        objectives: ["Create Session", "Find Sessions", "Join Session", "Online Subsystem NULL"],
        resources: [{ id: "sessions-docs", title: "Online Sessions", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/online-subsystem-in-unreal-engine/", description: "Online Subsystem" }],
        exercises: [{ id: "ex-8-7-1", title: "Session System", description: "Host/Join com server browser", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["NULL subsystem para LAN testing", "Steam Subsystem para release"],
        completed: false
      },
      {
        id: "8-8",
        title: "Debugging Network",
        description: "Encontrando problemas de rede",
        duration: "45min",
        content: "Use ferramentas de debug: Net Stats, Network Profiler, e técnicas para identificar problemas de replicação.",
        objectives: ["Net Stats console", "Network Profiler", "Common issues", "Testing methodology"],
        resources: [],
        exercises: [{ id: "ex-8-8-1", title: "Debug Session", description: "Encontre e corrija 3 bugs de rede", difficulty: "advanced", estimatedTime: "50min", completed: false }],
        tips: ["stat net para estatísticas", "Log replication para debug"],
        completed: false
      }
    ]
  },

  // MÓDULO 9 - AUDIO
  {
    id: 9,
    slug: "audio-system",
    title: "Sistema de Áudio",
    subtitle: "Som Imersivo",
    description: "Áudio que dá vida ao seu jogo",
    longDescription: "Áudio é 50% da experiência. Aprenda o sistema de áudio do Unreal: Sound Cues para variação, Attenuation para espacialização, Mixers para controle, e MetaSounds para audio procedural.",
    icon: "Volume2",
    color: "from-pink-500 to-rose-500",
    difficulty: "intermediate",
    totalDuration: "6h",
    prerequisites: [1, 2],
    skills: ["Sound Cues", "Attenuation", "Sound Classes", "MetaSounds"],
    projects: ["Soundscape Completo"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "audio-docs", title: "Audio System", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/audio-system-overview-for-unreal-engine/", description: "Audio Overview" }
    ],
    lessons: [
      {
        id: "9-1",
        title: "Audio Fundamentals",
        description: "Tocando sons no Unreal",
        duration: "35min",
        content: "Aprenda as bases: importar áudio, Play Sound 2D/at Location, e configurações básicas de som.",
        objectives: ["Import audio files", "Play Sound 2D", "Play Sound at Location", "Sound asset settings"],
        resources: [],
        exercises: [{ id: "ex-9-1-1", title: "Basic Sounds", description: "Adicione sons de passos e tiro", difficulty: "beginner", estimatedTime: "25min", completed: false }],
        tips: ["WAV para efeitos, OGG para música", "Compression Quality afeta tamanho"],
        completed: false
      },
      {
        id: "9-2",
        title: "Sound Cues",
        description: "Variação e complexidade",
        duration: "50min",
        content: "Crie Sound Cues para adicionar variação, camadas, e lógica ao áudio.",
        objectives: ["Create Sound Cue", "Random variations", "Looping", "Crossfade"],
        resources: [{ id: "soundcue-docs", title: "Sound Cues", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/sound-cues-in-unreal-engine/", description: "Sound Cue Reference" }],
        exercises: [{ id: "ex-9-2-1", title: "Footstep Cue", description: "Sound Cue com variação de passos", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Random evita repetição", "Concatenator para sequências"],
        completed: false
      },
      {
        id: "9-3",
        title: "Attenuation",
        description: "Som espacial 3D",
        duration: "45min",
        content: "Configure attenuation para sons 3D: falloff, occlusion, e spatialization.",
        objectives: ["Attenuation settings", "Distance curves", "Occlusion", "Spatialization"],
        resources: [],
        exercises: [{ id: "ex-9-3-1", title: "3D Ambience", description: "Configure som ambiente com attenuation", difficulty: "intermediate", estimatedTime: "35min", completed: false }],
        tips: ["Logarithmic falloff é mais natural", "Occlusion simula obstáculos"],
        completed: false
      },
      {
        id: "9-4",
        title: "Sound Classes e Mix",
        description: "Controle de volume global",
        duration: "45min",
        content: "Organize áudio em classes e controle volumes via Sound Mix para opções de jogador.",
        objectives: ["Sound Classes", "Sound Mix", "Volume control", "Save audio settings"],
        resources: [],
        exercises: [{ id: "ex-9-4-1", title: "Audio Options", description: "Menu de opções de áudio funcional", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Classes separam SFX de música", "Mix permite mute/solo"],
        completed: false
      },
      {
        id: "9-5",
        title: "Audio Components",
        description: "Som attached a actors",
        duration: "40min",
        content: "Use Audio Components para sons que seguem actors, com controle programático completo.",
        objectives: ["Audio Component", "Play/Stop control", "Fade in/out", "Parameter changes"],
        resources: [],
        exercises: [{ id: "ex-9-5-1", title: "Engine Sound", description: "Som de motor que muda com velocidade", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Components permitem controle preciso", "Set parameters em runtime"],
        completed: false
      },
      {
        id: "9-6",
        title: "Ambient Sound Design",
        description: "Criando atmosferas",
        duration: "50min",
        content: "Crie ambientes sonoros imersivos com layers, triggers, e variação temporal.",
        objectives: ["Ambient layers", "Audio Volumes", "Time of day audio", "Weather sounds"],
        resources: [],
        exercises: [{ id: "ex-9-6-1", title: "Forest Ambience", description: "Ambiente de floresta com camadas", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Layers criam profundidade", "Randomize timing para naturalidade"],
        completed: false
      }
    ]
  },

  // MÓDULO 10 - VFX E NIAGARA
  {
    id: 10,
    slug: "vfx-niagara",
    title: "VFX com Niagara",
    subtitle: "Efeitos Visuais Profissionais",
    description: "Crie efeitos visuais impressionantes",
    longDescription: "Niagara é o sistema de partículas mais poderoso do mercado. Aprenda a criar efeitos de fogo, fumaça, explosões, magia, e muito mais com controle total sobre cada partícula.",
    icon: "Sparkles",
    color: "from-orange-500 to-yellow-500",
    difficulty: "advanced",
    totalDuration: "10h",
    prerequisites: [1, 2],
    skills: ["Niagara Systems", "Emitters", "Modules", "Events", "Data Interfaces"],
    projects: ["Spell Effects Pack", "Weapon VFX"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "niagara-docs", title: "Niagara VFX", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/creating-visual-effects-in-niagara-for-unreal-engine/", description: "Niagara Documentation" }
    ],
    lessons: [
      {
        id: "10-1",
        title: "Niagara Fundamentals",
        description: "Entendendo o sistema",
        duration: "45min",
        content: "Aprenda a estrutura do Niagara: Systems, Emitters, Modules, e o pipeline de simulação.",
        objectives: ["Niagara System vs Emitter", "Module stack", "Parameter types", "Preview e debug"],
        resources: [],
        exercises: [{ id: "ex-10-1-1", title: "First Particle", description: "Crie efeito de partícula simples", difficulty: "beginner", estimatedTime: "30min", completed: false }],
        tips: ["Systems combinam múltiplos Emitters", "Modules são a lógica"],
        completed: false
      },
      {
        id: "10-2",
        title: "Sprite Particles",
        description: "Partículas 2D básicas",
        duration: "50min",
        content: "Crie efeitos com sprites: spawn, velocity, color over life, size curves.",
        objectives: ["Sprite renderer", "Spawn rate/burst", "Velocity modules", "Color/Size over life"],
        resources: [],
        exercises: [{ id: "ex-10-2-1", title: "Fire Effect", description: "Crie efeito de fogo com sprites", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Curves controlam vida da partícula", "Add velocity para movimento"],
        completed: false
      },
      {
        id: "10-3",
        title: "Mesh Particles",
        description: "Partículas 3D",
        duration: "55min",
        content: "Use meshes como partículas para debris, folhas, e efeitos complexos.",
        objectives: ["Mesh renderer", "Mesh orientation", "Scale/Rotation animation", "LODs"],
        resources: [],
        exercises: [{ id: "ex-10-3-1", title: "Debris System", description: "Efeito de destroços com meshes", difficulty: "intermediate", estimatedTime: "50min", completed: false }],
        tips: ["Meshes são mais custosos que sprites", "Use LODs para performance"],
        completed: false
      },
      {
        id: "10-4",
        title: "Forces e Physics",
        description: "Movimento realístico",
        duration: "50min",
        content: "Adicione forças, gravidade, drag, e colisões para partículas fisicamente corretas.",
        objectives: ["Gravity Force", "Drag", "Curl Noise", "Collision"],
        resources: [],
        exercises: [{ id: "ex-10-4-1", title: "Smoke Physics", description: "Fumaça com turbulência e rising", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Curl Noise cria turbulência natural", "Collision com depth buffer é barato"],
        completed: false
      },
      {
        id: "10-5",
        title: "Events e Communication",
        description: "Partículas que interagem",
        duration: "60min",
        content: "Use eventos para criar cascatas de efeitos: explosões que spawnam faíscas, etc.",
        objectives: ["Generate Events", "Receive Events", "Event handlers", "Location events"],
        resources: [],
        exercises: [{ id: "ex-10-5-1", title: "Explosion Chain", description: "Explosão com sparks e smoke", difficulty: "advanced", estimatedTime: "65min", completed: false }],
        tips: ["Events permitem sistemas complexos", "Death event para spawns em partícula morta"],
        completed: false
      },
      {
        id: "10-6",
        title: "GPU Simulation",
        description: "Milhões de partículas",
        duration: "55min",
        content: "Use GPU sim para efeitos massivos com milhões de partículas de forma performática.",
        objectives: ["GPU Emitters", "Attribute readers", "Limitations", "Optimization"],
        resources: [],
        exercises: [{ id: "ex-10-6-1", title: "Particle Rain", description: "Sistema de chuva com GPU", difficulty: "advanced", estimatedTime: "50min", completed: false }],
        tips: ["GPU sim tem limitações de features", "Perfeito para efeitos ambiente"],
        completed: false
      },
      {
        id: "10-7",
        title: "Blueprint Integration",
        description: "Controlando VFX por código",
        duration: "50min",
        content: "Controle sistemas Niagara via Blueprint: spawn, parameters, e lifecycle.",
        objectives: ["Spawn System at Location", "Set Niagara Variables", "Component control", "Pooling"],
        resources: [],
        exercises: [{ id: "ex-10-7-1", title: "Dynamic VFX", description: "Efeito que muda baseado em gameplay", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["User Parameters expõem controles", "Niagara Component para attach"],
        completed: false
      },
      {
        id: "10-8",
        title: "Material Effects",
        description: "Materiais para partículas",
        duration: "55min",
        content: "Crie materiais especiais para partículas: dissolve, distortion, e flipbook animation.",
        objectives: ["Particle color input", "Dissolve effects", "Distortion", "Flipbook animation"],
        resources: [],
        exercises: [{ id: "ex-10-8-1", title: "Magic Effect", description: "Efeito mágico com material custom", difficulty: "advanced", estimatedTime: "60min", completed: false }],
        tips: ["Dynamic Parameters passam dados", "Distortion usa Scene Texture"],
        completed: false
      }
    ]
  },

  // MÓDULO 11 - OTIMIZAÇÃO
  {
    id: 11,
    slug: "optimization",
    title: "Otimização e Performance",
    subtitle: "60 FPS em Qualquer Hardware",
    description: "Faça seu jogo rodar suave",
    longDescription: "Performance é crucial para a experiência do jogador. Aprenda a identificar bottlenecks, otimizar Blueprints, configurar LODs, usar profilers, e aplicar técnicas avançadas de otimização.",
    icon: "Gauge",
    color: "from-slate-500 to-zinc-500",
    difficulty: "expert",
    totalDuration: "8h",
    prerequisites: [1, 2, 3, 4, 5, 6],
    skills: ["Profiling", "Blueprint Optimization", "LODs", "Culling", "Memory Management"],
    projects: ["Performance Analysis Report"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [
      { id: "perf-docs", title: "Performance Guidelines", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/performance-guidelines-for-unreal-engine/", description: "Performance Docs" }
    ],
    lessons: [
      {
        id: "11-1",
        title: "Profiling Fundamentals",
        description: "Encontrando os problemas",
        duration: "55min",
        content: "Aprenda a usar stat commands, GPU profiler, CPU profiler, e Unreal Insights para identificar bottlenecks.",
        objectives: ["stat commands", "GPU Profiler", "CPU Profiler", "Unreal Insights"],
        resources: [],
        exercises: [{ id: "ex-11-1-1", title: "Profile Session", description: "Profile uma cena e identifique problemas", difficulty: "intermediate", estimatedTime: "45min", completed: false }],
        tips: ["Profile em target hardware", "stat unit mostra frame breakdown"],
        completed: false
      },
      {
        id: "11-2",
        title: "Blueprint Optimization",
        description: "Código visual eficiente",
        duration: "50min",
        content: "Otimize Blueprints: evite Tick desnecessário, use Timers, cache references, e nativize hot paths.",
        objectives: ["Tick alternatives", "Reference caching", "Event-driven design", "Nativization"],
        resources: [],
        exercises: [{ id: "ex-11-2-1", title: "Optimize BP", description: "Otimize um Blueprint problemático", difficulty: "intermediate", estimatedTime: "40min", completed: false }],
        tips: ["Disable Tick quando não usado", "Cast é caro - cache o resultado"],
        completed: false
      },
      {
        id: "11-3",
        title: "LOD Systems",
        description: "Níveis de detalhe",
        duration: "45min",
        content: "Configure LODs para meshes e outros assets para manter performance em cenas densas.",
        objectives: ["Auto LOD generation", "LOD settings", "Screen size thresholds", "HLOD"],
        resources: [],
        exercises: [{ id: "ex-11-3-1", title: "LOD Setup", description: "Configure LODs para asset complexo", difficulty: "intermediate", estimatedTime: "35min", completed: false }],
        tips: ["Teste LOD transitions visualmente", "HLOD para áreas estáticas"],
        completed: false
      },
      {
        id: "11-4",
        title: "Culling e Occlusion",
        description: "Não renderize o invisível",
        duration: "50min",
        content: "Configure frustum culling, occlusion culling, e distance culling para evitar renderizar objetos invisíveis.",
        objectives: ["Frustum culling", "Precomputed occlusion", "Distance culling", "Cull distance volumes"],
        resources: [],
        exercises: [{ id: "ex-11-4-1", title: "Culling Setup", description: "Configure culling para cidade", difficulty: "advanced", estimatedTime: "45min", completed: false }],
        tips: ["Occlusion requer bake", "Distance culling é gratuito"],
        completed: false
      },
      {
        id: "11-5",
        title: "Texture e Memory",
        description: "Gerenciamento de memória",
        duration: "50min",
        content: "Otimize uso de memória: streaming de texturas, compression, e monitoramento de memory budgets.",
        objectives: ["Texture streaming", "Compression settings", "Memory budgets", "Asset auditing"],
        resources: [],
        exercises: [{ id: "ex-11-5-1", title: "Memory Audit", description: "Audite e otimize uso de memória", difficulty: "advanced", estimatedTime: "50min", completed: false }],
        tips: ["Power of 2 textures stream melhor", "Size Map para identificar assets grandes"],
        completed: false
      },
      {
        id: "11-6",
        title: "Draw Call Optimization",
        description: "Batching e Instancing",
        duration: "45min",
        content: "Reduza draw calls usando instancing, merge actors, e material optimization.",
        objectives: ["Instanced Static Mesh", "Merge Actors", "Material complexity", "Draw call budget"],
        resources: [],
        exercises: [{ id: "ex-11-6-1", title: "Reduce Draw Calls", description: "Reduza draw calls de cena em 50%", difficulty: "advanced", estimatedTime: "55min", completed: false }],
        tips: ["Instancing para objetos repetidos", "Material complexity = custo"],
        completed: false
      }
    ]
  },

  // MÓDULO 12 - PROJETO FINAL
  {
    id: 12,
    slug: "projeto-final-jogo-completo",
    title: "Projeto Final: Jogo Completo",
    subtitle: "Aplicando Tudo",
    description: "Crie um jogo completo do zero à publicação",
    longDescription: "Este é o módulo culminante onde você aplicará tudo que aprendeu para criar um jogo completo. Do conceito à publicação, você passará por todas as etapas do desenvolvimento profissional.",
    icon: "Trophy",
    color: "from-amber-500 to-yellow-500",
    difficulty: "expert",
    totalDuration: "20h+",
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    skills: ["Game Design", "Production Pipeline", "Publishing", "Post-Launch"],
    projects: ["Jogo Completo Publicável"],
    completed: false,
    unlocked: false,
    progress: 0,
    resources: [],
    lessons: [
      {
        id: "12-1",
        title: "Game Design Document",
        description: "Planejando seu jogo",
        duration: "90min",
        content: "Crie um GDD profissional: conceito, mecânicas core, escopo, e milestones de desenvolvimento.",
        objectives: ["Core concept", "Mechanics definition", "Scope management", "Milestone planning"],
        resources: [],
        exercises: [{ id: "ex-12-1-1", title: "Write GDD", description: "Crie GDD completo para seu jogo", difficulty: "intermediate", estimatedTime: "120min", completed: false }],
        tips: ["Escopo realista é crucial", "Defina MVP primeiro"],
        completed: false
      },
      {
        id: "12-2",
        title: "Prototype Phase",
        description: "Validando mecânicas",
        duration: "180min",
        content: "Crie protótipos jogáveis para validar mecânicas core antes de investir em arte e polish.",
        objectives: ["Rapid prototyping", "Playtesting", "Iteration", "Core loop validation"],
        resources: [],
        exercises: [{ id: "ex-12-2-1", title: "Core Prototype", description: "Protótipo jogável do core loop", difficulty: "advanced", estimatedTime: "240min", completed: false }],
        tips: ["Ugly prototype é OK", "Teste com pessoas de fora"],
        completed: false
      },
      {
        id: "12-3",
        title: "Production: Systems",
        description: "Implementando sistemas",
        duration: "240min",
        content: "Implemente todos os sistemas do jogo seguindo a arquitetura planejada.",
        objectives: ["Implement core systems", "Integration testing", "Bug fixing", "Documentation"],
        resources: [],
        exercises: [{ id: "ex-12-3-1", title: "Systems Implementation", description: "Implemente todos os sistemas planejados", difficulty: "expert", estimatedTime: "300min", completed: false }],
        tips: ["Um sistema de cada vez", "Teste integração frequentemente"],
        completed: false
      },
      {
        id: "12-4",
        title: "Production: Content",
        description: "Criando conteúdo",
        duration: "180min",
        content: "Crie e integre conteúdo: levels, enemies, items, e todas as assets necessárias.",
        objectives: ["Level design", "Content integration", "Balance tuning", "Content pipeline"],
        resources: [],
        exercises: [{ id: "ex-12-4-1", title: "Content Creation", description: "Crie conteúdo para 1 hora de gameplay", difficulty: "expert", estimatedTime: "240min", completed: false }],
        tips: ["Use ferramentas de level design", "Iterate baseado em feedback"],
        completed: false
      },
      {
        id: "12-5",
        title: "Polish Phase",
        description: "Tornando o jogo profissional",
        duration: "120min",
        content: "Adicione polish: VFX, audio, feedback, UI animations, e detalhes que fazem diferença.",
        objectives: ["Visual polish", "Audio integration", "Feedback systems", "UI/UX refinement"],
        resources: [],
        exercises: [{ id: "ex-12-5-1", title: "Polish Pass", description: "Polish completo de uma feature", difficulty: "advanced", estimatedTime: "150min", completed: false }],
        tips: ["Polish multiplica qualidade percebida", "Priorize o que jogador vê mais"],
        completed: false
      },
      {
        id: "12-6",
        title: "QA e Bug Fixing",
        description: "Qualidade profissional",
        duration: "90min",
        content: "Execute QA sistemático, documente bugs, priorize fixes, e garanta estabilidade.",
        objectives: ["QA methodology", "Bug tracking", "Prioritization", "Regression testing"],
        resources: [],
        exercises: [{ id: "ex-12-6-1", title: "QA Pass", description: "Execute QA completo e documente bugs", difficulty: "intermediate", estimatedTime: "120min", completed: false }],
        tips: ["Teste em múltiplos hardwares", "Priorize crashes e blockers"],
        completed: false
      },
      {
        id: "12-7",
        title: "Build e Packaging",
        description: "Preparando para release",
        duration: "60min",
        content: "Configure build settings, package para plataformas target, e resolva issues de packaging.",
        objectives: ["Build configuration", "Platform settings", "Packaging", "Size optimization"],
        resources: [{ id: "packaging-docs", title: "Packaging Projects", type: "documentation", url: "https://docs.unrealengine.com/5.3/en-US/packaging-unreal-engine-projects/", description: "Packaging Docs" }],
        exercises: [{ id: "ex-12-7-1", title: "Final Build", description: "Crie build final otimizado", difficulty: "intermediate", estimatedTime: "60min", completed: false }],
        tips: ["Teste build packaged, não editor", "Shipping build para release"],
        completed: false
      },
      {
        id: "12-8",
        title: "Publishing",
        description: "Lançando ao mundo",
        duration: "90min",
        content: "Publique seu jogo: Steam, Itch.io, Epic Games Store. Configure store pages e marketing.",
        objectives: ["Store setup", "Marketing materials", "Launch checklist", "Post-launch plan"],
        resources: [],
        exercises: [{ id: "ex-12-8-1", title: "Store Page", description: "Crie store page completa", difficulty: "intermediate", estimatedTime: "90min", completed: false }],
        tips: ["Screenshots e trailer são cruciais", "Wishlist antes do launch"],
        completed: false
      }
    ]
  }
]

// Helper functions
export function getModuleBySlug(slug: string): ModuleDetailed | undefined {
  return professionalModules.find(m => m.slug === slug)
}

export function getModuleById(id: number): ModuleDetailed | undefined {
  return professionalModules.find(m => m.id === id)
}

export function getLessonById(moduleId: number, lessonId: string): Lesson | undefined {
  const module = getModuleById(moduleId)
  return module?.lessons.find(l => l.id === lessonId)
}

export function getNextLesson(moduleId: number, currentLessonId: string): Lesson | undefined {
  const module = getModuleById(moduleId)
  if (!module) return undefined
  
  const currentIndex = module.lessons.findIndex(l => l.id === currentLessonId)
  if (currentIndex === -1 || currentIndex === module.lessons.length - 1) return undefined
  
  return module.lessons[currentIndex + 1]
}

export function getPreviousLesson(moduleId: number, currentLessonId: string): Lesson | undefined {
  const module = getModuleById(moduleId)
  if (!module) return undefined
  
  const currentIndex = module.lessons.findIndex(l => l.id === currentLessonId)
  if (currentIndex <= 0) return undefined
  
  return module.lessons[currentIndex - 1]
}

export function calculateModuleProgress(module: ModuleDetailed): number {
  if (module.lessons.length === 0) return 0
  const completed = module.lessons.filter(l => l.completed).length
  return Math.round((completed / module.lessons.length) * 100)
}

export function getTotalStats() {
  const totalLessons = professionalModules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalHours = professionalModules.reduce((acc, m) => {
    const hours = m.lessons.reduce((h, l) => {
      const minutes = parseInt(l.duration.replace('min', ''))
      return h + minutes
    }, 0)
    return acc + hours
  }, 0)
  
  return {
    totalModules: professionalModules.length,
    totalLessons,
    totalHours: Math.round(totalHours / 60),
    totalExercises: professionalModules.reduce((acc, m) => 
      acc + m.lessons.reduce((e, l) => e + l.exercises.length, 0), 0
    )
  }
}
