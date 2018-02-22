## Why

- an image for a dedicate pod for running misc ops operations
- one-off scripts
- for long-running migrations: ie db, elastic search index population

## Building

```
ACCOUNT=maryan@rover.io. PROJECT=rover-staging make
```

builds image locally and pushes to `gcr.io/$PROJECT/tmux`.
Assumes access is granted to the registry


## Using

# Running tmux pod
```
kubectl-staging run -i --tty shell --image=gcr.io/rover-staging/tmux:latest
```

# Attaching to the pod/tmux

```
kubectl-staging exec -it <POD_NAME> tmux attach
```

## Tmux commands

`^b` - is a "leader key" mnemonic and is equal to pressing `CTRL-b` combo

- `^bc` - create a session
- `^bs` - select a session
- `^bd` - detach from session
