import { useAccount, useSignMessage, useSendTransaction, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useCallback, useState } from 'react'

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { sendTransactionAsync } = useSendTransaction()
  const [isSigning, setIsSigning] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const login = useCallback(() => {
    connect({ connector: injected() })
  }, [connect])

  const logout = useCallback(() => {
    disconnect()
  }, [disconnect])

  const submitScoreSiwe = async (score: number, distance: number) => {
    if (!isConnected || !address) {
       console.warn("Wallet not connected")
       return false;
    }
    try {
      setIsSigning(true)
      const message = `Sign this message to record your score on-chain!
      
App: Endless Runner Dash
Address: ${address}
Score: ${Math.floor(score)}
Distance: ${Math.floor(distance)}
Nonce: ${Date.now()}`;
      
      const signature = await signMessageAsync({ account: address as `0x${string}`, message })
      console.log("SIWE Signature:", signature)
      // In a real app we'd send signature to a backend to verify and record off-chain or execute meta-tx
      return true;
    } catch (e) {
      console.error(e)
      return false;
    } finally {
      setIsSigning(false)
    }
  }

  const sayGM = async () => {
     if (!isConnected || !address) return;
     try {
         setIsSending(true);
         // simple 0 value tx to self just as a test transaction for "Say GM"
         const tx = await sendTransactionAsync({
            to: address,
             value: 0n,
             data: '0x474d' // "GM" in hex roughly
         })
         console.log("Say GM Tx Hash:", tx)
         return tx;
     } catch(e) {
         console.error(e);
     } finally {
         setIsSending(false)
     }
  }

  return {
    address,
    isConnected,
    login,
    logout,
    submitScoreSiwe,
    sayGM,
    isSigning,
    isSending
  }
}
