# Dungeon Crawler: Game Systems Implementation Roadmap

## Project Overview

This document outlines a **3-6 month development roadmap** for implementing the comprehensive game systems from the manual into the dungeon crawler codebase. The plan is structured for a **small team of 3-4 developers** with clear task separation and parallel development opportunities.

### Current State
- **Existing**: Basic React/TypeScript app with simple party creation, dungeon exploration, and turn-based combat
- **Target**: Full-featured dungeon crawler with RoA + D&D 5e hybrid system including 40+ interconnected game systems

### Development Philosophy
- **MVP First**: Character Creation + Combat (Months 1-2)
- **Phased Rollout**: Add systems incrementally in logical dependency order
- **Parallel Development**: Tasks structured for concurrent work by multiple developers
- **Continuous Integration**: Each phase produces a playable, testable build

---

## MVP - Phase 0: Character Creation & Combat System (Months 1-2)

**Goal**: Create a fully functional character creation and combat experience that demonstrates the core game loop.

### Team Structure for MVP
- **Developer 1 (Lead)**: Character System Architecture & Integration
- **Developer 2**: Combat System & Mechanics
- **Developer 3**: UI/UX & Data Integration
- **Developer 4**: Testing, Balance, & Documentation

---

### 0.1 Character Creation System (Weeks 1-3)

#### Developer 1: Core Character Data Model
- [x] **Update Type Definitions** (`types/index.ts`)
  - [x] Replace simplified stats (str, def, agi, luc) with RoA attributes (ST, CO, DX, AG, IT, IN, WD, CH)
  - [x] Add negative attributes (SN, AC, CL, AV, NE, CU, VT)
  - [x] Add derived stats (HP, AP, Initiative, AC, Proficiency)
  - [x] Add race and class data structures
  - [x] Add feat system types
  - [x] Add skill system (51 skills) types

- [x] **Create Character Generation Store** (`stores/useCharacterCreationStore.ts`)
  - [x] Point buy system (80 points, 8-18 range)
  - [x] Random generation with reroll
  - [ ] Quick generation presets
  - [x] Race selection with modifiers
  - [x] Class selection with starting abilities
  - [x] Background/deity selection

#### Developer 2: Race & Class Data
- [x] **Import Race Data** (`data/races.ts`)
  - [x] Parse manual race data (Human, Elf, Dwarf, Halfling, etc.)
  - [x] Attribute modifiers
  - [x] Special abilities
  - [x] Movement rates

- [x] **Import Class Data** (`data/classes.ts`)
  - [x] Parse manual class data (12 classes: Warrior, Rogue, Ranger, Paladin, Cleric, Druid, Wizard, Sorcerer, Warlock, Bard, Barbarian, Monk)
  - [x] Base stats and growth rates
  - [ ] Starting equipment
  - [x] Class abilities by level
  - [x] Spellcasting progression (for casters)
  - [x] AP pools and bonuses

#### Developer 3: Character Creation UI
- [-] **Build Character Creation Wizard** (`components/party/CharacterCreationWizard.tsx`)
  - [x] Step 1: Name & Portrait (Portrait placeholder)
  - [x] Step 2: Race Selection
  - [x] Step 3: Class Selection
  - [x] Step 4: Attribute Distribution (Point Buy/Random/Quick)
  - [ ] Step 5: Deity Selection
  - [x] Step 6: Review & Confirm
  - [x] Visual stat preview with modifiers
  - [x] Derived stats calculation display

- [x] **Character Sheet Component** (`components/party/CharacterSheet.tsx`)
  - [x] Full attribute display with modifiers
  - [x] Skills list with proficiency indicators
  - [x] Equipment slots
  - [x] Spell list (for casters)
  - [x] Feat display

#### Developer 4: Data Validation & Testing
- [-] **Create Character Validation**
  - [x] Attribute range checks
  - [x] Class/race compatibility
  - [ ] Starting equipment validation
  - [ ] Spell list validation for casters

- [ ] **Write Unit Tests**
  - [ ] Attribute modifier calculations
  - [ ] Derived stat formulas (HP, AP, AC, Initiative)
  - [ ] Character creation flow
  - [ ] Race/class modifier application

---

### 0.2 Combat System Overhaul (Weeks 3-6)

#### Developer 1: Combat Architecture
- [-] **Redesign Combat Store** (`stores/useCombatStore.ts`)
  - [x] Initiative system (d20 + AG + IN modifiers)
  - [x] Turn order management
  - [ ] Action economy (Action, Bonus Action, Movement, Reaction)
  - [ ] Row positioning (Front/Back)
  - [ ] Concentration tracking for spells

