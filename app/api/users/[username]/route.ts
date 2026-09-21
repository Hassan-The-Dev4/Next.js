import { NextResponse } from "next/server";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {

    const { username } = await params

    return NextResponse.json({ username })
}
