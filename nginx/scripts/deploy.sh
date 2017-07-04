SOURCE_DIR=/home/harmonic/infinity_source
NGINX_DOCKER_FILE=$SOURCE_DIR/nginx

cd $NGINX_DOCKER_FILE
sudo git pull


sudo docker build -t infinity_nginx .


sudo docker tag infinity_nginx localhost:5000/infinity_nginx

sudo docker push localhost:5000/infinity_nginx


sudo docker stop infinity_nginx

sudo docker rm infinity_nginx

sudo docker run -itd -p 80:80 --name infinity_nginx -d infinity_nginx