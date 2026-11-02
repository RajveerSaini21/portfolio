# Preview Run Doc

## Reproduce uncommitted artifacts
No env files or build artifacts needed — `node_modules/` is already present in the main checkout.

## Run the dev server
```bash
launchctl remove com.freebuff.preview 2>/dev/null
launchctl submit -l com.freebuff.preview -- /bin/sh -c 'export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"; cd /Users/rajveersaini/Desktop/portfolio-3d && exec /opt/homebrew/bin/node node_modules/.bin/vite --port 5174'
sleep 5
lsof -ti :5174  # confirm port is listening
```

To stop:
```bash
launchctl remove com.freebuff.preview
```
