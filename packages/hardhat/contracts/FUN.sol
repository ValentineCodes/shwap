// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FUN is ERC20 {
    constructor() ERC20("FUN", "FUN") {
        _mint(msg.sender, 1000 ether); // mints 1000 fun tokens!
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
