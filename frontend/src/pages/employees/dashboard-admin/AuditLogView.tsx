import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getAuditsApi } from "@/api/company"

// Tipo para los registros de auditoría
type AuditLog = {
  userName: string
  action: string
  date: string
}

export default function AuditLogView() {
  const [audits, setAudits] = useState<AuditLog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const getAudits = async () => {
      const res = await getAuditsApi()
      setAudits(res.data)
      setTotalPages(Math.ceil(res.data.length / itemsPerPage))
    }
    getAudits()
  }, [])

  const paginatedAudits = audits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container rounded-md mx-auto  min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Auditoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="w-1/4 text-gray-700 dark:text-gray-300">Usuario</TableHead>
                  <TableHead className="w-1/2 text-gray-700 dark:text-gray-300">Acción</TableHead>
                  <TableHead className="w-1/4 text-gray-700 dark:text-gray-300">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAudits.map((log, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{log.userName}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      <div className="max-w-xs break-words">{log.action}</div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {format(new Date(log.date), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
