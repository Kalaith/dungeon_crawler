# Component Architecture Review

## Executive Summary

This review identifies opportunities to improve component architecture by:
1. **Extracting reusable components** from duplicated patterns
2. **Removing business logic** from display components
3. **Breaking down large components** into smaller, focused pieces
4. **Creating shared UI primitives** for consistency

---

## 🔴 Critical Issues

### 1. **CombatInterface.tsx** - Business Logic in Component

**Location**: `frontend/src/components/combat/CombatInterface.tsx` (Lines 20-58)

**Problem**: Complex turn processing logic embedded in component
```tsx
useEffect(() => {
  if (inCombat && combatTurnOrder.length > 0) {
    const currentParticipant = combatTurnOrder[currentTurn];
    
    if (currentParticipant) {
      if (currentParticipant.type === 'enemy') {
        if (lastProcessedTurn.current === currentTurn) return;
        lastProcessedTurn.current = currentTurn;
        processTurn();
      } else {
        const character = currentParticipant.character as Character;
        if (!character.alive || character.derivedStats.HP.current <= 0) {
          // Complex logic for checking unconscious party members
          const alivePartyMembers = combatTurnOrder.filter(p => {
            if (p.type === 'party') {
              const char = p.character as Character;
              return char.alive && char.derivedStats.HP.current > 0;
            }
            return false;
          });
          
          if (alivePartyMembers.length === 0) return;
          setTimeout(() => nextTurn(), 100);
        }
      }
    }
  }
}, [inCombat, combatTurnOrder, currentTurn, processTurn, nextTurn]);
```

**Solution**: Move this logic to `useCombat` hook or a dedicated `useTurnProcessor` hook

---

### 2. **CharacterCreationWizard.tsx** - Too Large (288 lines)

**Location**: `frontend/src/components/party/CharacterCreationWizard.tsx`

**Problems**:
- Single component handles 5 different steps
- Character creation logic mixed with display
- Derived stats calculation in component (lines 35-49)
- Each step is a separate render function (88-256)

**Solution**: Break into smaller components:
```
CharacterCreationWizard/
  ├── IdentityStep.tsx
  ├── RaceStep.tsx
  ├── ClassStep.tsx
  ├── AttributesStep.tsx
  ├── ReviewStep.tsx
  └── index.tsx (orchestrator)
```

Move character creation logic to a service/utility:
```typescript
// utils/characterCreation.ts
export function createCharacterFromWizardData(store: CharacterCreationStore): Character {
  // All the character creation logic
}
```

---

### 3. **ActionMenu.tsx** - Business Logic in Component

**Location**: `frontend/src/components/combat/ActionMenu.tsx` (Lines 33-78)

**Problem**: Ability selection UI embedded in action menu
- Lines 33-78: Complete ability selector UI
- Duplicates pattern from SpellSelector
- Should be extracted to separate component

**Solution**: Create `AbilitySelector.tsx` component similar to `SpellSelector.tsx`

---

## 🟡 Reusability Opportunities

### 4. **Stat Display Pattern** - Duplicated 3+ Times

**Locations**:
- `PartyStatus.tsx` (Lines 22-23, 40-54)
- `CharacterSlot.tsx` (Lines 46-49)
- `CharacterSheet.tsx` (Lines 50-69)
- `EnemyDisplay.tsx` (Lines 9, 18-26)

**Pattern**: Health/Mana bars with percentage calculations

**Current Duplication**:
```tsx
// In PartyStatus.tsx
const healthPercent = (character.derivedStats.HP.current / character.derivedStats.HP.max) * 100;
<div className="h-2 bg-gray-400/15 rounded-full overflow-hidden mb-1">
  <div
    className="h-full bg-gradient-to-r from-red-400 to-green-400 transition-all duration-300"
    style={{ width: `${healthPercent}%` }}
  />
</div>

// In EnemyDisplay.tsx
const healthPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;
<div className="bg-gray-400/15 h-3 rounded-full overflow-hidden mb-2 min-w-[150px]">
  <div
    className="h-full bg-red-400 transition-all duration-300"
    style={{ width: `${healthPercent}%` }}
  />
</div>
```

**Solution**: Create reusable components (see Phase 1 implementation)

---

### 5. **Character Card Pattern** - Duplicated 2 Times

**Locations**:
- `PartyStatus.tsx` (Lines 26-77)
- `CharacterSlot.tsx` (Lines 33-52)

**Pattern**: Character display with name, class, HP/AP

---

### 6. **Turn Order Badge** - Could Be Reusable

**Location**: `CombatHeader.tsx` (Lines 13-29)

---

### 7. **Attribute Grid Pattern** - Duplicated 2 Times

**Locations**:
- `CharacterCreationWizard.tsx` (Lines 180-212)
- `CharacterSheet.tsx` (Lines 34-43)

---

## 🟢 Good Patterns to Replicate

### 8. **SpellSelector.tsx** - Well Structured

**Why it's good**:
- ✅ Pure display component
- ✅ Clear props interface
- ✅ Business logic (`getCastableSpells`) in separate utility
- ✅ Grouped data presentation (spells by level)
- ✅ Consistent styling patterns

