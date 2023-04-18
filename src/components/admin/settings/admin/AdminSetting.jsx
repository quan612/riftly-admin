import React, { useState } from 'react'
import AddAdmin from './AddAdmin'
import AdminList from './AdminList'
import HalfPageWrapper from '@components/admin/layout/HalfPageWrapper'

const AdminSetting = () => {
  const [createData, createDataSet] = useState({
    id: -1,
    username: '',
    wallet: '',
    isUpdating: false,
  })
  return (
    <HalfPageWrapper>
      <AdminList createDataSet={createDataSet} />
      <AddAdmin createData={createData} createDataSet={createDataSet} />
    </HalfPageWrapper>
  )
}

export default AdminSetting
