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

export default async function Home() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID,
    serviceAccountAuth,
  )

  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()
  const projects = rows.map((r) => r.toObject())

  return (
    <main className="flex gap-4 flex-col max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Hacker Cabin Members Projects</h1>
      {projects
        ? projects.map((project, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{project['Project Name']}</CardTitle>
                <CardDescription>
                  <a href={project['Project URL']}>{project['Project URL']}</a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Technology: {project.Technology}</p>
                <p>Team: {project.Team}</p>
                <p>Revenue: {project.Revenue}</p>
              </CardContent>
              <CardFooter>
                <p>
                  By {project['Maker Name(s)']} - Launched on{' '}
                  {project['Date launched']}
                </p>
              </CardFooter>
            </Card>
          ))
        : null}
    </main>
  )
}
