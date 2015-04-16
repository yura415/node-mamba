# node-mamba
Mamba.ru API wrapper for node.js. It cares single dependency (md5).

## Installation

> npm i -s mamba

## Usage

Initialize.

```
var MambaApi = require("mamba");
var mamba = new MambaApi(appId, appSecret);
```

Then use it like this:

```
mamba.request("achievement.set", {
	sid: sid,
    text: text,
    extra_params: extra_params
}, callback);
...
```

Or use helper methods:

```
mamba.achievementSet(sid, text, extra_params, cb);
mamba.anketaGetFlags(oids, cb);
mamba.anketaGetHitlist(sid, period, limit, offset, blocks, ids_only, cb);
mamba.achievementSet({
	sid: sid,
    text: text,
    extra_params: extra_params
}, cb);
...
```

## License

MIT