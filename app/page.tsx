import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { BadgeDollarSign, Cpu, Rocket, Users } from 'lucide-react'
import { cache } from 'react'

export const revalidate = 30

const getProjects = cache(async () => {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID ?? '',
    serviceAccountAuth,
  )

  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()
  const projects = rows.map((r) => r.toObject())

  return projects
})

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="flex flex-col gap-6 px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl my-6 font-bold text-neutral-900">
        Hacker Cabin Members Projects
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {projects
          ? projects.map((project, i) => {
              const makers = project['Maker Name(s)']
                .split(',')
                .map((m: string) => m.trim())
              const twitters = project['Maker Twitter']
                ?.split(',')
                .map((m: string) => m.trim())
              return (
                <Card
                  key={i}
                  className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white border-neutral-200 xl:aspect-h-8 xl:aspect-w-7"
                >
                  <CardHeader>
                    <CardTitle>
                      <a
                        href={project['Project URL']}
                        className="text-emerald-700 hover:text-emerald-500 underline"
                      >
                        {project['Project Name']}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      <p className="px-2 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs inline">
                        {project.Description}
                      </p>
                      <p className="flex gap-1">
                        by{' '}
                        {makers.map((m: string, i) => (
                          <a
                            key={i}
                            href={twitters?.[i]}
                            className="text-emerald-700 hover:text-emerald-500 underline"
                          >
                            {m}
                          </a>
                        ))}
                      </p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      <li className="flex gap-1">
                        <Cpu />
                        <p>{project.Technology}</p>
                      </li>
                      <li className="flex gap-1 capitalize">
                        <Users />
                        <p>{project.Team}</p>
                      </li>
                      <li className="flex gap-1 capitalize">
                        <BadgeDollarSign />
                        <p>{project.Revenue}</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-1 text-sm capitalize">
                      <Rocket />
                      <p>{project['Date launched']}</p>
                    </div>
                  </CardFooter>
                </Card>
              )
            })
          : null}
      </div>
    </main>
  )
}