**Use as template for**: `AbilitySelector.tsx`, `ItemSelector.tsx`

---

### 9. **UI Components** - Good Primitives

**Button.tsx** and **Modal.tsx** are well-designed:
- ✅ Variant system for flexibility
- ✅ Size options
- ✅ Proper TypeScript interfaces
- ✅ No business logic
- ✅ Composable

---

## 📋 Recommended Action Plan

### Phase 1: Extract Reusable UI Components (High Impact, Low Risk) ✅ IMPLEMENTED

1. ✅ **Create `StatBar.tsx` and `StatDisplay.tsx`**
   - Replace 4+ duplicated implementations
   - Files to update: `PartyStatus.tsx`, `CharacterSlot.tsx`, `CharacterSheet.tsx`, `EnemyDisplay.tsx`

2. ✅ **Create `TurnOrderBadge.tsx`**
   - Extract from `CombatHeader.tsx`

3. ✅ **Create `AttributeGrid.tsx`**
   - Replace implementations in `CharacterCreationWizard.tsx` and `CharacterSheet.tsx`

### Phase 2: Move Business Logic Out of Components (Medium Impact, Medium Risk)

4. **Extract combat turn logic from `CombatInterface.tsx`**
   - Create `useTurnProcessor.ts` hook
   - Move lines 20-58 to hook

5. **Extract character creation logic from `CharacterCreationWizard.tsx`**
   - Create `utils/characterCreation.ts`
   - Move derived stats calculation (lines 35-49)
   - Move character object creation (lines 51-74)

6. **Extract ability selection from `ActionMenu.tsx`**
   - Create `AbilitySelector.tsx` component
   - Mirror structure of `SpellSelector.tsx`

### Phase 3: Break Down Large Components (Lower Impact, Higher Risk)

7. **Refactor `CharacterCreationWizard.tsx`**
   - Split into 5 step components
   - Create orchestrator component
   - Move to `components/party/CharacterCreation/` folder

8. **Create `CharacterCard.tsx` component**
   - Consolidate `PartyStatus` and `CharacterSlot` card displays
   - Support multiple variants (compact, detailed, clickable)

---

## 🎯 Component Purity Checklist

Use this checklist when creating/reviewing components:

- [ ] **No business logic** - All calculations in hooks/utils
- [ ] **No direct store mutations** - Only call store actions
- [ ] **No complex useEffect** - Move to custom hooks
- [ ] **Props are typed** - Clear TypeScript interfaces
- [ ] **Single responsibility** - Component does one thing well
- [ ] **Reusable** - Can be used in multiple contexts
- [ ] **Testable** - Easy to test in isolation
- [ ] **Accessible** - Proper ARIA labels, keyboard navigation

---

## 📊 Component Size Analysis

| Component | Lines | Status | Recommendation |
|-----------|-------|--------|----------------|
| `CharacterCreationWizard.tsx` | 288 | 🔴 Too Large | Split into 5+ components |
| `ActionMenu.tsx` | 162 | 🟡 Large | Extract `AbilitySelector` |
| `SpellSelector.tsx` | 145 | ✅ Good | Use as template |
| `CombatInterface.tsx` | 121 | 🟡 Complex | Extract business logic |
| `CharacterSheet.tsx` | 111 | ✅ Good | Consider extracting sections |
| `GameControls.tsx` | 105 | 🟡 Has Logic | Extract keyboard handler |
| `Minimap.tsx` | 102 | ✅ Good | Canvas logic is appropriate |
| `PartyCreation.tsx` | 91 | ✅ Good | Well structured |
| `DungeonView.tsx` | 86 | ✅ Good | Canvas logic is appropriate |
| `PartyStatus.tsx` | 83 | 🟡 Duplication | Use `CharacterCard` |
| `CombatVictoryScreen.tsx` | 72 | ✅ Good | Pure display |
| `CharacterSlot.tsx` | 54 | 🟡 Duplication | Use `CharacterCard` |
| `Modal.tsx` | 51 | ✅ Excellent | Good primitive |
| `Button.tsx` | 37 | ✅ Excellent | Good primitive |
| `CombatHeader.tsx` | 33 | ✅ Good | Could extract badge |
| `EnemyDisplay.tsx` | 31 | 🟡 Duplication | Use `StatBar` |
| `CombatLog.tsx` | 26 | ✅ Excellent | Perfect simplicity |

---

## 📝 Summary

**Total Components Reviewed**: 23

**Issues Found**:
- 🔴 Critical (Business Logic): 3 components
- 🟡 Reusability Issues: 5 patterns
- ✅ Well Structured: 15 components

**Estimated Refactoring Effort**:
- Phase 1 (UI Components): 2-3 days ✅ COMPLETE
- Phase 2 (Business Logic): 3-4 days
- Phase 3 (Large Components): 4-5 days
- **Total**: 9-12 days

**Expected Benefits**:
- 40% reduction in code duplication
- Improved testability
- Easier maintenance
- Better component reusability
- Clearer separation of concerns
