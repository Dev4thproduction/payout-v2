import asyncHandler from "express-async-handler";

import Role from "../Models/Role.js";

// * Private
const getRoles = asyncHandler(async (req, res) => {
  if (req.user.role.rolesView === false) {
    res.status(400);
    throw new Error("You are not authorized to perform this request");
  }

  const { search } = req.query;
  
  let query = {};
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const roles = await Role.find(query);

  res.json(roles);
});

// * Private
const addRole = asyncHandler(async (req, res) => {
  if (req.user.role.rolesAdd === false) {
    res.status(400);
    throw new Error("You are not authorized to perform this request");
  }

  const {
    name,
    tasksView,
    tasksDetailsView,
    tasksUpdate,
    tasksAddCustomer,
    tasksAddAllocation,
    allocationPendingTasks,
    visitPendingTasks,
    recentTasks,
    tatMonitor,
    inProgressTasks,
    holiday,
    finalisationPendingTasks,
    completedTasks,
    waivedTasks,
    calling,
    taskSummary,
    transfers,
    usersView,
    usersAdd,
    usersUpdate,
    viewAttendance,
    rejoinUsers,
    viewUnassignTasks,
    viewTransfferedTasks,
    viewFieldTasks,
    resignedUsers,
    rolesView,
    rolesAdd,
    rolesUpdate,
    customersView,
    customersAdd,
    customersUpdate,
    appAccess,
    webAccess,
    settings,
    reports,
    pincodes,
    dashboard,
    processView,
    processAdd,
    ProcessUpdate,
    ProcessDelete,
    assignProcessView,
    assignProcessAdd,
    assignProcessUpdate,
    assignProcessDelete,
    DailyCollectionView,
    DailyCollectionViewAdd,
    DailyCollectionViewUpdate,
    DailyCollectionViewDelete,
    mis,
    driveNbfcDelhi,
    driveNbfcHaryana,
    driveNbfcUp,
    driveNbfcTata,
    driveHdfcCard,
    driveHdfcRetail,
    driveIdfc,
    driveKotak,
  } = req.body;

  // * Find role by name
  const roleFound = await Role.findOne({ name });

  if (!roleFound) {
    const newRole = new Role({
      name,
      tasksView,
      tasksDetailsView,
      tasksUpdate,
      tasksAddCustomer,
      tasksAddAllocation,
      allocationPendingTasks,
      visitPendingTasks,
      recentTasks,
      tatMonitor,
      holiday,
      inProgressTasks,
      finalisationPendingTasks,
      completedTasks,
      waivedTasks,
      calling,
      taskSummary,
      transfers,
      usersView,
      usersAdd,
      usersUpdate,
      viewAttendance,
      rejoinUsers,
      viewUnassignTasks,
      viewTransfferedTasks,
      viewFieldTasks,
      resignedUsers,
      rolesView,
      rolesAdd,
      rolesUpdate,
      customersView,
      customersAdd,
      customersUpdate,
      appAccess,
      webAccess,
      settings,
      reports,
      pincodes,
      dashboard,
      processView,
      processAdd,
      ProcessUpdate,
      ProcessDelete,
      assignProcessView,
      assignProcessAdd,
      assignProcessUpdate,
      assignProcessDelete,
      DailyCollectionView,
      DailyCollectionViewAdd,
      DailyCollectionViewUpdate,
      DailyCollectionViewDelete,
      mis,
      driveNbfcDelhi,
      driveNbfcHaryana,
      driveNbfcUp,
      driveNbfcTata,
      driveHdfcCard,
      driveHdfcRetail,
      driveIdfc,
      driveKotak,
    });

    if (newRole) {
      await newRole.save();

      res.json(newRole);
    } else {
      res.status(400);
      throw new Error("Error creating role");
    }
  } else {
    res.status(409);
    throw new Error("Role already exists");
  }
});

// * Private
const getRoleByID = asyncHandler(async (req, res) => {
  if (req.user.role.rolesUpdate === false) {
    res.status(400);
    throw new Error("You are not authorized to perform this request");
  }
  const role = await Role.findById(req.params.id);

  res.json(role);
});

