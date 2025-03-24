import DoctorSearch from "@/components/doctor-search"
import FeaturedDoctors from "@/components/features-doctor" // Ensure this path is correct or update it to the correct path
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find The Right Doctor For You
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Search thousands of specialists and get the care you deserve.
              </p>
            </div>
            <DoctorSearch />
          </div>
        </section>
        <FeaturedDoctors />
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Doctor Finder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

