**Category: Rev**

**Points: 1000 (990 after dynamic scoring)**
## Introduction
There's no challenge description or hints. We get a binary file named readmymind. Upon running it, it asks for a number.
## Static Analysis
Upon opening the file in IDA, we can see that there's a function called read called from main. Nothing else of interest is called (there are a lot of dynamically loaded functions called that aren't interesting) so we go to it first. Here's the pseudocode IDA gave me when I decompiled it:

```
unsigned __int64 read(void)
{
  unsigned int v0; // eax
  int v1; // ebx
  int v2; // eax
  int v4; // [rsp+8h] [rbp-28h] BYREF
  int v5; // [rsp+Ch] [rbp-24h] BYREF
  int v6; // [rsp+10h] [rbp-20h] BYREF
  int v7; // [rsp+14h] [rbp-1Ch] BYREF
  unsigned __int64 v8; // [rsp+18h] [rbp-18h]

  v8 = __readfsqword(0x28u);
  srand(0x174Eu);
  v4 = rand() % 1000000;
  std::operator<<<std::char_traits<char>>(
    &std::cout,
    "I'm thinking of a number between 0 and 1,000,000. What is it?\n> ");
  std::istream::operator>>(&std::cin, &v4);
  validate(5966, (int)qword_F4240, v4);
  srand(0x249Eu);
  v5 = rand() % 5000000;
  std::operator<<<std::char_traits<char>>(
    &std::cout,
    "I'm thinking of a number between 0 and 5,000,000. What is it?\n> ");
  std::istream::operator>>(&std::cin, &v5);
  validate(9374, 5000000, v5);
  srand((unsigned int)sub_F29CE);
  v6 = rand() % 25000000;
  std::operator<<<std::char_traits<char>>(&std::cout, "I'm thinking of another number. What is it?\n> ");
  std::istream::operator>>(&std::cin, &v6);
  validate((int)sub_F29CE, 25000000, v6);
  v0 = time(0LL);
  srand(v0);
  v7 = rand() % 50000000;
  std::operator<<<std::char_traits<char>>(&std::cout, "I'm thinking of another number. What is it?\n> ");
  std::istream::operator>>(&std::cin, &v7);
  v1 = v7;
  v2 = time(0LL);
  validate(v2, 50000000, v1);
  return v8 - __readfsqword(0x28u);
}
```

It seems that we have 5 checks to overcome:
1. Statically seeded RNG
2. Statically seeded RNG part 2
3. Seeded RNG using function address
4. Seeded RNG using time
5. Time validation

Investigating validate() doesn't return too much. The function calls go extremely deep and don't really show anything of interest. 
## Solve
We'll try attacking the RNG first.

We can see that the first 2 RNGs are seeded in the lines:
```
srand(0x174Eu);
v4 = rand() % 1000000;

srand(0x249Eu);
v5 = rand() % 5000000;

```

I'll write some cpp code just to test what numbers these are to see if they print fully:
```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
    srand(0x174Eu);
    int v4 = rand() % 1000000;
    std::cout << "First: " << v4 << std::endl;

    srand(0x249Eu);
    int v5 = rand() % 5000000;
    std::cout << "Second: " << v5 << std::endl;
```

This returns the numbers 322554 and 2140813. Inputting these into the program, it seems to work. Next, it comes to grabbing the offset of the function. It seems to be a static value each time, so we can just right click and grab the function offset in IDA. With that out of the way, we need to overcome the time check from these lines:
```
v0 = time(0LL);
srand(v0);
v7 = rand() % 50000000;
```

Now instead of doing this the hard way, let's create a breakpoint before srand is called in GDB. From there, we can set edi (the register for the argument) to 0. We can then just add a line seeding srand with 0 in our cpp script. The final check is:
```
v1 = v7;
v2 = time(0LL);
validate(v2, 50000000, v1);
```

To bypass this, we can simply pass arguments to the validate function that we know will work. We set a breakpoint before our first call of validate and another breakpoint before our final call of it. Inspecting the registers before the first call, we see the values:
```
$rdx = 0x4ebfa
$rsi = 0xf4240
$rdi = 0x174e
```

This works for us, so we can continue the program until the final breakpoint, where we set the registers to these values. Continuing prints us the flag:
`CIT{uJ902IlzCax6IR6gNgPM}`

## Solve Script
Lastly, here's a solve script and inputs file that can be used to automatically solve the chal:

solve.gdb:
```
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
```

inputs:
```
322554
2140813
14933206
4289383
```

We can run the solve script with the command: `gdb -x solve.gdb < inputs`. The files can also be found in the github repo for this site
