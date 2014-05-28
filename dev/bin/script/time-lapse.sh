#!/bin/bash

#if [ $# -ne "2" ] ; then
  if [ $# -ne "1" ] ; then
    echo "Usage: time-lapse.sh startupVideo1" 1>&2
#    echo "or:" 1>&2
#    echo "       time-lapse.sh frame%03.png output.mp4" 1>&2
    exit 1
  fi
#fi

if [ $# -eq "1" ] ; then
  frameRoot="${1}_%03d.png"
  videoOut="${1}.mp4"
#elif [ $# -eq "2" ] ; then
#  frameRoot=$1
#  videoOut=$2
fi

echo "Running: "
echo "  ffmpeg -f image2 -start_number 000 -i $frameRoot -vcodec libx264 $videoOut"
echo ""

#ffmpeg -r 50 -i $frameRoot  -q:v 0 -s hd720 -vcodec libx264 -vpre hq -crf 25 $videoOut
#ffmpeg -r 50 -i $frameRoot  -q:v 0 -s hd720 -vcodec libx264  -crf 25 $videoOut

#ffmpeg -r 0.3 -i $frameRoot -s 1280x800 -vcodec libx264  -crf 25 -r 0.3 -y $videoOut
#ffmpeg -r 0.3 -i $frameRoot -s 1280x800 -r 0.3 -y $videoOut



for i in {0..99} ; do
  pi=`printf "%03d" $i`
  echo "Duplicating ${1}_01 -> frame $pi"
  /bin/cp ${1}_01.png tmp/${1}_$pi.png
done

for i in {100..150} ; do
  pi=`printf "%03d" $i`
  echo "Duplicating ${1}_02 -> frme $pi"
  /bin/cp ${1}_02.png tmp/${1}_$pi.png
done


echo ""
echo "Cmd: ffmpeg -f image2 -start_number 000 -i \\"tmp\\$frameRoot\\" -vcodec mpeg4 -y \"$videoOut\""
echo ""

ffmpeg -f image2 -start_number 000 -i "tmp\\$frameRoot" -vcodec mpeg4 -y "$videoOut"


##ffmpeg -f image2 -start_number 000 -i $frameRoot -vcodec libx264 -b:v 5000k -s 1920×1080 $videoOut
#echo ""
#echo "Cmd: ffmpeg -f image2 -start_number 000 -i 'tmp\\"$frameRoot"' -vcodec libx264 -movflags faststart -y $videoOut"
#echo ""

##ffmpeg -f image2 -start_number 000 -i "tmp\\$frameRoot" -vcodec libx264 -movflags faststart -y "$videoOut"

#ffmpeg -f image2 -start_number 000 -i "tmp\\$frameRoot" -vcodec libx264 -s 480x320 -movflags faststart -y "$videoOut"

#-acodec aac

#-vcodec libx264 
#  -strict -2 -ac 1 -ar 16000 -r 13 -ab 32000 -aspect 3:2


#for i in {0..99} ; do
#  pi=`printf "%03d" $i`
#  echo "Removing $pi"
#  /bin/rm ${1}_$pi.png
#done

#for i in {100..199} ; do
#  pi=`printf "%03d" $i`
#  echo "Removing $pi"
#  /bin/rm ${1}_$pi.png
#done

