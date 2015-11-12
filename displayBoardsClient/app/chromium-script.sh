 if ps ax | grep -v grep | grep chromium-browser > /dev/null
then
    pkill chromium-browser && chromium-browser
else
    chromium-browser
fi