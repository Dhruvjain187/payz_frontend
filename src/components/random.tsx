"use client"
import { useSession } from "next-auth/react"

export default function Random() {
    const data = useSession()
    console.log("data=", data)
    return (
        <>
            nothing
        </>
    )
}