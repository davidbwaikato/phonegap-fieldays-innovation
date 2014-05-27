
echo ""
echo "******"
echo "* Setting up command-line environment for PhoneGap"
echo "******"

echo "+"
export ADT_SDK_HOME=/cygdrive/c/Apps/Android/adt/sdk
export PATH=$ADT_SDK_HOME/tools/:$ADT_SDK_HOME/platform-tools:$PATH
echo "+ Setting ADT_SDK_HOME to"
echo "+  ADT_SDK_HOME"
echo "+ And adding 'tools' and 'platform-tools' to PATH"

echo "+"
export ANT_HOME=/cygdrive/c/Apps/Ant
export PATH=$ANT_HOME/bin/:$PATH
echo "+ Setting ANT_HOME to"
echo "+  $ANT_HOME"
echo "+ And adding 'bin' to PATH"

if [ -d dev ] ; then
  echo "++"
  echo "++ Detected development folder"

  export PATH=`pwd`/dev/bin/script:$PATH

  echo "++  ... Adding 'dev/bin/script' to PATH"
  echo "++"

fi

cygpath -h 2>&1 >/dev/null
if [ $? = "0" ] ; then
  echo "++ Cygwin detected => Changing ANT_HOME to be Windows style"
  export ANT_HOME="C:\\Apps\\Ant"

  if [ -d dev ] ; then
    export PATH=`pwd`/dev/bin/windows:$PATH
  fi
fi



echo "+"
export JAVA_HOME=/cygdrive/c/Program\ Files/Java/jdk1.8.0_20
export PATH=$JAVA_HOME/bin:$PATH
echo "+ Setting JAVA_HOME to"
echo "+  $JAVA_HOME"
echo "+ And adding 'bin' to PATH"

# Sometimes the following is needed
#export  GIT_SSL_NO_VERIFY=true
#echo "++ Set environment variable 'GIT_SSL_NO_VERIFY' to true"

