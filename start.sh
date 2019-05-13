NAME=fileapp
ENV=dev
CLUSTER=1

pm2 stop fileapp
pm2 flush
pm2 delete fileapp

mkdir logs

echo 'start '${NAME}'...'

pm2 start main.js --node-args="--expose-gc --max_old_space_size=1024" -i ${CLUSTER} --name ${NAME} -o logs/pm2_log.log -e logs/pm2_error.log -- -env=${ENV}
