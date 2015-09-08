#!/bin/bash

env |grep RABBIT | sed -n 's/^/export /p' >> /etc/profile

/usr/sbin/sshd -D $@
