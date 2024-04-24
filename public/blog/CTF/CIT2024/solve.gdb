file ./readmymind

break *_Z4readv+267
command
set $edi = 0x0
continue
end

break *_Z4readv+509
command
set $rdx = 0x4ebfa
set $rsi = 0xf4240
set $rdi = 0x174e
continue
end

run 
