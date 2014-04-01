#!/usr/bin/perl -w

use strict;

use List::Util qw(min max);

my $screen_image_data = 
[
    { 'x_dim' =>  800, 'y_dim' =>  480, 'file' => 'res/screen/android/screen-hdpi-landscape.png' },
    { 'x_dim' =>  480, 'y_dim' =>  800, 'file' => 'res/screen/android/screen-hdpi-portrait.png' },
    { 'x_dim' =>  320, 'y_dim' =>  200, 'file' => 'res/screen/android/screen-ldpi-landscape.png' },
    { 'x_dim' =>  200, 'y_dim' =>  320, 'file' => 'res/screen/android/screen-ldpi-portrait.png' },
    { 'x_dim' =>  480, 'y_dim' =>  320, 'file' => 'res/screen/android/screen-mdpi-landscape.png' },
    { 'x_dim' =>  320, 'y_dim' =>  480, 'file' => 'res/screen/android/screen-mdpi-portrait.png' },
    { 'x_dim' => 1280, 'y_dim' =>  720, 'file' => 'res/screen/android/screen-xhdpi-landscape.png' },
    { 'x_dim' =>  720, 'y_dim' => 1280, 'file' => 'res/screen/android/screen-xhdpi-portrait.png' },
    { 'x_dim' =>  480, 'y_dim' =>  800, 'file' => 'res/screen/bada/screen-portrait.png' },
    { 'x_dim' =>  320, 'y_dim' =>  480, 'file' => 'res/screen/bada-wac/screen-type3.png' },
    { 'x_dim' =>  480, 'y_dim' =>  800, 'file' => 'res/screen/bada-wac/screen-type4.png' },
    { 'x_dim' =>  240, 'y_dim' =>  400, 'file' => 'res/screen/bada-wac/screen-type5.png' },
    { 'x_dim' =>  225, 'y_dim' =>  225, 'file' => 'res/screen/blackberry/screen-225.png' },
    { 'x_dim' => 2008, 'y_dim' => 1536, 'file' => 'res/screen/ios/screen-ipad-landscape-2x.png' },
    { 'x_dim' => 1024, 'y_dim' =>  783, 'file' => 'res/screen/ios/screen-ipad-landscape.png' },
    { 'x_dim' => 1536, 'y_dim' => 2008, 'file' => 'res/screen/ios/screen-ipad-portrait-2x.png' },
    { 'x_dim' =>  768, 'y_dim' => 1004, 'file' => 'res/screen/ios/screen-ipad-portrait.png' },
    { 'x_dim' =>  960, 'y_dim' =>  640, 'file' => 'res/screen/ios/screen-iphone-landscape-2x.png' },
    { 'x_dim' =>  480, 'y_dim' =>  320, 'file' => 'res/screen/ios/screen-iphone-landscape.png' },
    { 'x_dim' =>  640, 'y_dim' =>  960, 'file' => 'res/screen/ios/screen-iphone-portrait-2x.png' },
    { 'x_dim' =>  640, 'y_dim' => 1136, 'file' => 'res/screen/ios/screen-iphone-portrait-568h-2x.png' },
    { 'x_dim' =>  320, 'y_dim' =>  480, 'file' => 'res/screen/ios/screen-iphone-portrait.png' },
    { 'x_dim' =>   64, 'y_dim' =>   64, 'file' => 'res/screen/webos/screen-64.png' },
    { 'x_dim' =>  480, 'y_dim' =>  480, 'file' => 'res/screen/windows-phone/screen-portrait.jpg' }
];


my $ifile = "res/screen-template.png";
my $ix_dim = 1536;
my $iy_dim = 1536;

my $resized_ifile = "/tmp/resized-screen-template.png";

foreach my $sid (@$screen_image_data) {

    my $ofile = $sid->{'file'};
    my $x_dim  = $sid->{'x_dim'};
    my $y_dim  = $sid->{'y_dim'};

    my $x_scale = $x_dim / $ix_dim;
    my $y_scale = $y_dim / $iy_dim;

    my $min_scale = min($x_scale,$y_scale);
    my $min_perc = $min_scale * 100;

    print "Generating: $ofile\n";

    my $cmd = "convert \"$ifile\" -adaptive-resize ${min_perc}\% \"$resized_ifile\"";
    $cmd .= " && convert -size ${x_dim}x${y_dim} xc: \"$resized_ifile\" -gravity center -composite -matte \"$ofile\"";

    `$cmd`;

    
}

