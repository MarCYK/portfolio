import type { Project } from '@/types';

export const workProjects: Project[] = [
  {
    title: 'ChatMT Agent',
    description:
      'A no-code platform where Mettler Toledo employees build AI agents, from personal productivity to team workflows.',
    date: 'Present',
    href: '/projects/chatmt-agent',
    external: false,
    icon: 'brain',
    status: 'Mettler Toledo',
    content: [
      'ChatMT Agent is Mettler Toledo\'s internal platform for building AI agents: over a thousand agents, around 6000 conversations a day. My corner is the agent harness, the runtime the agents run in, plus maintaining the platform itself. This includes cost management, tools, connectors, system prompt, context management and agent orchestration.',
      'With this platform, any department can build an agent, no code needed: pick a model, pick tools, write the instructions. I also build the connectors that let agents reach other systems, like ServiceNow, Salesforce, SAP, and MCP servers.',
      'Context management is the hardest part, by far. It\'s controlling what enters the context window each turn, to prevent context rot and token explosion on longer tasks. Tool outputs can be huge, and a model that gets everything at once can hallucinate or miss the record that mattered. I improved the existing system: newer messages stay verbatim, older history gets squashed into a summary, oversized tool outputs get summarized automatically, and important info is saved as user memory.',
      'I also added skills, same idea as Claude Code: a team packages a workflow once, and any agent can load it, even with a different owner, model, or tools. Nobody builds the same workflow twice.',
      'The platform now sits at 1200 daily users, and the departments built all thousand-plus agents themselves. Not us.',
      'Right now I\'m on subagent orchestration: splitting a workflow across multiple agents so each one holds only its own context and can handle long-running workflows better.',
    ],
  },
  {
    title: 'SAP & M365 Integrations',
    description:
      'Adding agentic capabilities to Mettler Toledo\'s SAP and Microsoft 365 systems, so agents can read and write data in those systems.',
    date: 'September 2026',
    href: '/projects/sap-m365-integrations',
    external: false,
    icon: 'files',
    status: 'Mettler Toledo',
    content: [
      'Mettler Toledo employees work in SAP and Microsoft 365 every day. The connectors are what let agents on the ChatMT Agent Platform reach both.',
      'The SAP side is a connector over OData. Product owners build the tools on top, and the connector makes SAP data reachable from an agent. Each system\'s owners keep owning them, same split as the platform.',
      'The Microsoft 365 side is different: code-level tools on the Graph API, authenticated with OAuth on-behalf-of, so a tool acts as the user who asked for it. These are tools a team writes and an agent calls directly.',
      'Two agents came out of the M365 work. The Excel agent analyzes spreadsheet files: it detects tables heuristically, falls back to an AI pass for complex layouts, then constructs them as SQL tables. It exists because enterprise Excel files can reach millions of rows, so SQL is a natural fit.',
      'The PowerPoint agent helps a user plan the deck first, then builds it from that plan on Mettler Toledo\'s own templates. What used to take hours of assembling slides takes about 40 minutes.',
      'Both agents are available to every user on the platform.',
    ],
  },
  {
    title: 'MT Translate Cloud Migration',
    description: 'Lead the migration of Mettler Toledo\'s text and image translation platform to the cloud from on-premises infrastructure.',
    date: 'August 2026',
    href: '/projects/mt-translate-cloud-migration',
    external: false,
    icon: 'languages',
    status: 'Mettler Toledo',
    content: [
      'MT Translate is Mettler Toledo\'s own translation platform. Text and image translation, with MT-specific terminology and context, plus an API endpoint so other services can build translation in. I handled the migration from our on-prem server to Azure and implementing EasyAuth.',
      'The platform now runs on Azure App Service, with a Postgres database on Azure Database for PostgreSQL. EasyAuth handles authentication and authorization, so the platform can be used by any Mettler Toledo employee without needing to manage accounts or credentials.'
    ]
  },
  {
    title: 'Compliance, Finance, and Content Hub',
    description: 'Internal AI tools for Deriv: compliance monitoring, PO management, and content management systems.',
    date: '2025',
    href: '#',
    external: true,
    icon: 'house',
    status: 'Deriv',
  }
];

