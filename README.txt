Notes on how to get things working

****************************
 GETTING ADB WORKING ON HP8
****************************

To get adb working on a new Android device which has no drivers for adb, such as the hp8 (hp8 1401), and to get the
device to be detected by Eclipse (in DDMS mode) as well:

1. Follow the instructions at http://dominoc925.blogspot.co.nz/2013/09/connecting-hp-touchpad-to-android-adb.html

a. Which involves going to Device Manager > Portable Devices > [your device, e.g. HP 8)]. 
b. Rightclick on it, choose Properties > Details. Set "Property" dropdown to Hardware ids. 
c. Then rightclick on its Value field and choose Select All, Copy.
E.g. in the HP8's case, the values copied were:

USB\VID_03F0&PID_6C1D&REV_0233&MI_00
USB\VID_03F0&PID_6C1D&MI_00

d. Edit C:\Apps\Android\adt\sdk\extras\google\usb_driver\android_winusb.inf

Under the section [Google.NTx86] add the Values found above in the following format:

;HP 8
%SingleAdbInterface%        = USB_Install, USB\VID_03F0&PID_6C1D&REV_0233&MI_01
%CompositeAdbInterface%     = USB_Install, USB\VID_03F0&PID_6C1D&MI_01

e. Also add the same under the section [Google.NTamd64]

f. Save the file


2. This step may or may not be necessary:

Edit C:\Users\Me\.android\adb_usb.ini and add in the first part of the device's ID number 
which comes after the USB/VID_ prefix as discovered in step 1c.

The text file contains:

# ANDROID 3RD PARTY USB VENDOR ID LIST -- DO NOT EDIT.
# USE 'android update adb' TO GENERATE.
# 1 USB VENDOR ID PER LINE.
0x03F0

3. a In "Device Manager" right click on Other Devices -> HP8 Slate and select "Update Drivers".

  Then use "Browser for drivers" and point it at the 'android\extras\google\usb_driver' folder
  
  Say "yes" to installing an unauthorized driver

[b. Disconnect and reconnect your Android device. On the device it should come up with an "Unauthorized" warning for the detected device.]
  
4. The tools folder of the Android SDK needs to be on the path. Then you can run:

a. adb kill-server && adb start-server
(It will reconfigure)

b. adb devices

c. ADB will now finally detect and list your new device, probably labelled as "Unauthorized". 
Eclipse's DDBS perspective has a Devices tab where your device will also be listed, again as "Unauthorized".
It's waiting for you to go onto your device and confirm authorisation to access the device with adb.
