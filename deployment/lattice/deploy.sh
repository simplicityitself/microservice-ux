#!/bin/bash

echo "Target  $LTC_TARGET"

expect -c "
spawn ./ltc target $LTC_TARGET
expect -nocase \"Username:\" {send \"$LTC_USER\r\"}
expect -nocase \"Password:\" {send \"$LTC_PASS\r\";interact}
"

./ltc target

./ltc rm $LTC_APP
./ltc create $LTC_APP $LTC_IMAGE -m "${LTC_MEM}" --no-monitor -e "SPRING_PROFILES_ACTIVE=prod" -e "MUON_CONFIG=/usr/src/app/config.json"

