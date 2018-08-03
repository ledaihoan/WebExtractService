#!/bin/sh
# $2 config name
# Example ./runservice.sh start development

if [ "x$2" != "x" ]; then
APP_PROF="$2"
else
APP_PROF="production"
fi
APP_NAME="WebExtractor"
case "$1" in
	start)
        echo "Starting app with 1 instance..."
        pm2 delete $APP_NAME
        NODE_ENV=$APP_PROF pm2 start app.js --name $APP_NAME
		exit 1
		;;
	stop)
		echo "Application already stopped!"
		pm2 stop all   
		exit 1
		;;
	restart)
		pm2 reload all
		exit 1
		;;
	delete)
		echo "Application delete all service"
		pm2 delete all
esac

