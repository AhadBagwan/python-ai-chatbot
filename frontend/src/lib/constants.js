export const MODELS = [
  { 
    id: "gemini-2.0-flash", 
    name: "Gemini 2.0 Flash", 
    badge: "Ultra Fast", 
    color: "#00f0ff",
    description: "Next-gen low latency model. Best for fast code generation & real-time Q&A." 
  },
  { 
    id: "gemini-1.5-pro", 
    name: "Gemini 1.5 Pro", 
    badge: "Deep Reasoning", 
    color: "#a855f7",
    description: "High capacity model with complex reasoning for architecture & deep code analysis." 
  },
  { 
    id: "gemini-1.5-flash", 
    name: "Gemini 1.5 Flash", 
    badge: "Balanced", 
    color: "#10b981",
    description: "Reliable, versatile model balancing performance and thorough explanations." 
  },
];

export const STORAGE_KEYS = {
  CHATS: 'ahadnova-chats',
  SETTINGS: 'ahadnova-settings',
  ACTIVE_CHAT: 'ahadnova-active-chat',
};

export const EXPLANATION_MODES = [
  { 
    id: "normal", 
    name: "Standard Technical", 
    badge: "Balanced",
    icon: "Brain",
    description: "Structured explanations with code samples, key concepts, and practical insights." 
  },
  { 
    id: "eli5", 
    name: "ELI5 (Beginner Friendly)", 
    badge: "Analogies",
    icon: "Sparkles",
    description: "Simple everyday analogies, plain English, and step-by-step breakdowns without heavy jargon." 
  },
  { 
    id: "expert", 
    name: "Expert Deep-Dive", 
    badge: "Advanced",
    icon: "Shield",
    description: "In-depth architectural analysis, edge cases, security considerations, and performance trade-offs." 
  },
];

export const DOMAIN_CATEGORIES = [
  { id: "all", name: "All Domains", icon: "Sparkles" },
  { id: "networking", name: "Networking", icon: "Wifi", color: "#00f0ff" },
  { id: "cybersecurity", name: "Cybersecurity", icon: "ShieldAlert", color: "#ef4444" },
  { id: "security", name: "Security Eng.", icon: "Lock", color: "#a855f7" },
  { id: "development", name: "Development", icon: "Code2", color: "#10b981" },
];

