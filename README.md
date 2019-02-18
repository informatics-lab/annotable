# Annotable

This is a thing that does a thing...

## set up assuming conda:  

```
conda  create -n py36 python=3.6 
. activate py36
python3 -m venv ./env
. env/bin/activate 
pip install zappa flask
```


## once set up:

```
. env/bin/activate
```

## Deploy

`zappa deploy dev`

## update

`zappa update dev`

## tear down
`zappa undeploy dev`


