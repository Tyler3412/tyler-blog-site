## Challenge Writeup
So first we see a bash script

In the line containing the rsa key, we get part of the flag: user@tS_u0y_ll1w{BTH
Clearly it's been reversed but we'll come back to it later

Then at the end of the file, we have the line: bash -c 'NG5kX3kwdVJfR3IwdU5kISF9' " >> /etc/crontab
This seems to be base64 encoded, so decoding it gives us 4nd_y0uR_Gr0uNd!!}

Looks like that's the second half of the flag. Putting them both together, we get:

HTB{w1ll_y0u_St4nd_y0uR_Gr0uNd!!}