// * Private
const updateRole = asyncHandler(async (req, res) => {
  if (req.user.role.rolesUpdate === false) {
    res.status(400);
    throw new Error("You are not authorized to perform this request");
  }

  const {
    tasksView,
    tasksDetailsView,
    tasksUpdate,
    tasksAddCustomer,
    tasksAddAllocation,
    allocationPendingTasks,
    visitPendingTasks,
    inProgressTasks,
    tatMonitor,
    recentTasks,
    holiday,
    finalisationPendingTasks,
    completedTasks,
    waivedTasks,
    calling,
    taskSummary,
    transfers,
    usersView,
    usersAdd,
    usersUpdate,
    viewAttendance,
    rejoinUsers,
    viewUnassignTasks,
    viewTransfferedTasks,
    viewFieldTasks,
    resignedUsers,
    rolesView,
    rolesAdd,
    rolesUpdate,
    customersView,
    customersAdd,
    customersUpdate,
    appAccess,
    webAccess,
    settings,
    reports,
    pincodes,
    dashboard,
    processView,
    processAdd,
    ProcessUpdate,
    ProcessDelete,
    assignProcessView,
    assignProcessAdd,
    assignProcessUpdate,
    assignProcessDelete,
    DailyCollectionView,
    DailyCollectionViewAdd,
    DailyCollectionViewUpdate,
    DailyCollectionViewDelete,
    mis,
    driveNbfcDelhi,
    driveNbfcHaryana,
    driveNbfcUp,
    driveNbfcTata,
    driveHdfcCard,
    driveHdfcRetail,
    driveIdfc,
    driveKotak,

  } = req.body;
  // * Find role by id
  const roleFound = await Role.findById(req.params.id);
  if (roleFound) {
    await Role.findByIdAndUpdate(roleFound._id, {
      tasksView: tasksView !== undefined ? tasksView : roleFound.tasksView,
      tasksDetailsView:
        tasksDetailsView !== undefined
          ? tasksDetailsView
          : roleFound.tasksDetailsView,
      tasksUpdate:
        tasksUpdate !== undefined ? tasksUpdate : roleFound.tasksUpdate,
      tasksAddCustomer:
        tasksAddCustomer !== undefined
          ? tasksAddCustomer
          : roleFound.tasksAddCustomer,
      tasksAddAllocation:
        tasksAddAllocation !== undefined
          ? tasksAddAllocation
          : roleFound.tasksAddAllocation,
      allocationPendingTasks:
        allocationPendingTasks !== undefined
          ? allocationPendingTasks
          : roleFound.allocationPendingTasks,
      visitPendingTasks:
        visitPendingTasks !== undefined
          ? visitPendingTasks
          : roleFound.visitPendingTasks,
      recentTasks:
        recentTasks !== undefined ? recentTasks : roleFound.recentTasks,
      tatMonitor: tatMonitor !== undefined ? tatMonitor : roleFound.tatMonitor,
      holiday: holiday !== undefined ? holiday : roleFound.holiday,
      finalisationPendingTasks:
        finalisationPendingTasks !== undefined
          ? finalisationPendingTasks
          : roleFound.finalisationPendingTasks,
      completedTasks:
        completedTasks !== undefined
          ? completedTasks
          : roleFound.completedTasks,
      waivedTasks:
        waivedTasks !== undefined ? waivedTasks : roleFound.waivedTasks,
      calling: calling !== undefined ? calling : roleFound.calling,
      taskSummary:
        taskSummary !== undefined ? taskSummary : roleFound.taskSummary,
      transfers: transfers !== undefined ? transfers : roleFound.transfers,
      usersView: usersView !== undefined ? usersView : roleFound.usersView,
      usersAdd: usersAdd !== undefined ? usersAdd : roleFound.usersAdd,
      usersUpdate:
        usersUpdate !== undefined ? usersUpdate : roleFound.usersUpdate,
      viewAttendance:
        viewAttendance !== undefined ? viewAttendance : roleFound.viewAttendance,
      rejoinUsers:
        rejoinUsers !== undefined ? rejoinUsers : roleFound.rejoinUsers,
      viewFieldTasks:
        viewFieldTasks !== undefined ? viewFieldTasks : roleFound.viewFieldTasks,
      viewTransfferedTasks:
        viewTransfferedTasks !== undefined ? viewTransfferedTasks : roleFound.viewTransfferedTasks,
      viewUnassignTasks:
        viewUnassignTasks !== undefined ? viewUnassignTasks : roleFound.viewUnassignTasks,
      resignedUsers:
        resignedUsers !== undefined ? resignedUsers : roleFound.resignedUsers,
      rolesView: rolesView !== undefined ? rolesView : roleFound.rolesView,
      rolesAdd: rolesAdd !== undefined ? rolesAdd : roleFound.rolesAdd,
      rolesUpdate:
        rolesUpdate !== undefined ? rolesUpdate : roleFound.rolesUpdate,
      customersView:
        customersView !== undefined ? customersView : roleFound.customersView,
      customersAdd:
        customersAdd !== undefined ? customersAdd : roleFound.customersAdd,
      customersUpdate:
        customersUpdate !== undefined
          ? customersUpdate
          : roleFound.customersUpdate,
      appAccess: appAccess !== undefined ? appAccess : roleFound.appAccess,
      webAccess: webAccess !== undefined ? webAccess : roleFound.webAccess,
      settings: settings !== undefined ? settings : roleFound.settings,
      reports: reports !== undefined ? reports : roleFound.reports,
      pincodes: pincodes !== undefined ? pincodes : roleFound.pincodes,
      dashboard: dashboard !== undefined ? dashboard : roleFound.dashboard,
      processView: processView !== undefined ? processView : roleFound.processView,
      processAdd: processAdd !== undefined ? processAdd : roleFound.processAdd,
      ProcessUpdate: ProcessUpdate !== undefined ? ProcessUpdate : roleFound.ProcessUpdate,
      ProcessDelete: ProcessDelete !== undefined ? ProcessDelete : roleFound.ProcessDelete,
      assignProcessView: assignProcessView !== undefined ? assignProcessView : roleFound.assignProcessView,
      assignProcessAdd: assignProcessAdd !== undefined ? assignProcessAdd : roleFound.assignProcessAdd,
      assignProcessUpdate: assignProcessUpdate !== undefined ? assignProcessUpdate : roleFound.assignProcessUpdate,
      assignProcessDelete: assignProcessDelete !== undefined ? assignProcessDelete : roleFound.assignProcessDelete,
      DailyCollectionView: DailyCollectionView !== undefined ? DailyCollectionView : roleFound.DailyCollectionView,
      DailyCollectionViewAdd: DailyCollectionViewAdd !== undefined ? DailyCollectionViewAdd : roleFound.DailyCollectionViewAdd,
      DailyCollectionViewUpdate: DailyCollectionViewUpdate !== undefined ? DailyCollectionViewUpdate : roleFound.DailyCollectionViewUpdate,
      DailyCollectionViewDelete: DailyCollectionViewDelete !== undefined ? DailyCollectionViewDelete : roleFound.DailyCollectionViewDelete,
      mis: mis !== undefined ? mis : roleFound.mis,
      driveNbfcDelhi: driveNbfcDelhi !== undefined ? driveNbfcDelhi : roleFound.driveNbfcDelhi,
      driveNbfcHaryana: driveNbfcHaryana !== undefined ? driveNbfcHaryana : roleFound.driveNbfcHaryana,
      driveNbfcUp: driveNbfcUp !== undefined ? driveNbfcUp : roleFound.driveNbfcUp,
      driveNbfcTata: driveNbfcTata !== undefined ? driveNbfcTata : roleFound.driveNbfcTata,
      driveHdfcCard: driveHdfcCard !== undefined ? driveHdfcCard : roleFound.driveHdfcCard,
      driveHdfcRetail: driveHdfcRetail !== undefined ? driveHdfcRetail : roleFound.driveHdfcRetail,
      driveIdfc: driveIdfc !== undefined ? driveIdfc : roleFound.driveIdfc,
      driveKotak: driveKotak !== undefined ? driveKotak : roleFound.driveKotak,
    });

    const role = await Role.findById(roleFound._id);

    res.json(role);
  } else {
    res.status(400);
    throw new Error("Role not found");
  }
});

export { getRoles, addRole, getRoleByID, updateRole };