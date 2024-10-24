import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell, toNano, Address } from '@ton/ton'

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.

	const body = beginCell()
	.storeUint(0xf8a7ea5, 32)                 // jetton transfer op code
	.storeUint(0, 64)                         // query_id:uint64
	.storeCoins(toNano("0.001"))              // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
	.storeAddress(Address.parse("EQCjpFIuTr_a-DKnKZzeeR1gRkn0i4q2HVHzpmjFR3P2ceHT"))  // destination:MsgAddress
	.storeAddress(Address.parse("UQDC6c8RLsP7cF4mCx4iHbO4h_HrRt_9jOlERMXhOmh4m2P3"))  // response_destination:MsgAddress
	.storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
	.storeCoins(toNano("0.05"))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
	.storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)
	.endCell();

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: "EQAFbD90JMWnEWDqqd7utTyL0SXKooKMmJuMdGC9F1sMmxI4",
            amount: toNano("0.05").toString(), // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with jetton transfer body
        }
    ]
}

export function TxForm() {
	const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
}