export const personalProjects: Project[] = [
  {
    title: 'ZCode Model Router',
    description:
      'ZCode plugin that routes each coding task to the right model, so searches and file reads stop billing at flagship rates. Read-only caps and acceptance checks are enforced by hooks.',
    date: 'July 2026',
    href: '/projects/zcode-model-router',
    external: false,
    icon: 'compass',
    status: 'adapted from opencode-model-router',
    content: [
      'I built this because my API bill got stupid. Coding agents bill every message at one rate, whether the job is finding where a function lives or redesigning half the app, and most of a session is just finding things. On Z.ai the flagship runs $4.40 per million output tokens and the flash model runs $0.50. I was paying flagship prices to locate code, so I went and fixed it.',
      'The whole thing runs on measure twice, cut once. The cheap tier finds the work: search, skim, read again, wherever the change actually lands. Those calls cost almost nothing. The expensive tier only sees the locations it needs, with a small context, never the whole session. What reaches the expensive model is most of the savings.',
      'Three subagent tiers: a flash model for searches and lookups, a mid model for implementation and tests, the flagship for architecture, security review and hard debugging. The orchestrator stays on my main model and dispatches down. Models and prices sit in one tiers.json, so swapping providers is a config edit. The repo\'s default search model, GLM-4.7-Flash, is free on Z.ai. Free fits my budget.',
      'The routing itself is prompt-level. A UserPromptSubmit hook injects a protocol into every message I send: tier definitions, cost ratios, routing rules, caps. The orchestrator reads it and dispatches to the right tier instead of running every tool call itself. It rides on ZCode\'s subagent system, which already existed. The plugin just decides who gets the work.',
      'Each tier has a read-only budget, 8/5/3 calls by default. PreToolUse and PostToolUse hooks count the calls, inject live counters like [cap: 4/8] into results, flag repeated reads, and persist state to ~/.zcode/model-router/. Caps survive a restart.',
      'Dispatches can also carry acceptance checks: testsPass, buildPasses, lintClean, fileExists. When a subagent reports back, the hooks verify the claim against an actual test run.',
      'The starting point was marco-jardim\'s opencode-model-router v1.3, built for opencode. I ported it to ZCode\'s plugin system, rewired the tiers for my provider, and added the cap enforcement and acceptance checks.',
      'It routes the sessions that build this portfolio. Repo: https://github.com/MarCYK/zcode-model-router',
    ],
  },
  {
    title: 'MySignMate',
    description:
      'An Android app that translates Malaysian Sign Language to text entirely on-device. 110 gestures collected with the Malaysia Federation of the Deaf (MFD), custom LSTM at 95.8% accuracy.',
    date: 'March 2024',
    href: '/projects/mysignmate',
    external: false,
    icon: 'signLanguage',
    status: 'Universiti Malaya · MFD',
    content: [
      'MySignMate is my final year project at Universiti Malaya, a native Android app that turns Malaysian Sign Language (BIM) gestures into text in real time. The camera feed goes through MediaPipe hand and body tracking into a gesture recognizer, and everything runs on the phone locally, no internet connection needed.',
      'The dataset didn\'t exist, so we had to collect, clean and annotate it from scratch. 110 BIM gestures, around 20 signers per gesture, filmed at a data collection workshop with sign language teachers from the Malaysia Federation of the Deaf. That\'s 3,549 videos, balanced into 108 classes and doubled to 7,098 with horizontal flip augmentation.',
      'Three models went head to head on our BIM dataset. My custom LSTM won with 95.8% test accuracy, ahead of a vanilla Transformer encoder at 94.68% and an SL-TSSI-DenseNet at 87.53%. The boring preprocessing did the heavy lifting: keypoint reconstruction, normalization, and flip augmentation took the LSTM from 61.95% to 95.8%. Translation takes under 3 seconds.',
      'Shipping the models was its own puzzle. The sign model runs through PyTorch Mobile as TorchScript; Whisper handles voice input through TFLite, where quantization shrinks it from 967 MB to 241 MB. CPU-GPU delegation and multithreading keep the camera feed smooth.',
      'The app itself has a translator view with live keypoint overlay, front/back camera toggle, a copyable transcript, 30-second voice input, and a sign dictionary that MFD maintains. Translation works between English, Malay, and Chinese.',
      'MFD interpreters put the app through user acceptance testing and found it useful. The model pipeline and the app are both on GitHub: https://github.com/MarCYK/FYP_BIM_Model https://github.com/MarCYK/MySignMate',
      'The recognition pipeline also became a co-authored paper on SSRN (preprint), built on the methodology from this project. Give it a read: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5766993',
    ],
  },
];