export const CATEGORIZED_PROMPTS = [
  // NETWORKING
  {
    category: "networking",
    title: "TCP 3-Way Handshake & Flags",
    description: "Explain SYN, SYN-ACK, ACK packet exchange and socket state transitions.",
    prompt: "Explain the TCP 3-way handshake process in detail, including SYN, SYN-ACK, ACK packets, TCP flags, sequence numbers, and state transitions.",
    tag: "Protocol Analysis",
    level: "Intermediate",
    color: "#00f0ff",
  },
  {
    category: "networking",
    title: "OSI vs TCP/IP Model Stack",
    description: "Layer-by-layer comparison with protocol mappings and packet encapsulation.",
    prompt: "Compare the 7-layer OSI model with the 4-layer TCP/IP model. Explain encapsulation/decapsulation with headers at each layer.",
    tag: "Network Fundamentals",
    level: "Beginner",
    color: "#00f0ff",
  },
  {
    category: "networking",
    title: "DNS Query Resolution & DNSSEC",
    description: "How recursive DNS lookup works and how DNSSEC prevents spoofing.",
    prompt: "Explain step-by-step how recursive DNS resolution works from browser cache to root nameservers, and how DNSSEC secures queries.",
    tag: "DNS & Security",
    level: "Advanced",
    color: "#00f0ff",
  },
  {
    category: "networking",
    title: "BGP Routing & Hijacking",
    description: "Border Gateway Protocol path vector mechanics and route hijacking risks.",
    prompt: "Explain how BGP autonomous systems exchange routes, how BGP route hijacking occurs, and how RPKI mitigates hijacking.",
    tag: "Routing & BGP",
    level: "Expert",
    color: "#00f0ff",
  },

  // CYBERSECURITY
  {
    category: "cybersecurity",
    title: "OWASP Top 10 Vulnerabilities",
    description: "Deep dive into Injection, Broken Auth, SSRF, and modern mitigations.",
    prompt: "Provide a detailed overview of the OWASP Top 10 security vulnerabilities, including code examples of vulnerabilities and mitigation techniques.",
    tag: "Web AppSec",
    level: "Intermediate",
    color: "#ef4444",
  },
  {
    category: "cybersecurity",
    title: "Zero Trust Security Model",
    description: "Never trust, always verify: Microsegmentation, IAM, and continuous auth.",
    prompt: "Explain the Zero Trust Architecture principles. Detail how microsegmentation, IAM policies, and continuous verification replace perimeter security.",
    tag: "Architecture",
    level: "Advanced",
    color: "#ef4444",
  },
  {
    category: "cybersecurity",
    title: "Buffer Overflow & Exploit Analysis",
    description: "Stack smashing, return address overwrites, and DEP/ASLR protections.",
    prompt: "Explain how a C stack buffer overflow vulnerability occurs, how memory is corrupted, and how OS defenses like ASLR, DEP/NX, and stack canaries work.",
    tag: "System Security",
    level: "Expert",
    color: "#ef4444",
  },
  {
    category: "cybersecurity",
    title: "SOC Threat Hunting & SIEM Rules",
    description: "Creating Detection rules for lateral movement and credential dumping.",
    prompt: "How do Security Operations (SOC) analysts hunt for threats using SIEM logs? Provide Sigma/YARA detection rule concepts for Pass-the-Hash attacks.",
    tag: "Defensive Sec",
    level: "Advanced",
    color: "#ef4444",
  },

  // SECURITY ENGINEERING
  {
    category: "security",
    title: "SQL Injection Prevention & Code Audit",
    description: "Parametrized queries, ORMs, and secure database architecture.",
    prompt: "Explain SQL Injection (SQLi) types (Union-based, Blind, Time-based) with code examples in Python/Node, and demonstrate secure parametrized query implementations.",
    tag: "AppSec",
    level: "Intermediate",
    color: "#a855f7",
  },
  {
    category: "security",
    title: "TLS 1.3 Handshake & Cipher Suites",
    description: "Diffie-Hellman Key Exchange, Forward Secrecy, and session resumption.",
    prompt: "Walk through the TLS 1.3 cryptographic handshake step-by-step. Explain Ephemeral Diffie-Hellman (ECDHE), Perfect Forward Secrecy, and 0-RTT resumption.",
    tag: "Cryptography",
    level: "Advanced",
    color: "#a855f7",
  },
  {
    category: "security",
    title: "OAuth 2.0 & PKCE Flow",
    description: "Authorization Code Flow with Proof Key for Code Exchange for SPAs.",
    prompt: "Explain the OAuth 2.0 Authorization Code flow with PKCE. Detail why PKCE is required for single-page applications and mobile apps to prevent token interception.",
    tag: "IAM & Auth",
    level: "Intermediate",
    color: "#a855f7",
  },
  {
    category: "security",
    title: "JWT Security & Signature Forgery",
    description: "Header manipulation, 'alg: none' exploits, and token storage best practices.",
    prompt: "What are common JWT security vulnerabilities? Explain algorithm confusion attacks, secret brute-forcing, and secure storage (HttpOnly cookies vs LocalStorage).",
    tag: "Token Security",
    level: "Intermediate",
    color: "#a855f7",
  },

  // SOFTWARE DEVELOPMENT
  {
    category: "development",
    title: "Microservices & Distributed Systems",
    description: "Event-driven architecture, Saga pattern, and circuit breakers.",
    prompt: "Explain design patterns for resilient microservices architecture: Event Sourcing, Saga Pattern for distributed transactions, and Circuit Breaker pattern.",
    tag: "System Design",
    level: "Advanced",
    color: "#10b981",
  },
  {
    category: "development",
    title: "Async/Await & Event Loop Internals",
    description: "Microtasks, Macrotasks, promises, and non-blocking I/O execution.",
    prompt: "Explain how the Event Loop works in Node.js / JavaScript. Detail the execution order between synchronous code, Promises (microtasks), and setTimeout (macrotasks).",
    tag: "JavaScript / Node",
    level: "Intermediate",
    color: "#10b981",
  },
  {
    category: "development",
    title: "REST vs gRPC vs GraphQL API Design",
    description: "Protobuf serialization, HTTP/2 multiplexing, and schema trade-offs.",
    prompt: "Compare REST, gRPC (HTTP/2 + Protocol Buffers), and GraphQL. Analyze performance, network overhead, payload serialization, and ideal use cases for each.",
    tag: "API Architecture",
    level: "Advanced",
    color: "#10b981",
  },
  {
    category: "development",
    title: "Docker Containerization & Multi-Stage Builds",
    description: "Optimizing container images, non-root users, and minimal base images.",
    prompt: "Write a production-ready, secure Dockerfile using Multi-Stage builds for a Node/Python app. Include security practices like non-root user execution and Alpine minimal images.",
    tag: "DevOps & Cloud",
    level: "Intermediate",
    color: "#10b981",
  },
];

export const KEYBOARD_SHORTCUTS = [
  { key: "Ctrl+N", action: "New conversation" },
  { key: "Ctrl+K", action: "Search conversations" },
  { key: "Ctrl+,", action: "Open settings" },
  { key: "Ctrl+/", action: "Show shortcuts" },
  { key: "Ctrl+L", action: "Clear active chat" },
  { key: "Ctrl+E", action: "Export chat" },
  { key: "Ctrl+B", action: "Toggle sidebar" },
];
