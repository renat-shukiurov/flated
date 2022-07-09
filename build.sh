# dev | lint | lint_check | watch | install | webpack | webpack_dev | grunt
env=$1;

LOCAL_PATH=$(pwd);
OS=`uname -s`

if [[ "$env" = "dev" ]]
then
    echo "ENV: dev";
    docker run --rm --name="dev-flated-node" --net devnetwork -it -v $(pwd):/app flated-node-image sh -c "yarn run watch";


elif [[ "$env" = "prod" ]]
then
    echo "ENV: prod";
    docker run --rm --name="dev-flated-node" --net devnetwork -it -v $(pwd):/app flated-node-image sh -c "yarn install && yarn run start";

elif [[ "$env" = "install" ]]
then
    echo "ENV: prod";
    docker run --rm --name="dev-flated-node" --net devnetwork -it -v $(pwd):/app flated-node-image sh -c "yarn install";

else
    echo "ENV: prod";
    docker run --rm --name="dev-flated-node" --net devnetwork -it -v $(pwd):/app flated-node-image sh -c "yarn install && yarn run start";
fi