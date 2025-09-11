import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";



export default async function Home() {
  const session = await getServerSession(authOptions)
  // console.log("session=", session)

  if (!session || !session.user) {
    redirect("/signin")
  } else {
    redirect("/dashboard")
  }

  return (<>

  </>
  );
}