SOURCE_PATH=~/infinity_source/

APP_PATH=/opt/infinity
SERVER_PATH=$APP_PATH/infinity_srv
CLIENT_PATH=$APP_PATH/infinity_cli
WWW_PATH=$APP_PATH/www
NGINX_CONF=/etc/nginx/sites-available/default


sudo mkdir $APP_PATH
sudo cp -r $SOURCE_PATH/* $APP_PATH

cd $SERVER_PATH
sudo npm install

sudo cp $SERVER_PATH/nginx.conf $NGINX_CONF

echo Adding application to systemd
sudo cp $SERVER_PATH/infinity_srv.service /etc/systemd/system/


sudo systemctl enable infinity_srv.service
sudo systemctl restart infinity_srv.service
sudo systemctl restart nginx.service
