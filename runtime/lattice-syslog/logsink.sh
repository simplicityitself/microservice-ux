#/bin/bash

source ~/.gvm/bin/gvm-init.sh
gvm use groovy

export DOPPLER_ADDR="ws://doppler.52.28.94.142.xip.io"

#SOURCE='echo origin:"executor" eventType:LogMessage timestamp:1433003986865771586 logMessage:<message:"2015-05-30 16:39:46.864  INFO 20 --- [           main] com.simplicityitself.helios.Application  : Started Application in 16.42 seconds (JVM running for 19.651)" message_type:OUT timestamp:1433003986865769497 app_id:"chattersource" source_type:"APP" source_instance:"0" >'

SOURCE='./firehose_sample'

NC="nc -4u logs2.papertrailapp.com 17572"
SINK="./logparse.groovy"

$SOURCE | grep source_type:\"APP\" | sed -E "s/.*[<](.*)[>]/\\1/" | $SINK | $NC
#$SOURCE | grep source_type:\"APP\" | $SINK | $NC

