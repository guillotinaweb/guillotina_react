---
agent: agent
---

# Init Prompt

You are analyzing a codebase to produce precise, developer-facing project instruction files for GitHub Copilot. These files will guide AI assistants working in this repository.

## Analysis Workflow

1. **Scan & Collect** – Review all source files, configuration files, tests, build scripts, and documentation. Extract factual details only.

2. **Technology Detection** – Identify the primary technology stack, frameworks, and architectural patterns used.

3. **Pattern Detection** – Identify recurring coding styles, conventions, and architectural approaches across multiple files.

4. **Constraint Analysis** – Understand WHY patterns were chosen: business requirements, technical constraints, team decisions.

5. **Anti-Pattern Detection** – Identify inconsistencies, technical debt, or deviations from AMIGA standards that should NOT be replicated.

6. **Decision Mapping** – Map architectural decisions to their driving forces and trade-offs considered.

7. **Evidence Rule** – Only document patterns observed in **at least two distinct files** unless explicitly declared as standards.

8. **Critical Requirements Analysis** – Analyze code patterns that impact AI decision-making:

   - **Module/package organization patterns** and what types of components belong where
   - **Framework annotation patterns** (comprehensive coverage of essential annotations and contexts)
   - **Base patterns and abstractions** for common use cases with complete implementation examples
   - **Error handling approaches** (functional patterns, exception strategies, error propagation)
   - **Code generation policies** (when to use framework generators vs manual implementations)
   - **Testing strategy completeness** (frameworks, tools, naming conventions, data creation patterns)
   - **Configuration management patterns** (property binding, setup examples)
   - **AMIGA Framework compliance** when detected (configuration, patterns, standards)

9. **Generate Instructions** – Create modular instruction files optimized for AI decision-making, not documentation.

## Output Structure

Generate the following **4 core files maximum**:

### Essential Instructions Files

- `.github/copilot-instructions.md` - **Main project overview** with business context, architecture patterns, AI guidelines and complete technology context. Also reference the other instruction files.
  **Instructions structure must mirror this template:**

- `.github/instructions/project-functional.instructions.md` - Domain knowledge, service boundaries, business rules, and architectural decisions
- `.github/instructions/project-technical.instructions.md` - Code conventions, testing patterns, build processes, configuration, integrations, and development tools
- `.github/instructions/git-commit.instructions.md` - Git commit conventions and standards following Inditex governance

## File Format Rules

Each instruction file must:

- Start with `applyTo: '**'` frontmatter
- Be **50-150 lines** of actionable markdown (increased scope per file)
- **Balance description with examples**: 60% conceptual guidance, 40% concrete examples
- Focus on patterns and principles, not exhaustive code listings
- Use clear, concise language optimized for AI consumption
- **Group related concerns** to minimize context switching
- **Prioritize "why" over "what"** - explain reasoning behind patterns

## Main Instructions File Template

The `copilot-instructions.md` should serve as the **strategic overview and decision guide**:

- **Business purpose**: What business problem this project solves (not how it solves it)
- **Strategic architectural decisions**: 2-3 major architectural choices and their business drivers
- **Technology context**: Framework choice and WHY it was selected for this use case
- **Decision framework for AI**: How to approach different types of changes (adding features, fixing issues, integrating systems)
- **Integration philosophy**: How this project fits in broader business ecosystem
- **Quality principles**: What makes a good vs bad contribution in this context
- **AVOID**: Technical implementation details, API documentation, configuration examples

## Specialized Instructions Templates

### Functional Instructions (`project-functional.instructions.md`)

Should focus on **business domain understanding and functional context**:

- **Business context and objectives**: What business problems this microservice solves and WHY they matter
- **Functional scope and boundaries**: What business capabilities are included/excluded and WHY
- **Primary business workflows**: Main functional flows that this service orchestrates or participates in
- **Business rules and constraints**: Core business logic with rationale behind rules
- **Domain concepts and entities**: Key business entities and their relationships
- **Integration purpose**: WHY this service integrates with external systems (business justification)
- **User scenarios and actors**: How different business stakeholders interact with this service
- **Information and event flows**: How business data and events move between systems (different from workflows - focus on data movement and event propagation)
- **Compliance and regulatory context**: Business rules driven by regulatory requirements
- **Business trade-offs and decisions**: What business compromises were made and why
- **Business quality requirements**: Business-driven scale, user experience, and consistency needs that guide architectural patterns (focus on business constraints, avoid technical metrics)

**File Naming Convention**: Use descriptive title like "Business Context" or "Functional Scope", avoid "Architecture" which implies technical details.

**Important Distinctions for Functional Files**:

