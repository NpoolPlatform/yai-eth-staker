export const setMultisigOwner = () => {
  return (
    process.env.MULTISIG_OWNER === undefined ||
    JSON.parse(process.env.MULTISIG_OWNER)
  )
}
