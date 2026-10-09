$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
cd "d:\Indian Short Films\apps\capacitor_app\android"
.\gradlew clean
.\gradlew assembleRelease
.\gradlew bundleRelease
