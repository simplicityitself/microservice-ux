# sshd
#
# VERSION               0.0.2

FROM simplicityitself/stem:1504
MAINTAINER Simplicity Itself

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:screencast' | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

#ENV NOTVISIBLE "in users profile"
#RUN echo "export VISIBLE=now" >> /etc/profile
RUN echo "export PATH=$PATH:/opt/node/bin" >> /etc/profile


COPY installnode.sh .

RUN wget https://nodejs.org/dist/latest/node-v4.0.0-linux-x64.tar.gz
RUN ./installnode.sh

COPY run.sh /root/run.sh
EXPOSE 22
CMD ["/root/run.sh"]
