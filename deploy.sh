#!/bin/bash
local_dir=./
server_dir=/data/services/WebExtractServices
user=ledaihoan
#10.30.22.241
servers=(35.201.222.105)

i=0
massdeploy=0

while [ "x${servers[i]}" != "x" ]
do
    server=${servers[i]}
    echo echo "Deploy on server $server";echo
    rsync -auvr --delete $local_dir/* $user@$server:$server_dir/
    echo;echo "Done $server"
    i=$(( $i + 1 ))
    if [ "x${servers[i]}" != "x" ]; then
        if [ $massdeploy -eq 0 ]; then
            echo;echo "Press Enter to continue update --- ${servers[i]}"
            echo "Press \"1 + Enter\" to update all other"
            read line
            if [ "$line" == "1" ]; then
                massdeploy=1
            fi
        else
            continue
        fi
    else
        echo "Done!!!"
    fi
done
