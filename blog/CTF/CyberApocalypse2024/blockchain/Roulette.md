Chal Desc:
Welcome to The Fray. This is a warm-up to test if you have what it 
takes to tackle the challenges of the realm. Are you brave enough?

Writeup:
We're given 2 files, one containing the contract setup and the second
containing the russian roulette contract. The main thing we care about
here is the russian roulette contract. We're also given 2 IP addresses
and ports, one is hosting the contracts and the other contains an
interface we can interact with.

Using netcat on the latter, we're presented with:

nc 83.136.255.100 33403
1 - Connection information
2 - Restart Instance
3 - Get flag
action? 1

Private key     :  0x2a246cd77d360c5456d7571130e4fb75bfd0bf09b89cd88a6f0d71552995fbf9
Address         :  0x9ecc74b3451662A90d5301b70258d506519527AF
Target contract :  0x7513C052d203eC1d365E698d7051f63ba5fA7afB
Setup contract  :  0xd8b50B75926060DDd94603e519DFBDb877E7e476

So know we know which contract we can target. Let's look at how we
can fulfill the contract in RussianRoulette.sol:

function pullTrigger() public returns (string memory) {
        if (uint256(blockhash(block.number - 1)) % 10 == 7) {
            selfdestruct(payable(msg.sender)); // 💀
        } else {
		return "im SAFU ... for now";
	    }
    }

Looks like we'll need to continuously call pullTrigger() until
our contract balance is 0. The python script for it can be found in
sol.py. We run sol.py until it stops, then go back to the interface:

We finally input 3 into our nc connection and we get the flag:
nc 83.136.255.100 33403
1 - Connection information
2 - Restart Instance
3 - Get flag
action? 3
HTB{99%_0f_g4mbl3rs_quit_b4_bigwin}
