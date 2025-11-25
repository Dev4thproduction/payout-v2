import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
  addCustomerToUserReducer,
  addUserReducer,
  getRoleReducer,
  getUserByIDReducer,
  getUsersReducer,
  userLoginReducer,
  removeCustomerFromUserReducer,
  resetDeviceIDReducer,
  resetPasswordReducer,
  updateUserReducer,
  userLogoutReducer,
  fetchAttendanceReducer,
  resignUserReducer,
  forceLogoutUserReducer,
  forceLogoutMultipleReducer,
} from './reducers/userReducers';
import {
  addCustomerReducer,
  getCustomersReducer,
  updateCustomerReducer
} from './reducers/customerReducers';
import {
  addRoleReducer,
  getRoleByIDReducer,
  getRolesReducer,
  updateRoleReducer,
} from './reducers/roleReducers';
import {
  getClientsReducer,
  addClientReducer,
  updateClientReducer,
  deleteClientReducer,
  clientUIReducer,
} from './reducers/clientReducer';
import { productReducer } from './reducers/productReducer';
import { fixedPriceReducer } from './reducers/fixedPriceReducer';
import { processReducer } from './reducers/processReducer';
import { verifyReducer } from './reducers/verifyReducer';
import { FIXEDReducer } from './reducers/fixedReducer';
import verificationReducer from './reducers/verificationReducer';
import employeeReportsReducer from './reducers/employeeReportsReducer';
import { collectionReducer } from './reducers/collectionReducer';

const reducer = combineReducers({
  // User reducers
  userLogin: userLoginReducer,
  userLogout: userLogoutReducer,
  getRoleInfo: getRoleReducer,
  getUsersInfo: getUsersReducer,
  addUserInfo: addUserReducer,
  getUserByIDInfo: getUserByIDReducer,
  addCustomerToUserInfo: addCustomerToUserReducer,
  updateUserInfo: updateUserReducer,
  resetDeviceIDInfo: resetDeviceIDReducer,
  resetPasswordInfo: resetPasswordReducer,
  removeCustomerFromUserInfo: removeCustomerFromUserReducer,
  fetchAttendanceInfo: fetchAttendanceReducer,
  resignUserInfo: resignUserReducer,
  forceLogoutUserInfo: forceLogoutUserReducer,
  forceLogoutMultipleInfo: forceLogoutMultipleReducer,
  
  // Customer reducers
  getCustomersInfo: getCustomersReducer,
  addCustomerInfo: addCustomerReducer,
  updateCustomerInfo: updateCustomerReducer,
  
  // Role reducers
  getRolesInfo: getRolesReducer,
  addRoleInfo: addRoleReducer,
  getRoleByIDInfo: getRoleByIDReducer,
  updateRoleInfo: updateRoleReducer,

  // Client reducers
  getClientsInfo: getClientsReducer,
  addClientInfo: addClientReducer,
  updateClientInfo: updateClientReducer,
  deleteClientInfo: deleteClientReducer,
  clientUIInfo:clientUIReducer,
  userLogin: userLoginReducer, 

  productState: productReducer,
  fixedPrice: fixedPriceReducer,
  process: processReducer,
  verify: verifyReducer,
  fixed: FIXEDReducer,
  verification: verificationReducer,
  employeeReports: employeeReportsReducer,

  collection: collectionReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const inititalState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

// Conditionally apply Redux DevTools extension
const composeEnhancers = process.env.NODE_ENV === 'development'
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;

const store = createStore(
  reducer,
  inititalState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
