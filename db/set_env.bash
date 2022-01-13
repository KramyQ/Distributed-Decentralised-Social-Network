#!/bin/bash
#Needs to be run with eval(./set_env.bash) as a workaround
read -p "Is your host your localhost (127.0.0.1) ? : type (y) or your custom host address: " entree
if [ $entree = "y" ]; then
   echo export SR05_DB_HOST=127.0.0.1
else
  echo export SR05_DB_HOST=$entree
fi

read -p  "Is your port 8889 ? : type (y) or your custom port " entree
if [ $entree = "y" ]; then
   echo export SR05_DB_PORT=8889
else
  echo export SR05_DB_PORT=$entree
fi

read -p  "Is your database name sr05-facebook? : type (y) or your custom name " entree
if [ $entree = "y" ]; then
   echo export SR05_DB_DATABASE=sr05-facebook
else
  echo export SR05_DB_DATABASE=$entree
fi

read -p  "Is your root user call root? type (y) or your custom root user name " entree
if [ $entree = "y" ]; then
   echo export SR05_DB_USER=root
else
  echo export SR05_DB_USER=$entree
fi

read -p  "Is your root pass root? type (y) or your custom root pass " entree
if [ $entree = "y" ]; then
   echo export SR05_DB_PASS=root
else
  echo export SR05_DB_PASS=$entree
fi
