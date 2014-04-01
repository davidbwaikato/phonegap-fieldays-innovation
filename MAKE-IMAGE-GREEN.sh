#!/bin/sh

for f in $* ; do
  echo "Processing $f"
  convert $f -background darkgreen -flatten png:- > $f.new \
  && /bin/mv $f.new $f
done
