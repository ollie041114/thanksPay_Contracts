// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ThanksPay {
    using SafeMath for uint256;
    using SafeMath for uint256;
    event workerRegistered(uint256 wId, string email, string w_license, uint256 p_license, uint256 wage);
    event partnerRegistered(uint256 pId, string p_license, uint256 wageDate);
    event partnerBalanceChanged(uint256 pId, int256 change);
    event thanksPayRequested(uint256 thanksPayNum, uint256 amount);
    event thanksPayComplete(uint256 thanksPayNum, uint256 date, uint256 status);
    
    error revertExitCode(uint256 exitcode);
    
    function revertCheck(bool condition, uint256 exitCode) private pure {
        if(!condition)
            revert revertExitCode(exitCode);
    }

    struct Worker {
        uint256 balance;
            // current balance. Is updated every month. 
        uint256 wage;
            // monthly wage for a given worker
        uint256 latestRequest;
            // latest time the worker has taken a thanksPay. 
        uint256 pId;
            // partnerId.
    }

    struct Partner { 
        uint256 relativePayday;
            // if wage is every 25th of October, pass 25
        uint256 balance;
    }

    uint256[] months;

    constructor(uint256 prevMonthTimestamp, uint256 currMonthTimestamp) {
        months = [prevMonthTimestamp, currMonthTimestamp];
    }

    mapping(uint256 => Worker) public workers;
    mapping(uint256 => Partner) public partners;
    

    function isInRange(uint num, uint low, uint high) private pure returns(bool isIndeed) {
        return num >= low && num <= high;
    }


    function getWorkerBalance(uint256 wId, uint256 timestamp) public view returns(uint256){
        uint256 relativePayday = partners[workers[wId].pId].relativePayday;
        
        uint256 payOne = months[0] + relativePayday*(1 days);
        uint256 payTwo = months[1] + relativePayday*(1 days);
        uint256 Now = timestamp;

        uint256 latestPay;

        if (Now > payTwo){
            latestPay = payTwo;
        } else if (Now > payOne) {
            latestPay = payOne;
        }

        if (workers[wId].latestRequest < latestPay) {
            return workers[wId].wage;
        } else {
            return workers[wId].balance;
        }
    }

    function getPartnerBalance(uint256 pId) public view returns(uint256){
        return partners[pId].balance;
    }

    function monthStart(uint256 timestamp) public {
        // send when the month starts, i.e. 1st October, 1st November, etc.
        uint256 prevMonth = months[1];
        months = [prevMonth, timestamp];
    }

    function registerPartner(uint256 pId, string memory p_license, uint256 relativePayday) public {
        revertCheck(pId != 0, 1);
        partners[pId] = Partner(relativePayday, 0);
        emit partnerRegistered(pId, p_license, relativePayday);
    }

    function registerWorker(uint256 wId, uint256 pId, string memory email, string memory w_license, uint256 wage, uint256 startBalance) public {
        revertCheck(pId != 0, 2);
        revertCheck(partners[pId].balance > startBalance, 3);
        workers[wId] = Worker(startBalance, wage, 0, pId);
            // should ask what's the default balance
        emit workerRegistered(wId, email, w_license, pId, wage);
    }
    
    function changePartnerBalance(uint256 pId, int256 change) public {
        // change can be negative or positive
        uint256 newBalance;
        if (change < 0) {
            uint256 uChange = uint256(-change);
            newBalance = partners[pId].balance.sub(uChange);
                // will give error if not enough balace
        } else {
            uint256 uChange = uint256(change);
            newBalance = partners[pId].balance.add(uChange);
        }
        partners[pId].balance = newBalance;
        emit partnerBalanceChanged(pId, change);
    }

    function requestThanksPay(uint256 thanksPayNum, uint256 wId, uint256 amount, uint256 timestamp) public {
        revertCheck(getWorkerBalance(wId, timestamp) > amount, 4);
        revertCheck(getPartnerBalance(wId) > amount, 5);
        workers[wId].balance = workers[wId].balance.sub(amount);
        workers[wId].latestRequest = timestamp;
        uint256 pId = workers[wId].pId;
        partners[pId].balance = partners[pId].balance.sub(amount);

        emit thanksPayRequested(thanksPayNum, amount);
    }

    function completeThanksPay(uint256 thanksPayNum, uint256 date, uint256 status) public {
        emit thanksPayComplete(thanksPayNum, date, status);
    }
}