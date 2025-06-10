"use client"
import React from 'react'
import ParentPanel from './layout'
import withAuth from '../utils/withAuth'
import ParentDashboard from './components/ParentDashboard'



export default withAuth(ParentDashboard,["PARENT"])