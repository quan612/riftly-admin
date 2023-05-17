// Modules
import { useMemo } from 'react'

// Hooks
import { useTable } from 'react-table'

// UI
import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

// Types
import { TableProps } from './types'

const TableHeaderText = ({ children }) => {
  return (
    <Text fontSize="sm" color="brand.neutral1" fontWeight={'400'}>
      {children}
    </Text>
  )
}

const SimpleTable = <T extends object>({ columnsData, tableData }: TableProps<T>) =>{
  const columns = useMemo(() => columnsData, [columnsData])

  const data = useMemo(() => tableData, [tableData])

  const tableInstance = useTable({
    columns,
    data,
  })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  return (
    <Table {...getTableProps()} variant="simple" >
      <Thead>
        {headerGroups.map((headerGroup, index) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <Th {...column.getHeaderProps()} pe="10px" key={index}>
                <TableHeaderText>
                  {column.render('Header')}
                </TableHeaderText>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()} key={index}>
              {row.cells.map((cell, index) => {
                return (
                  <Td
                    {...cell.getCellProps()}
                    key={index}
                    fontSize="14px"
                    maxH="30px !important"
                    py="8px"
                    borderColor="transparent"
                  >
                    {cell.render('Cell')}
                  </Td>
                )
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}


export default SimpleTable;