- [-] **Combat State Machine**
  - [x] Initiative phase
  - [x] Player turn phase
  - [x] Enemy turn phase
  - [ ] Status effect processing
  - [x] Victory/defeat conditions

#### Developer 2: Combat Mechanics
- [-] **Attack System** (`utils/combatMechanics.ts`)
  - [ ] Attack rolls (d20 + modifiers + proficiency + weapon skill)
  - [ ] Damage calculation (weapon dice + attribute modifier)
  - [ ] Critical hits (natural 20 = double weapon dice)
  - [ ] Critical misses (natural 1)
  - [ ] Advantage/Disadvantage system

- [-] **Defense System**
  - [x] AC calculation (10 + armor + AG modifier)
  - [ ] Armor types (Light/Medium/Heavy)
  - [ ] Shield bonuses
  - [ ] Row positioning effects (back row: melee attacks have disadvantage)

- [-] **Spell System** (`utils/spellSystem.ts`)
  - [x] AP cost system (Cantrip: 0, Level 1: 5, Level 2: 8, etc.)
  - [ ] Spell save DC (8 + proficiency + spellcasting modifier)
  - [ ] Spell attack bonus (proficiency + spellcasting modifier)
  - [ ] Concentration mechanics
  - [ ] Spell learning (Prepared vs Known casters)

#### Developer 3: Combat UI
- [-] **Combat Interface** (`components/combat/CombatInterface.tsx`)
  - [x] Initiative tracker display
  - [x] Turn indicator
  - [x] Party status (HP, AP, row position)
  - [x] Enemy status
  - [x] Combat log with color coding

- [-] **Action Menu** (`components/combat/ActionMenu.tsx`)
  - [x] Attack action
  - [ ] Spell casting (with AP cost display)
  - [x] Item use
  - [ ] Defend action
  - [ ] Row switch (free action)
  - [x] Ability/skill use

- [ ] **Spell Selection UI** (`components/combat/SpellSelector.tsx`)
  - [ ] Spell list filtered by available AP
  - [ ] Spell details (cost, damage/effect, target, range)
  - [ ] Concentration indicator
  - [ ] Spell level organization

#### Developer 4: Monster Integration
- [-] **Import Monster Data** (`data/monsters.ts`)
  - [ ] Parse `monsters_ultra.json` from manual
  - [ ] Convert D&D stats to RoA scale
  - [ ] Map abilities and actions
  - [ ] Create encounter tables by CR

- [ ] **Combat Balance Testing**
  - [ ] Test combat encounters at levels 1, 3, 5
  - [ ] Validate damage scaling
  - [ ] Test spell effectiveness
  - [ ] Verify AP economy balance

---

### 0.3 Magic System (Weeks 5-8)

#### Developer 1: Spell Data Architecture
- [ ] **Import Spell Database** (`data/spells.ts`)
  - [ ] Parse 84 spells from manual
  - [ ] Organize by spell level (Cantrip - 9)
  - [ ] Categorize by school (12 disciplines)
  - [ ] Add D&D 5e spell list integration

- [ ] **Spell Learning System** (`utils/spellLearning.ts`)
  - [ ] Prepared casters (Cleric, Druid, Paladin): Know all spells, prepare subset
  - [ ] Known casters (Wizard, Sorcerer, Warlock, Bard, Ranger): Learn specific spells
  - [ ] Spell progression by level
  - [ ] Spellbook management for Wizards

#### Developer 2: AP System
- [-] **AP Pool Management** (`stores/useResourceStore.ts`)
  - [x] AP pool calculation (10 + IT modifier × 2 + class bonus)
  - [x] AP cost tracking
  - [ ] AP recovery (Long rest: full, Short rest: 25%, Meditation: 5 HP → 5 AP)

- [ ] **Rest System** (`utils/restSystem.ts`)
  - [ ] Long rest (8 hours): Restore HP and AP
  - [ ] Short rest (1 hour): Restore 25% AP (once per day)
  - [ ] Meditation (Magicians only): HP to AP conversion

#### Developer 3: Magic UI
- [ ] **Spellbook Interface** (`components/magic/Spellbook.tsx`)
  - [ ] Spell list by level
  - [ ] Spell details panel
  - [ ] Prepared spell management (for prepared casters)
  - [ ] Spell learning interface (for known casters)
  - [ ] AP pool display