- **Primary Business Workflows**: End-to-end business processes (user journey, request lifecycle)
- **Information and Event Flows**: Data movement and event propagation patterns (what information flows where and why)
- **Business Rules**: Decision logic and constraints that govern behavior
- **Domain Concepts**: Business entities and their relationships (not technical data models)

### Technical Instructions (`project-technical.instructions.md`)

Should focus on **implementation patterns and development practices**:

- **Architectural Decisions and Rationale**: WHY specific patterns were chosen (hexagonal, event-driven, etc.)
- **Module/Package Structure**: What belongs where and WHY boundaries exist (language-agnostic)
- **Framework Annotation Patterns**: Essential annotations/decorators with contexts and examples
- **Base Patterns and Abstractions**: Standard interfaces, base classes, complete code examples for common use cases
- **Error Handling Strategy**: Preferred error management patterns with concrete implementation examples
- **Code Generation Policy**: When to use framework generators vs manual implementations and WHY
- **AMIGA Framework Integration**: Specific AMIGA patterns when framework is detected
- **Dependency Management**: What depends on what, and why those boundaries exist
- **Code conventions with Intent**: Language-specific patterns with business/technical reasoning
- **Testing Philosophy and Strategies**: Comprehensive testing approach with frameworks, tools, and patterns
- **Configuration and Build Strategy**: High-level approach with practical configuration examples
- **Performance Requirements and SLAs**: Specific technical metrics, response times, throughput targets, and resource constraints for implementation guidance
- **Integration Patterns**: How services communicate and why (event bus, API contracts, etc.)
- **Development Workflow Guidelines**: Key practices that affect code quality and team efficiency
- **Anti-Patterns to Avoid**: What NOT to do with specific alternatives to use instead

### Git Commit Instructions Template

The `git-commit-instructions.md` should:

- **Use GitHub MCP tools** to analyze existing commit history and patterns
- **Filter human commits only** - exclude automated bot commits when analyzing patterns
- Document **real project conventions** (not theoretical standards)
- Include **commit message standards** (format, scope, breaking changes)
- Define **branch naming conventions** and workflow patterns
- Specify **PR requirements** and merge strategies used in the project

### GitHub Analysis Guidelines

When generating git commit instructions:

1. **Use MCP GitHub tools** to retrieve commits from pull requests created by developers
2. **Focus on feature branch commits** - analyze actual developer commit patterns before squash-merge
3. **Exclude automated commits** - filter out bot-generated commits, CI/CD system commits, and dependency updates
4. **Analyze authentic developer patterns** - understand real commit conventions used during development
5. **Document deviations** and recommend corrections if patterns don't match corporate standards

## Quality Guidelines and Content Strategy

**Primary Goal**: Enable AI understanding of **WHY** decisions were made, not just **WHAT** exists.

**File-Specific Balance:**

- **Functional files**: Business-focused (75% business rationale, 25% domain examples)
- **Technical files**: Decision-focused (60% rationale, 40% complete code examples with context)
- **Main overview**: Strategy-focused (80% context, 20% high-level examples)

**Universal Quality Criteria:**

- **Evidence-based**: Document patterns observed in multiple files OR declared as standards
- **Decision-oriented**: Explain WHY patterns were chosen, not just WHAT exists
- **Corporate-aligned**: Follow Inditex/AMIGA standards and practices
- **Actionable**: AI can immediately apply guidance with complete examples
- **Avoid**: Code dumps, exhaustive documentation, step-by-step tutorials
- **Emphasize**: Architectural reasoning, business constraints, trade-offs

**Decision Framework Templates:**

- **Pattern + Constraint**: "Use [pattern] **because** [business/technical constraint]"
- **Technology Choice**: "Choose [technology] **because** [requirement/standard]"
- **Trade-off**: "Prefer [approach A] over [approach B] **because** [context reason]"
- **Evolution**: "Migrated from [old] to [new] **because** [changing requirement]"

**Quality Validation for Generated Instructions:**

- **Completeness Check**: Can an AI understand WHY decisions were made, not just WHAT exists?
- **Actionability Test**: Can an AI apply these instructions to make consistent decisions?
- **Context Sufficiency**: Is there enough context to handle edge cases and trade-offs?
- **Corporate Alignment**: Do instructions reflect Inditex/AMIGA standards and practices?
- **Technical Completeness**: Are examples complete, annotations documented, testing comprehensive, anti-patterns with alternatives?

---

**Success Criteria**: Enable AI decision-making consistent with project patterns and business objectives. Answer "How should I think about this project?" not "What does every file do?"

**Git Analysis**: Use GitHub MCP tools to analyze commit history, filtering human-authored commits to establish authentic patterns and verify Inditex compliance.
