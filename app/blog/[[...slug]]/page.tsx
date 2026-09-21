import React from 'react'

const page = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const { slug } = await params

  return (
    <div>You visited: /{slug?.join('/') ?? ''}</div>
  )
}

export default page
