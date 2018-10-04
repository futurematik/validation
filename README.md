# Model

It is often useful to have a list of keys for an interface in Typescript. It
would be awesome if you could do this:

```typescript
interface Thing {
  id: number;
  name: string;
}

const thingKeys = keyof Thing;
```

But you can't do that. Until then, you can do this:

```typescript
import { keyof, model, UnwrapDefinition } from '@fmtk/model';

const thingDef = model({
  id: type<number>(),
  name: type<string>(),
});

type Thing = UnwrapDefinition<typeof thingDef>;

const thingKeys = keyof(thingDef);
```

It's a bit clanky but it cuts down on typing a little, which improves
development speed and maintainability.
