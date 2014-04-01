#!/bin/bash

find res -type f -name "*.png" -exec ./MAKE-IMAGE-GREEN.sh {} \; -print
