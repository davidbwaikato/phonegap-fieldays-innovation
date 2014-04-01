#!/usr/bin/perl -w

use strict;

my $icon_data = 
[
 { 'size' =>  36, 'file' => "res/icon/android/icon-36-ldpi.png"        },
 { 'size' =>  48, 'file' => "res/icon/android/icon-48-mdpi.png"        },
 { 'size' =>  72, 'file' => "res/icon/android/icon-72-hdpi.png"        },
 { 'size' =>  96, 'file' => "res/icon/android/icon-96-xhdpi.png"       },
 { 'size' => 128, 'file' => "res/icon/bada/icon-128.png"               },
 { 'size' =>  48, 'file' => "res/icon/bada-wac/icon-48-type5.png"      },
 { 'size' =>  50, 'file' => "res/icon/bada-wac/icon-50-type3.png"      },
 { 'size' =>  80, 'file' => "res/icon/bada-wac/icon-80-type4.png"      },
 { 'size' =>  80, 'file' => "res/icon/blackberry/icon-80.png"          },
 { 'size' => 114, 'file' => "res/icon/ios/icon-57-2x.png"              },
 { 'size' =>  57, 'file' => "res/icon/ios/icon-57.png"                 },
 { 'size' => 144, 'file' => "res/icon/ios/icon-72-2x.png"              },
 { 'size' =>  72, 'file' => "res/icon/ios/icon-72.png"                 },
 { 'size' => 128, 'file' => "res/icon/tizen/icon-128.png"              },
 { 'size' =>  64, 'file' => "res/icon/webos/icon-64.png"               },
 { 'size' => 173, 'file' => "res/icon/windows-phone/icon-173-tile.png" },
 { 'size' =>  48, 'file' => "res/icon/windows-phone/icon-48.png"       },
 { 'size' =>  62, 'file' => "res/icon/windows-phone/icon-62-tile.png"  }
];

my $ifile = "res/icon-template.png";


foreach my $id (@$icon_data) {

    my $ofile = $id->{'file'};
    my $size  = $id->{'size'};
    print "Generating: $ofile\n";
    `convert "$ifile" -adaptive-resize ${size}x${size} "$ofile"`;
}