- [ ] **Spell Effects Visualization**
  - [ ] Damage numbers animation
  - [ ] Healing effects
  - [ ] Status effect icons
  - [ ] Concentration indicator

#### Developer 4: Testing & Balance
- [ ] **Spell Testing Suite**
  - [ ] Test all spell effects
  - [ ] Validate AP costs
  - [ ] Test spell save DCs
  - [ ] Verify concentration mechanics
  - [ ] Balance testing for spell damage/healing

---

### 0.4 MVP Integration & Polish (Weeks 7-8)

#### All Developers: Integration Tasks
- [-] **Character Progression**
  - [x] XP gain and leveling
  - [x] Stat increases on level up
  - [ ] New spell learning
  - [ ] Feat selection (every 3rd level)

- [x] **Save/Load System**
  - [x] Persist character data
  - [x] Save combat state
  - [x] Load game functionality

- [ ] **Tutorial/Onboarding**
  - [ ] Character creation guide
  - [ ] Combat tutorial
  - [ ] Spell system introduction

- [ ] **Bug Fixes & Polish**
  - UI/UX improvements
  - Performance optimization
  - Balance adjustments
  - Documentation

---

## Post-MVP Phase 1: Skills & Progression (Month 3)

### 1.1 Skills System (Weeks 9-10)

#### Developer 1: Skills Architecture
- [ ] **Import 51 Skills** (`data/skills.ts`)
  - Combat skills (Attack/Parry values)
  - Social skills
  - Nature skills
  - Lore skills
  - Craftsmanship skills

- [ ] **Skill Check System** (`utils/skillChecks.ts`)
  - d20 + attribute modifier + proficiency
  - Advantage from secondary attributes
  - DC table (Very Easy: 5, Easy: 10, Medium: 15, Hard: 20, Very Hard: 25, Nearly Impossible: 30)

#### Developer 2: Skill Progression
- [ ] **Skill Training System**
  - Skill points on level up
  - Class skill bonuses
  - Proficiency system

#### Developer 3: Skills UI
- [ ] **Skills Panel** (`components/character/SkillsPanel.tsx`)
  - Skill list with values
  - Training interface
  - Skill check results display

### 1.2 Feat System (Weeks 11-12)

#### Developer 1: Feat Data
- [ ] **Import Feats** (`data/feats.ts`)
  - Parse feat data from manual
  - Prerequisites
  - Effects and bonuses

#### Developer 2: Feat Selection
- [ ] **Feat Selection System**
  - Feat selection on levels 3, 6, 9, etc.
  - Prerequisite checking
  - Feat effects application

#### Developer 3: Feat UI
- [ ] **Feat Selection Interface**
  - Available feats display
  - Feat details
  - Selection confirmation

---

## Post-MVP Phase 2: Exploration & World (Month 4)

### 2.1 Dungeon Exploration Enhancement (Weeks 13-14)

#### Developer 1: Dungeon Systems
- [ ] **Automap System** (`components/game/Automap.tsx`)
  - Revealed map display
  - Fog of war
  - Points of interest markers

- [ ] **Cartography System** (`components/game/CartographyTool.tsx`)
  - Manual mapping interface
  - Drawing tools
  - Map notes

#### Developer 2: Dungeon Mechanics
- [ ] **Door & Lock System**
  - Lock picking skill checks
  - Door types (wooden, iron, magical)
  - Bash door mechanics

- [ ] **Search & Treasure**
  - Search skill checks
  - Hidden treasure locations
  - Trap detection

#### Developer 3: Dungeon UI
- [ ] **Enhanced Dungeon View**
  - 3D perspective view
  - Interactive elements
  - Minimap integration

### 2.2 Travel & Camping (Weeks 15-16)

#### Developer 1: Travel System
- [ ] **Overworld Travel** (`stores/useTravelStore.ts`)
  - World map navigation
  - Travel time calculation
  - Random encounters
  - Ship travel

#### Developer 2: Camping System
- [ ] **Camp Mechanics** (`utils/campingSystem.ts`)
  - Set up camp
  - Guard assignment
  - Hunting for food
  - Rest and recovery
  - Random night encounters

#### Developer 3: Travel UI
- [ ] **World Map Interface**
  - Location markers
  - Travel routes
  - Camp setup screen

---

## Post-MVP Phase 3: Items & Economy (Month 5)

### 3.1 Inventory & Equipment (Weeks 17-18)

