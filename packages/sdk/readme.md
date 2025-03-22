# Operational node.js sdk

Operational's node.js sdk relies on axios internally.

## How to build

Clone this package and run `npm install` to install dependencies.

Then run `npm run build` inside the package to generate build files.

This will generate /build/index.es.js and /build/index.umd.js

## How to install

Open terminal and run `npm install --save @operational.co/sdk` inside your node.js project.

## How to use

```
import Operational from "@operational.co/sdk";

const ops = new Operational("API_KEY");

await ops.events.ingest({
	name : "user signed up",
	avatar : "😀"
});
```

## API docs

For docs, refer to https://operational.co/api
