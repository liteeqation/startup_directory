import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden text-2xl">Create</span>
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button type="submit">
                  <span className="max-sm:hidden text-2xl">Logout</span>
                </button>
              </form>
              <span className="text-2xl">{session.user.name}</span>
            </>
          ) : (
            <form action="/api/auth/signin/github" method="POST">
              <button type="submit">
                <span className="max-sm:hidden text-2xl">Login</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