#### Developer 1: Inventory System
- [ ] **Enhanced Inventory** (`stores/useInventoryStore.ts`)
  - Weight limits
  - Equipment slots (weapon, armor, shield, accessories)
  - Item stacking
  - Item durability

#### Developer 2: Item Data
- [ ] **Import Item Database** (`data/items.ts`)
  - Weapons (with attack/parry values)
  - Armor (with AC values)
  - Consumables
  - Quest items
  - Materials

#### Developer 3: Inventory UI
- [ ] **Inventory Interface** (`components/inventory/InventoryPanel.tsx`)
  - Grid/list view
  - Equipment paper doll
  - Item tooltips
  - Drag and drop

### 3.2 Economy & Trade (Weeks 19-20)

#### Developer 1: Economy System
- [ ] **Currency System** (`utils/economy.ts`)
  - Gold, Silver, Copper conversion
  - Party gold pool
  - Banking system

- [ ] **Market System** (`stores/useMarketStore.ts`)
  - Shop inventory generation
  - Price calculation
  - Haggling mechanics

#### Developer 2: Crafting & Gathering
- [ ] **Crafting System** (`utils/craftingSystem.ts`)
  - Alchemist recipes
  - Blacksmith recipes
  - Leatherworker recipes

- [ ] **Gathering System**
  - Herbalism
  - Mining
  - Skinning

#### Developer 3: Economy UI
- [ ] **Shop Interface** (`components/services/ShopInterface.tsx`)
  - Buy/sell interface
  - Haggling UI
  - Inventory comparison

- [ ] **Crafting Interface**
  - Recipe list
  - Material requirements
  - Crafting queue

---

## Post-MVP Phase 4: Services & Locations (Month 6)

### 4.1 Town Services (Weeks 21-22)

#### Developer 1: Service Systems
- [ ] **Inn & Tavern** (`stores/useInnStore.ts`)
  - Room rental
  - Food and drink
  - Performance for coin
  - Rumors and quests

- [ ] **Healer System**
  - Healing services
  - Disease treatment
  - Poison cure
  - Resurrection

- [ ] **Blacksmith Services**
  - Weapon/armor repair
  - Equipment upgrades

#### Developer 2: Temple System
- [ ] **Temple Mechanics** (`stores/useTempleStore.ts`)
  - Deity worship
  - Divine bonuses
  - Miracles
  - Offerings
  - Save game functionality

#### Developer 3: Service UI
- [ ] **Service Interfaces**
  - Inn interface
  - Healer interface
  - Blacksmith interface
  - Temple interface

### 4.2 NPC & Party Management (Weeks 23-24)

#### Developer 1: NPC System
- [ ] **NPC Interaction** (`stores/useNPCStore.ts`)
  - Dialogue system
  - Quest givers
  - Companion recruitment
  - NPC schedules

#### Developer 2: Party Management
- [ ] **Team Management** (`utils/partyManagement.ts`)
  - Split party
  - Unite teams
  - Multiple group management
  - Party composition validation

#### Developer 3: NPC UI
- [ ] **Dialogue Interface**
  - Conversation trees
  - Quest tracking
  - Companion management

---

## Post-MVP Phase 5: Advanced Systems (Ongoing)

### 5.1 Hazards & Survival (Weeks 25-26)

#### Developer 1: Hazard Systems
- [ ] **Disease System** (`utils/diseaseSystem.ts`)
  - 6 major diseases
  - Symptoms and effects
  - Treatment methods

- [ ] **Wilderness Hazards** (`utils/wildernessHazards.ts`)
  - Hunger and thirst
  - Weather effects
  - Terrain dangers

#### Developer 2: Survival Mechanics
- [ ] **Resource Management**
  - Food consumption
  - Water consumption
  - Fatigue system

### 5.2 Magic & Religion (Weeks 27-28)

#### Developer 1: Deity System
- [ ] **Religion Mechanics** (`data/deities.ts`)
  - Deity selection
  - Divine bonuses
  - Temple access
  - Alignment system

#### Developer 2: Advanced Magic
- [ ] **Spell Schools** (12 disciplines)
  - School specialization
  - School restrictions
  - Spell research

---

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode, full type coverage
- **React**: Functional components with hooks
- **State Management**: Zustand with persistence
- **Testing**: Jest + React Testing Library (minimum 70% coverage)
- **Documentation**: JSDoc for all public APIs

### Git Workflow
- **Main Branch**: Production-ready code
- **Develop Branch**: Integration branch
- **Feature Branches**: `feature/system-name`
- **Pull Requests**: Required for all merges, minimum 1 reviewer

