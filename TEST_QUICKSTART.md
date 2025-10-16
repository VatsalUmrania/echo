# Test Suite Quick Start Guide

## Installation

Before running tests, install dependencies:

```bash
# From repository root
cd apps/widgets
pnpm install

cd ../web
pnpm install
```

## Running Tests

### Widgets App Tests

```bash
cd apps/widgets

# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# With coverage report
pnpm test:coverage
```

### Web App Tests

```bash
cd apps/web

# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

## Test Files Location

All test files are in `__tests__` directories next to the source files:

- `apps/widgets/modules/widget/ui/screens/__tests__/`
- `apps/widgets/modules/widget/ui/views/__tests__/`
- `apps/widgets/app/__tests__/`
- `apps/web/modules/customization/ui/components/__tests__/`

## What Was Tested

✅ Widget Contact Screen (new file) — 60+ tests  
✅ Widget View — 40+ tests  
✅ Widget Selection Screen — 25+ tests  
✅ Widget Voice Screen — 30+ tests  
✅ Widgets Layout — 35+ tests  
✅ Vapi Form Fields — 40+ tests  

### Total: 250+ test cases

## Test Framework

- **Jest**: Test runner  
- **React Testing Library**: Component testing  
- **@testing-library/jest-dom**: DOM matchers  

## Troubleshooting

**Error: `jest: not found`**  
- Solution: Run `pnpm install` in the app directory  

**Error: `Cannot find module`**  
- Solution: Ensure all workspace dependencies are installed  

**Tests fail unexpectedly**:  
- Check that you're in the correct directory (apps/widgets or apps/web)  
- Verify package.json has test scripts  
- Run `pnpm install` again  

## More Information

See `TESTING_SUMMARY.md` for detailed information about each test file.