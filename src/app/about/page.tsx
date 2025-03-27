import React from 'react';
import Navbar from '@/components/navbar';
import { Card } from '@/components/ui/card';

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: 'Dikshayn Chakroborty',
      role: 'AI & Frontend Dev',
      college: 'Assam Down Town University',
      contact: '#',
      image: '/dikshayn.jpeg',
      linkedin: 'https://www.linkedin.com/in/dikshyan-chakraborty-27a1741b4/',
      github: 'https://github.com/Dikshyan',
      bio: 'Code wizard turning AI dreams into pixel-perfect realities. Turning coffee into complex algorithms.'
    },
    {
      name: 'Poran Dip Boruah',
      role: 'Backend & System Architect',
      college: 'Assam Engineering College',
      contact: 'porandip4@gmail.com',
      image: '/poran.jpg',
      linkedin: 'https://www.linkedin.com/in/poran-dip/',
      github: 'https://github.com/poran-dip',
      bio: 'Backend maestro who makes servers sing and databases dance. Solving complex problems with elegant solutions.'
    },
    {
      name: 'Rajdeep Choudhory',
      role: 'Presentation & Project Coordination',
      college: 'Amity University',
      contact: '#',
      image: '/rajdeep.jpg',
      linkedin: '#',
      github: '#',
      bio: 'Presentation ninja and coordination guru. Transforms technical chaos into smooth, understandable narratives.'
    },
    {
      name: 'Hirok',
      role: 'Research & Data Analyst',
      college: 'Assam Down Town University',
      contact: '#',
      image: '/hirok.jpg',
      linkedin: '#',
      github: '#',
      bio: 'Data detective digging deep into insights. Transforms raw numbers into meaningful stories.'
    }
  ];
  

  const techStack = [
    { name: 'Next.js', link: 'https://nextjs.org/' },
    { name: 'React', link: 'https://react.dev/', },
    { name: 'TypeScript', link: 'https://www.typescriptlang.org/' },
    { name: 'Tailwind CSS', link: 'https://tailwindcss.com/' },
    { name: 'Shadcn UI', link: 'https://ui.shadcn.com/' },
    { name: 'Lucide React', link: 'https://lucide.dev/' },
    { name: 'Prisma', link: 'https://www.prisma.io/' },
    { name: 'Google Gemini', link: 'https://gemini.google.com/' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <section className="mb-16 px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Our Journey</h1>
          <div className="max-w-2xl mx-auto space-y-6 text-center text-muted-foreground">
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Eazydoc didn’t start with a grand plan—it started with Dikshayn convincing <span className="italic">(read: nagging)</span> me to join 
              yet another hackathon. Once we were in, we teamed up with Rajdeep and Hirok to build something real:
              a seamless healthcare platform that connects patients, doctors, and hospitals  with ease, making medical access simpler than ever.
            </p>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              With Dikshayn leading the AI-driven medbot and me handling most of the backend, we pushed
              ourselves beyond what we’d ever built before. Every late night, every refactor, and every unexpected 
              bug brought us here—turning what started as a hackathon project into something we’re truly proud of.
            </p>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Eazydoc isn’t just an idea anymore. It’s a step toward accessible, AI-powered healthcare.
            </p>
            <p className="text-right text-muted-foreground mt-6">~Poran Dip</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team: Cosmic Titans</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="flex items-center p-6 group hover:bg-gray-50 transition-colors duration-300">
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-24 h-24 rounded-full border-2 border-primary shadow-sm 
                    transform group-hover:scale-115 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground italic mb-3">{member.college}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-start space-x-4">
                    {member.contact !== '#' && (
                      <a 
                        href={`mailto:${member.contact}`} 
                        className="text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                      >
                        <img src="/icons/gmail.svg" alt="gmail" width="30" height="30" className="opacity-50 hover:opacity-100 transition-opacity duration-300"/>
                      </a>
                    )}
                    {member.github !== '#' && (
                      <a 
                        href={member.github} 
                        className="text-muted-foreground hover:text-primary hover:scale-110 transition-all" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <img src="/icons/github.svg" alt="github" width="30" height="30" className="opacity-50 hover:opacity-100 transition-opacity duration-300"/>
                      </a>
                    )}
                    {member.linkedin !== '#' && (
                      <a 
                        href={member.linkedin} 
                        className="text-muted-foreground hover:text-primary hover:scale-110 transition-all" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <img src="/icons/linkedin.svg" alt="linkedin" width="30" height="30" className="opacity-50 hover:opacity-100 transition-opacity duration-300"/>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <a 
                key={index}
                href={tech.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium transition-hover duration-150 hover:bg-gray-200 hover:scale-105"
              >
                {tech.name}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <div className="text-center">
            <p className="text-muted-foreground">
              <span className="font-semibold">Email: </span> 
              <a href="mailto:support.eazydoc@gmail.com" className="underline hover:no-underline">support.eazydoc@gmail.com</a>
            </p>
            <p className="text-muted-foreground"><span className="font-semibold">Address:</span> Guwahati, Assam, IN - 781034</p>
            <p className="text-muted-foreground">Stay tuned! More features dropping soon!</p>
          </div>
        </section>
      </main>
    </div>
  );
}