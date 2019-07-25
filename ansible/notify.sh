#!/bin/bash

# Author: KK
# Version: 1.0

url="http://172.16.3.205:10000/sender/wechat?"
tos="tao.wang"

#"PROJECT: ${JOB_NAME}&BUILD: ${BUILD_NUMBER}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${JOB_NAME}/detail/${JOB_NAME}/${BUILD_NUMBER}/pipeline/"

status=$1
job=$2
build=$3

content="$status&PROJECT: ${job}&BUILD: ${build}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${job}/detail/${job}/${build}/pipeline/"

curl -d "tos=$tos&content=$(echo $content | xargs -d'&' -n 1 | sed '$d')" $url
