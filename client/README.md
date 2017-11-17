# Availability App Client

This guide outlines the steps to setup your windows Development Environment


#Windows

The steps below are based off the guide outlines here,
https://facebook.github.io/react-native/docs/getting-started.html

- Powershell Prompt (run as admin)
```choco install -y nodejs.install python2 jdk8```

	```npm install -g react-native-cli```


- Download Android Studio - https://developer.android.com/studio/index.html
- Clone Git Repo to your machine
- Android Studio - Open existing Project in Android Studio > client folder.
- DO NOT Upgrade **GRADLE** version as per prompt
- Android Studio  > Tools > Android > SKD Manager
- Tick "show package details" on each tab as you open them
- Untick all items that do not match below to avoid conflicts

**SDK Platforms**
Android 6.0 - Google APIs
Android 6.0 - Android SDK Platform 23
Android 6.0 - Sources for Android 23
Intel x86 Atom System Image
Intel x86 Atom_x64 System Image
Intel APIs Intel x86 Atom System Image
Intel APIs Intel x86 Atom_64 System Image
Android 6.0 - Performance (Intel ® HAXM)
Android 6.0 - Android Virtual Device

**SDK Tools**
Android SDK-Build-Tools - 23.0.1
Android Emulator - 26.1.4
Android SKD Platform Tools - 26.0.2
Android SDK Tools 26.1.1
Intel x86 Emulator Accelerator (HAMX Installer)
Android SUpport Repository - 47.0.0
Google Repository - 58

- Setup Android "AVD"  - Tools > Android > Setup AVD
	- 86 Images > Marshmellow API = v23 

**Test Compile app** Powershell (Run as admin) - You will need to change directory to suite yourself

```cd c:\availability-poc\client\android
./gradlew clean
cd C:\availability-poc\client\
react-native run-android```

If all goes to plan, it will error out saying "No AVD" available.

**Run in emulator**
- Android Dev Tools > AVD > Start > Wait for it to boot
- Run compile as per steps above

To "reload" the app after you make changes, you need to push R twice while you have the emulator selected.


