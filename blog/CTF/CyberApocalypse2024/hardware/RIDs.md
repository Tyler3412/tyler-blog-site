## Challenge description:
Upon reaching the factory door, you physically open the RFID lock and find a flash memory 
chip inside. The chip's package has the word W25Q128 written on it. Your task is to uncover 
the secret encryption keys stored within so the team can generate valid credentials to gain 
access to the facility.

## Writeup:

We get a docker instance and a client.py file
We're told we can play through terminal using 'nc 94.237.62.149 30047'

According to the chal desc., we need to exploit an RFID lock memory chip
that has the word W25Q128 written in it to gain the encryption keys stored
within to generate valid creds.

Given our client code, we can try connecting to the given IP and port.
It returns an array of values, which means we're supposed to use it to access
the W25Q128 memory chip directly. The datasheet for the cip can be found
here: https://www.pjrc.com/teensy/W25Q128FV.pdf

The test command we're given is 9F which reads the JEDEC ID. Reading the
datasheet for the chip, we can see that 0x03 allows us to directly read
memory. Given that we're looking for encryption keys, these are likely
to be stored in the memory of the chip.

We can modify the client to call a memory read and pass in starting and
ending addresses using the function:

def read_sector(sector_number, length=256):
    start_address = sector_number * 4096  # Calculate start address of the sector
    hex_list = [0x03,  # Read Data command
                (start_address >> 16) & 0xFF,  # Address MSB
                (start_address >> 8) & 0xFF,
                start_address & 0xFF]  # Address LSB
    return exchange(hex_list, length)

Running this code and printing the sector returns an array of 256 bytes containing
the values:
[72, 84, 66, 123, 109, 51, 109, 48, 50, 49, 51, 53, 95, 53, 55, 48, 50, 51, 95, 53,
 51, 99, 50, 51, 55, 53, 95, 102, 48, 50, 95, 51, 118, 51, 50, 121, 48, 110, 51, 95,
 55, 48, 95, 53, 51, 51, 33, 64, 125, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]

The 255 seems to be padding. We can also convert the initial byte values to ascii to see
what it displays. Using the function:

def bytes_to_ascii(byte_values):
    return ''.join(chr(b) for b in byte_values if b != 255)

We print out our flag:
HTB{m3m02135_57023_53c2375_f02_3v32y0n3_70_533!@}

## Full Code:

```python
import socket
import json

def bytes_to_ascii(byte_values):
    # Filter out byte values of 255 (which are likely padding) and convert the rest to their ASCII characters
    return ''.join(chr(b) for b in byte_values if b != 255)

def exchange(hex_list, value=0):
    # Configure according to your setup
    host = '94.237.62.149'  # The server's hostname or IP address
    port = 30047        # The port used by the server
    cs=0 # /CS on A*BUS3 (range: A*BUS3 to A*BUS7)
    
    usb_device_url = 'ftdi://ftdi:2232h/1'

    # Convert hex list to strings and prepare the command data
    command_data = {
        "tool": "pyftdi",
        "cs_pin":  cs,
        "url":  usb_device_url,
        "data_out": [hex(x) for x in hex_list],  # Convert hex numbers to hex strings
        "readlen": value
    }
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        
        # Serialize data to JSON and send
        s.sendall(json.dumps(command_data).encode('utf-8'))
        
        # Receive and process response
        data = b''
        while True:
            data += s.recv(1024)
            if data.endswith(b']'):
                break
                
        response = json.loads(data.decode('utf-8'))
        # print(f"Received: {response}")
    return response

def read_sector(sector_number, length=256):
    start_address = sector_number * 4096  # Calculate start address of the sector
    hex_list = [0x03,  # Read Data command
                (start_address >> 16) & 0xFF,  # Address MSB
                (start_address >> 8) & 0xFF,
                start_address & 0xFF]  # Address LSB
    return exchange(hex_list, length)


# Example command
#jedec_id = exchange([0x9F], 3)
#print(jedec_id)

memory_data = read_sector(0x000000, 256)
print(bytes_to_ascii(memory_data))
```