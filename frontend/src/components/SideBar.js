import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getRole, logout } from '../actions/userActions'

// Material UI Icons
import Home from '@material-ui/icons/Home'
import Assignment from '@material-ui/icons/Assignment'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import GroupIcon from '@material-ui/icons/Group'
import MergeTypeIcon from '@material-ui/icons/MergeType'
import Assessment from '@material-ui/icons/Assessment'
import Settings from '@material-ui/icons/Settings'
import PersonPinCircle from '@material-ui/icons/PersonPinCircle'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import DashboardIcon from '@material-ui/icons/Dashboard'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WorkIcon from '@material-ui/icons/Work'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import ListIcon from '@material-ui/icons/List'
import TodayIcon from '@material-ui/icons/Today'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import logo from '../logo.png'
import pjson from '../../package.json'

const Sidebar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // States
  const [name, setName] = useState('')
  const [role, setRole] = useState({})
  const [expandedGroup, setExpandedGroup] = useState('')
  const [expandedSubGroup, setExpandedSubGroup] = useState('')

  // Redux selectors
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, errorGetRole, getRoleData } = getRoleInfo

  // Define menu groups with organized structure
  const menuGroups = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      items: [
        { to: '/dashboard', label: 'Main Dashboard', visible: role.settings },
      ]
    },
    {
      id: 'management',
      title: 'User Management',
      items: [
        { to: '/users', label: 'Active Users', visible: role.usersView },
        { to: '/customers', label: 'Customers', visible: role.customersView }
      ]
    },
    {
      id: 'administration',
      title: 'Administration',
      items: [
        { to: '/roles', label: 'Roles', visible: role.rolesView },
        { to: '/Client', label: 'client', visible: role.rolesView },
        { to: '/Product', label: 'Product', visible: role.rolesView },
        { to: '/Fixed-Price', label: 'Fixed-Price', visible: role.rolesView },
      ]
    },
    {
      id: 'Process',
      title: 'Process',
      items: [
        { to: '/Process', label: 'Process', visible: role.rolesView },
        { to: '/Verification', label: 'Price Verification', visible: role.rolesView },
      ]
    },
    {
      id: 'Payout',
      title: 'Payout',
      items: [
        { to: '/Fixed', label: 'Fixed', visible: role.rolesView },
        { to: '/PayoutVerification', label: 'Verification', visible: role.rolesView },
        { to: '/Collection', label: 'Collection', visible: role.rolesView },
        { to: '/Report', label: 'Report', visible: role.rolesView },
      ]
    },
    // Add this new group to your menuGroups array (after line 47)
  ]

  // Icon mapping
  const iconMapping = {
    "Main Dashboard": DashboardIcon,
    "Task Count": Assessment,
    "Process List": ListIcon,
    "Daily Collection": TodayIcon,
    "Assign Process": AssignmentTurnedInIcon,
    "All Tasks": Assignment,
    "Task Allocation": AccountTreeIcon,
    "Bank Tasks": Assignment,
    "Field User Tasks": WorkIcon,
    "Unassigned Tasks": Assignment,
    "In Progress": WorkIcon,
    "Transferred": TransferWithinAStationIcon,
    "Finalisation Pending": Assignment,
    "Completed Tasks": CheckCircleIcon,
    "Done Tasks": CheckCircleIcon,
    "Active Users": GroupIcon,
    "Resigned Users": GroupIcon,
    "Customers": AssignmentIndIcon,
    "Roles": MergeTypeIcon,
    "Settings": Settings,
    "Pincodes": PersonPinCircle
  }

  // Find which group contains the current path
  const findGroupForPath = (path) => {
    for (const group of menuGroups) {
      // Check regular items
      if (group.items) {
        for (const item of group.items) {
          if (item.to === path) {
            return group.id
          }
        }
      }

      // Check subGroups (for Drive section)
      if (group.subGroups) {
        for (const subGroup of group.subGroups) {
          for (const item of subGroup.items) {
            if (item.to === path) {
              return group.id
            }
          }
        }
      }
    }
    return 'dashboard' // Default to dashboard if no match found
  }


  const findSubGroupForPath = (path) => {
    for (const group of menuGroups) {
      if (group.subGroups) {
        for (const subGroup of group.subGroups) {
          for (const item of subGroup.items) {
            if (item.to === path) {
              return subGroup.id
            }
          }
        }
      }
    }
    return ''
  }


  // Effects
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      dispatch(getRole())
    }
  }, [userInfo, dispatch])

  useEffect(() => {
    if (getRoleData) {
      setRole(getRoleData)
    } else if (errorGetRole) {
      handleLogout()
    }
  }, [getRoleData, errorGetRole])

  // Set the expanded group based on the current path
  useEffect(() => {
    const currentGroup = findGroupForPath(location.pathname)
    const currentSubGroup = findSubGroupForPath(location.pathname)

    setExpandedGroup(currentGroup)
    if (currentSubGroup) {
      setExpandedSubGroup(currentSubGroup)
    }
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const toggleGroup = (groupName) => {
    if (expandedGroup === groupName) {
      setExpandedGroup('') // Collapse if already expanded
      setExpandedSubGroup('') // Also collapse any subgroups
    } else {
      setExpandedGroup(groupName) // Expand the clicked group
      setExpandedSubGroup('') // Reset subgroups when switching main groups
    }
  }


  const toggleSubGroup = (subGroupName) => {
    if (expandedSubGroup === subGroupName) {
      setExpandedSubGroup('') // Collapse if already expanded
    } else {
      setExpandedSubGroup(subGroupName) // Expand the clicked subgroup
    }
  }

  // Navigation Link Component
  const NavLink = ({ to, label, visible }) => {
    if (!visible) return null

    const isActive = location.pathname === to
    const Icon = iconMapping[label] || Assignment

    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-3 text-base transition-all duration-200 no-underline hover:no-underline ${isActive
          ? 'text-[rgb(254,240,138)] bg-[rgba(254,240,138,0.1)]'
          : 'text-white hover:text-[rgb(204,188,72)] hover:bg-[rgba(254,240,138,0.05)]'
          }`}
      >
        <Icon className="w-5 h-5" />
        <span className="ml-3 font-medium">{label}</span>
      </Link>
    )
  }

  return (
    <div className="w-1/5 min-h-screen absolute sm:relative bg-[#013975] shadow flex-col justify-between hidden sm:flex overflow-x-auto">
      {/* Header with Logo */}
      <div className="px-6 py-6 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-2">
          {/* <img src={logo} alt="GoLog" className="w-20" /> */}
          <h3 className="text-2xl font-semibold text-white">Template</h3>
        </div>
      </div>

      {/* Scrollable Navigation with Groups */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto h-full">
        {!loadingGetRole && menuGroups.map((group) => {
          // Check if any items in the group are visible
          const hasVisibleItems = group.subGroups ?
            group.subGroups.some(subGroup => subGroup.items.some(item => item.visible)) :
            group.items?.some(item => item.visible)

          if (!hasVisibleItems) return null

          return (
            <div key={group.id} className="mb-2">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full px-4 py-2 text-lg font-semibold text-white hover:bg-[rgba(254,240,138,0.1)] hover:text-[rgb(204,188,72)] rounded transition-all duration-200"
              >
                <span className="text-lg font-bold">{group.title}</span>
                {expandedGroup === group.id ? (
                  <ExpandLess className="w-6 h-6" />
                ) : (
                  <ExpandMore className="w-6 h-6" />
                )}
              </button>

              {/* Group Items or SubGroups */}
              {expandedGroup === group.id && (
                <div className="pl-2 mt-1">
                  {group.subGroups ? (
                    // Render subgroups for Drive
                    group.subGroups.map((subGroup) => {
                      const hasVisibleSubItems = subGroup.items.some(item => item.visible)
                      if (!hasVisibleSubItems) return null

                      return (
                        <div key={subGroup.id} className="mb-1">
                          {/* SubGroup Header */}
                          <button
                            onClick={() => toggleSubGroup(subGroup.id)}
                            className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-200 hover:bg-[rgba(254,240,138,0.1)] hover:text-[rgb(204,188,72)] rounded transition-all duration-200"
                          >
                            <span>{subGroup.title}</span>
                            {expandedSubGroup === subGroup.id ? (
                              <ExpandLess className="w-5 h-5" />
                            ) : (
                              <ExpandMore className="w-5 h-5" />
                            )}
                          </button>

                          {/* SubGroup Items */}
                          {expandedSubGroup === subGroup.id && (
                            <div className="pl-4 mt-1">
                              {subGroup.items.map((item) => (
                                <NavLink
                                  key={item.to}
                                  to={item.to}
                                  label={item.label}
                                  visible={item.visible}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    // Render regular items for other groups
                    group.items?.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        visible={item.visible}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[rgba(255,255,255,0.1)]">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-4 space-x-3 text-white hover:bg-[rgba(254,240,138,0.1)] hover:text-[rgb(204,188,72)] transition-colors duration-200"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[rgba(254,240,138,0.2)] flex items-center justify-center">
              <span className="text-[rgb(254,240,138)] font-medium">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{name}</div>
            <div className="text-xs text-gray-300 truncate">Role: {role.name}</div>
          </div>
          <PowerSettingsNewIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export default Sidebar