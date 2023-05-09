export const isAdmin = async (session) => {
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}
