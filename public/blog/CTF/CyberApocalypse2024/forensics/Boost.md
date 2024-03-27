## First Half
At tcp.stream eq 3, we get a reversed base64 cmdlet that decodes into a very very long cmdle.

In the file, we have something labeled part1: 
`$part1 = "SFRCe2ZyMzNfTjE3cjBHM25fM3hwMDUzZCFf"`

This base64 decodes into: HTB{fr33_N17r0G3n_3xp053d!_

First half of our flag down. Time to find the next part.

## Second Half
This seems like an interesting line: 
`$AES_KEY = "Y1dwaHJOVGs5d2dXWjkzdDE5amF5cW5sYUR1SWVGS2k="`


Our next stream of interest seems to be at tcp.stream eq 48 This contains post data with what seems to be encrypted data. Going back to our AES key, we can try decrypting it. Here's our decryption script:
```py
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

# Given encrypted data and AES key
encrypted_data_b64 = "bEG+rGcRyYKeqlzXb0QVVRvFp5E9vmlSSG3pvDTAGoba05Uxvepwv++0uWe1Mn4LiIInZiNC/ES1tS7Smzmbc99Vcd9h51KgA5Rs1t8T55Er5ic4FloBzQ7tpinw99kC380WRaWcq1Cc8iQ6lZBP/yqJuLsfLTpSY3yIeSwq8Z9tusv5uWvd9E9V0Hh2Bwk5LDMYnywZw64hsH8yuE/u/lMvP4gb+OsHHBPcWXqdb4DliwhWwblDhJB4022UC2eEMI0fcHe1xBzBSNyY8xqpoyaAaRHiTxTZaLkrfhDUgm+c0zOEN8byhOifZhCJqS7tfoTHUL4Vh+1AeBTTUTprtdbmq3YUhX6ADTrEBi5gXQbSI5r1wz3r37A71Z4pHHnAoJTO0urqIChpBihFWfYsdoMmO77vZmdNPDo1Ug2jynZzQ/NkrcoNArBNIfboiBnbmCvFc1xwHFGL4JPdje8s3cM2KP2EDL3799VqJw3lWoFX0oBgkFi+DRKfom20XdECpIzW9idJ0eurxLxeGS4JI3n3jl4fIVDzwvdYr+h6uiBUReApqRe1BasR8enV4aNo+IvsdnhzRih+rpqdtCTWTjlzUXE0YSTknxiRiBfYttRulO6zx4SvJNpZ1qOkS1UW20/2xUO3yy76Wh9JPDCV7OMvIhEHDFh/F/jvR2yt9RTFId+zRt12Bfyjbi8ret7QN07dlpIcppKKI8yNzqB4FA=="
aes_key_b64 = "Y1dwaHJOVGs5d2dXWjkzdDE5amF5cW5sYUR1SWVGS2k="

# Decode from Base64
encrypted_data = base64.b64decode(encrypted_data_b64)
aes_key = base64.b64decode(aes_key_b64)

# Assuming the first 16 bytes are the IV for CBC mode (if applicable)
iv = encrypted_data[:16]
encrypted_message = encrypted_data[16:]

try:
    # Try to decrypt with AES CBC mode
    cipher_cbc = AES.new(aes_key, AES.MODE_CBC, iv)
    decrypted_message = unpad(cipher_cbc.decrypt(encrypted_message), AES.block_size)
    print("Decrypted (CBC mode):", decrypted_message.decode('utf-8'))
except ValueError as e:
    print("Decryption or unpadding error in CBC mode:", e)

try:
    # If IV not used (ECB mode, not recommended)
    cipher_ecb = AES.new(aes_key, AES.MODE_ECB)
    decrypted_message = unpad(cipher_ecb.decrypt(encrypted_data), AES.block_size)
    print("Decrypted (ECB mode):", decrypted_message.decode('utf-8'))
except ValueError as e:
    print("Decryption or unpadding error in ECB mode:", e)

```


The email portion: `"Email":  "YjNXNHIzXzBmX1QwMF9nMDBkXzJfYjNfN3J1M18wZmYzcjV9"` decodes from base64 to: `b3W4r3_0f_T00_g00d_2_b3_7ru3_0ff3r5}`

Looks like we're done here. Here's the fully constructed flag:
`HTB{fr33_N17r0G3n_3xp053d!_b3W4r3_0f_T00_g00d_2_b3_7ru3_0ff3r5}`
