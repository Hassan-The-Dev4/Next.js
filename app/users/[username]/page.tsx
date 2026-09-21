import React from 'react'

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params

  return (
    <div>Welcome, {username}</div>
  )
}

export default page
