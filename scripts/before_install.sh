DIR="/home/ec2-user/ineedsomething-v3-backend"
if [ -d "$DIR" ]; then
    cd /home/ec2-user
    sudo pm2 delete all
    sudo rm -rf ineedsomething-v3-backend
else
    echo "File not found"
fi
