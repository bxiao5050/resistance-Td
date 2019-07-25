#!/bin/bash

# Author: KK
# Version: 1.0

url="http://172.16.3.205:10000/sender/wechat?"
tos="kk,tao.wang"
content=$@

curl -d "tos=$tos&content=$(echo $content | xargs -d'&' -n 1 | sed '$d')" $url
