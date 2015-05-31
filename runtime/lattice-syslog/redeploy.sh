#!/bin/bash


#docker run quay.io:simplicityitself:deploylattice -e lattice url lattic user lattic password memory disk 

ltc rm lattice_logger
ltc create lattice_logger quay.io/simplicityitself/lattice-logger -m 800 --no-monitor -e SPRING_PROFILES_ACTIVE=prod

