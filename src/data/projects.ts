import type { Project } from '@/types';

export const workProjects: Project[] = [
  {
    title: 'ChatMT Agent',
    description: 'An enterprise conversational AI agent built for Mettler Toledo to automate complex domain-specific tasks.',
    date: 'Present',
    href: '#',
    external: true,
    icon: 'brain',
    status: 'Mettler Toledo',
  },
];

export const personalProjects: Project[] = [
  {
    title: 'ZCode Model Router',
    description:
      'ZCode plugin that routes each coding task to the right model, so searches and file reads stop billing at flagship rates. Read-only caps and acceptance checks are enforced by hooks.',
    date: '2026',
    href: '/projects/zcode-model-router',
    external: false,
    icon: 'compass',
    status: 'GPL-3.0 · adapted from opencode-model-router v1.3',
    content: [
      'I built this because my API bill got stupid. Coding agents bill every message at one rate, whether the job is finding where a function lives or redesigning half the app, and most of a session is just finding things. On Z.ai the flagship runs $4.40 per million output tokens and the flash model runs $0.50. I was paying flagship prices to locate code, so I went and fixed it.',
      'The whole thing runs on measure twice, cut once. The cheap tier does the measuring: search, skim, read again, whatever it takes to find exactly where the work is. That freedom costs almost nothing. The expensive tier only cuts: it gets pointed at those locations with a small, relevant context, never the whole session. Controlling what reaches the expensive model is most of the savings.',
      'Three subagent tiers: a flash model for searches and lookups, a mid model for implementation and tests, the flagship for architecture, security review and hard debugging. The orchestrator stays on my main model and dispatches down. Models and prices sit in one tiers.json, so swapping providers is a config edit. The repo\'s default search model, GLM-4.7-Flash, is free on Z.ai. Free fits my budget.',
      'The routing itself is prompt-level. A UserPromptSubmit hook injects a protocol into every message I send: tier definitions, cost ratios, routing rules, caps. The orchestrator reads it and dispatches to the right tier instead of running every tool call itself. It rides on ZCode\'s subagent system, which already existed. The plugin just decides who gets the work.',
      'Each tier has a read-only budget, 8/5/3 calls by default. PreToolUse and PostToolUse hooks count the calls, inject live counters like [cap: 4/8] into results, flag repeated reads, and persist state to ~/.zcode/model-router/. Caps survive a restart.',
      'Dispatches can also carry acceptance checks: testsPass, buildPasses, lintClean, fileExists. When a subagent reports back, the hooks verify the claim. A passing test run is the definition of done, not the subagent\'s word for it.',
      'The starting point was marco-jardim\'s opencode-model-router v1.3, built for opencode. I ported it to ZCode\'s plugin system, rewired the tiers for my provider, and added the cap enforcement and acceptance checks. It\'s at 86 commits so far.',
      'It routes the sessions that build this portfolio. Repo: https://github.com/MarCYK/zcode-model-router',
    ],
  },
  {
    title: 'MySignMate',
    description:
      'UM final year project: an Android app that translates Malaysian Sign Language to text entirely on-device. 110 gestures collected with the Malaysia Federation of the Deaf, custom LSTM at 95.8% accuracy.',
    date: '2024',
    href: '/projects/mysignmate',
    external: false,
    icon: 'signLanguage',
    status: 'Universiti Malaya · Malaysian Federation of the Deaf',
    content: [
      'MySignMate is my final year project at Universiti Malaya, a native Android app that turns Malaysian Sign Language (BIM) gestures into text in real time. The camera feed goes through MediaPipe hand and body tracking into a gesture recognizer, and everything runs on the phone. No server, no internet. Kotlin, Jetpack Compose, CameraX.',
      'The dataset didn\'t exist, so we made one. 110 BIM gestures, around 20 signers per gesture, filmed at a data collection workshop with sign language teachers from the Malaysia Federation of the Deaf. That\'s 3,549 videos, balanced into 108 classes and doubled to 7,098 with horizontal flip augmentation.',
      'Three models went head to head on our BIM dataset. My custom LSTM won with 95.8% test accuracy, ahead of a vanilla Transformer encoder at 94.68% and an SL-TSSI-DenseNet at 87.53%. The boring preprocessing did the heavy lifting: keypoint reconstruction, normalization, and flip augmentation took the LSTM from 61.95% to 95.8%. Translation takes under 3 seconds.',
      'Shipping the models was its own puzzle. The sign model runs through PyTorch Mobile as TorchScript; Whisper handles voice input through TFLite, where quantization shrinks it from 967 MB to 241 MB. CPU-GPU delegation and multithreading keep the camera feed smooth.',
      'The app itself has a translator view with live keypoint overlay, front/back camera toggle, a copyable transcript, 30-second voice input, and a sign dictionary that MFD maintains. Translation works between English, Malay, and Chinese.',
      'MFD interpreters put the app through user acceptance testing and found it useful. The model pipeline and the app are both on GitHub: https://github.com/MarCYK/FYP_BIM_Model https://github.com/MarCYK/MySignMate',
      'The recognition pipeline also became a co-authored paper on SSRN (preprint), built on the methodology from this project. Give it a read: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5766993',
    ],
  },
];
