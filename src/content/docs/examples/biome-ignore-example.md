---
title: biome ignore example
description: "This document shows examples of what NOT to do in TypeScript code, along with better alternatives.\r"
---

# Common TypeScript Mistakes

This document shows examples of what NOT to do in TypeScript code, along with better alternatives.

## Using `any` Type

Here's what NOT to do:

```typescript
// biome-ignore lint/suspicious/noExplicitAny: Example of bad practice
const badExample: any = getData();
```

Better approach:

```typescript
interface UserData {
  id: number;
  name: string;
  email: string;
}

const goodExample: UserData = getData();
```

## Unused Variables

Example of poor code:

```typescript
// biome-ignore lint/correctness/noUnusedVariables: Demonstrating unused variable anti-pattern  
function processUser(user: User) {
  const unusedVariable = "this is not used";
  return user.name;
}
```

Better approach:

```typescript
function processUser(user: User) {
  return user.name;
}
```

## Non-null Assertions

Avoid this pattern:

```typescript
// biome-ignore lint/style/noNonNullAssertion: Showing dangerous pattern
const result = getValue()!.property;
```

Safer alternative:

```typescript
const value = getValue();
const result = value?.property ?? defaultValue;
```