### Task Assignment Strategy
- **Developer 1**: Architecture, data models, core systems
- **Developer 2**: Game mechanics, calculations, algorithms
- **Developer 3**: UI/UX, components, user interactions
- **Developer 4**: Testing, QA, documentation, balance

### Communication
- **Daily Standups**: 15 minutes
- **Weekly Sprint Planning**: 1 hour
- **Bi-weekly Demos**: Show progress to stakeholders
- **Monthly Retrospectives**: Process improvement

---

## Verification Plan

### Automated Testing

#### Unit Tests
```bash
cd frontend
npm run test
```
- Character creation validation
- Attribute modifier calculations
- Combat mechanics (attack rolls, damage, AC)
- Spell system (AP costs, save DCs, spell attacks)
- Skill check calculations
- Inventory management
- Economy calculations

#### Integration Tests
```bash
cd frontend
npm run test:integration
```
- Character creation → Combat flow
- Combat → Loot → Inventory flow
- Shop → Buy/Sell → Inventory flow
- Spell learning → Spellbook → Combat flow

### Manual Testing

#### MVP Testing Checklist
- [ ] Create character with each class
- [ ] Test all attribute generation methods (Point Buy, Random, Quick)
- [ ] Verify derived stats calculations (HP, AP, AC, Initiative)
- [ ] Complete combat encounter at level 1
- [ ] Test spell casting for each caster class
- [ ] Verify AP consumption and recovery
- [ ] Test character leveling and progression
- [ ] Verify save/load functionality

#### Phase Testing Checklists
Each phase will include specific manual testing checklists for new systems.

### Performance Testing
- Load time < 3 seconds
- Combat turn processing < 500ms
- Smooth animations at 60fps
- Memory usage < 200MB

### Balance Testing
- Combat encounters winnable but challenging
- Resource management (HP, AP, gold) feels meaningful
- Progression curve feels rewarding
- No dominant strategies or broken builds

---

## Risk Mitigation

### Technical Risks
- **Data Migration**: Existing save files may break → Implement migration system
- **Performance**: Large spell/item databases → Lazy loading and indexing
- **Type Safety**: Complex nested types → Incremental type improvements

### Schedule Risks
- **Scope Creep**: Stick to phased approach, defer non-critical features
- **Dependencies**: Identify blocking tasks early, maintain parallel work streams
- **Team Availability**: Cross-train developers on multiple systems

### Quality Risks
- **Bugs**: Comprehensive testing at each phase
- **Balance**: Dedicated balance testing and iteration
- **UX**: Regular playtesting and feedback loops

---

## Success Metrics

### MVP Success Criteria
- ✅ Create character with all 12 classes
- ✅ Complete combat encounter with victory
- ✅ Cast spells and manage AP
- ✅ Level up character and gain new abilities
- ✅ Save and load game

### Phase Completion Criteria
- ✅ All planned features implemented
- ✅ Unit tests passing (70%+ coverage)
- ✅ Manual testing checklist completed
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Documentation updated

### Final Release Criteria
- ✅ All 40+ game systems implemented
- ✅ Full playthrough possible (character creation → endgame)
- ✅ Comprehensive testing completed
- ✅ Player manual/guide created
- ✅ Performance optimized
- ✅ Cross-browser compatibility verified

---

## Appendix: System Dependencies

### Dependency Graph
```
Character Creation
  ↓
Combat System → Magic System
  ↓              ↓
Skills System ← Progression System
  ↓              ↓
Exploration → Inventory → Economy
  ↓              ↓         ↓
Travel → Services → Crafting
  ↓       ↓
Hazards  NPCs
```

### Critical Path
1. Character Creation (blocking: everything)
2. Combat System (blocking: progression, exploration)
3. Magic System (blocking: combat balance)
4. Skills System (blocking: exploration, services)
5. Inventory (blocking: economy, crafting)
6. All other systems can be developed in parallel after these core systems

---

## Conclusion

This roadmap provides a **structured, achievable path** to implementing the comprehensive game manual systems into the dungeon crawler. By focusing on the **MVP first** (Character Creation + Combat), the team can deliver a playable, testable product early, then incrementally add systems in logical dependency order.

The **3-4 developer team structure** allows for parallel development while maintaining clear ownership and accountability. Each phase produces a **shippable increment** that can be playtested and validated before moving forward.

**Estimated Timeline**: 3-6 months depending on team velocity and scope adjustments.
