import { blob, Canister, text, ic, None, Record, update } from 'azle';
import { Secp256k1PublicKey } from '@mysten/sui/keypairs/secp256k1';
import { managementCanister } from 'azle/canisters/management';
import { Networks } from '@kaspa/core-lib';

var Address = require('@kaspa/core-lib/lib/address');
var PublicKey = require('@kaspa/core-lib/lib/publickey');
var Transaction = require('@kaspa/core-lib/lib/transaction/transaction');

const Signature = Record({
    signature: blob
});

export default Canister({
    suiAddress: update([], text, async () => {
        const caller = ic.caller().toUint8Array();

        const publicKeyResult = await ic.call(
            managementCanister.ecdsa_public_key,
            {
                args: [
                    {
                        canister_id: None,
                        derivation_path: [caller],
                        key_id: {
                            curve: { secp256k1: null },
                            name: 'dfx_test_key'
                        }
                    }
                ]
            }
        );

        const suiPublicKey = new Secp256k1PublicKey(publicKeyResult.public_key);
        const suiAddress = suiPublicKey.toSuiAddress();
        return suiAddress;
    }),

    kaspaAddress: update([], text, async () => {
        const caller = ic.caller().toUint8Array();

        const publicKeyResult = await ic.call(
            managementCanister.ecdsa_public_key,
            {
                args: [
                    {
                        canister_id: None,
                        derivation_path: [caller],
                        key_id: {
                            curve: { secp256k1: null },
                            name: 'dfx_test_key'
                        }
                    }
                ]
            }
        );

        console.log(publicKeyResult.public_key.toString());
        var pub = PublicKey(publicKeyResult.public_key, {compressed: "false"});
        var addy = Address(pub, "kaspa", "pubkey");
        //var addy = Address(publicKeyResult.public_key, "testnet", "pubkey");
        // console.log("Address: ", addy);
        // const kaspaPublicKey = new Secp256k1PublicKey(publicKeyResult.public_key);
        // const kaspaAddress = kaspaPublicKey.toSuiAddress();
        // return kaspaAddress;
        const suiPublicKey = new Secp256k1PublicKey(publicKeyResult.public_key);
        const suiAddress = suiPublicKey.toSuiAddress();
        //return suiAddress;
        return addy.toString();
        //return pub.inspect();
    }),

    // 	toSuiAddress(): string {
	// 	// Each hex char represents half a byte, hence hex address doubles the length
	// 	return normalizeSuiAddress(
	// 		bytesToHex(blake2b(this.toSuiBytes(), { dkLen: 32 })).slice(0, SUI_ADDRESS_LENGTH * 2),
	// 	);
	// }

    // createUnsignedTransaction: update([], text, async () => {
    //     Transaction = new Transaction()
	// 			.from(utxos)
	// 			.to(toAddr, amount)
	// 			.setVersion(0)
	// 			.fee(fee)
	// 			.change(changeAddr)
    //     return "";
    // }),

    sign: update([blob], Signature, async (messageHash) => {
        if (messageHash.length !== 32) {
            ic.trap('messageHash must be 32 bytes');
        }
        const caller = ic.caller().toUint8Array();
        const signatureResult = await ic.call(
            managementCanister.sign_with_ecdsa,
            {
                args: [
                    {
                        message_hash: messageHash,
                        derivation_path: [caller],
                        key_id: {
                            curve: { secp256k1: null },
                            name: 'dfx_test_key'
                        }
                    }
                ],
                cycles: 10_000_000_000n
            }
        );
        return {
            signature: signatureResult.signature
        };
    })
});
